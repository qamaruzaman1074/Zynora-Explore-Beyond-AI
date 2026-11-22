import amazonLogo from '../assets/platform-logos/amazon.svg'
import amdLogo from '../assets/platform-logos/amd.svg'
import adobeLogo from '../assets/platform-logos/adobe.svg'
import anthropicLogo from '../assets/platform-logos/anthropic.svg'
import appleLogo from '../assets/platform-logos/apple.svg'
import googleLogo from '../assets/platform-logos/google.svg'
import ibmLogo from '../assets/platform-logos/ibm.svg'
import metaLogo from '../assets/platform-logos/meta.svg'
import microsoftLogo from '../assets/platform-logos/microsoft.svg'
import nvidiaLogo from '../assets/platform-logos/nvidia.svg'
import openaiLogo from '../assets/platform-logos/openai.svg'
import oracleLogo from '../assets/platform-logos/oracle.svg'
import './PopularPlatforms.css'

const platforms = [
  { name: 'OpenAI', href: 'https://openai.com/', logo: openaiLogo },
  { name: 'Google', href: 'https://about.google/', logo: googleLogo },
  { name: 'Microsoft', href: 'https://www.microsoft.com/', logo: microsoftLogo },
  { name: 'NVIDIA', href: 'https://www.nvidia.com/', logo: nvidiaLogo },
  { name: 'Meta', href: 'https://about.meta.com/', logo: metaLogo },
  { name: 'Anthropic', href: 'https://www.anthropic.com/', logo: anthropicLogo },
  { name: 'Apple', href: 'https://www.apple.com/', logo: appleLogo },
  { name: 'Amazon', href: 'https://www.amazon.com/', logo: amazonLogo },
  { name: 'Adobe', href: 'https://www.adobe.com/', logo: adobeLogo },
  { name: 'IBM', href: 'https://www.ibm.com/', logo: ibmLogo },
  { name: 'Oracle', href: 'https://www.oracle.com/', logo: oracleLogo },
  { name: 'AMD', href: 'https://www.amd.com/', logo: amdLogo },
] as const

function PopularPlatforms() {
  const items = [...platforms, ...platforms]

  return (
    <section
      aria-labelledby="popular-platforms-title"
      className="popular-platforms"
    >
      <div className="popular-platforms__header site-container">
        <p className="eyebrow">Popular platforms</p>
        <h2 id="popular-platforms-title">Leading AI innovation</h2>
      </div>
      <div className="popular-platforms__viewport site-container">
        <div className="popular-platforms__track">
          {items.map((platform, index) => (
            <a
              aria-label={`Visit ${platform.name} official website`}
              className="popular-platform"
              href={platform.href}
              key={`${platform.name}-${index}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="popular-platform__logo-wrap">
                <img
                  alt={`${platform.name} logo`}
                  decoding="async"
                  loading="lazy"
                  src={platform.logo}
                />
              </span>
              <span className="popular-platform__name">{platform.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularPlatforms
