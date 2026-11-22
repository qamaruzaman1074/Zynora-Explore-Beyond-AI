import { promises as fs } from 'node:fs'
import { lookup as dnsLookup } from 'node:dns/promises'
import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workbookPath = path.join(root, 'public', 'data', 'workbook-tools.json')
const toolsSourcePath = path.join(root, 'src', 'data', 'tools.ts')
const logoDirectory = path.join(root, 'public', 'tools_logo')
const statePath = path.join(root, '.cache', 'logo-collector', 'state.json')
const manualReviewPath = path.join(
  root,
  'scripts',
  'logo-collection-manual-review.json',
)
const userAgent = 'ZYNORA-Logo-Collector/1.0'
const maxRedirects = 4
const maxHtmlBytes = 1_500_000
const maxImageBytes = 1_500_000
const maxRobotsBytes = 256_000
const maxImageCandidates = 4
const retryableStatuses = new Set([500, 502, 503, 504])
const redirectStatuses = new Set([301, 302, 303, 307, 308])
const allowedProvenance = new Set([
  'official',
  'metadata',
  'favicon',
  'placeholder',
  'legacy',
])
const robotsCache = new Map()
const lastRequestAt = new Map()
const originQueues = new Map()
const maxConcurrency = 6

function parseOptions(args) {
  const options = {
    batchSize: 10,
    delayMs: 1000,
    retryFailed: false,
    retryExhausted: false,
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--help' || arg === '-h') {
      options.help = true
    } else if (arg === '--retry-failed') {
      options.retryFailed = true
    } else if (arg === '--retry-exhausted') {
      options.retryFailed = true
      options.retryExhausted = true
    } else if (arg === '--batch-size' || arg.startsWith('--batch-size=')) {
      const value = arg.includes('=')
        ? arg.slice(arg.indexOf('=') + 1)
        : args[++index]
      options.batchSize = parseBoundedInteger(value, '--batch-size', 1, 100)
    } else if (arg === '--delay-ms' || arg.startsWith('--delay-ms=')) {
      const value = arg.includes('=')
        ? arg.slice(arg.indexOf('=') + 1)
        : args[++index]
      options.delayMs = parseBoundedInteger(value, '--delay-ms', 500, 60_000)
    } else {
      throw new Error(`Unknown option: ${arg}`)
    }
  }

  return options
}

function parseBoundedInteger(value, name, minimum, maximum) {
  const parsed = Number(value)
  if (
    !Number.isInteger(parsed) ||
    parsed < minimum ||
    parsed > maximum
  ) {
    throw new Error(`${name} must be an integer from ${minimum} to ${maximum}.`)
  }
  return parsed
}

function printHelp() {
  console.log(
    [
      'Collect logos from public pages linked as tools’ official websites.',
      '',
      'Usage: npm run collect-logos -- [options]',
      '',
      'Options:',
      '  --batch-size <n>  Maximum tools per run (default 10, max 100)',
      '  --delay-ms <n>    Delay between tools in milliseconds (default 1000)',
      '  --retry-failed    Retry tools recorded as failed in prior runs',
      '  --retry-exhausted Retry failed tools that already had one retry',
      '  --help            Show this help',
      '',
      'Disallowed or blocked sites are recorded and never bypassed.',
    ].join('\n'),
  )
}

function normalizeToolName(name) {
  return name.toLocaleLowerCase().replace(/[^a-z0-9]/g, '')
}

function readObjectProperty(objectNode, propertyName) {
  return objectNode.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) &&
      property.name.text === propertyName,
  )
}

function readLiteral(node, imports = new Map()) {
  if (!node) return undefined
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text
  }
  if (node.kind === ts.SyntaxKind.NullKeyword) return null
  if (ts.isIdentifier(node)) {
    return { importedFrom: imports.get(node.text) ?? null }
  }
  return undefined
}

function parseCuratedDefinitions(source) {
  const sourceFile = ts.createSourceFile(
    toolsSourcePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const imports = new Map()
  let definitions

  for (const statement of sourceFile.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      statement.importClause?.name &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      imports.set(
        statement.importClause.name.text,
        statement.moduleSpecifier.text,
      )
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name) &&
          declaration.name.text === 'curatedToolDefinitions' &&
          declaration.initializer &&
          ts.isArrayLiteralExpression(declaration.initializer)
        ) {
          definitions = declaration.initializer
        }
      }
    }
  }

  if (!definitions) {
    throw new Error('Could not find curatedToolDefinitions in src/data/tools.ts.')
  }

  return definitions.elements
    .filter(ts.isObjectLiteralExpression)
    .map((objectNode) => {
      const get = (name) =>
        readLiteral(readObjectProperty(objectNode, name)?.initializer, imports)
      const slug = get('slug')
      const name = get('name')
      if (typeof slug !== 'string' || typeof name !== 'string') {
        throw new Error('A curated tool is missing its name or slug.')
      }
      return {
        slug,
        name,
        officialWebsite: get('officialWebsite'),
        logo: get('logo'),
        logoProvenance: get('logoProvenance'),
        logoVerificationStatus: get('logoVerificationStatus'),
        logoSourceUrl: get('logoSourceUrl'),
      }
    })
}

function inferLegacyMetadata(logo) {
  if (logo && typeof logo === 'object' && logo.importedFrom) {
    return {
      logoProvenance: 'legacy',
      logoVerificationStatus: 'unverified',
      logoSourceUrl: null,
    }
  }

  if (typeof logo !== 'string' || !logo.trim()) {
    return {
      logoProvenance: 'placeholder',
      logoVerificationStatus: 'unverified',
      logoSourceUrl: null,
    }
  }

  try {
    const url = new URL(logo)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return {
        logoProvenance: /\/favicon(?:\.[^/]+)?$/i.test(url.pathname)
          ? 'favicon'
          : 'legacy',
        logoVerificationStatus: 'unverified',
        logoSourceUrl: logo,
      }
    }
  } catch {
    return {
      logoProvenance: 'legacy',
      logoVerificationStatus: 'unverified',
      logoSourceUrl: null,
    }
  }

  return {
    logoProvenance: 'legacy',
    logoVerificationStatus: 'unverified',
    logoSourceUrl: null,
  }
}

