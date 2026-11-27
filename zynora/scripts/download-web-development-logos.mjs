import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(root, 'src', 'data', 'webDevelopmentTools.ts')
const logoDirectory = path.join(root, 'public', 'tool-logos', 'web-development')
const manifestPath = path.join(logoDirectory, 'logo-manifest.json')

await fs.mkdir(logoDirectory, { recursive: true })

const source = await fs.readFile(sourcePath, 'utf8')
const seedRows = [...source.matchAll(/\{\s*name:\s*'([^']+)',\s*slug:\s*'([^']+)'.*?officialWebsite:\s*'([^']+)'/g)]
const uniqueTools = new Map()
for (const [, name, slug, officialWebsite] of seedRows) {
  uniqueTools.set(slug, { name, slug, officialWebsite })
}

function resolveUrl(value, baseUrl) {
  try {
    return new URL(value, baseUrl).href
  } catch {
    return null
  }
}

function isBlockedRobotText(text) {
  return /(?:^|\n)disallow:\s*\/(?:\s|$)/i.test(text)
}

async function canFetchOrigin(origin) {
  try {
    const response = await fetch(`${origin}/robots.txt`, {
      headers: { 'user-agent': 'ZYNORA-Logo-Collector/1.0' },
      redirect: 'follow',
    })
    if (!response.ok) return true
    const text = await response.text()
    return !isBlockedRobotText(text)
  } catch {
    return true
  }
}

function getIconCandidates(html, pageUrl) {
  const candidates = []
  const linkPattern = /<link\b[^>]*(?:rel=["'][^"']*(?:icon|apple-touch-icon)[^"']*["'])[^>]*>/gi
  for (const match of html.matchAll(linkPattern)) {
    const hrefMatch = match[0].match(/\bhref=["']([^"']+)["']/i)
    const href = hrefMatch?.[1]
    const resolved = href ? resolveUrl(href, pageUrl) : null
    if (resolved) candidates.push(resolved)
  }
  const metaPattern = /<meta\b[^>]*(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/gi
  for (const match of html.matchAll(metaPattern)) {
    const contentMatch = match[0].match(/\bcontent=["']([^"']+)["']/i)
    const resolved = contentMatch?.[1]
      ? resolveUrl(contentMatch[1], pageUrl)
      : null
    if (resolved) candidates.push(resolved)
  }
  return [...new Set(candidates)]
}

async function downloadAndValidate(url, outputPath) {
  let response
  try {
    response = await fetch(url, {
      headers: { 'user-agent': 'ZYNORA-Logo-Collector/1.0' },
      redirect: 'follow',
    })
  } catch {
    return null
  }
  if (!response.ok) return null
  const contentType = response.headers.get('content-type') ?? ''
  if (!/(image|octet-stream)/i.test(contentType)) return null
  let bytes
  try {
    bytes = Buffer.from(await response.arrayBuffer())
  } catch {
    return null
  }
  if (bytes.length < 200 || bytes.length > 3_000_000) return null
  try {
    const metadata = await sharp(bytes).metadata()
    if (!metadata.width || !metadata.height || metadata.width > 4096 || metadata.height > 4096) return null
    await sharp(bytes)
      .resize({ width: 512, height: 512, fit: 'contain', withoutEnlargement: true })
      .png()
      .toFile(outputPath)
    return { width: metadata.width, height: metadata.height, sourceUrl: response.url || url }
  } catch {
    return null
  }
}

const manifest = {
  generatedAt: new Date().toISOString().slice(0, 10),
  logos: {},
  failures: [],
}

for (const tool of uniqueTools.values()) {
  let origin
  try {
    origin = new URL(tool.officialWebsite).origin
  } catch {
    manifest.failures.push({ ...tool, reason: 'invalid official URL' })
    continue
  }

  if (!(await canFetchOrigin(origin))) {
    manifest.failures.push({ ...tool, reason: 'robots.txt blocks crawling' })
    continue
  }

  const candidates = []
  try {
    let pageResponse
    try {
      pageResponse = await fetch(tool.officialWebsite, {
        headers: { 'user-agent': 'ZYNORA-Logo-Collector/1.0' },
        redirect: 'follow',
      })
    } catch {
      pageResponse = null
    }
    if (pageResponse?.ok) {
      const contentType = pageResponse.headers.get('content-type') ?? ''
      if (/text\/html/i.test(contentType)) {
        candidates.push(
          ...getIconCandidates(
            await pageResponse.text(),
            pageResponse.url || tool.officialWebsite,
          ),
        )
      }
    }
  } catch {}

  candidates.push(
    resolveUrl('/favicon.ico', origin),
    resolveUrl('/favicon.svg', origin),
  )

  let downloaded = null
  let successfulSource = null
  for (const candidate of [...new Set(candidates)].filter(Boolean)) {
    const outputPath = path.join(logoDirectory, `${tool.slug}.png`)
    downloaded = await downloadAndValidate(candidate, outputPath)
    if (downloaded) {
      successfulSource = candidate
      break
    }
  }

  if (downloaded) {
    manifest.logos[tool.slug] = {
      name: tool.name,
      officialWebsite: tool.officialWebsite,
      localPath: `/tool-logos/web-development/${tool.slug}.png`,
      sourceUrl: successfulSource,
      provenance: 'favicon',
      verificationStatus: 'unverified',
      width: downloaded.width,
      height: downloaded.height,
    }
  } else {
    await fs.rm(path.join(logoDirectory, `${tool.slug}.png`), { force: true })
    manifest.failures.push({ ...tool, reason: 'no valid official logo image found' })
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
}

await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
console.log(`Downloaded ${Object.keys(manifest.logos).length} logos; ${manifest.failures.length} failures.`)
