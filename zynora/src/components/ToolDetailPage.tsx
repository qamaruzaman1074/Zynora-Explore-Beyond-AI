import { ArrowUpRight } from 'lucide-react'
import {
  getCategoryById,
  getPrimaryCategoryGroupForTool,
} from '../data/categories'
import { tools } from '../data/tools'
import type { AITool } from '../types/tool'
import AppLink from './AppLink'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import ToolLogo from './ToolLogo'
import './ToolDetailPage.css'

type ToolDetailPageProps = {
  tool: AITool
}

function ToolDetailPage({ tool }: ToolDetailPageProps) {
  const categoryGroup = getPrimaryCategoryGroupForTool(tool.slug)
  const legacyCategory = tool.categoryId
    ? getCategoryById(tool.categoryId)
    : undefined
  const categoryName =
    categoryGroup?.name ?? legacyCategory?.name ?? 'AI tools'
  const relatedTools = tools
    .filter(
      (candidate) =>
        candidate.slug !== tool.slug &&
        (categoryGroup
          ? getPrimaryCategoryGroupForTool(candidate.slug)?.slug ===
            categoryGroup.slug
          : tool.categoryId !== undefined &&
            candidate.categoryId === tool.categoryId),
    )
    .sort((first, second) => {
      if (first.featured !== second.featured) {
        return first.featured ? -1 : 1
      }
      return first.name.localeCompare(second.name)
    })
    .slice(0, 4)

  return (
    <div className="app-shell">
      <SiteHeader />
      <main>
        <article
          aria-labelledby="tool-detail-title"
          className="tool-detail site-container"
        >
          <nav aria-label="Breadcrumb" className="tool-detail__breadcrumb">
            <AppLink href="/#explore">Explore AI Tools</AppLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{tool.name}</span>
          </nav>

          <header className="tool-detail__hero card">
            <div className="tool-detail__identity">
              <div className="tool-detail__logo">
                <ToolLogo loading="eager" size={48} tool={tool} />
              </div>
              <div className="tool-detail__intro">
                <p className="eyebrow">{categoryName}</p>
                <h1 id="tool-detail-title">{tool.name}</h1>
                <p className="tool-detail__short-description">
                  {tool.shortDescription}
                </p>
              </div>
            </div>
            <div className="tool-detail__actions">
              {tool.officialWebsite ? (
                <a
                  className="button button--accent"
                  href={tool.officialWebsite}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Visit Official Website
                </a>
              ) : (
                <span className="tool-detail__site-unavailable" role="status">
                  Official website not verified
                </span>
              )}
            </div>
          </header>

          {relatedTools.length > 0 && (
            <section
              aria-labelledby="related-tools-title"
              className="tool-detail__related"
            >
              <div className="tool-detail__section-heading">
                <div>
                  <p className="eyebrow">Recommended for you</p>
                  <h2 id="related-tools-title">More in {categoryName}</h2>
                </div>
                <span>{relatedTools.length} suggestions</span>
              </div>
              <div className="tool-detail__related-grid">
                {relatedTools.map((relatedTool) => (
                  <AppLink
                    aria-label={`View details for ${relatedTool.name}`}
                    className="tool-detail__related-card card"
                    href={`/tools/${relatedTool.slug}`}
                    key={relatedTool.id}
                  >
                    <span className="tool-detail__related-topline">
                      <span className="tool-detail__related-logo">
                        <ToolLogo size={30} tool={relatedTool} />
                      </span>
                      <ArrowUpRight aria-hidden="true" size={18} />
                    </span>
                    <span className="tool-detail__related-name">
                      {relatedTool.name}
                    </span>
                    <small>{relatedTool.shortDescription}</small>
                  </AppLink>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}

export default ToolDetailPage