function getCuratedMetadata(tool) {
  const inferred = inferLegacyMetadata(tool.logo)
  return {
    logoProvenance:
      typeof tool.logoProvenance === 'string'
        ? tool.logoProvenance
        : inferred.logoProvenance,
    logoVerificationStatus:
      typeof tool.logoVerificationStatus === 'string'
        ? tool.logoVerificationStatus
        : inferred.logoVerificationStatus,
    logoSourceUrl:
      tool.logoSourceUrl === undefined ? inferred.logoSourceUrl : tool.logoSourceUrl,
  }
}

function buildMergedCatalog(workbookTools, curatedTools) {
  const workbookByName = new Map(
    workbookTools.map((tool) => [normalizeToolName(tool.name), tool]),
  )
  const logoAliases = { 'canva-ai': 'Canva' }
  const curatedNames = new Set(curatedTools.map((tool) => normalizeToolName(tool.name)))
  const merged = []

  for (const curated of curatedTools) {
    const workbookTool = workbookByName.get(normalizeToolName(curated.name))
    const aliasTool = logoAliases[curated.slug]
      ? workbookByName.get(normalizeToolName(logoAliases[curated.slug]))
      : undefined
    const chosenWorkbookLogo =
      workbookTool?.logo !== null && workbookTool
        ? workbookTool
        : aliasTool?.logo !== null && aliasTool
          ? aliasTool
          : null
    const usesCuratedLogo =
      curated.logo !== null && curated.logo !== undefined
    const logoMetadata = usesCuratedLogo
      ? getCuratedMetadata(curated)
      : chosenWorkbookLogo
        ? {
            logoProvenance: chosenWorkbookLogo.logoProvenance,
            logoVerificationStatus:
              chosenWorkbookLogo.logoVerificationStatus,
            logoSourceUrl: chosenWorkbookLogo.logoSourceUrl,
          }
        : inferLegacyMetadata(null)

    merged.push({
      id: curated.slug,
      name: curated.name,
      slug: curated.slug,
      logo: usesCuratedLogo
        ? curated.logo
        : chosenWorkbookLogo?.logo ?? null,
      officialWebsite:
        (typeof curated.officialWebsite === 'string' &&
        curated.officialWebsite
          ? curated.officialWebsite
          : null) ?? workbookTool?.officialWebsite ?? null,
      logoVerificationStatus: logoMetadata.logoVerificationStatus,
      logoProvenance: logoMetadata.logoProvenance,
      logoSourceUrl: logoMetadata.logoSourceUrl,
      curatedSlug: curated.slug,
      workbookRecord: workbookTool ?? null,
    })
  }

  for (const tool of workbookTools) {
    if (!curatedNames.has(normalizeToolName(tool.name))) {
      merged.push({
        id: tool.id,
        name: tool.name,
        slug: tool.slug,
        logo: tool.logo,
        officialWebsite: tool.officialWebsite,
        logoVerificationStatus: tool.logoVerificationStatus,
        logoProvenance: tool.logoProvenance,
        logoSourceUrl: tool.logoSourceUrl,
        curatedSlug: null,
        workbookRecord: tool,
      })
    }
  }

  return merged
}

function isPublicIpv4(address) {
  const parts = address.split('.').map(Number)
  if (parts.length !== 4 || parts.some((part) => part < 0 || part > 255)) {
    return false
  }
  const [first, second, third] = parts
  if (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 192 && second === 0) ||
    (first === 192 && second === 0 && third === 2) ||
    (first === 198 && (second === 18 || second === 19)) ||
    (first === 198 && second === 51 && third === 100) ||
    (first === 203 && second === 0 && third === 113) ||
    first >= 224
  ) {
    return false
  }
  return true
}

function isPublicIp(address) {
  const family = net.isIP(address)
  if (family === 4) return isPublicIpv4(address)
  if (family !== 6) return false

  const normalized = address.toLowerCase().split('%')[0]
  if (normalized.startsWith('::ffff:')) return false
  const firstGroup = Number.parseInt(normalized.split(':')[0] || '0', 16)
  return (
    firstGroup >= 0x2000 &&
    firstGroup <= 0x3fff &&
    !normalized.startsWith('2001:db8:')
  )
}

async function withTimeout(promise, timeoutMs, label) {
  let timer
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`${label} timed out.`)),
          timeoutMs,
        )
        timer.unref?.()
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

async function resolvePublicAddress(hostname) {
  const host = hostname.replace(/^\[|\]$/g, '')
  if (net.isIP(host)) {
    if (!isPublicIp(host)) {
      throw new Error('Private or reserved IP addresses are not allowed.')
    }
    return { address: host, family: net.isIP(host) }
  }

  const addresses = await withTimeout(
    dnsLookup(host, { all: true, verbatim: true }),
    5000,
    'DNS lookup',
  )
  if (
    addresses.length === 0 ||
    addresses.some((entry) => !isPublicIp(entry.address))
  ) {
    throw new Error('The hostname did not resolve exclusively to public IPs.')
  }
  return addresses[0]
}

