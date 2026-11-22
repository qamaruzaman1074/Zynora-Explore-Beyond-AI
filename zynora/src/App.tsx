import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import { categoryGroups, getCategoryRoute } from './data/categories'
import { getInfoPage } from './data/infoPages'
import { getToolBySlug, tools } from './data/tools'
import { navigate, useCurrentLocation } from './routing'
import AppLink from './components/AppLink'
import { CategoryGroupCard, RevealGrid } from './components/CategoryCards'
import CategoriesExperience from './components/CategoriesExperience'
import HomepageCategories from './components/HomepageCategories'
import PopularPlatforms from './components/PopularPlatforms'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import ToolDirectory from './components/ToolDirectory'
import ToolDetailPage from './components/ToolDetailPage'
import ToolNotFoundPage from './components/ToolNotFoundPage'
import InfoPage from './components/InfoPages'
import AllToolsPage from './components/AllToolsPage'
import './App.css'

function TrendingCategories() {
  const trendingGroups = categoryGroups.slice(0, 3)

  return (
    <section
      aria-labelledby="trending-title"
      className="directory-section site-container trending-categories"
      id="trending"
    >
      <header className="trending-categories__header">
        <div className="section-heading">
          <p className="eyebrow">What&apos;s popular</p>
          <h2 id="trending-title">
            <span className="heading-pill">Trending</span> categories
          </h2>
          <p className="trending-categories__description">
            Explore popular areas of AI and jump into the subcategories that
            match your needs.
          </p>
        </div>
      </header>
      <RevealGrid
        className="trending-categories__grid"
        itemsKey={trendingGroups.map((group) => group.slug).join(':')}
      >
        {trendingGroups.map((group, index) => (
          <CategoryGroupCard group={group} index={index} key={group.slug} />
        ))}
      </RevealGrid>
      <div className="trending-categories__footer">
        <AppLink className="button button--outline" href="/all-tools">
          Browse all AI tools
          <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
        </AppLink>
      </div>
    </section>
  )
}

