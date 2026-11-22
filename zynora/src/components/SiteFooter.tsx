import { useEffect, useState } from 'react'
import { Check, Coffee, Copy, X } from 'lucide-react'
import AppLink from './AppLink'
import AnimatedLogo from '../AnimatedLogo'
import './SiteFooter.css'

const exploreLinks = [
  { label: 'AI Tools', href: '/#explore' },
  { label: 'Categories', href: '/categories' },
  { label: 'Trending', href: '/#trending' },
  { label: 'Submit AI Tool', href: '/submit-ai-tool' },
]

const companyLinks = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'FAQ', href: '/faq' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
]

function FooterLinkGroup({
  title,
  links,
  label,
}: {
  title: string
  label: string
  links: { label: string; href: string }[]
}) {
  return (
    <nav aria-label={label} className="site-footer__group">
      <h2>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <AppLink href={link.href}>{link.label}</AppLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function SiteFooter() {
  const [supportOpen, setSupportOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!supportOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSupportOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [supportOpen])

  const copyPaymentNumber = async () => {
    try {
      await navigator.clipboard.writeText('03704204775')
    } catch {
      const temporaryInput = document.createElement('textarea')
      temporaryInput.value = '03704204775'
      temporaryInput.style.position = 'fixed'
      temporaryInput.style.opacity = '0'
      document.body.append(temporaryInput)
      temporaryInput.select()
      document.execCommand('copy')
      temporaryInput.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <AppLink
            aria-label="ZYNORA home"
            className="site-footer__logo"
            href="/#home"
          >
            <AnimatedLogo />
          </AppLink>
          <p>Explore Beyond AI. Discover the tools shaping what&apos;s possible.</p>
        </div>

        <div aria-hidden="true" className="site-footer__rule" />

        <div className="site-footer__middle">
          <div className="site-footer__navigation">
            <div className="site-footer__navigation-primary">
              <FooterLinkGroup
                label="Explore"
                links={exploreLinks}
                title="Explore"
              />
              <FooterLinkGroup
                label="Legal"
                links={legalLinks}
                title="Legal"
              />
            </div>
            <FooterLinkGroup
              label="Company"
              links={companyLinks}
              title="Company"
            />
          </div>
          <button
            className="buy-coffee-card"
            onClick={() => setSupportOpen(true)}
            type="button"
          >
            <span className="buy-coffee-card__icon" aria-hidden="true">
              <Coffee size={22} strokeWidth={1.8} />
            </span>
            <span>
              <small>Support ZYNORA</small>
              <strong>Buy me a Coffee</strong>
            </span>
            <span aria-hidden="true" className="buy-coffee-card__arrow">
              →
            </span>
          </button>
        </div>

        <div aria-hidden="true" className="site-footer__rule" />

        <p className="site-footer__copyright">
          © {new Date().getFullYear()} ZYNORA. All rights reserved.
        </p>
      </div>

      {supportOpen && (
        <div
          aria-label="Support ZYNORA"
          aria-modal="true"
          className="coffee-modal"
          role="dialog"
        >
          <button
            aria-label="Close support panel"
            className="coffee-modal__backdrop"
            onClick={() => setSupportOpen(false)}
            type="button"
          />
          <div className="coffee-modal__panel">
            <button
              aria-label="Close"
              className="coffee-modal__close"
              onClick={() => setSupportOpen(false)}
              type="button"
            >
              <X size={18} />
            </button>
            <span className="coffee-modal__icon" aria-hidden="true">
              <Coffee size={30} strokeWidth={1.7} />
            </span>
            <p className="coffee-modal__eyebrow">Support ZYNORA</p>
            <h2>Buy me a Coffee</h2>
            <p className="coffee-modal__description">
              Send your support through Easypaisa.
            </p>
            <button
              className="coffee-modal__number"
              onClick={copyPaymentNumber}
              type="button"
            >
              <span>
                <small>Easypaisa number</small>
                <strong>0370 4204775</strong>
              </span>
              <span className={copied ? 'is-copied' : ''}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied' : 'Copy'}
              </span>
            </button>
          </div>
        </div>
      )}
    </footer>
  )
}

export default SiteFooter
