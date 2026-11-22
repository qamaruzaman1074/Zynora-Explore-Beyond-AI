import { useMemo, useState } from 'react'
import {
  categoryGroups,
  getCategoryById,
  getCategoryToolSlugs,
  getGroupToolSlugs,
  getPrimaryCategoryGroupForTool,
} from '../data/categories'
import { tools } from '../data/tools'
import { navigate, useCurrentLocation } from '../routing'
import AppLink from './AppLink'
import type { AITool, PricingTier } from '../types/tool'
import ToolLogo from './ToolLogo'
import './ToolDirectory.css'

const pageSize = 8
const pinnedToolOrder = new Map(
  [
    'chatgpt',
    'claude',
    'perplexity',
    'gemini',
    'grok',
    'elevenlabs',
    'midjourney',
    'cursor',
    'deepseek',
    'gamma',
  ].map((slug, index) => [slug, index]),
)

function pricingClassName(pricing: PricingTier) {
  return pricing.toLocaleLowerCase().replace(/\s+/g, '-')
}

function getCategoryFilter(search: string): string | 'all' {
  const selectedCategory = new URLSearchParams(search).get('category')
  return categoryGroups.some(
    (group) =>
      group.slug === selectedCategory ||
      group.children.some((category) => category.slug === selectedCategory),
  )
    ? selectedCategory ?? 'all'
    : 'all'
}

export function ToolCard({ tool }: { tool: AITool }) {
  const categoryGroup = getPrimaryCategoryGroupForTool(tool.slug)
  const category = categoryGroup?.name ??
    (tool.categoryId ? getCategoryById(tool.categoryId).name : 'AI tools')

  return (
    <article className="tool-card card">
      <AppLink
        aria-label={`View details for ${tool.name}`}
        className="tool-card__main"
        href={`/tools/${tool.slug}`}
      >
        <div className="tool-card__topline">
          <div className="tool-card__logo">
            <ToolLogo size={30} tool={tool} />
          </div>
          {tool.featured && (
            <span className="tool-card__featured">Featured</span>
          )}
        </div>
        <p className="tool-card__category">        {category}</p>
        <h3>{tool.name}</h3>
        <p className="tool-card__description">{tool.shortDescription}</p>
      </AppLink>
      <div className="tool-card__footer">
        <span
          className={`tool-card__pricing tool-card__pricing--${pricingClassName(tool.pricing)}`}
        >
          {tool.pricing}
        </span>
        {tool.officialWebsite ? (
          <a
            aria-label={`Visit ${tool.name} website (opens in a new tab)`}
            className="tool-card__link"
            href={tool.officialWebsite}
            rel="noopener noreferrer"
            target="_blank"
          >
            Visit Website <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="tool-card__link-unavailable">
            Official site not verified
          </span>
        )}
      </div>
    </article>
  )
}

