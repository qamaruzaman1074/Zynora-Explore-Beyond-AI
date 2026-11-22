import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workbookPath = path.join(root, 'public', 'data', 'workbook-tools.json')
const toolsSourcePath = path.join(root, 'src', 'data', 'tools.ts')
const outputDirectory = path.join(root, 'artifacts', 'logo-contact-sheets')
const logoDirectory = path.join(root, 'public', 'tool-logos')
const cellWidth = 220
const cellHeight = 160
const columns = 4
const rowsPerSheet = 6
const sheetCapacity = columns * rowsPerSheet

function property(object, name) {
  return object.properties.find(
    (entry) =>
      ts.isPropertyAssignment(entry) &&
      (ts.isIdentifier(entry.name) || ts.isStringLiteral(entry.name)) &&
      entry.name.text === name,
  )
}

function literal(node, imports) {
  if (!node) return undefined
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text
  }
  if (node.kind === ts.SyntaxKind.NullKeyword) return null
  if (ts.isIdentifier(node)) return imports.get(node.text) ?? null
  return undefined
}

function parseCurated(source) {
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
      imports.set(statement.importClause.name.text, statement.moduleSpecifier.text)
    }
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

  if (!definitions) throw new Error('Could not read curated tool definitions.')
  return definitions.elements.flatMap((entry) => {
    if (!ts.isObjectLiteralExpression(entry)) return []
    const get = (name) => literal(property(entry, name)?.initializer, imports)
    return [{
      name: get('name'),
      slug: get('slug'),
      categoryId: get('categoryId'),
      categorySlugs: get('categorySlugs'),
      officialWebsite: get('officialWebsite'),
      logo: get('logo'),
      logoProvenance: get('logoProvenance'),
    }]
  })
}

function normalize(value) {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]/g, '')
}

function slugLabel(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

function svgData(svg) {
  return Buffer.from(svg)
}

function fallbackTile(name, reason) {
  return svgData(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="96"><rect width="100%" height="100%" fill="#eeeeee"/><text x="50%" y="46%" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">${escapeHtml(reason)}</text><text x="50%" y="70%" text-anchor="middle" font-family="Arial" font-size="9" fill="#555">${escapeHtml(name.slice(0, 20))}</text></svg>`,
  )
}

async function imageBuffer(assetPath, name) {
  const input = await fs.readFile(assetPath)
  if (path.extname(assetPath).toLowerCase() !== '.ico') return input

  if (
    input.length >= 22 &&
    input.readUInt16LE(0) === 0 &&
    input.readUInt16LE(2) === 1
  ) {
    const entries = input.readUInt16LE(4)
    for (let index = 0; index < entries; index += 1) {
      const offset = 6 + index * 16
      if (offset + 16 > input.length) break
      const length = input.readUInt32LE(offset + 8)
      const imageOffset = input.readUInt32LE(offset + 12)
      if (imageOffset + length > input.length) continue
      const embedded = input.subarray(imageOffset, imageOffset + length)
      if (embedded.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        return embedded
      }
    }
  }

  return fallbackTile(name, 'ICO')
}

async function makeTile(tool) {
  let logo
  let decodeError = false
  const filename = path.basename(tool.logo)
  const filePath = path.join(logoDirectory, filename)
  try {
    logo = await imageBuffer(filePath, tool.name)
    logo = await sharp(logo, { failOn: 'error', limitInputPixels: 40_000_000 })
      .resize(112, 82, { fit: 'contain', background: '#eeeeee' })
      .png()
      .toBuffer()
  } catch {
    decodeError = true
    logo = await sharp(fallbackTile(tool.name, 'UNREADABLE'))
      .png()
      .toBuffer()
  }

  const label = escapeHtml(tool.name.slice(0, 32))
  const source = escapeHtml(
    tool.logoProvenance ?? tool.provenance ?? 'unknown',
  )
  const description = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${cellWidth}" height="58"><text x="10" y="19" font-family="Arial" font-size="14" font-weight="600" fill="#111">${label}</text><text x="10" y="39" font-family="Arial" font-size="11" fill="#555">${escapeHtml(tool.slug)}</text><text x="10" y="54" font-family="Arial" font-size="9" fill="#777">${source}</text></svg>`,
  )
  const tile = await sharp({
    create: {
      width: cellWidth,
      height: cellHeight,
      channels: 3,
      background: '#ffffff',
    },
  })
    .composite([
      { input: logo, left: (cellWidth - 112) / 2, top: 8 },
      { input: description, left: 0, top: 98 },
    ])
    .png()
    .toBuffer()
  return { tile, decodeError }
}

