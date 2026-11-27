import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const appRoot = fileURLToPath(new URL('../', import.meta.url))
const publicDirectory = resolve(appRoot, 'public')
const siteConfig = JSON.parse(
  await readFile(resolve(appRoot, 'src/seo.config.json'), 'utf8'),
)
const configuredUrl = new URL(siteConfig.siteOrigin)

if (
  configuredUrl.protocol !== 'https:' ||
  configuredUrl.pathname !== '/' ||
  configuredUrl.search ||
  configuredUrl.hash
) {
  throw new Error(
    'src/seo.config.json must contain an HTTPS origin without a path, query, or fragment.',
  )
}

const siteOrigin = configuredUrl.origin
const server = await createServer({
  configFile: resolve(appRoot, 'vite.config.ts'),
  root: appRoot,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const categoriesModule = await server.ssrLoadModule('/src/data/categories.ts')
  const infoPagesModule = await server.ssrLoadModule('/src/data/infoPages.ts')
  const toolsModule = await server.ssrLoadModule('/src/data/tools.ts')
  const workbookTools = JSON.parse(
    await readFile(resolve(publicDirectory, 'data/workbook-tools.json'), 'utf8'),
  )

  if (!Array.isArray(workbookTools)) {
    throw new Error('The workbook tool catalog must be a JSON array.')
  }

  toolsModule.loadWorkbookTools(workbookTools)

  const toolSlugs = toolsModule.tools.map((tool) => tool.slug)
  if (
    toolSlugs.some((slug) => typeof slug !== 'string' || slug.length === 0) ||
    new Set(toolSlugs).size !== toolSlugs.length
  ) {
    throw new Error('The merged tool catalog contains missing or duplicate slugs.')
  }

  const categoryPaths = categoriesModule.categoryGroups.flatMap((group) => [
    `/categories/${group.slug}`,
    ...group.children.map(
      (category) => `/categories/${group.slug}/${category.slug}`,
    ),
  ])
  const paths = new Set([
    '/',
    '/all-tools',
    '/categories',
    ...categoryPaths,
    ...infoPagesModule.infoPages.map((page) => page.path),
    ...toolsModule.tools.map((tool) => `/tools/${tool.slug}`),
  ])
  const locations = [...paths].map((path) => {
    if (!path.startsWith('/') || path.includes('?') || path.includes('#')) {
      throw new Error(`Invalid sitemap path: ${path}`)
    }

    return new URL(path, siteOrigin).href
  })

  if (locations.length > 50_000) {
    throw new Error('Sitemap exceeds the 50,000 URL limit.')
  }

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...locations.map(
      (location) =>
        `  <url><loc>${location.replaceAll('&', '&amp;')}</loc></url>`,
    ),
    '</urlset>',
    '',
  ].join('\n')

  if (Buffer.byteLength(sitemap, 'utf8') > 50 * 1024 * 1024) {
    throw new Error('Sitemap exceeds the 50 MB limit.')
  }

  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteOrigin}/sitemap.xml`,
    '',
  ].join('\n')

  await Promise.all([
    writeFile(resolve(publicDirectory, 'sitemap.xml'), sitemap, 'utf8'),
    writeFile(resolve(publicDirectory, 'robots.txt'), robots, 'utf8'),
  ])

  console.log(
    `Generated sitemap with ${locations.length} URLs for ${toolsModule.tools.length} tools.`,
  )
} finally {
  await server.close()
}
