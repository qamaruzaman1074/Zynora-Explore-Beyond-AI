import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react'
import { categoryGroups } from '../data/categories'
import { tools } from '../data/tools'
import { ToolCard } from './ToolDirectory'
import './AllToolsPage.css'

type SortOption = 'az' | 'za' | 'featured' | 'popular'
const pageSize = 24

function AllToolsPage() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('az')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)

  const matchingTools = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const filtered = tools.filter((tool) => {
      const matchesQuery =
        !normalizedQuery ||
        `${tool.name} ${tool.shortDescription} ${tool.tags.join(' ')}`
          .toLocaleLowerCase()
          .includes(normalizedQuery)
      const matchesCategory =
        category === 'all' ||
        tool.categorySlugs?.includes(category) === true
      return matchesQuery && matchesCategory
    })

    return [...filtered].sort((first, second) => {
      if (sort === 'za') return second.name.localeCompare(first.name)
      if (sort === 'featured') {
        if (first.featured !== second.featured) return first.featured ? -1 : 1
        return first.name.localeCompare(second.name)
      }
      if (sort === 'popular') {
        return (
          (second.popularity ?? 0) - (first.popularity ?? 0) ||
          first.name.localeCompare(second.name)
        )
      }
      return first.name.localeCompare(second.name)
    })
  }, [category, query, sort])

  const pageCount = Math.max(1, Math.ceil(matchingTools.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleTools = matchingTools.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const updateCategory = (value: string) => {
    setCategory(value)
    setPage(1)
  }

  return (
    <main className="all-tools-page">
      <section className="all-tools-page__header site-container">
        <div>
          <p className="eyebrow">Complete directory</p>
          <h1>
            All <span className="heading-pill">AI Tools</span>
          </h1>
          <p>
            Browse all {tools.length.toLocaleString()} logo-verified listings
            from ZYNORA.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="all-tools-results-title"
        className="all-tools-page__content site-container"
      >
        <div className="all-tools-controls">
          <label className="all-tools-control all-tools-control--search">
            <Search aria-hidden="true" size={18} />
            <span className="visually-hidden">Search all tools</span>
            <input
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search all tools"
              type="search"
              value={query}
            />
            {query && (
              <button
                aria-label="Clear search"
                className="all-tools-control--clear"
                onClick={() => {
                  setQuery('')
                  setPage(1)
                }}
                type="button"
              >
                <X aria-hidden="true" size={16} />
              </button>
            )}
          </label>
          <label className="all-tools-control">
            <span>Category</span>
            <select
              onChange={(event) => updateCategory(event.target.value)}
              value={category}
            >
              <option value="all">All categories</option>
              {categoryGroups.map((group) => (
                <optgroup key={group.slug} label={group.name}>
                  {group.children.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="all-tools-control">
            <span>Sort</span>
            <select
              onChange={(event) => {
                setSort(event.target.value as SortOption)
                setPage(1)
              }}
              value={sort}
            >
              <option value="az">Name: A-Z</option>
              <option value="za">Name: Z-A</option>
              <option value="featured">Featured first</option>
              <option value="popular">Most popular</option>
            </select>
          </label>
        </div>

        <div className="all-tools-results">
          <p id="all-tools-results-title" role="status">
            Showing {matchingTools.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, matchingTools.length)} of{' '}
            {matchingTools.length} tools
          </p>
        </div>

        {visibleTools.length > 0 ? (
          <>
            <div className="tool-grid all-tools-grid">
              {visibleTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            {pageCount > 1 && (
              <nav aria-label="All tools pages" className="all-tools-pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  type="button"
                >
                  <ArrowLeft aria-hidden="true" size={18} />
                  Previous
                </button>
                <span>
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  disabled={currentPage === pageCount}
                  onClick={() =>
                    setPage((value) => Math.min(pageCount, value + 1))
                  }
                  type="button"
                >
                  Next
                  <ArrowRight aria-hidden="true" size={18} />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="directory-empty card" role="status">
            <h2>No matching tools</h2>
            <p>Try another name or category.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default AllToolsPage
