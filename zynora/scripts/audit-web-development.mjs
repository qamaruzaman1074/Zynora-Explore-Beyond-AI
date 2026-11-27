import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const expectedUniqueToolCount = 70
const expectedSubcategoryCounts = new Map([
  ['free-hosting-and-deployment', 7],
  ['free-domains-and-subdomains', 5],
  ['ai-website-builders', 8],
  ['ai-coding-assistants', 7],
  ['git-and-version-control', 5],
  ['code-editors-and-ides', 7],
  ['frontend-development', 8],
  ['backend-and-databases', 8],
  ['ui-ux-and-design-resources', 8],
  ['testing-seo-and-performance', 7],
  ['learning-and-documentation', 5],
])
const server = await createServer({
  configFile: resolve(root, 'vite.config.ts'),
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const categoriesModule = await server.ssrLoadModule('/src/data/categories.ts')
  const toolsModule = await server.ssrLoadModule('/src/data/tools.ts')
  const webModule = await server.ssrLoadModule('/src/data/webDevelopmentTools.ts')
  const workbook = JSON.parse(
    await fs.readFile(resolve(root, 'public/data/workbook-tools.json'), 'utf8'),
  )
  const logoManifest = JSON.parse(
    await fs.readFile(
      resolve(root, 'public/tool-logos/web-development/logo-manifest.json'),
      'utf8',
    ),
  )

  toolsModule.loadWorkbookTools(workbook)

  const group = categoriesModule.categoryGroups.find(
    (candidate) => candidate.slug === 'web-development',
  )
  if (!group) throw new Error('Web Development category is missing.')

  const expectedByName = new Map(
    webModule.webDevelopmentTools.map((tool) => [
      tool.name.toLocaleLowerCase().replace(/[^a-z0-9]/g, ''),
      tool,
    ]),
  )
  const missingFromCatalog = webModule.webDevelopmentTools.filter(
    (tool) =>
      !toolsModule.tools.some(
        (candidate) =>
          candidate.name
            .toLocaleLowerCase()
            .replace(/[^a-z0-9]/g, '') ===
          tool.name.toLocaleLowerCase().replace(/[^a-z0-9]/g, ''),
      ),
  )

  const subcategories = group.children.map((category) => {
    const catalogTools = toolsModule.tools.filter((tool) =>
      tool.categorySlugs?.includes(category.slug),
    )
    return {
      name: category.name,
      slug: category.slug,
      count: catalogTools.length,
      unique: new Set(catalogTools.map((tool) => tool.slug)).size,
      tools: catalogTools.map((tool) => tool.name).sort(),
    }
  })

  const representedNames = new Set(
    subcategories.flatMap((category) =>
      category.tools.map((name) =>
        name.toLocaleLowerCase().replace(/[^a-z0-9]/g, ''),
      ),
    ),
  )
  const missingFromCategory = webModule.webDevelopmentTools
    .filter(
      (tool) =>
        !representedNames.has(
          tool.name.toLocaleLowerCase().replace(/[^a-z0-9]/g, ''),
        ),
    )
    .map((tool) => tool.name)
  const representedSeedCount = [...expectedByName.keys()].filter((normalizedName) =>
    toolsModule.tools.some(
      (tool) =>
        tool.name
          .toLocaleLowerCase()
          .replace(/[^a-z0-9]/g, '') === normalizedName,
    ),
  ).length
  const webTools = toolsModule.tools.filter((tool) =>
    tool.categorySlugs?.some((slug) =>
      group.children.some((category) => category.slug === slug),
    ),
  )
  const duplicateSlugs = webTools
    .map((tool) => tool.slug)
    .filter((slug, index, slugs) => slugs.indexOf(slug) !== index)
  const invalidUrls = webModule.webDevelopmentTools
    .filter((tool) => {
      try {
        return new URL(tool.officialWebsite ?? '').protocol !== 'https:'
      } catch {
        return true
      }
    })
    .map((tool) => tool.name)
  const missingSubcategorySlugs = webModule.webDevelopmentTools.flatMap(
    (tool) =>
      (tool.categorySlugs ?? [])
        .filter(
          (slug) => !group.children.some((category) => category.slug === slug),
        )
        .map((slug) => `${tool.name}: ${slug}`),
  )
  const missingLogoFallbacks = webModule.webDevelopmentTools
    .map((seed) =>
      toolsModule.tools.find(
        (tool) =>
          tool.name.toLocaleLowerCase().replace(/[^a-z0-9]/g, '') ===
          seed.name.toLocaleLowerCase().replace(/[^a-z0-9]/g, ''),
      ),
    )
    .filter((tool) => !tool?.logo)
    .map((tool) => tool?.name)
  const incorrectSubcategoryCounts = subcategories
    .filter(
      (category) =>
        expectedSubcategoryCounts.get(category.slug) !== category.unique,
    )
    .map((category) => ({
      slug: category.slug,
      expected: expectedSubcategoryCounts.get(category.slug),
      actual: category.unique,
    }))
  const totalPlacements = subcategories.reduce(
    (count, category) => count + category.unique,
    0,
  )

  if (
    group.children.length !== 11 ||
    expectedSubcategoryCounts.size !== group.children.length ||
    webModule.webDevelopmentTools.length !== expectedUniqueToolCount ||
    expectedByName.size !== webModule.webDevelopmentTools.length ||
    representedSeedCount !== webModule.webDevelopmentTools.length ||
    missingFromCatalog.length ||
    missingFromCategory.length ||
    duplicateSlugs.length ||
    invalidUrls.length ||
    missingSubcategorySlugs.length ||
    incorrectSubcategoryCounts.length ||
    totalPlacements !== 75
  ) {
    throw new Error(
      JSON.stringify({
        expected: webModule.webDevelopmentTools.length,
        representedSeedCount,
        missingFromCatalog: missingFromCatalog.map((tool) => tool.name),
        missingFromCategory,
        duplicateSlugs,
        invalidUrls,
        missingSubcategorySlugs,
        missingLogoFallbacks,
        incorrectSubcategoryCounts,
        totalPlacements,
      }),
    )
  }

  console.log(
    JSON.stringify(
      {
        uniqueSubcategories: group.children.length,
        seedCount: webModule.webDevelopmentTools.length,
        representedSeedCount,
        uniqueCatalogTools: new Set(webTools.map((tool) => tool.slug)).size,
        missingFromCatalog: missingFromCatalog.map((tool) => tool.name),
        missingFromCategory,
        duplicateSlugs,
        invalidUrls,
        missingSubcategorySlugs,
        manifestLogoCount: Object.keys(logoManifest.logos).length,
        manifestFailures: logoManifest.failures.map((entry) => entry.name),
        missingLogoFallbacks,
        subcategories,
        representedNames: representedNames.size,
        totalPlacements,
      },
      null,
      2,
    ),
  )
} finally {
  await server.close()
}