function requestOnce(url, address, { accept, maxBytes, timeoutMs }) {
  const transport = url.protocol === 'https:' ? httpsRequest : httpRequest
  const pinnedLookup = (_hostname, options, callback) => {
    const result = { address: address.address, family: address.family }
    if (options?.all) callback(null, [result])
    else callback(null, result.address, result.family)
  }

  return new Promise((resolve, reject) => {
    let settled = false
    const request = transport(
      url,
      {
        method: 'GET',
        headers: {
          Accept: accept,
          'Accept-Encoding': 'identity',
          'User-Agent': userAgent,
        },
        lookup: pinnedLookup,
        servername: net.isIP(url.hostname.replace(/^\[|\]$/g, ''))
          ? undefined
          : url.hostname,
        maxHeaderSize: 64 * 1024,
      },
      (response) => {
        const status = response.statusCode ?? 0
        const headers = response.headers
        if (redirectStatuses.has(status)) {
          response.resume()
          settled = true
          resolve({ status, headers, body: Buffer.alloc(0) })
          return
        }

        const contentLength = Number(headers['content-length'])
        if (Number.isFinite(contentLength) && contentLength > maxBytes) {
          settled = true
          response.destroy()
          reject(new Error(`Response exceeds the ${maxBytes}-byte limit.`))
          return
        }

        const chunks = []
        let received = 0
        response.on('data', (chunk) => {
          if (settled) return
          received += chunk.length
          if (received > maxBytes) {
            settled = true
            response.destroy()
            request.destroy()
            reject(new Error(`Response exceeds the ${maxBytes}-byte limit.`))
            return
          }
          chunks.push(chunk)
        })
        response.on('end', () => {
          if (settled) return
          settled = true
          resolve({ status, headers, body: Buffer.concat(chunks) })
        })
        response.on('error', (error) => {
          if (settled) return
          settled = true
          reject(error)
        })
      },
    )

    request.setTimeout(timeoutMs, () =>
      request.destroy(new Error('HTTP request timed out.')),
    )
    request.on('error', (error) => {
      if (settled) return
      settled = true
      reject(error)
    })
    request.end()
  })
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseRobotsRules(text, userAgentToken) {
  const groups = []
  let group = null
  let hasDirective = false

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.split('#', 1)[0].trim()
    if (!line) continue
    const separator = line.indexOf(':')
    if (separator < 0) continue
    const key = line.slice(0, separator).trim().toLowerCase()
    const value = line.slice(separator + 1).trim()

    if (key === 'user-agent') {
      if (!group || hasDirective) {
        group = { agents: [], rules: [] }
        groups.push(group)
        hasDirective = false
      }
      group.agents.push(value.toLowerCase())
    } else if ((key === 'allow' || key === 'disallow') && group) {
      group.rules.push({ allow: key === 'allow', path: value })
      hasDirective = true
    }
  }

  const specific = groups.filter((item) =>
    item.agents.some(
      (agent) =>
        agent !== '*' && userAgentToken.toLowerCase().includes(agent),
    ),
  )
  const selectedGroups =
    specific.length > 0
      ? specific
      : groups.filter((item) => item.agents.includes('*'))
  return selectedGroups.flatMap((item) => item.rules)
}

function robotsRuleMatches(rulePath, requestPath) {
  if (!rulePath) return false
  const anchored = rulePath.endsWith('$')
  const pattern = rulePath
    .replace(/\*/g, '\u0000')
    .split('\u0000')
    .map(escapeRegex)
    .join('.*')
  return new RegExp(`^${pattern}${anchored ? '$' : ''}`).test(requestPath)
}

function isAllowedByRobots(rules, url) {
  const requestPath = `${url.pathname}${url.search}`
  const matchingRules = rules
    .filter((rule) => robotsRuleMatches(rule.path, requestPath))
    .sort((first, second) => {
      const firstSpecificity = first.path.replace(/[*$]/g, '').length
      const secondSpecificity = second.path.replace(/[*$]/g, '').length
      if (firstSpecificity !== secondSpecificity) {
        return secondSpecificity - firstSpecificity
      }
      return Number(second.allow) - Number(first.allow)
    })
  return matchingRules.length === 0 || matchingRules[0].allow
}

async function requestFollowingRedirects(
  initialUrl,
  { accept, maxBytes, timeoutMs = 10_000, checkRobots = true },
) {
  let current = validatePublicUrl(initialUrl)

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    if (checkRobots && !(await isUrlAllowedByRobots(current))) {
      throw new Error(`robots.txt disallows ${current.origin}${current.pathname}`)
    }

    const address = await resolvePublicAddress(current.hostname)
    let response
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const releaseOrigin = await waitForOriginSlot(current.origin)
        try {
          response = await requestOnce(current, address, {
            accept,
            maxBytes,
            timeoutMs,
          })
        } finally {
          releaseOrigin()
        }
      } catch (error) {
        if (attempt === 0) {
          await delay(500)
          continue
        }
        throw error
      }
      if (retryableStatuses.has(response.status) && attempt === 0) {
        await delay(750)
        continue
      }
      break
    }

    if (!redirectStatuses.has(response.status)) {
      return { ...response, url: current }
    }
    if (redirectCount === maxRedirects) {
      throw new Error(`Exceeded ${maxRedirects} redirects.`)
    }
    const location = response.headers.location
    if (!location) throw new Error('Redirect response did not include Location.')
    current = validatePublicUrl(new URL(location, current))
  }
  throw new Error('Redirect processing stopped unexpectedly.')
}

async function waitForOriginSlot(origin) {
  const previous = originQueues.get(origin) ?? Promise.resolve()
  let release
  const slot = new Promise((resolve) => {
    release = resolve
  })
  const queued = previous.then(() => slot)
  originQueues.set(origin, queued)
  await previous

  const lastRequest = lastRequestAt.get(origin) ?? 0
  const waitMs = 1000 - (Date.now() - lastRequest)
  if (waitMs > 0) await delay(waitMs)
  lastRequestAt.set(origin, Date.now())
  return release
}

function validatePublicUrl(value, base) {
  const url = value instanceof URL ? new URL(value.href) : new URL(value, base)
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    (url.port && url.port !== (url.protocol === 'https:' ? '443' : '80'))
  ) {
    throw new Error('Only public HTTP(S) URLs on standard ports are allowed.')
  }
  return url
}

async function getRobotsRules(url) {
  const robotsUrl = new URL('/robots.txt', url.origin)
  const key = robotsUrl.origin
  if (robotsCache.has(key)) return robotsCache.get(key)

  const pending = (async () => {
    const response = await requestFollowingRedirects(robotsUrl, {
      accept: 'text/plain,*/*;q=0.1',
      maxBytes: maxRobotsBytes,
      timeoutMs: 8000,
      checkRobots: false,
    })
    if (response.status === 404 || response.status === 410) {
      return { allowed: true, rules: [] }
    }
    if (response.status < 200 || response.status >= 300) {
      return {
        allowed: false,
        rules: [],
        reason: `robots.txt returned HTTP ${response.status}`,
      }
    }
    return {
      allowed: true,
      rules: parseRobotsRules(response.body.toString('utf8'), userAgent),
    }
  })()

  robotsCache.set(key, pending)
  try {
    return await pending
  } catch (error) {
    robotsCache.delete(key)
    throw error
  }
}

async function isUrlAllowedByRobots(url) {
  const policy = await getRobotsRules(url)
  if (!policy.allowed) {
    throw new Error(policy.reason ?? 'robots.txt could not be verified.')
  }
  return isAllowedByRobots(policy.rules, url)
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);?/g, (_, decimal) =>
      String.fromCodePoint(Number.parseInt(decimal, 10)),
    )
}

