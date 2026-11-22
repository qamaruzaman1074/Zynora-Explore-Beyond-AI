import {
  getCategoryById,
  getPrimaryCategoryGroupForTool,
} from '../data/categories'
import { tools } from '../data/tools'
import type { AITool, PricingTier } from '../types/tool'
import AppLink from './AppLink'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import ToolLogo from './ToolLogo'
import './ToolDetailPage.css'

function pricingClassName(pricing: PricingTier) {
  return pricing.toLocaleLowerCase().replace(/\s+/g, '-')
}

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
              <span
                className={`tool-detail__pricing tool-detail__pricing--${pricingClassName(tool.pricing)}`}
              >
                {tool.pricing}
              </span>
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

          <div className="tool-detail__content">
            <section
              aria-labelledby="tool-overview-title"
              className="tool-detail__panel card"
            >
              <h2 id="tool-overview-title">Overview</h2>
              <p>{tool.longDescription ?? tool.shortDescription}</p>
              {!tool.longDescription && (
                <p className="tool-detail__note">
                  This profile contains a brief directory summary. Check the
                  official website for current product information.
                </p>
              )}
            </section>

            <div className="tool-detail__columns">
              <section
                aria-labelledby="tool-features-title"
                className="tool-detail__panel card"
              >
                <h2 id="tool-features-title">Main features</h2>
                {tool.features?.length ? (
                  <ul>
                    {tool.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="tool-detail__note">
                    No additional feature details have been verified yet.
                  </p>
                )}
              </section>

              <section
                aria-labelledby="tool-use-cases-title"
                className="tool-detail__panel card"
              >
                <h2 id="tool-use-cases-title">Common use cases</h2>
                {tool.useCases?.length ? (
                  <ul>
                    {tool.useCases.map((useCase) => (
                      <li key={useCase}>{useCase}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="tool-detail__note">
                    No additional use-case details have been verified yet.
                  </p>
                )}
              </section>
            </div>

            <section
              aria-labelledby="tool-pricing-title"
              className="tool-detail__panel card"
            >
              <h2 id="tool-pricing-title">Pricing information</h2>
              <p>
                Pricing status: <strong>{tool.pricing}</strong>
              </p>
              <p className="tool-detail__note">
                {tool.pricingNotes ??
                  (tool.pricing === 'Unverified'
                    ? tool.officialWebsite
                      ? 'Current pricing has not been verified. Check the official website for the latest information.'
                      : 'Current pricing and official website have not been verified yet.'
                    : 'Plans and availability can change. Check the official website for current pricing details.')}
              </p>
              {tool.lastVerified && (
                <p className="tool-detail__verified">
                  Last verified:{' '}
                  <time dateTime={tool.lastVerified}>{tool.lastVerified}</time>
                </p>
              )}
            </section>

            {relatedTools.length > 0 && (
              <section
                aria-labelledby="related-tools-title"
                className="tool-detail__related"
              >
                <div className="tool-detail__section-heading">
                  <div>
                    <p className="eyebrow">Explore more</p>
                    <h2 id="related-tools-title">Related tools</h2>
                  </div>
                  <span>{categoryName}</span>
                </div>
                <div className="tool-detail__related-grid">
                  {relatedTools.map((relatedTool) => (
                    <AppLink
                      className="tool-detail__related-card card"
                      href={`/tools/${relatedTool.slug}`}
                      key={relatedTool.id}
                    >
                      <span>{relatedTool.name}</span>
                      <span aria-hidden="true">↗</span>
                      <small>{relatedTool.shortDescription}</small>
                    </AppLink>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}

export default ToolDetailPage
