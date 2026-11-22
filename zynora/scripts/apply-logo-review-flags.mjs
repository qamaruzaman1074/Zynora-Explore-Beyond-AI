import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workbookPath = path.join(root, 'public', 'data', 'workbook-tools.json')
const statePath = path.join(root, '.cache', 'logo-collector', 'state.json')
const flagsPath = path.join(root, 'scripts', 'logo-asset-review-flags.json')

async function atomicWrite(filePath, data) {
  const temporaryPath = `${filePath}.${process.pid}.tmp`
  await fs.writeFile(temporaryPath, data)
  await fs.rename(temporaryPath, filePath)
}

async function main() {
  const [workbookText, stateText, flagsText, toolsSource] = await Promise.all([
    fs.readFile(workbookPath, 'utf8'),
    fs.readFile(statePath, 'utf8'),
    fs.readFile(flagsPath, 'utf8'),
    fs.readFile(path.join(root, 'src', 'data', 'tools.ts'), 'utf8'),
  ])
  const workbook = JSON.parse(workbookText)
  const state = JSON.parse(stateText)
  const flags = JSON.parse(flagsText)

  for (const flag of flags) {
    const tool = workbook.find((entry) => entry.slug === flag.slug)
    const result = state.tools[flag.slug]
    const candidateAsset = result?.asset ?? result?.candidateAsset
    if (!tool || !result || candidateAsset !== flag.candidateAsset) {
      throw new Error(`Review flag does not match the saved record for ${flag.slug}.`)
    }

    result.status = 'needs-review'
    result.candidateAsset = candidateAsset
    result.candidateProvenance =
      result.provenance ?? result.candidateProvenance
    result.candidateSourceUrl =
      result.sourceUrl ?? result.candidateSourceUrl
    result.reason = flag.reason
    delete result.asset
    delete result.provenance
    delete result.sourceUrl

    tool.logo = null
    tool.logoVerificationStatus = 'unverified'
  }

  const verifiedLogo = state.tools.gemini
  const geminiSourceUrl =
    'https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg'
  if (
    !toolsSource.includes('/tool-logos/gemini.svg') ||
    !toolsSource.includes('logoVerificationStatus: "verified"') ||
    !toolsSource.includes(geminiSourceUrl) ||
    !verifiedLogo ||
    verifiedLogo.asset !== 'gemini.svg'
  ) {
    throw new Error('Gemini verification evidence no longer matches the catalog.')
  }
  verifiedLogo.verificationStatus = 'verified'
  verifiedLogo.verificationNote =
    'Official Gemini sparkle mark visually matches the logo exposed by the official Gemini site metadata.'

  await atomicWrite(workbookPath, JSON.stringify(workbook))
  state.updatedAt = new Date().toISOString()
  await atomicWrite(statePath, `${JSON.stringify(state, null, 2)}\n`)
  console.log(`Marked ${flags.length} downloaded candidates for manual review.`)
}

main().catch((error) => {
  console.error(
    `Could not apply logo review flags: ${error instanceof Error ? error.message : String(error)}`,
  )
  process.exitCode = 1
})
