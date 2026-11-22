import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workbookPath = path.join(root, 'public', 'data', 'workbook-tools.json')
const logoDirectory = path.join(root, 'public', 'tool-logos')

function parseBatchSize(args) {
  const index = args.findIndex((arg) => arg === '--batch-size')
  const inline = args.find((arg) => arg.startsWith('--batch-size='))
  const value = inline ? inline.split('=')[1] : index >= 0 ? args[index + 1] : '50'
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error('Invalid batch size')
  return parsed
}

async function isMonochromeSvg(filePath) {
  const source = await fs.readFile(filePath, 'utf8')
  const colors = [
    ...new Set(
      [...source.matchAll(/#[0-9A-Fa-f]{3,8}|rgba?\([^)]*\)/g)]
        .map((match) => match[0].toLowerCase()),
    ),
  ]
  const meaningful = colors.filter(
    (color) =>
      !/^#(?:000(?:000)?|fff(?:fff)?|0{3,6}|f{3,6})$/i.test(color),
  )
  return meaningful.length <= 1
}

async function isLowSaturationImage(filePath) {
  const source = await fs.readFile(filePath)
  const metadata = await sharp(source).metadata()
  if (!metadata.width || !metadata.height) return false
  const stats = await sharp(source).stats()
  const range = stats.channels
    .slice(0, 3)
    .reduce((sum, channel) => sum + (channel.max - channel.min), 0) / 765
  return range < 0.08
}

async function getAssetStatus(filePath) {
  const extension = path.extname(filePath).toLowerCase()
  if (extension === '.svg') return isMonochromeSvg(filePath)
  try {
    return await isLowSaturationImage(filePath)
  } catch {
    return false
  }
}

async function downloadGoogleFavicon(officialWebsite, slug) {
  const domainUrl = new URL(officialWebsite)
  const candidateUrl = `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(domainUrl.origin)}&sz=256`
  const response = await fetch(candidateUrl, { signal: AbortSignal.timeout(20_000) })
  if (!response.ok) return null
  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length < 256) return null

  const metadata = await sharp(bytes).metadata()
  if (!metadata.width || !metadata.height) return null
  const stats = await sharp(bytes).stats()
  const range = stats.channels
    .slice(0, 3)
    .reduce((sum, channel) => sum + (channel.max - channel.min), 0) / 765
  if (range < 0.08) return null

  const output = await sharp(bytes)
    .resize(256, 256, { fit: 'contain', withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer()
  return { output, sourceUrl: candidateUrl, filename: `${slug}.png` }
}

async function main() {
  const batchSize = parseBatchSize(process.argv.slice(2))
  const workbook = JSON.parse(await fs.readFile(workbookPath, 'utf8'))
  const candidates = workbook.filter((tool) =>
    tool.logoVerificationStatus !== 'verified' &&
    tool.logo &&
    tool.officialWebsite &&
    typeof tool.logo === 'string' &&
    tool.logo.startsWith('/tool-logos/'),
  )

  let processed = 0
  let replaced = 0
  let remaining = 0

  for (const tool of candidates) {
    if (processed >= batchSize) break
    const assetPath = path.join(logoDirectory, path.basename(tool.logo))
    try {
      await fs.access(assetPath)
    } catch {
      continue
    }

    processed += 1
    const lowColor = await getAssetStatus(assetPath)
    if (!lowColor) continue
    remaining += 1

    try {
      const downloaded = await downloadGoogleFavicon(tool.officialWebsite, tool.slug)
      if (!downloaded) continue
      await fs.writeFile(path.join(logoDirectory, downloaded.filename), downloaded.output)
      tool.logo = `/tool-logos/${downloaded.filename}`
      tool.logoProvenance = 'favicon'
      tool.logoVerificationStatus = 'unverified'
      tool.logoSourceUrl = downloaded.sourceUrl
      replaced += 1
      console.log(`Replaced ${tool.name} -> ${downloaded.filename}`)
    } catch (error) {
      console.log(`Skipped ${tool.name}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  await fs.writeFile(workbookPath, JSON.stringify(workbook))
  console.log(JSON.stringify({ processed, replaced, lowColorRemaining: remaining - replaced }, null, 2))
}

await main()
