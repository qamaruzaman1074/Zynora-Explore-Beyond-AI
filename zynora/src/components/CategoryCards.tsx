import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import {
  getCategoryToolSlugs,
  getGroupToolSlugs,
} from '../data/categories'
import type { Category, CategoryGroup } from '../types/tool'
import AppLink from './AppLink'
import CategoryIcon from './CategoryIcon'
import './CategoryCards.css'

type RevealStyle = CSSProperties & {
  '--reveal-index': number
}

type RevealGridProps = {
  children: ReactNode
  className: string
  itemsKey: string
}

export function RevealGrid({
  children,
  className,
  itemsKey,
}: RevealGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const cards = grid.querySelectorAll<HTMLElement>('[data-reveal]')
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      cards.forEach((card) => card.classList.add('is-visible'))
      return
    }

    grid.classList.add('is-revealing')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -32px 0px' },
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [itemsKey])

  return (
    <div className={`category-reveal-grid ${className}`} ref={gridRef}>
      {children}
    </div>
  )
}

type CategoryGroupCardProps = {
  group: CategoryGroup
  index: number
}

export function CategoryGroupCard({
  group,
  index,
}: CategoryGroupCardProps) {
  const count = getGroupToolSlugs(group.slug).length

  return (
    <AppLink
      aria-label={`${group.name}, ${count} ${count === 1 ? 'tool' : 'tools'}`}
      className="category-group-card"
      href={`/categories/${group.slug}`}
      style={{ '--reveal-index': index } as RevealStyle}
      data-reveal
    >
      <span className="category-group-card__icon">
        <CategoryIcon name={group.icon} size={20} />
      </span>
      <h3>{group.name}</h3>
      <p className="category-group-card__description">{group.description}</p>
      <span aria-label="Featured subcategories" className="category-group-card__chips">
        {group.children.slice(0, 3).map((category) => (
          <span className="category-group-card__chip" key={category.slug}>
            <span aria-hidden="true" />
            {category.name}
          </span>
        ))}
      </span>
      <span className="category-group-card__footer">
        <span className="category-count">
          {count} {count === 1 ? 'tool' : 'tools'}
        </span>
        <ArrowUpRight aria-hidden="true" className="category-card-arrow" size={20} strokeWidth={1.5} />
      </span>
    </AppLink>
  )
}

type SubcategoryCardProps = {
  category: Category
  group: CategoryGroup
  index: number
}

export function SubcategoryCard({
  category,
  group,
  index,
}: SubcategoryCardProps) {
  const count = getCategoryToolSlugs(category.slug).length

  return (
    <AppLink
      aria-label={`${category.name}, ${count} ${count === 1 ? 'tool' : 'tools'}`}
      className="subcategory-card"
      href={`/categories/${group.slug}/${category.slug}`}
      style={{ '--reveal-index': index } as RevealStyle}
      data-reveal
    >
      <span className="subcategory-card__title">{category.name}</span>
      <span className="subcategory-card__description">
        {category.description}
      </span>
      <span className="subcategory-card__footer">
        <span className="category-count">
          {count} {count === 1 ? 'tool' : 'tools'}
        </span>
        <ArrowUpRight aria-hidden="true" className="category-card-arrow" size={20} strokeWidth={1.5} />
      </span>
    </AppLink>
  )
}

export function CategoryPill({
  category,
  group,
}: {
  category: Category
  group: CategoryGroup
}) {
  const count = getCategoryToolSlugs(category.slug).length

  return (
    <AppLink
      className="category-pill"
      href={`/categories/${group.slug}/${category.slug}`}
    >
      <span aria-hidden="true" className="category-pill__dot" />
      <span>{category.name}</span>
      <span className="category-count">{count}</span>
    </AppLink>
  )
}

export function CategoryCount({ count }: { count: number }) {
  return (
    <span className="category-count">
      {count} {count === 1 ? 'tool' : 'tools'}
    </span>
  )
}