function HomeHero() {
  const [heroQuery, setHeroQuery] = useState('')
  const [heroSearchOpen, setHeroSearchOpen] = useState(false)
  const heroSearchRef = useRef<HTMLFormElement>(null)
  const categoryCount = categoryGroups.reduce(
    (total, group) => total + group.children.length,
    0,
  )
  const roundedToolCount = Math.floor(tools.length / 10) * 10
  const normalizedHeroQuery = heroQuery.trim().toLocaleLowerCase()
  const heroMatches = useMemo(() => {
    if (!normalizedHeroQuery) return []

    const toolMatches = tools
      .filter((tool) =>
        `${tool.name} ${tool.shortDescription} ${tool.tags.join(' ')}`
          .toLocaleLowerCase()
          .includes(normalizedHeroQuery),
      )
      .slice(0, 4)
      .map((tool) => ({
        id: `tool-${tool.slug}`,
        name: tool.name,
        detail: tool.shortDescription,
        href: `/tools/${tool.slug}`,
      }))

    const categoryMatches = categoryGroups.flatMap((group) =>
      group.children
        .filter((category) =>
          `${category.name} ${category.description}`
            .toLocaleLowerCase()
            .includes(normalizedHeroQuery),
        )
        .map((category) => ({
          id: `category-${group.slug}-${category.slug}`,
          name: category.name,
          detail: group.name,
          href: `/categories/${group.slug}/${category.slug}`,
        })),
    )

    return [...toolMatches, ...categoryMatches].slice(0, 6)
  }, [normalizedHeroQuery])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        heroSearchRef.current &&
        !heroSearchRef.current.contains(event.target as Node)
      ) {
        setHeroSearchOpen(false)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setHeroSearchOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const submitHeroSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHeroSearchOpen(false)
    const query = heroQuery.trim()
    if (!query) return

    const exactTool = tools.find(
      (tool) => tool.name.toLocaleLowerCase() === query.toLocaleLowerCase(),
    )
    if (exactTool) {
      navigate(`/tools/${exactTool.slug}`)
      return
    }
    for (const group of categoryGroups) {
      const exactCategory = group.children.find(
        (category) =>
          category.name.toLocaleLowerCase() === query.toLocaleLowerCase(),
      )
      if (exactCategory) {
        navigate(`/categories/${group.slug}/${exactCategory.slug}`)
        return
      }
    }
    navigate(`/?q=${encodeURIComponent(query)}#explore`)
  }

  return (
    <section
      aria-labelledby="home-title"
      className="home-section site-container"
      id="home"
    >
      <div className="home-copy">
        <h1 id="home-title">
          Best AI Tools
          <br />
          <span className="home-copy__title-accent">Directory</span>
        </h1>
        <p className="home-description">
          Discover the world&apos;s leading AI tools in one place. Explore,
          compare, and find the right tools to bring your ideas to life.
        </p>
        <form
          className="hero-search"
          onFocus={() => setHeroSearchOpen(true)}
          onSubmit={submitHeroSearch}
          ref={heroSearchRef}
          role="search"
        >
            <Search aria-hidden="true" size={20} strokeWidth={1.7} />
            <label className="visually-hidden" htmlFor="hero-tool-search">
              Search AI tools or categories
            </label>
            <input
              autoComplete="off"
              id="hero-tool-search"
              onChange={(event) => {
                setHeroQuery(event.target.value)
                setHeroSearchOpen(true)
              }}
              placeholder="Search AI tools or categories"
              type="search"
              value={heroQuery}
            />
            <button aria-label="Search" type="submit">
              Search
            </button>
            {heroSearchOpen &&
              normalizedHeroQuery &&
              heroMatches.length > 0 && (
                <div
                  aria-label="Search suggestions"
                  className="hero-search__results"
                  role="listbox"
                >
                  {heroMatches.map((result) => (
                    <AppLink
                      className="hero-search__result"
                      href={result.href}
                      key={result.id}
                      role="option"
                    >
                      <span>
                        <strong>{result.name}</strong>
                        <small>{result.detail}</small>
                      </span>
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </AppLink>
                  ))}
                </div>
              )}
        </form>
        <p className="home-proof">
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="M10 1.5 11.9 8l6.6 2-6.6 1.9-1.9 6.6-2-6.6-6.5-1.9L8 8z" />
          </svg>
          <span>
            {roundedToolCount.toLocaleString()}+ AI tools analyzed and listed
          </span>
        </p>
        <ul aria-label="Directory highlights" className="home-trust">
          <li>
            <span aria-hidden="true">✓</span>
            {categoryCount} Categories
          </li>
          <li>
            <span aria-hidden="true">✓</span>
            Updated Daily
          </li>
          <li>
            <span aria-hidden="true">✓</span>
            Quality-checked Listings
          </li>
        </ul>
        <div className="home-actions">
          <AppLink className="button button--accent" href="/all-tools">
            All Tools
          </AppLink>
          <AppLink className="button button--outline" href="/#categories">
            Discover Categories
          </AppLink>
        </div>
      </div>
    </section>
  )
}

function updateMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string | undefined,
) {
  const selector = `meta[${attribute}="${key}"]`
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!content) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }
  element.content = content
}

function updateCanonical(href: string | undefined) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  )

  if (!href) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.append(element)
  }
  element.href = href
}

function updateBreadcrumbSchema(
  crumbs: readonly { name: string; path: string }[] | undefined,
) {
  const scriptId = 'category-breadcrumb-schema'
  const existingScript = document.getElementById(scriptId)

  if (!crumbs) {
    existingScript?.remove()
    return
  }

  let script: HTMLScriptElement
  if (existingScript instanceof HTMLScriptElement) {
    script = existingScript
  } else {
    existingScript?.remove()
    script = document.createElement('script')
    script.id = scriptId
    script.type = 'application/ld+json'
    document.head.append(script)
  }

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.path, window.location.origin).href,
    })),
  })
}