async function renderSheet(category, page, entries) {
  const width = columns * cellWidth
  const height = rowsPerSheet * cellHeight
  const composites = []
  let decodeErrors = 0

  for (let index = 0; index < entries.length; index += 1) {
    const { tile, decodeError } = await makeTile(entries[index])
    if (decodeError) decodeErrors += 1
    const column = index % columns
    const row = Math.floor(index / columns)
    composites.push({
      input: tile,
      left: column * cellWidth,
      top: row * cellHeight,
    })
  }

  const basename = `${category.slug}-${String(page).padStart(2, '0')}`
  const outputPath = path.join(outputDirectory, `${basename}.jpg`)
  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: '#d8d8d8',
    },
  })
    .composite(composites)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outputPath)
  return { basename, outputPath, decodeErrors }
}

async function main() {
  await fs.mkdir(outputDirectory, { recursive: true })
  const [workbook, toolsSource] = await Promise.all([
    fs.readFile(workbookPath, 'utf8'),
    fs.readFile(toolsSourcePath, 'utf8'),
  ])
  const rows = JSON.parse(workbook)
  const curated = parseCurated(toolsSource)
  const workbookByName = new Map(rows.map((tool) => [normalize(tool.name), tool]))
  const curatedNames = new Set(curated.map((tool) => normalize(tool.name)))
  const tools = curated.map((tool) => {
    const workbookTool = workbookByName.get(normalize(tool.name))
    const aliasTool =
      tool.slug === 'canva-ai' ? workbookByName.get(normalize('Canva')) : null
    const logo =
      tool.logo ??
      (workbookTool?.logo ? workbookTool.logo : aliasTool?.logo ?? null)
    const logoProvenance =
      tool.logo !== null && tool.logo !== undefined
        ? tool.logoProvenance ?? 'legacy'
        : workbookTool?.logoProvenance ?? aliasTool?.logoProvenance ?? 'legacy'
    return {
      ...tool,
      logo,
      logoProvenance,
      categorySlugs:
        tool.categorySlugs ??
        workbookTool?.categorySlugs ??
        aliasTool?.categorySlugs ??
        (tool.categoryId ? [tool.categoryId] : []),
    }
  })
  for (const tool of rows) {
    if (!curatedNames.has(normalize(tool.name))) tools.push(tool)
  }

  const groups = new Map()
  for (const tool of tools) {
    if (typeof tool.logo !== 'string' || !tool.logo.startsWith('/tool-logos/')) {
      continue
    }
    const categories =
      Array.isArray(tool.categorySlugs) && tool.categorySlugs.length > 0
        ? tool.categorySlugs
        : ['uncategorized']
    for (const slug of categories) {
      if (!groups.has(slug)) groups.set(slug, [])
      groups.get(slug).push(tool)
    }
  }

  const sheets = []
  let decodeErrors = 0
  for (const [slug, entries] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const category = { slug, label: slugLabel(slug) }
    for (let offset = 0; offset < entries.length; offset += sheetCapacity) {
      const page = Math.floor(offset / sheetCapacity) + 1
      const result = await renderSheet(
        category,
        page,
        entries.slice(offset, offset + sheetCapacity),
      )
      decodeErrors += result.decodeErrors
      sheets.push({
        ...result,
        category: category.label,
        count: Math.min(sheetCapacity, entries.length - offset),
      })
    }
  }

  const links = sheets
    .map(
      (sheet) =>
        `<li><a href="./${path.basename(sheet.outputPath)}">${escapeHtml(sheet.category)} (${sheet.count})</a></li>`,
    )
    .join('\n')
  await fs.writeFile(
    path.join(outputDirectory, 'index.html'),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>ZYNORA Logo Contact Sheets</title><style>body{font:16px system-ui;max-width:900px;margin:40px auto;padding:0 20px;background:#111;color:#fff}a{color:#b7ff3c}li{margin:8px 0}</style><h1>ZYNORA Logo Contact Sheets</h1><p>${tools.length} merged tools; ${sheets.length} sheets across ${groups.size} categories. Candidates are not identity verified.</p><ul>${links}</ul></html>\n`,
  )
  await fs.writeFile(
    path.join(outputDirectory, 'summary.json'),
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        toolCount: tools.length,
        categoryCount: groups.size,
        sheetCount: sheets.length,
        savedLogoCount: tools.filter(
          (tool) =>
            typeof tool.logo === 'string' &&
            tool.logo.startsWith('/tool-logos/'),
        ).length,
        decodeErrors,
        sheets: sheets.map((sheet) => ({
          file: path.basename(sheet.outputPath),
          category: sheet.category,
          count: sheet.count,
        })),
      },
      null,
      2,
    )}\n`,
  )
  console.log(
    `Created ${sheets.length} contact sheets for ${tools.length} tools across ${groups.size} categories (${decodeErrors} images needed decode placeholders).`,
  )
  console.log(`Index: ${path.join(outputDirectory, 'index.html')}`)
}

main().catch((error) => {
  console.error(
    `Contact sheet generation failed: ${error instanceof Error ? error.message : String(error)}`,
  )
  process.exitCode = 1
})
