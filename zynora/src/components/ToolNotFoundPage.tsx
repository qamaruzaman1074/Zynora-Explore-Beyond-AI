import AppLink from './AppLink'
import SiteHeader from './SiteHeader'
import './ToolDetailPage.css'

function ToolNotFoundPage() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="tool-not-found site-container">
        <p className="eyebrow">404 · Tool not found</p>
        <h1>We couldn&apos;t find that AI tool.</h1>
        <p>
          The link may be incorrect, or the tool may no longer be listed in the
          directory.
        </p>
        <AppLink className="button button--accent" href="/#explore">
          Back to Explore
        </AppLink>
      </main>
    </div>
  )
}

export default ToolNotFoundPage