function App() {
  const location = useCurrentLocation()
  const pathname = location.split(/[?#]/, 1)[0]
  const detailMatch = pathname.match(/^\/tools\/([^/]+)\/?$/)
  const tool = detailMatch ? getToolBySlug(detailMatch[1]) : undefined
  const isHome = pathname === '/'
  const isAllTools = pathname === '/all-tools'
  const categoryRoute = getCategoryRoute(pathname)
  const infoPage = getInfoPage(pathname)

  useEffect(() => {
    const socialImageUrl = new URL('/og-image.svg', window.location.origin).href

    if (categoryRoute) {
      const isCategoryNotFound = categoryRoute.type === 'not-found'
      const title =
        categoryRoute.type === 'index'
          ? 'All AI Categories | ZYNORA'
          : categoryRoute.type === 'group'
            ? `${categoryRoute.group.name} AI Tools | ZYNORA`
            : categoryRoute.type === 'category'
              ? `${categoryRoute.category.name} AI Tools | ZYNORA`
              : 'Category Not Found | ZYNORA'
      const description =
        categoryRoute.type === 'group'
          ? categoryRoute.group.description
          : categoryRoute.type === 'category'
            ? categoryRoute.category.description
            : categoryRoute.type === 'index'
              ? 'Browse AI tools by category, task, and discipline in the ZYNORA directory.'
              : 'The requested category could not be found in the ZYNORA directory.'
      const canonicalUrl = isCategoryNotFound
        ? undefined
        : new URL(pathname, window.location.origin).href
      const crumbs =
        categoryRoute.type === 'category'
          ? [
              { name: 'Home', path: '/' },
              { name: 'Categories', path: '/categories' },
              {
                name: categoryRoute.group.name,
                path: `/categories/${categoryRoute.group.slug}`,
              },
              {
                name: categoryRoute.category.name,
                path: `/categories/${categoryRoute.group.slug}/${categoryRoute.category.slug}`,
              },
            ]
          : categoryRoute.type === 'group'
            ? [
                { name: 'Home', path: '/' },
                { name: 'Categories', path: '/categories' },
                {
                  name: categoryRoute.group.name,
                  path: `/categories/${categoryRoute.group.slug}`,
                },
              ]
            : [
                { name: 'Home', path: '/' },
                { name: 'Categories', path: '/categories' },
              ]

      document.title = title
      updateMeta('name', 'description', description)
      updateMeta('property', 'og:title', title)
      updateMeta('property', 'og:description', description)
      updateMeta('property', 'og:type', 'website')
      updateMeta('property', 'og:site_name', 'ZYNORA')
      updateMeta('property', 'og:url', canonicalUrl)
      updateMeta('property', 'og:image', socialImageUrl)
      updateMeta('name', 'twitter:card', 'summary_large_image')
      updateMeta('name', 'twitter:title', title)
      updateMeta('name', 'twitter:description', description)
      updateMeta('name', 'twitter:image', socialImageUrl)
      updateCanonical(canonicalUrl)
      updateBreadcrumbSchema(crumbs)
      return
    }

    updateBreadcrumbSchema(undefined)

    if (isHome) {
      const canonicalUrl = new URL('/', window.location.origin).href
      document.title = 'ZYNORA — Explore Beyond AI'
      updateMeta('name', 'description', 'Explore, compare, and discover AI tools with ZYNORA.')
      updateMeta('property', 'og:title', 'ZYNORA — Explore Beyond AI')
      updateMeta(
        'property',
        'og:description',
        'Explore, compare, and discover AI tools with ZYNORA.',
      )
      updateMeta('property', 'og:type', 'website')
      updateMeta('property', 'og:site_name', 'ZYNORA')
      updateMeta('property', 'og:url', canonicalUrl)
      updateMeta('property', 'og:image', socialImageUrl)
      updateMeta('name', 'twitter:card', 'summary_large_image')
      updateMeta('name', 'twitter:title', 'ZYNORA — Explore Beyond AI')
      updateMeta('name', 'twitter:image', socialImageUrl)
      updateMeta(
        'name',
        'twitter:description',
        'Explore, compare, and discover AI tools with ZYNORA.',
      )
      updateCanonical(canonicalUrl)
      return
    }

    if (tool) {
      const canonicalUrl = new URL(`/tools/${tool.slug}`, window.location.origin)
        .href
      const title = `${tool.name} | ZYNORA`
      document.title = title
      updateMeta('name', 'description', tool.shortDescription)
      updateMeta('property', 'og:title', title)
      updateMeta('property', 'og:description', tool.shortDescription)
      updateMeta('property', 'og:type', 'website')
      updateMeta('property', 'og:site_name', 'ZYNORA')
      updateMeta('property', 'og:url', canonicalUrl)
      updateMeta('property', 'og:image', socialImageUrl)
      updateMeta('name', 'twitter:card', 'summary_large_image')
      updateMeta('name', 'twitter:title', title)
      updateMeta('name', 'twitter:image', socialImageUrl)
      updateMeta('name', 'twitter:description', tool.shortDescription)
      updateCanonical(canonicalUrl)
      return
    }

    if (infoPage) {
      const canonicalUrl = new URL(infoPage.path, window.location.origin).href
      document.title = `${infoPage.title} | ZYNORA`
      updateMeta('name', 'description', infoPage.description)
      updateMeta('property', 'og:title', `${infoPage.title} | ZYNORA`)
      updateMeta('property', 'og:description', infoPage.description)
      updateMeta('property', 'og:type', 'website')
      updateMeta('property', 'og:site_name', 'ZYNORA')
      updateMeta('property', 'og:url', canonicalUrl)
      updateMeta('property', 'og:image', socialImageUrl)
      updateMeta('name', 'twitter:card', 'summary_large_image')
      updateMeta('name', 'twitter:title', `${infoPage.title} | ZYNORA`)
      updateMeta('name', 'twitter:description', infoPage.description)
      updateMeta('name', 'twitter:image', socialImageUrl)
      updateCanonical(canonicalUrl)
      return
    }

    if (isAllTools) {
      const canonicalUrl = new URL('/all-tools', window.location.origin).href
      const title = `All AI Tools | ZYNORA`
      const description = `Browse and sort ${tools.length.toLocaleString()} AI tools in the ZYNORA directory.`
      document.title = title
      updateMeta('name', 'description', description)
      updateMeta('property', 'og:title', title)
      updateMeta('property', 'og:description', description)
      updateMeta('property', 'og:type', 'website')
      updateMeta('property', 'og:site_name', 'ZYNORA')
      updateMeta('property', 'og:url', canonicalUrl)
      updateMeta('property', 'og:image', socialImageUrl)
      updateMeta('name', 'twitter:card', 'summary_large_image')
      updateMeta('name', 'twitter:title', title)
      updateMeta('name', 'twitter:description', description)
      updateMeta('name', 'twitter:image', socialImageUrl)
      updateCanonical(canonicalUrl)
      updateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'All AI Tools', path: '/all-tools' },
      ])
      return
    }

    document.title = 'Tool Not Found | ZYNORA'
    updateMeta(
      'name',
      'description',
      'The requested page could not be found in the ZYNORA AI tools directory.',
    )
    updateMeta('property', 'og:title', 'Tool Not Found | ZYNORA')
    updateMeta(
      'property',
      'og:description',
      'The requested page could not be found in the ZYNORA AI tools directory.',
    )
    updateMeta('property', 'og:type', 'website')
    updateMeta('property', 'og:site_name', 'ZYNORA')
    updateMeta('property', 'og:url', undefined)
    updateMeta('property', 'og:image', socialImageUrl)
    updateMeta('name', 'twitter:card', 'summary_large_image')
    updateMeta('name', 'twitter:title', 'Tool Not Found | ZYNORA')
    updateMeta('name', 'twitter:image', socialImageUrl)
    updateMeta(
      'name',
      'twitter:description',
      'The requested page could not be found in the ZYNORA AI tools directory.',
    )
    updateCanonical(undefined)
  }, [categoryRoute, infoPage, isAllTools, isHome, pathname, tool])

  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.slice(1)
      const frame = requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView()
      })
      return () => cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [location])

  if (categoryRoute) return <CategoriesExperience route={categoryRoute} />
  if (tool) return <ToolDetailPage tool={tool} />
  if (isAllTools) {
    return (
      <div className="app-shell">
        <SiteHeader />
        <AllToolsPage />
        <SiteFooter />
      </div>
    )
  }
  if (infoPage) {
    return (
      <div className="app-shell">
        <SiteHeader />
        <InfoPage page={infoPage} />
        <SiteFooter />
      </div>
    )
  }
  if (!isHome) return <ToolNotFoundPage />

  return (
    <div className="app-shell">
      <SiteHeader />
      <main>
        <HomeHero />
        <PopularPlatforms />
        <HomepageCategories />

        <div aria-hidden="true" className="ticks"></div>

        <ToolDirectory key={location} />

        <TrendingCategories />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