function parseAttributes(tag) {
  const attributes = new Map()
  const pattern =
    /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
  let match
  while ((match = pattern.exec(tag)) !== null) {
    const name = match[1].toLowerCase()
    if (name.startsWith('<')) continue
    attributes.set(
      name,
      decodeHtmlEntities(match[2] ?? match[3] ?? match[4] ?? ''),
    )
  }
  return attributes
}

function extractLogoUrl(value, pageUrl) {
  if (typeof value !== 'string' || !value.trim() || value.trim().startsWith('data:')) {
    return null
  }
  try {
    return validatePublicUrl(value.trim(), pageUrl).href
  } catch {
    return null
  }
}

function collectStructuredLogo(value, candidates, pageUrl, warnings, toolName) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectStructuredLogo(item, candidates, pageUrl, warnings, toolName)
    }
    return
  }
  if (!value || typeof value !== 'object') return

  const typeValue = value['@type']
  const types = (Array.isArray(typeValue) ? typeValue : [typeValue])
    .filter((item) => typeof item === 'string')
    .map((item) => item.toLowerCase())
  const isBrandEntity = types.some(
    (type) =>
      type === 'organization' ||
      type.endsWith('organization') ||
      type === 'brand' ||
      type === 'localbusiness',
  )
  const entityName =
    typeof value.name === 'string'
      ? value.name
      : Array.isArray(value.name)
        ? value.name.find((name) => typeof name === 'string')
        : null
  const normalizedEntityName =
    typeof entityName === 'string' ? normalizeToolName(entityName) : ''
  const normalizedToolName = normalizeToolName(toolName)
  const nameMatches =
    !normalizedEntityName ||
    normalizedEntityName === normalizedToolName ||
    normalizedEntityName.includes(normalizedToolName) ||
    normalizedToolName.includes(normalizedEntityName)

  if (isBrandEntity && nameMatches && value.logo !== undefined) {
    const logoValues = []
    const collect = (logo) => {
      if (typeof logo === 'string') logoValues.push(logo)
      else if (Array.isArray(logo)) logo.forEach(collect)
      else if (logo && typeof logo === 'object') {
        for (const key of ['url', 'contentUrl', '@id']) {
          if (typeof logo[key] === 'string') logoValues.push(logo[key])
        }
      }
    }
    collect(value.logo)
    for (const logoValue of logoValues) {
      const url = extractLogoUrl(logoValue, pageUrl)
      if (url) {
        candidates.push({
          url,
          sourceUrl: url,
          provenance: 'metadata',
          score: 100,
        })
      } else {
        warnings.push('Ignored an invalid Organization.logo URL.')
      }
    }
  }

  for (const [key, child] of Object.entries(value)) {
    if (key !== 'logo') {
      collectStructuredLogo(child, candidates, pageUrl, warnings, toolName)
    }
  }
}

function sourceSetUrl(value) {
  const first = value.split(',')[0]?.trim()
  return first ? first.split(/\s+/)[0] : ''
}

