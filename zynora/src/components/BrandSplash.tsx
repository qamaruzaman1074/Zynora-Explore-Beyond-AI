import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import './BrandSplash.css'

const letters = ['Z', 'Y', 'N', 'O', 'R', 'A']

function BrandSplash({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const exitDelay = 3000
    const exitTimer = window.setTimeout(() => setExiting(true), exitDelay - 300)
    const completeTimer = window.setTimeout(onComplete, exitDelay)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div
      aria-label="ZYNORA — Universe of AI"
      aria-live="polite"
      className={`brand-splash${exiting ? ' brand-splash--exiting' : ''}`}
      onClick={onComplete}
      role="status"
    >
      <button
        aria-label="Skip ZYNORA intro animation"
        className="brand-splash__skip"
        type="button"
      >
        Skip
      </button>
      <div className="brand-splash__glow" aria-hidden="true" />
      <div className="brand-splash__content">
        <div className="brand-splash__name" aria-hidden="true">
          {letters.map((letter, index) => (
            <span
              className="brand-splash__letter"
              key={`${letter}-${index}`}
              style={{ '--letter-index': index } as CSSProperties}
            >
              {letter}
            </span>
          ))}
        </div>
        <p className="brand-splash__tagline">
          <span>Universe</span>
          <span className="brand-splash__tagline-accent">of AI</span>
        </p>
        <div className="brand-splash__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  )
}

export default BrandSplash
