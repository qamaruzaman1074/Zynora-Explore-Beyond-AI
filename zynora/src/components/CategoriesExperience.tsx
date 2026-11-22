import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {
  categoryGroups,
  getCategoryToolSlugs,
  getGroupToolSlugs,
  type CategoryRoute,
} from '../data/categories'
import { tools } from '../data/tools'
import type { AITool, Category, CategoryGroup } from '../types/tool'
import AppLink from './AppLink'
import CategoryIcon from './CategoryIcon'
import {
  CategoryCount,
  CategoryPill,
  RevealGrid,
  SubcategoryCard,
} from './CategoryCards'
import { ToolCard } from './ToolDirectory'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'
import './CategoriesExperience.css'

const directoryTools: readonly AITool[] = tools
const moreGroupSlug = 'more-categories'
const groupsBeforeMore = categoryGroups.filter(
  (group) => group.slug !== moreGroupSlug,
)

type VisibleGroup = {
  group: CategoryGroup
  children: Category[]
}

function matchesCategory(category: Category | CategoryGroup, query: string) {
  return `${category.name} ${category.description}`
    .toLocaleLowerCase()
    .includes(query)
}

function CategoriesIndexPage() {
  const [query, setQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState(
    categoryGroups[0]?.slug ?? '',
  )
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const visibleGroups = useMemo<VisibleGroup[]>(() => {
    return groupsBeforeMore
      .map((group) => {
        const groupMatches =
          !normalizedQuery || matchesCategory(group, normalizedQuery)
        const children = groupMatches
          ? group.children
          : group.children.filter((category) =>
              matchesCategory(category, normalizedQuery),
            )
        return { group, children }
      })
      .filter(
        ({ group, children }) =>
          !normalizedQuery ||
          matchesCategory(group, normalizedQuery) ||
          children.length > 0,
      )
  }, [normalizedQuery])
  const moreGroup = categoryGroups.find(
    (group) => group.slug === moreGroupSlug,
  )
  const moreChildren = moreGroup
    ? !normalizedQuery || matchesCategory(moreGroup, normalizedQuery)
      ? moreGroup.children
      : moreGroup.children.filter((category) =>
          matchesCategory(category, normalizedQuery),
        )
    : []
  const showsMoreGroup =
    !!moreGroup &&
    (!normalizedQuery ||
      matchesCategory(moreGroup, normalizedQuery) ||
      moreChildren.length > 0)
  const moreGroupMatches =
    !!moreGroup &&
    (matchesCategory(moreGroup, normalizedQuery) || !normalizedQuery)
  const resultCount =
    visibleGroups.reduce(
      (count, { group, children }) =>
        count +
        (matchesCategory(group, normalizedQuery) || !normalizedQuery ? 1 : 0) +
        children.length,
      0,
    ) +
    (showsMoreGroup
      ? (moreGroupMatches ? 1 : 0) + moreChildren.length
      : 0)
  const visibleGroupSlugs = [
    ...visibleGroups.map(({ group }) => group.slug),
    ...(showsMoreGroup ? [moreGroupSlug] : []),
  ]
  const activeVisibleGroup = visibleGroupSlugs.includes(activeGroup)
    ? activeGroup
    : visibleGroupSlugs[0] ?? ''

  useEffect(() => {
    if (normalizedQuery || !('IntersectionObserver' in window)) return

    const observedGroupSlugs = [
      ...visibleGroups.map(({ group }) => group.slug),
      ...(showsMoreGroup ? [moreGroupSlug] : []),
    ]
    const observer = new IntersectionObserver(
      (entries) => {
        const topmost = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              first.boundingClientRect.top - second.boundingClientRect.top,
          )[0]
        if (topmost) setActiveGroup(topmost.target.id)
      },
      { rootMargin: '-15% 0px -70% 0px' },
    )

    observedGroupSlugs.forEach((slug) => {
      const section = document.getElementById(slug)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [normalizedQuery, showsMoreGroup, visibleGroups])

  return (
    <div className="categories-index site-container">
      <header className="categories-page-header">
        <p className="eyebrow">THE DIRECTORY</p>
        <h1>All categories</h1>
        <p className="categories-page-header__description">
          Browse AI tools by task, creative discipline, or the kind of work you
          want to get done.
        </p>
        <label className="categories-search">
          <Search aria-hidden="true" size={20} strokeWidth={1.5} />
          <span className="visually-hidden">Search categories</span>
          <input
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search categories"
            type="search"
            value={query}
          />
        </label>
        {normalizedQuery && (
          <p aria-live="polite" className="categories-result-count" role="status">
            {resultCount} matching {resultCount === 1 ? 'result' : 'results'}
          </p>
        )}
      </header>

      <nav
        aria-label="Category groups"
        className="categories-group-chips"
      >
        {visibleGroupSlugs.map((slug) => {
          const group = categoryGroups.find((item) => item.slug === slug)
          return group ? (
            <a
              aria-current={activeVisibleGroup === slug ? 'location' : undefined}
              className={activeVisibleGroup === slug ? 'is-active' : undefined}
              href={`#${slug}`}
              key={slug}
              onClick={() => setActiveGroup(slug)}
            >
              {group.name}
            </a>
          ) : null
        })}
      </nav>

      <div className="categories-layout">
        <aside aria-label="Category group navigation" className="categories-sidebar">
          <nav aria-label="Category group links">
            {visibleGroupSlugs.map((slug) => {
              const group = categoryGroups.find((item) => item.slug === slug)
              return group ? (
                <a
                  aria-current={
                    activeVisibleGroup === slug ? 'location' : undefined
                  }
                  className={
                    activeVisibleGroup === slug ? 'is-active' : undefined
                  }
                  href={`#${slug}`}
                  key={slug}
                  onClick={() => setActiveGroup(slug)}
                >
                  {group.name}
                </a>
              ) : null
            })}
          </nav>
          <AppLink className="categories-sidebar__all" href="/categories">
            All categories
          </AppLink>
        </aside>

        <div className="categories-groups">
          {visibleGroups.map(({ group, children }) => (
            <section
              aria-labelledby={`${group.slug}-heading`}
              className="categories-group-section"
              id={group.slug}
              key={group.slug}
            >
              <header className="categories-group-section__header">
                <span className="categories-group-section__icon">
                  <CategoryIcon name={group.icon} size={22} />
                </span>
                <div>
                  <h2 id={`${group.slug}-heading`}>{group.name}</h2>
                  <p>{group.description}</p>
                </div>
                <CategoryCount count={getGroupToolSlugs(group.slug).length} />
              </header>
              <RevealGrid
                className="subcategory-grid"
                itemsKey={children.map((category) => category.slug).join(':')}
              >
                {children.map((category, index) => (
                  <SubcategoryCard
                    category={category}
                    group={group}
                    index={index}
                    key={category.slug}
                  />
                ))}
              </RevealGrid>
            </section>
          ))}

          {showsMoreGroup && moreGroup && (
            <section
              aria-labelledby={`${moreGroup.slug}-heading`}
              className="categories-group-section categories-group-section--more"
              id={moreGroup.slug}
            >
              <header className="categories-group-section__header">
                <span className="categories-group-section__icon">
                  <CategoryIcon name={moreGroup.icon} size={22} />
                </span>
                <div>
                  <h2 id={`${moreGroup.slug}-heading`}>{moreGroup.name}</h2>
                  <p>{moreGroup.description}</p>
                </div>
                <CategoryCount count={getGroupToolSlugs(moreGroup.slug).length} />
              </header>
              <div aria-label="More categories" className="category-pill-list">
                {moreChildren.map((category) => (
                  <CategoryPill
                    category={category}
                    group={moreGroup}
                    key={category.slug}
                  />
                ))}
              </div>
            </section>
          )}

          {visibleGroups.length === 0 && !showsMoreGroup && (
            <div className="categories-empty card" role="status">
              No categories match that. Try another keyword.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type CategoryDetailPageProps = {
  category?: Category
  group: CategoryGroup
}

type PricingFilter = 'all' | 'Free' | 'Freemium' | 'Free Trial' | 'Paid'
type ToolSort = 'popular' | 'newest' | 'alphabetical'

function CategoryDetailPage({
  category,
  group,
}: CategoryDetailPageProps) {
  const [query, setQuery] = useState('')
  const [pricing, setPricing] = useState<PricingFilter>('all')
  const [sort, setSort] = useState<ToolSort>('popular')
  const groupToolSlugs = useMemo(
    () =>
      new Set(
        category
          ? getCategoryToolSlugs(category.slug)
          : getGroupToolSlugs(group.slug),
      ),
    [category, group.slug],
  )
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const matchingTools = useMemo(() => {
    const matching = directoryTools.filter((tool) => {
      if (!groupToolSlugs.has(tool.slug)) return false
      const matchesQuery =
        !normalizedQuery ||
        `${tool.name} ${tool.shortDescription} ${tool.tags.join(' ')}`
          .toLocaleLowerCase()
          .includes(normalizedQuery)
      const matchesPricing =
        pricing === 'all' ||
        (pricing === 'Paid'
          ? tool.pricing === 'Paid' || tool.pricing === 'Premium'
          : tool.pricing === pricing)
      return matchesQuery && matchesPricing
    })

    return matching.sort((first, second) => {
      if (sort === 'alphabetical') {
        return first.name.localeCompare(second.name)
      }
      if (sort === 'newest') {
        const firstDate = first.lastVerified ?? ''
        const secondDate = second.lastVerified ?? ''
        const dateOrder = secondDate.localeCompare(firstDate)
        return dateOrder || first.name.localeCompare(second.name)
      }
      const popularityDifference =
        (second.popularity ?? 0) - (first.popularity ?? 0)
      if (popularityDifference !== 0) return popularityDifference
      if (first.featured !== second.featured) {
        return first.featured ? -1 : 1
      }
      return first.name.localeCompare(second.name)
    })
  }, [groupToolSlugs, normalizedQuery, pricing, sort])
  const activeCategorySlug = category?.slug

  return (
    <article className="category-detail-page site-container">
      <nav aria-label="Breadcrumb" className="category-breadcrumb">
        <AppLink href="/#home">Home</AppLink>
        <span aria-hidden="true">/</span>
        <AppLink href="/categories">Categories</AppLink>
        <span aria-hidden="true">/</span>
        {category && (
          <>
            <AppLink href={`/categories/${group.slug}`}>{group.name}</AppLink>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span aria-current="page">{category?.name ?? group.name}</span>
      </nav>

      <header className="category-detail-header">
        <span className="category-detail-header__icon">
          <CategoryIcon name={category?.icon ?? group.icon} size={24} />
        </span>
        <p className="eyebrow">{category ? group.name : 'CATEGORY GROUP'}</p>
        <h1>{category?.name ?? group.name}</h1>
        <p>{category?.description ?? group.description}</p>
        <CategoryCount count={groupToolSlugs.size} />
      </header>

      <nav aria-label={`${group.name} subcategories`} className="category-subnav">
        <AppLink
          aria-current={!category ? 'page' : undefined}
          className={!category ? 'is-active' : undefined}
          href={`/categories/${group.slug}`}
        >
          All {group.name}
        </AppLink>
        {group.children.map((sibling) => (
          <AppLink
            aria-current={activeCategorySlug === sibling.slug ? 'page' : undefined}
            className={activeCategorySlug === sibling.slug ? 'is-active' : undefined}
            href={`/categories/${group.slug}/${sibling.slug}`}
            key={sibling.slug}
          >
            {sibling.name}
          </AppLink>
        ))}
      </nav>

      <div aria-label="Filter category tools" className="category-tool-toolbar">
        <label className="category-tool-toolbar__search">
          <span>Search within category</span>
          <input
            className="input"
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search tools"
            type="search"
            value={query}
          />
        </label>
        <label>
          <span>Sort by</span>
          <select
            className="input"
            onChange={(event) => {
              const value = event.currentTarget.value
              if (
                value === 'popular' ||
                value === 'newest' ||
                value === 'alphabetical'
              ) {
                setSort(value)
              }
            }}
            value={sort}
          >
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="alphabetical">A–Z</option>
          </select>
        </label>
        <label>
          <span>Pricing</span>
          <select
            className="input"
            onChange={(event) => {
              const value = event.currentTarget.value
              if (
                value === 'all' ||
                value === 'Free' ||
                value === 'Freemium' ||
                value === 'Free Trial' ||
                value === 'Paid'
              ) {
                setPricing(value)
              }
            }}
            value={pricing}
          >
            <option value="all">All pricing</option>
            <option value="Free">Free</option>
            <option value="Freemium">Freemium</option>
            <option value="Free Trial">Free Trial</option>
            <option value="Paid">Paid</option>
          </select>
        </label>
      </div>

      <p aria-live="polite" className="category-tools-count" role="status">
        {matchingTools.length}{' '}
        {matchingTools.length === 1 ? 'tool' : 'tools'}
      </p>
      {matchingTools.length ? (
        <div className="tool-grid category-tool-grid">
          {matchingTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="category-tools-empty card" role="status">
          Tools for this category are coming soon
        </div>
      )}
    </article>
  )
}

function CategoryNotFoundPage() {
  return (
    <section className="category-not-found site-container">
      <p className="eyebrow">CATEGORY NOT FOUND</p>
      <h1>This category could not be found.</h1>
      <p>Browse all ZYNORA categories to continue exploring.</p>
      <AppLink className="button button--accent" href="/categories">
        View all categories
      </AppLink>
    </section>
  )
}

function CategoriesExperience({ route }: { route: CategoryRoute }) {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main>
        {route.type === 'index' ? (
          <CategoriesIndexPage />
        ) : route.type === 'group' ? (
          <CategoryDetailPage group={route.group} />
        ) : route.type === 'category' ? (
          <CategoryDetailPage category={route.category} group={route.group} />
        ) : (
          <CategoryNotFoundPage />
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

export default CategoriesExperience