function extractLogoCandidates(html, pageUrl, toolName) {
  const candidates = []
  const warnings = []
  const scriptPattern =
    /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi
  let scriptMatch

  while ((scriptMatch = scriptPattern.exec(html)) !== null) {
    const attrs = parseAttributes(`<script ${scriptMatch[1]}>`)
    if ((attrs.get('type') ?? '').split(';')[0].trim().toLowerCase() !== 'application/ld+json') {
      continue
    }
    try {
      collectStructuredLogo(
        JSON.parse(scriptMatch[2]),
        candidates,
        pageUrl,
        warnings,
        toolName,
      )
    } catch {
      warnings.push('Ignored an invalid JSON-LD block.')
    }
  }

  const metaPattern = /<meta\b[^>]*>/gi
  let metaMatch
  while ((metaMatch = metaPattern.exec(html)) !== null) {
    const attrs = parseAttributes(metaMatch[0])
    const property = (attrs.get('property') ?? '').toLowerCase()
    const name = (attrs.get('name') ?? '').toLowerCase()
    const itemprop = (attrs.get('itemprop') ?? '').toLowerCase().split(/\s+/)
    if (
      property !== 'og:logo' &&
      property !== 'twitter:logo' &&
      name !== 'logo' &&
      !itemprop.includes('logo')
    ) {
      continue
    }
    const url = extractLogoUrl(attrs.get('content') ?? '', pageUrl)
    if (url) {
      candidates.push({
        url,
        sourceUrl: url,
        provenance: 'metadata',
        score: 95,
      })
    } else {
      warnings.push('Ignored an invalid logo metadata URL.')
    }
  }

  const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header\s*>/i)?.[0]
  if (header) {
    const toolToken = normalizeToolName(toolName)
    const imagePattern = /<img\b[^>]*>/gi
    let imageMatch
    while ((imageMatch = imagePattern.exec(header)) !== null) {
      const attrs = parseAttributes(imageMatch[0])
      const descriptiveText = [
        attrs.get('alt'),
        attrs.get('title'),
        attrs.get('class'),
        attrs.get('id'),
        attrs.get('aria-label'),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const describesBrand =
        /logo|brand|wordmark/i.test(descriptiveText) ||
        (toolToken.length >= 3 &&
          normalizeToolName(descriptiveText).includes(toolToken))
      if (!describesBrand) continue

      const imageSource =
        attrs.get('src') ??
        attrs.get('data-src') ??
        sourceSetUrl(attrs.get('srcset') ?? '')
      const url = extractLogoUrl(imageSource ?? '', pageUrl)
      if (url) {
        candidates.push({
          url,
          sourceUrl: url,
          provenance: 'official',
          score: 90,
        })
      }
    }

    const svgPattern = /<svg\b[^>]*>[\s\S]*?<\/svg\s*>/gi
    let svgMatch
    while ((svgMatch = svgPattern.exec(header)) !== null) {
      const openingTag = svgMatch[0].match(/^<svg\b[^>]*>/i)?.[0] ?? ''
      const attrs = parseAttributes(openingTag)
      const descriptiveText = [
        attrs.get('class'),
        attrs.get('id'),
        attrs.get('aria-label'),
        attrs.get('title'),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const describesBrand =
        /logo|brand|wordmark/i.test(descriptiveText) ||
        (toolToken.length >= 3 &&
          normalizeToolName(descriptiveText).includes(toolToken))
      if (describesBrand) {
        candidates.push({
          inlineSvg: Buffer.from(svgMatch[0]),
          sourceUrl: pageUrl.href,
          provenance: 'official',
          score: 92,
        })
      }
    }
  }

  const linkPattern = /<link\b[^>]*>/gi
  let linkMatch
  while ((linkMatch = linkPattern.exec(html)) !== null) {
    const attrs = parseAttributes(linkMatch[0])
    const rel = (attrs.get('rel') ?? '').toLowerCase().split(/\s+/)
    const isAppleIcon = rel.some((part) => part.startsWith('apple-touch-icon'))
    const isIcon = rel.includes('icon') || rel.includes('shortcut')
    const isMaskIcon = rel.includes('mask-icon')
    if (!isAppleIcon && !isIcon && !isMaskIcon) continue

    const url = extractLogoUrl(attrs.get('href') ?? '', pageUrl)
    if (url) {
      candidates.push({
        url,
        sourceUrl: url,
        provenance: 'favicon',
        score: isAppleIcon ? 55 : isMaskIcon ? 45 : 40,
      })
    }
  }

  const unique = new Map()
  for (const candidate of candidates) {
    const key = candidate.inlineSvg
      ? `inline:${candidate.inlineSvg.toString('base64')}`
      : candidate.url
    const previous = unique.get(key)
    if (!previous || candidate.score > previous.score) unique.set(key, candidate)
  }

  return {
    candidates: [...unique.values()].sort(
      (first, second) => second.score - first.score,
    ),
    warnings,
  }
}

function validateSvg(buffer) {
  const text = buffer.toString('utf8').replace(/^\uFEFF/, '').trim()
  if (!/<svg\b/i.test(text)) throw new Error('SVG signature is missing.')
  if (
    /<!doctype|<script\b|<foreignobject\b|\bon[a-z]+\s*=|javascript:|@import|url\(\s*['"]?(?:https?:|\/\/)/i.test(
      text,
    )
  ) {
    throw new Error('SVG contains active or external content and was rejected.')
  }
  return { extension: 'svg', mimeType: 'image/svg+xml' }
}

function validateImage(buffer, contentType) {
  if (buffer.length === 0 || buffer.length > maxImageBytes) {
    throw new Error('Image body is empty or exceeds the size limit.')
  }
  const mimeType = (contentType ?? '').split(';')[0].trim().toLowerCase()
  const textSample = buffer.subarray(0, 4096).toString('utf8')
  if (
    mimeType === 'image/svg+xml' ||
    ((mimeType === 'text/xml' || mimeType === 'application/xml') &&
      /<svg\b/i.test(textSample))
  ) {
    return validateSvg(buffer)
  }
  const pngSignature = buffer
    .subarray(0, 8)
    .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  if (
    pngSignature &&
    ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon', 'application/octet-stream'].includes(mimeType)
  ) {
    return { extension: 'png', mimeType: 'image/png' }
  }
  if (
    mimeType === 'image/jpeg' &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { extension: 'jpg', mimeType: 'image/jpeg' }
  }
  if (mimeType === 'image/webp' && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return { extension: 'webp', mimeType: 'image/webp' }
  }
  if (mimeType === 'image/gif' && /^GIF8[79]a$/.test(buffer.toString('ascii', 0, 6))) {
    return { extension: 'gif', mimeType: 'image/gif' }
  }
  if (
    (mimeType === 'image/x-icon' || mimeType === 'image/vnd.microsoft.icon') &&
    buffer[0] === 0 &&
    buffer[1] === 0 &&
    buffer[2] === 1 &&
    buffer[3] === 0
  ) {
    return { extension: 'ico', mimeType: 'image/x-icon' }
  }
  if (
    mimeType === 'image/avif' &&
    buffer.toString('ascii', 4, 8) === 'ftyp' &&
    /^(avif|avis)$/.test(buffer.toString('ascii', 8, 12))
  ) {
    return { extension: 'avif', mimeType: 'image/avif' }
  }
  throw new Error(`Unsupported or mismatched image format (${mimeType || 'no MIME'}).`)
}

async function optimizeImage(buffer, imageType) {
  const expectedFormats = {
    jpg: 'jpeg',
    png: 'png',
    webp: 'webp',
    gif: 'gif',
    avif: 'heif',
  }
  const expectedFormat = expectedFormats[imageType.extension]
  if (!expectedFormat) return buffer

  const image = sharp(buffer, {
    failOn: 'error',
    limitInputPixels: 40_000_000,
  })
  const metadata = await image.metadata()
  if (metadata.format !== expectedFormat) {
    throw new Error(`Image decoder detected ${metadata.format ?? 'unknown'} instead of ${expectedFormat}.`)
  }
  await image.stats()

  if (imageType.extension !== 'png') return buffer

  const optimized = await sharp(buffer, {
    failOn: 'error',
    limitInputPixels: 40_000_000,
  })
    .withMetadata()
    .png({ adaptiveFiltering: true, compressionLevel: 9 })
    .toBuffer()
  return optimized.length < buffer.length ? optimized : buffer
}

async function loadState() {
  try {
    const parsed = JSON.parse(await fs.readFile(statePath, 'utf8'))
    if (parsed.version !== 1 || !parsed.tools || typeof parsed.tools !== 'object') {
      throw new Error('Logo collector state has an unsupported format.')
    }
    return parsed
  } catch (error) {
    if (error?.code === 'ENOENT') return { version: 1, tools: {} }
    throw error
  }
}

async function atomicWrite(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  const temporaryPath = `${filePath}.${process.pid}.tmp`
  await fs.writeFile(temporaryPath, data)
  let lastError
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      await fs.rename(temporaryPath, filePath)
      return
    } catch (error) {
      lastError = error
      if (!['EPERM', 'EBUSY', 'EACCES'].includes(error?.code)) break
      await delay(500)
    }
  }
  try {
    await fs.rm(temporaryPath, { force: true })
  } catch (cleanupError) {
    if (cleanupError?.code !== 'ENOENT') throw cleanupError
  }
  throw lastError
}

