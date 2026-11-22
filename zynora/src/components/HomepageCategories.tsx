import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { featuredCategoryGroups } from '../data/categories'
import AppLink from './AppLink'
import {
  CategoryGroupCard,
  RevealGrid,
} from './CategoryCards'
import './HomepageCategories.css'

function HomepageCategories() {
  const homepageCategoryGroups = featuredCategoryGroups.slice(0, 4)

  return (
    <section
      aria-labelledby="homepage-categories-title"
      className="homepage-categories site-container"
      id="categories"
    >
      <header className="homepage-categories__header">
        <div className="homepage-categories__heading">
          <p className="eyebrow">CATEGORIES</p>
          <h2 id="homepage-categories-title">
            Find the right AI for <span className="heading-pill">every</span>{' '}
            task
          </h2>
          <p>
            Explore focused categories to find the tools that fit the work
            you&apos;re doing.
          </p>
        </div>
        <AppLink
          className="button button--outline homepage-categories__all"
          href="/categories"
        >
          View all categories
          <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
        </AppLink>
      </header>

      <RevealGrid
        className="homepage-categories__grid"
        itemsKey={homepageCategoryGroups.map((group) => group.slug).join(':')}
      >
        {homepageCategoryGroups.map((group, index) => (
          <CategoryGroupCard group={group} index={index} key={group.slug} />
        ))}
        <AppLink
          aria-label="Browse 81 AI tool categories"
          className="category-browse-card"
          data-reveal
          href="/categories"
          style={
            {
              '--reveal-index': homepageCategoryGroups.length,
            } as CSSProperties & { '--reveal-index': number }
          }
        >
          <span className="category-browse-card__eyebrow">Explore the directory</span>
          <span className="category-browse-card__title">
            Browse 81 categories
          </span>
          <span className="category-browse-card__button">
            View all categories
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
          </span>
        </AppLink>
      </RevealGrid>
    </section>
  )
}

export default HomepageCategories