function ToolDirectory() {
  const [query, setQuery] = useState(
    () => new URLSearchParams(window.location.search).get('q') ?? '',
  )
  const [pageState, setPageState] = useState({ key: '', page: 1 })
  const location = useCurrentLocation()
  const categoryFilter = getCategoryFilter(
    new URL(location, window.location.origin).search,
  )
  const matchingCategoryToolSlugs = useMemo(() => {
    if (categoryFilter === 'all') return new Set<string>()
    const isGroup = categoryGroups.some(
      (group) => group.slug === categoryFilter,
    )
    return new Set(
      isGroup
        ? getGroupToolSlugs(categoryFilter)
        : getCategoryToolSlugs(categoryFilter),
    )
  }, [categoryFilter])
  const categoryOrderByToolSlug = useMemo(() => {
    const orderByToolSlug = new Map<string, number>()

    categoryGroups.forEach((group, index) => {
      getGroupToolSlugs(group.slug).forEach((slug) => {
        if (!orderByToolSlug.has(slug)) orderByToolSlug.set(slug, index)
      })
    })

    return orderByToolSlug
  }, [])
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const filterKey = [categoryFilter, normalizedQuery].join('|')

  const matchingTools = useMemo(() => {
    const filteredTools = tools.filter((tool) => {
      const matchesQuery =
        !normalizedQuery ||
        `${tool.name} ${tool.shortDescription} ${tool.tags.join(' ')}`
          .toLocaleLowerCase()
          .includes(normalizedQuery)
      const matchesCategory =
        categoryFilter === 'all' ||
        matchingCategoryToolSlugs.has(tool.slug)

      return matchesQuery && matchesCategory
    })

    return [...filteredTools].sort((first, second) => {
      const firstPinnedOrder = pinnedToolOrder.get(first.slug)
      const secondPinnedOrder = pinnedToolOrder.get(second.slug)
      if (firstPinnedOrder !== undefined || secondPinnedOrder !== undefined) {
        if (firstPinnedOrder === undefined) return 1
        if (secondPinnedOrder === undefined) return -1
        return firstPinnedOrder - secondPinnedOrder
      }
      const categoryDifference =
        (categoryOrderByToolSlug.get(first.slug) ?? categoryGroups.length) -
        (categoryOrderByToolSlug.get(second.slug) ?? categoryGroups.length)
      if (categoryDifference !== 0) return categoryDifference
      const popularityDifference =
        (second.popularity ?? 0) - (first.popularity ?? 0)
      if (popularityDifference !== 0) return popularityDifference
      if (first.featured !== second.featured) {
        return first.featured ? -1 : 1
      }
      return first.name.localeCompare(second.name)
    })
  }, [
    categoryFilter,
    categoryOrderByToolSlug,
    matchingCategoryToolSlugs,
    normalizedQuery,
  ])
  const pageCount = Math.max(1, Math.ceil(matchingTools.length / pageSize))
  const page = pageState.key === filterKey ? pageState.page : 1
  const currentPage = Math.min(page, pageCount)
  const visibleTools = matchingTools.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const clearFilters = () => {
    setQuery('')
    if (new URLSearchParams(window.location.search).has('category')) {
      navigate('/#explore')
    }
  }

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categoryGroups.some(
      (group) =>
        group.slug === value ||
        group.children.some((category) => category.slug === value),
    )
    const destination = new URL(window.location.href)

    if (selectedCategory) {
      destination.searchParams.set('category', value)
    } else {
      destination.searchParams.delete('category')
    }
    destination.hash = 'explore'
    navigate(
      `${destination.pathname}${destination.search}${destination.hash}`,
    )
  }

  return (
    <section
      aria-labelledby="explore-title"
      className="tools-directory directory-section site-container"
      id="explore"
    >
      <div className="section-heading">
        <p className="eyebrow">Popular &amp; trending</p>
        <h2 id="explore-title">
          Discover <span className="heading-pill">AI Tools</span>
        </h2>
        <p className="tools-directory__description">
          Search {tools.length.toLocaleString()} AI tools across{' '}
          {categoryGroups.length} category groups and{' '}
          {categoryGroups.reduce(
            (total, group) => total + group.children.length,
            0,
          )}{' '}
          categories.
        </p>
      </div>

      <div aria-label="Filter AI tools" className="directory-controls">
        <label className="directory-control">
          <span>Search tools</span>
          <input
            autoComplete="off"
            className="input"
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search by name, description, or tag"
            type="search"
            value={query}
          />
        </label>

        <label className="directory-control">
          <span>Category</span>
          <select
            className="input"
            onChange={(event) =>
              handleCategoryChange(event.currentTarget.value)
            }
            value={categoryFilter}
          >
            <option value="all">All categories</option>
            {categoryGroups.map((group) => (
              <optgroup key={group.slug} label={group.name}>
                <option value={group.slug}>All in {group.name}</option>
                {group.children.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

      </div>

      <div className="directory-results">
        <p aria-live="polite" className="directory-results__count" role="status">
          {matchingTools.length === 0
            ? 'No tools found'
            : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(
                currentPage * pageSize,
                matchingTools.length,
              )} of ${matchingTools.length} tools`}
        </p>
        <div className="directory-results__actions">
          <AppLink
            className="button button--outline directory-results__clear"
            href="/all-tools"
          >
            View all tools
          </AppLink>
          <button
            className="button button--outline directory-results__clear"
            onClick={clearFilters}
            type="button"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {matchingTools.length > 0 ? (
        <>
          <div className="tool-grid">
            {visibleTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          {pageCount > 1 && (
            <nav aria-label="Tool result pages" className="directory-pagination">
              <button
                aria-label="Previous page"
                className="button button--outline"
                disabled={currentPage === 1}
                onClick={() =>
                  setPageState({ key: filterKey, page: currentPage - 1 })
                }
                type="button"
              >
                Previous
              </button>
              <span aria-live="polite">
                Page {currentPage} of {pageCount}
              </span>
              <button
                aria-label="Next page"
                className="button button--outline"
                disabled={currentPage === pageCount}
                onClick={() =>
                  setPageState({ key: filterKey, page: currentPage + 1 })
                }
                type="button"
              >
                Next
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="directory-empty card" role="status">
          <h3>No matching tools</h3>
          <p>
            Try a different search or clear the filters to see all available
            tools.
          </p>
          <button
            className="button button--accent"
            onClick={clearFilters}
            type="button"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  )
}

export default ToolDirectory