async function saveState(state) {
  state.updatedAt = new Date().toISOString()
  await atomicWrite(statePath, `${JSON.stringify(state, null, 2)}\n`)
}

async function saveManualReview(state, mergedTools) {
  const tools = mergedTools.flatMap((tool) => {
    const result = state.tools[tool.slug]
    if (tool.logoVerificationStatus === 'verified') return []
    if (
      result?.status !== 'failed' &&
      result?.status !== 'needs-review' &&
      !(result?.status === 'complete' && result.verificationStatus !== 'verified')
    ) {
      return []
    }

    return [{
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      officialWebsite: tool.officialWebsite,
      logo:
        result.asset || result.candidateAsset
          ? `/tool-logos/${result.asset ?? result.candidateAsset}`
          : typeof tool.logo === 'string'
            ? tool.logo
            : null,
      logoProvenance:
        result.provenance ??
        result.candidateProvenance ??
        tool.logoProvenance,
      logoVerificationStatus:
        result.verificationStatus ?? tool.logoVerificationStatus,
      logoSourceUrl:
        result.sourceUrl ??
        result.candidateSourceUrl ??
        tool.logoSourceUrl,
      status: result.status,
      reason:
        result.reason ??
        'Downloaded candidate requires identity verification.',
    }]
  })

  await atomicWrite(
    manualReviewPath,
    `${JSON.stringify(
      { generatedAt: new Date().toISOString(), tools },
      null,
      2,
    )}\n`,
  )
  return tools.length
}

function removeUnusedLogoImports(source) {
  let output = source

  while (true) {
    const sourceFile = ts.createSourceFile(
      toolsSourcePath,
      output,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    )
    let unusedImport

    for (const statement of sourceFile.statements) {
      if (
        !ts.isImportDeclaration(statement) ||
        !ts.isStringLiteral(statement.moduleSpecifier) ||
        !statement.moduleSpecifier.text.endsWith('.svg') ||
        !statement.importClause?.name
      ) {
        continue
      }
      const localName = statement.importClause.name.text
      let referenced = false
      const visit = (node) => {
        if (
          ts.isIdentifier(node) &&
          node.text === localName &&
          (node.pos < statement.pos || node.end > statement.end)
        ) {
          referenced = true
        }
        if (!referenced) ts.forEachChild(node, visit)
      }
      visit(sourceFile)

      if (!referenced) {
        unusedImport = statement
        break
      }
    }

    if (!unusedImport) return output
    const lineStart =
      output.lastIndexOf('\n', unusedImport.getStart(sourceFile) - 1) + 1
    const nextLineBreak = output.indexOf('\n', unusedImport.end)
    output =
      output.slice(0, lineStart) +
      output.slice(nextLineBreak === -1 ? output.length : nextLineBreak + 1)
  }
}

function validToolSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

function applyTextEdits(source, edits) {
  const ordered = [...edits].sort((first, second) => second.start - first.start)
  let output = source
  let previousStart = source.length + 1

  for (const edit of ordered) {
    if (edit.end > previousStart) {
      throw new Error('Overlapping curated-tool updates were detected.')
    }
    output =
      output.slice(0, edit.start) + edit.text + output.slice(edit.end)
    previousStart = edit.start
  }
  return output
}

function updateCuratedSource(source, update) {
  const sourceFile = ts.createSourceFile(
    toolsSourcePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  let definitions
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === 'curatedToolDefinitions' &&
        declaration.initializer &&
        ts.isArrayLiteralExpression(declaration.initializer)
      ) {
        definitions = declaration.initializer
      }
    }
  }
  if (!definitions) {
    throw new Error('Could not find curatedToolDefinitions to update.')
  }

  const entry = definitions.elements.find((element) => {
    if (!ts.isObjectLiteralExpression(element)) return false
    const slug = readObjectProperty(element, 'slug')?.initializer
    return ts.isStringLiteral(slug) && slug.text === update.slug
  })
  if (!entry || !ts.isObjectLiteralExpression(entry)) {
    throw new Error(`Could not find curated tool "${update.slug}".`)
  }

  const values = {
    logo: update.logo,
    logoProvenance: update.logoProvenance,
    logoVerificationStatus: 'unverified',
    logoSourceUrl: update.logoSourceUrl,
  }
  const edits = []
  const missingProperties = []

  for (const [name, value] of Object.entries(values)) {
    const property = readObjectProperty(entry, name)
    if (property) {
      edits.push({
        start: property.initializer.getStart(sourceFile),
        end: property.initializer.end,
        text: JSON.stringify(value),
      })
    } else {
      const objectIndent =
        sourceFile.getLineAndCharacterOfPosition(entry.getStart(sourceFile))
          .character
      missingProperties.push(
        `${' '.repeat(objectIndent + 2)}${name}: ${JSON.stringify(value)},`,
      )
    }
  }

  if (missingProperties.length > 0) {
    const closeLineStart = source.lastIndexOf('\n', entry.end - 2) + 1
    edits.push({
      start: closeLineStart,
      end: closeLineStart,
      text: `${missingProperties.join('\n')}\n`,
    })
  }

  return removeUnusedLogoImports(applyTextEdits(source, edits))
}

function updateLogoFields(record, update) {
  record.logo = update.logo
  record.logoProvenance = update.logoProvenance
  record.logoVerificationStatus = 'unverified'
  record.logoSourceUrl = update.logoSourceUrl
}

async function persistUpdate(workbookTools, toolsSource, mergedTool, update) {
  const nextToolsSource = mergedTool.curatedSlug
    ? updateCuratedSource(toolsSource, {
        ...update,
        slug: mergedTool.curatedSlug,
      })
    : toolsSource
  let workbookChanged = false

  const workbookRecord = mergedTool.workbookRecord
  if (workbookRecord) {
    const record = workbookTools.find((tool) => tool.id === workbookRecord.id)
    if (!record) {
      throw new Error(`Could not find workbook record "${workbookRecord.id}" to update.`)
    }
    updateLogoFields(record, update)
    workbookChanged = true
  }

  if (workbookChanged) {
    await atomicWrite(workbookPath, JSON.stringify(workbookTools))
  }
  if (nextToolsSource !== toolsSource) {
    await atomicWrite(toolsSourcePath, nextToolsSource)
  }

  Object.assign(mergedTool, update)
  return nextToolsSource
}

