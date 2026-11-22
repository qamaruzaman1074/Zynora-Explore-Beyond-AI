import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist-mono'
import '@fontsource-variable/manrope'
import './index.css'
import App from './App.tsx'
import BrandSplash from './components/BrandSplash'
import { loadWorkbookTools } from './data/tools'
import { useCallback, useState } from 'react'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The application root element is missing.')
}

const root = createRoot(rootElement)

async function startApplication() {
  const response = await fetch(
    `${import.meta.env.BASE_URL}data/workbook-tools.json`,
  )

  if (!response.ok) {
    throw new Error(`The tool catalog failed to load (${response.status}).`)
  }

  loadWorkbookTools(await response.json())

  function ApplicationWithSplash() {
    const [showSplash, setShowSplash] = useState(true)
    const hideSplash = useCallback(() => setShowSplash(false), [])

    return (
      <>
        {showSplash && <BrandSplash onComplete={hideSplash} />}
        {!showSplash && <App />}
      </>
    )
  }

  root.render(
    <StrictMode>
      <ApplicationWithSplash />
    </StrictMode>,
  )
}

void startApplication().catch((error: unknown) => {
  console.error('Unable to start ZYNORA because the tool catalog failed.', error)
  root.render(
    <main className="catalog-load-error" role="alert">
      The AI tools directory could not be loaded. Please refresh the page.
    </main>,
  )
})
