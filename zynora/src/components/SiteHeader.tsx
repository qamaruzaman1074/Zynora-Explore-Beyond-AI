import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import githubLogo from '../assets/social/github.png'
import { featuredCategoryGroups } from '../data/categories'
import AnimatedLogo from '../AnimatedLogo'
import AppLink from './AppLink'
import './SiteHeader.css'

const mainNavigation = [
  { label: 'Explore', href: '/#explore' },
  { label: 'All Tools', href: '/all-tools' },
]

type LinkNavigationProps = {
  className: string
  isMegaOpen: boolean
  onToggleCategories: () => void
  onNavigate: () => void
}

function MainNavigation({
  className,
  isMegaOpen,
  onToggleCategories,
  onNavigate,
}: LinkNavigationProps) {
  return (
    <nav aria-label="Primary navigation" className={className}>
      <ul>
        {mainNavigation.slice(0, 1).map(({ label, href }) => (
          <li key={href}>
            <AppLink href={href} onClick={onNavigate}>
              {label}
            </AppLink>
          </li>
        ))}
        <li>
          <button
            aria-controls="desktop-categories-menu"
            aria-expanded={isMegaOpen}
            className="site-header__categories-link"
            onClick={onToggleCategories}
            type="button"
          >
            Categories
            <ChevronDown
              aria-hidden="true"
              className={isMegaOpen ? 'is-open' : undefined}
              size={14}
              strokeWidth={1.5}
            />
          </button>
        </li>
        {mainNavigation.slice(1).map(({ label, href }) => (
          <li key={href}>
            <AppLink href={href} onClick={onNavigate}>
              {label}
            </AppLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

type MobileCategoryAccordionProps = {
  onNavigate: () => void
}

function MobileCategoryAccordion({
  onNavigate,
}: MobileCategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  return (
    <div className="site-header__mobile-categories">
      <button
        aria-controls="mobile-categories-accordion"
        aria-expanded={isOpen}
        className="site-header__mobile-category-toggle"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        Categories
        <ChevronDown
          aria-hidden="true"
          className={isOpen ? 'is-open' : undefined}
          size={16}
          strokeWidth={1.5}
        />
      </button>
      {isOpen && (
        <div
          className="site-header__mobile-category-groups"
          id="mobile-categories-accordion"
        >
          {featuredCategoryGroups.map((group) => {
            const isGroupOpen = openGroup === group.slug
            return (
              <section key={group.slug}>
                <button
                  aria-controls={`mobile-category-${group.slug}`}
                  aria-expanded={isGroupOpen}
                  className="site-header__mobile-group-toggle"
                  onClick={() =>
                    setOpenGroup(isGroupOpen ? null : group.slug)
                  }
                  type="button"
                >
                  {group.name}
                  <ChevronDown
                    aria-hidden="true"
                    className={isGroupOpen ? 'is-open' : undefined}
                    size={14}
                    strokeWidth={1.5}
                  />
                </button>
                {isGroupOpen && (
                  <div
                    className="site-header__mobile-group-links"
                    id={`mobile-category-${group.slug}`}
                  >
                    {group.children.slice(0, 4).map((category) => (
                      <AppLink
                        href={`/categories/${group.slug}/${category.slug}`}
                        key={category.slug}
                        onClick={onNavigate}
                      >
                        {category.name}
                      </AppLink>
                    ))}
                    <AppLink
                      className="site-header__mobile-view-all"
                      href={`/categories/${group.slug}`}
                      onClick={onNavigate}
                    >
                      View all {group.name}
                    </AppLink>
                  </div>
                )}
              </section>
            )
          })}
          <AppLink
            className="site-header__mobile-category-index"
            href="/categories"
            onClick={onNavigate}
          >
            Browse all categories
          </AppLink>
        </div>
      )}
    </div>
  )
}

type GitHubLinkProps = {
  className: string
  onClick: () => void
}

function GitHubLink({ className, onClick }: GitHubLinkProps) {
  return (
    <a
      aria-label="Visit ZYNORA on GitHub (opens in a new tab)"
      className={className}
      href="https://github.com/qamaruzaman1074"
      onClick={onClick}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img alt="" height={24} src={githubLogo} width={24} />
    </a>
  )
}

function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const closeMenus = () => {
    setIsMenuOpen(false)
    setIsMegaOpen(false)
  }

  useEffect(() => {
    if (!isMenuOpen && !isMegaOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenus()
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        closeMenus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMenuOpen, isMegaOpen])

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-header__inner site-container">
        <AppLink
          aria-label="ZYNORA — Explore Beyond AI"
          className="site-header__brand"
          href="/"
          onClick={closeMenus}
        >
          <AnimatedLogo />
          <span className="site-header__tagline">Explore Beyond AI.</span>
        </AppLink>

        <MainNavigation
          className="site-header__desktop-nav"
          isMegaOpen={isMegaOpen}
          onToggleCategories={() => setIsMegaOpen((open) => !open)}
          onNavigate={closeMenus}
        />

        <div className="site-header__desktop-actions">
          <GitHubLink
            className="site-header__github"
            onClick={closeMenus}
          />
          <AppLink
            className="button button--accent site-header__cta"
            href="/submit-ai-tool"
            onClick={closeMenus}
          >
            Submit AI Tool
          </AppLink>
        </div>

        <div className="site-header__mobile-header-actions">
          <GitHubLink
            className="site-header__mobile-github"
            onClick={closeMenus}
          />
          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={
              isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            className="site-header__menu-toggle"
            onClick={() => setIsMenuOpen((open) => !open)}
            type="button"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path
                d={
                  isMenuOpen
                    ? 'm6 6 12 12M18 6 6 18'
                    : 'M4 7h16M4 12h16M4 17h16'
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {isMegaOpen && (
        <div
          aria-label="Featured category groups"
          className="site-header__mega-menu site-header__mega-menu--open"
          id="desktop-categories-menu"
        >
          <div className="site-header__mega-grid">
            {featuredCategoryGroups.map((group) => (
              <section key={group.slug}>
                <h2>{group.name}</h2>
                <ul>
                  {group.children.slice(0, 4).map((category) => (
                    <li key={category.slug}>
                      <AppLink
                        href={`/categories/${group.slug}/${category.slug}`}
                        onClick={closeMenus}
                      >
                        {category.name}
                      </AppLink>
                    </li>
                  ))}
                </ul>
                <AppLink
                  className="site-header__mega-all"
                  href={`/categories/${group.slug}`}
                  onClick={closeMenus}
                >
                  View all <span aria-hidden="true">↗</span>
                </AppLink>
              </section>
            ))}
          </div>
          <AppLink
            className="site-header__mega-index"
            href="/categories"
            onClick={closeMenus}
          >
            Browse all categories <span aria-hidden="true">↗</span>
          </AppLink>
        </div>
      )}

      <div
        aria-hidden={!isMenuOpen}
        className={`site-header__mobile-menu${isMenuOpen ? ' is-open' : ''}`}
        inert={!isMenuOpen}
        id="mobile-navigation"
      >
        <div className="site-header__mobile-clip">
          <div className="site-header__mobile-content site-container">
            <nav aria-label="Primary navigation" className="site-header__mobile-nav">
              <ul>
                {mainNavigation.slice(0, 1).map(({ label, href }) => (
                  <li key={href}>
                    <AppLink href={href} onClick={closeMenus}>
                      {label}
                    </AppLink>
                  </li>
                ))}
                <li>
                  <MobileCategoryAccordion onNavigate={closeMenus} />
                </li>
                {mainNavigation.slice(1).map(({ label, href }) => (
                  <li key={href}>
                    <AppLink href={href} onClick={closeMenus}>
                      {label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="site-header__mobile-actions">
              <AppLink
                className="button button--accent site-header__mobile-cta"
                href="/submit-ai-tool"
                onClick={closeMenus}
              >
                Submit AI Tool
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