async function clearRemoteLogo(workbookTools, toolsSource, tool) {
  if (
    typeof tool.logo !== 'string' ||
    !/^https?:\/\//i.test(tool.logo)
  ) {
    return toolsSource
  }

  const update = {
    logo: null,
    logoProvenance: tool.logoProvenance ?? 'legacy',
    logoVerificationStatus: 'unverified',
    logoSourceUrl: tool.logoSourceUrl ?? tool.logo,
  }
  return persistUpdate(workbookTools, toolsSource, tool, update)
}

async function clearFailedRemoteLogos(
  workbookTools,
  toolsSource,
  mergedTools,
  state,
) {
  let nextToolsSource = toolsSource
  let workbookChanged = false

  for (const tool of mergedTools) {
    if (
      state.tools[tool.slug]?.status !== 'failed' ||
      typeof tool.logo !== 'string' ||
      !/^https?:\/\//i.test(tool.logo)
    ) {
      continue
    }

    const update = {
      logo: null,
      logoProvenance: tool.logoProvenance ?? 'legacy',
      logoVerificationStatus: 'unverified',
      logoSourceUrl: tool.logoSourceUrl ?? tool.logo,
    }
    if (tool.curatedSlug) {
      nextToolsSource = updateCuratedSource(nextToolsSource, {
        ...update,
        slug: tool.curatedSlug,
      })
    }
    if (tool.workbookRecord) {
      const record = workbookTools.find(
        (candidate) => candidate.id === tool.workbookRecord.id,
      )
      if (!record) {
        throw new Error(
          `Could not find workbook record "${tool.workbookRecord.id}" to update.`,
        )
      }
      updateLogoFields(record, update)
      workbookChanged = true
    }
    Object.assign(tool, update)
  }

  if (workbookChanged) {
    await atomicWrite(workbookPath, JSON.stringify(workbookTools))
  }
  if (nextToolsSource !== toolsSource) {
    await atomicWrite(toolsSourcePath, nextToolsSource)
  }
  return nextToolsSource
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function candidateUrl(value, pageUrl) {
  return extractLogoUrl(value, pageUrl)
}

async function collectOneTool(tool) {
  if (
    tool.logoVerificationStatus === 'verified' &&
    allowedProvenance.has(tool.logoProvenance)
  ) {
    return { status: 'skipped', reason: 'Logo is already verified.' }
  }
  if (!tool.officialWebsite) {
    throw new Error('No officialWebsite is recorded.')
  }
  if (!validToolSlug(tool.slug)) {
    throw new Error('Tool slug cannot be used safely as a filename.')
  }

  const homepage = validatePublicUrl(tool.officialWebsite)
  const pageResponse = await requestFollowingRedirects(homepage, {
    accept: 'text/html,application/xhtml+xml;q=0.9',
    maxBytes: maxHtmlBytes,
  })
  if (pageResponse.status === 401 || pageResponse.status === 403) {
    throw new Error(`Official site returned HTTP ${pageResponse.status}; skipped without bypass.`)
  }
  if (pageResponse.status === 429) {
    throw new Error('Official site returned HTTP 429; skipped without retry.')
  }
  if (pageResponse.status < 200 || pageResponse.status >= 300) {
    throw new Error(`Official site returned HTTP ${pageResponse.status}.`)
  }
  const htmlType = (pageResponse.headers['content-type'] ?? '')
    .split(';')[0]
    .trim()
    .toLowerCase()
  if (!['text/html', 'application/xhtml+xml'].includes(htmlType)) {
    throw new Error(`Official site did not return HTML (${htmlType || 'no MIME'}).`)
  }

  const { candidates: extractedCandidates, warnings } = extractLogoCandidates(
    pageResponse.body.toString('utf8'),
    pageResponse.url,
    tool.name,
  )
  if (warnings.length > 0) {
    console.warn(`  ${tool.slug}: ${warnings.join(' ')}`)
  }
  const candidates = [...extractedCandidates]
  const fallbackIcons = [
    '/favicon.ico',
    '/favicon.png',
    '/favicon.svg',
    '/apple-touch-icon.png',
  ]
  for (const pathname of fallbackIcons) {
    const url = new URL(pathname, pageResponse.url).href
    if (!candidates.some((candidate) => candidate.url === url)) {
      candidates.push({
        url,
        sourceUrl: url,
        provenance: 'favicon',
        score: 20,
      })
    }
  }

  let lastCandidateError = 'No candidate was accepted.'
  for (const candidate of candidates.slice(
    0,
    maxImageCandidates + fallbackIcons.length,
  )) {
    let image
    let imageType
    let sourceUrl = candidate.sourceUrl
    try {
      if (candidate.inlineSvg) {
        image = candidate.inlineSvg
        imageType = validateSvg(image)
      } else {
        if (!(await isUrlAllowedByRobots(new URL(candidate.url)))) {
          lastCandidateError = `robots.txt disallows candidate ${candidate.url}`
          continue
        }
        const response = await requestFollowingRedirects(candidate.url, {
          accept:
            'image/avif,image/webp,image/svg+xml,image/png,image/jpeg,image/x-icon,*/*;q=0.1',
          maxBytes: maxImageBytes,
        })
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Logo host returned HTTP ${response.status}; skipped without bypass.`)
        }
        if (response.status === 429) {
          throw new Error('Logo host returned HTTP 429; skipped without retry.')
        }
        if (response.status < 200 || response.status >= 300) {
          lastCandidateError = `Candidate returned HTTP ${response.status}.`
          continue
        }
        image = response.body
        sourceUrl = candidate.sourceUrl
        imageType = validateImage(
          image,
          response.headers['content-type'] ?? '',
        )
        image = await optimizeImage(image, imageType)
      }
    } catch (error) {
      lastCandidateError = error instanceof Error ? error.message : String(error)
      if (/HTTP (401|403|429)|robots\.txt disallows/i.test(lastCandidateError)) {
        throw new Error(lastCandidateError)
      }
      continue
    }

    const filename = `${tool.slug}.${imageType.extension}`
    const assetPath = path.join(logoDirectory, filename)
    let existingAsset
    try {
      existingAsset = await fs.readFile(assetPath)
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
    }
    if (existingAsset && !existingAsset.equals(image)) {
      throw new Error(`Refusing to overwrite existing ${filename} with different content.`)
    }
    if (!existingAsset) await atomicWrite(assetPath, image)

    const update = {
      logo: `/tools_logo/${filename}`,
      logoProvenance: candidate.provenance,
      logoVerificationStatus: 'unverified',
      logoSourceUrl: sourceUrl,
    }
    return { status: 'complete', update, filename, warnings }
  }

  throw new Error(lastCandidateError)
}

async function loadInputs() {
  const [workbookText, toolsSource] = await Promise.all([
    fs.readFile(workbookPath, 'utf8'),
    fs.readFile(toolsSourcePath, 'utf8'),
  ])
  let workbookTools
  try {
    workbookTools = JSON.parse(workbookText)
  } catch (error) {
    throw new Error(`Could not parse workbook catalog: ${error.message}`)
  }
  if (!Array.isArray(workbookTools)) {
    throw new Error('Workbook catalog must contain an array.')
  }
  const curated = parseCuratedDefinitions(toolsSource)
  const mergedTools = buildMergedCatalog(workbookTools, curated)
  const seenSlugs = new Set()
  for (const tool of mergedTools) {
    if (!validToolSlug(tool.slug)) {
      throw new Error(`Invalid tool slug "${tool.slug}" in merged catalog.`)
    }
    if (seenSlugs.has(tool.slug)) {
      throw new Error(`Duplicate tool slug "${tool.slug}" in merged catalog.`)
    }
    seenSlugs.add(tool.slug)
  }
  return {
    workbookTools,
    toolsSource,
    mergedTools,
  }
}

function hasPendingState(state, slug, options) {
  const previous = state.tools[slug]
  if (!previous) return true
  if (
    previous.status === 'complete' ||
    previous.status === 'skipped' ||
    previous.status === 'needs-review'
  ) {
    return false
  }
  if (previous.status !== 'failed') return true
  if (!options.retryFailed) return false
  if (
    !options.retryExhausted &&
    (previous.attempts ?? 0) > 1
  ) {
    return false
  }
  return !/robots\.txt|returned HTTP (?:401|403|429)|without bypass/i.test(previous.reason ?? '')
}

async function collectBatch(tools, delayMs, onResult) {
  let nextIndex = 0
  let persistenceQueue = Promise.resolve()
  let fatalError = null

  const workers = Array.from(
    { length: Math.min(maxConcurrency, tools.length) },
    async () => {
      let firstTool = true
      while (!fatalError) {
        if (!firstTool) await delay(delayMs)
        firstTool = false
        const index = nextIndex
        nextIndex += 1
        if (index >= tools.length) return

        const tool = tools[index]
        console.log(`Collecting ${tool.name} (${tool.slug})...`)
        let outcome
        try {
          outcome = { result: await collectOneTool(tool) }
        } catch (error) {
          outcome = { error }
        }

        const currentWrite = persistenceQueue.then(async () => {
          if (fatalError) return
          try {
            await onResult(tool, outcome)
          } catch (error) {
            fatalError = error
            throw error
          }
        })
        persistenceQueue = currentWrite.catch(() => {})
        try {
          await currentWrite
        } catch {
          return
        }
      }
    },
  )

  await Promise.all(workers)
  if (fatalError) throw fatalError
}

async function main() {
  const options = parseOptions(process.argv.slice(2))
  if (options.help) {
    printHelp()
    return
  }

  const [{ workbookTools, toolsSource, mergedTools }, state] =
    await Promise.all([loadInputs(), loadState()])
  let currentToolsSource = await clearFailedRemoteLogos(
    workbookTools,
    toolsSource,
    mergedTools,
    state,
  )
  const verifiedCount = mergedTools.filter(
    (tool) => tool.logoVerificationStatus === 'verified',
  ).length
  const selected = mergedTools
    .filter(
      (tool) =>
        tool.logoVerificationStatus !== 'verified' &&
        hasPendingState(state, tool.slug, options),
    )
    .slice(0, options.batchSize)

  console.log(
    `Logo collection batch: ${selected.length} of ${mergedTools.length} tools; ${verifiedCount} verified logos skipped.`,
  )
  if (selected.length === 0) {
    const manualReviewCount = await saveManualReview(state, mergedTools)
    console.log('No eligible tools remain in this batch.')
    console.log(`${manualReviewCount} tools are in the manual-review list.`)
    return
  }

  let successes = 0
  let failures = 0
  await collectBatch(selected, options.delayMs, async (tool, outcome) => {
    if (outcome.error) {
      const reason =
        outcome.error instanceof Error
          ? outcome.error.message
          : String(outcome.error)
      currentToolsSource = await clearRemoteLogo(
        workbookTools,
        currentToolsSource,
        tool,
      )
      state.tools[tool.slug] = {
        status: 'failed',
        attempts: (state.tools[tool.slug]?.attempts ?? 0) + 1,
        reason,
        updatedAt: new Date().toISOString(),
      }
      failures += 1
      console.error(`  Failed: ${reason}`)
    } else if (outcome.result.status === 'complete') {
      currentToolsSource = await persistUpdate(
        workbookTools,
        currentToolsSource,
        tool,
        outcome.result.update,
      )
      state.tools[tool.slug] = {
        status: 'complete',
        attempts: (state.tools[tool.slug]?.attempts ?? 0) + 1,
        provenance: outcome.result.update.logoProvenance,
        verificationStatus: 'unverified',
        sourceUrl: outcome.result.update.logoSourceUrl,
        asset: outcome.result.filename,
        completedAt: new Date().toISOString(),
      }
      successes += 1
      console.log(
        `  Saved ${outcome.result.filename} (${outcome.result.update.logoProvenance}; unverified).`,
      )
    } else {
      state.tools[tool.slug] = {
        status: 'skipped',
        attempts: state.tools[tool.slug]?.attempts ?? 0,
        reason: outcome.result.reason,
        updatedAt: new Date().toISOString(),
      }
      console.log(`  Skipped: ${outcome.result.reason}`)
    }
    await saveState(state)
  })

  const manualReviewCount = await saveManualReview(state, mergedTools)
  console.log(
    `Batch complete: ${successes} logos saved as unverified, ${failures} failures. State saved for resuming; ${manualReviewCount} tools are in the manual-review list.`,
  )
}

main().catch((error) => {
  console.error(`Logo collection stopped: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
})
