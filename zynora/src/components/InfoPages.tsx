import { useState, type FormEvent, type ReactNode } from 'react'
import type { InfoPageDefinition } from '../data/infoPages'
import AppLink from './AppLink'
import './InfoPages.css'

function ContentSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="info-page__section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function AboutContent() {
  return (
    <>
      <ContentSection title="A clearer way to explore AI">
        <p>
          ZYNORA is an AI tools discovery directory built to make a fast-moving
          landscape easier to navigate. It brings tools together across areas
          such as writing and content, chatbots and assistants, search and
          research, image and design, video, audio, coding, and productivity.
        </p>
        <p>
          Our goal is to help you find relevant options, understand what each
          tool is listed for, and continue to the provider&apos;s own website
          when you are ready to learn more.
        </p>
      </ContentSection>
      <ContentSection title="How the directory works">
        <p>
          Listings are organized into categories and subcategories to make
          browsing more useful. Product names, descriptions, availability,
          pricing, and features can change; always confirm important details
          with the provider before you sign up or make a purchase.
        </p>
        <p>
          ZYNORA is an independent discovery resource. A listing is not a
          recommendation, certification, or guarantee of a product.
        </p>
      </ContentSection>
      <ContentSection title="Help us improve">
        <p>
          If you spot an outdated detail, a broken link, or a category that
          could be improved, please let us know through our{' '}
          <AppLink href="/contact-us">Contact Us page</AppLink>.
        </p>
      </ContentSection>
    </>
  )
}

function ContactContent() {
  return (
    <>
      <ContentSection title="Contact the ZYNORA team">
        <p>
          For questions about the directory, listing corrections, accessibility,
          partnerships, or privacy requests, email us. Please include the
          relevant tool name or page URL so we can understand your request.
        </p>
        <p className="info-page__contact-link">
          <a href="mailto:zynora@gmail.com">zynora@gmail.com</a>
        </p>
      </ContentSection>
      <ContentSection title="Listing corrections">
        <p>
          Tell us what needs to be changed and, where possible, include a link
          to the tool&apos;s official website or documentation. We review
          submitted corrections, but cannot guarantee that every request will
          result in a listing or a particular change.
        </p>
      </ContentSection>
      <p className="info-page__note">
        ZYNORA does not provide customer support for third-party tools. For
        account, billing, or product issues, contact the tool provider directly.
      </p>
    </>
  )
}

function PrivacyContent() {
  return (
    <>
      <p className="info-page__updated">Last updated: November 20, 2026</p>
      <ContentSection title="Who we are">
        <p>
          ZYNORA is an AI tools discovery directory operated by ZYNORA in
          Pakistan. For privacy questions or requests, contact{' '}
          <a href="mailto:zynora@gmail.com">zynora@gmail.com</a>.
        </p>
      </ContentSection>
      <ContentSection title="Information we may handle">
        <ul>
          <li>
            <strong>Messages you send us:</strong> your email address and any
            information you choose to include when contacting us.
          </li>
          <li>
            <strong>Basic technical information:</strong> our hosting and
            security providers may process connection and diagnostic data, such
            as an IP address, browser details, and request time, to deliver and
            protect the website.
          </li>
          <li>
            <strong>Advertising data:</strong> Google AdSense and its partners
            may use cookies or similar technologies to deliver and measure ads,
            subject to your settings, applicable consent requirements, and
            Google&apos;s own policies.
          </li>
        </ul>
        <p>
          You can browse the directory without creating a ZYNORA account. Do not
          include sensitive personal information in a message unless it is
          necessary for your request.
        </p>
      </ContentSection>
      <ContentSection title="Cookies and Google AdSense">
        <p>
          ZYNORA uses Google AdSense to display advertising. Google and its
          partners may set or read cookies and use similar technologies to
          provide, personalize where permitted, limit, and measure advertising.
          Their use of information is governed by Google&apos;s policies and
          your advertising and consent settings.
        </p>
        <p>
          You can review or change ad personalization in{' '}
          <a
            href="https://adssettings.google.com/"
            rel="noreferrer"
            target="_blank"
          >
            Google Ads Settings
          </a>{' '}
          and learn more in{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            rel="noreferrer"
            target="_blank"
          >
            How Google uses information from sites or apps that use its services
          </a>
          . Browser controls can also be used to manage or delete cookies. See
          our <AppLink href="/cookie-policy">Cookie Policy</AppLink>.
        </p>
      </ContentSection>
      <ContentSection title="How information is used and shared">
        <p>
          We use information sent to us to respond to questions and maintain the
          directory. We do not sell information you send directly to us. We may
          rely on service providers to host, secure, or operate the website, and
          advertising partners may process information as described above.
          Third-party tool websites linked from ZYNORA have their own privacy
          practices, which we do not control.
        </p>
      </ContentSection>
      <ContentSection title="Retention, security, and your choices">
        <p>
          We retain correspondence only as long as reasonably needed to respond,
          keep records, or meet legal obligations. We use reasonable safeguards
          but cannot guarantee that internet transmission or storage is
          completely secure. Depending on applicable law, you may request access
          to, correction of, or deletion of personal information you provided.
          Contact us at <a href="mailto:zynora@gmail.com">zynora@gmail.com</a>.
        </p>
      </ContentSection>
      <ContentSection title="Children and policy updates">
        <p>
          ZYNORA is a general audience directory and is not designed to collect
          personal information from children. We may update this policy as the
          site or applicable requirements change. The latest version and its
          update date will appear on this page.
        </p>
      </ContentSection>
    </>
  )
}

function TermsContent() {
  return (
    <>
      <p className="info-page__updated">Last updated: November 20, 2026</p>
      <ContentSection title="Using ZYNORA">
        <p>
          ZYNORA provides a directory to help visitors discover AI tools by
          category. You may browse and use the site for lawful personal or
          business research. You agree not to interfere with the site, attempt
          unauthorized access, or use automated means in a way that disrupts
          its operation.
        </p>
      </ContentSection>
      <ContentSection title="Listings and third-party services">
        <p>
          Tool names, descriptions, categories, pricing, availability, and
          links are provided for general information and may be incomplete or
          out of date. Tool providers control their own websites, products,
          accounts, and terms. When you follow an external link, your
          interaction is with that provider and subject to its terms and
          privacy policy.
        </p>
        <p>
          A listing does not mean ZYNORA endorses or has verified a provider.
          We do not control third-party services and are not responsible for
          their content or performance.
        </p>
      </ContentSection>
      <ContentSection title="Intellectual property">
        <p>
          ZYNORA&apos;s original site content and design are protected by
          applicable intellectual property laws. Third-party names, marks, and
          logos belong to their respective owners and are used to identify
          products. If you believe material on the directory infringes your
          rights, contact us with the relevant details.
        </p>
      </ContentSection>
      <ContentSection title="Availability and liability">
        <p>
          The site is provided on an “as is” and “as available” basis. To the
          extent permitted by applicable law, ZYNORA disclaims warranties and
          liability for indirect or consequential loss arising from your use of
          the directory or a third-party service. Nothing in these terms limits
          a right or liability that cannot lawfully be limited.
        </p>
      </ContentSection>
      <ContentSection title="Changes and governing law">
        <p>
          We may update these terms when the site or its services change.
          Continued use after an update means the revised terms apply to future
          use. These terms are governed by the laws of Pakistan, subject to any
          mandatory protections that apply to you. Questions can be sent to{' '}
          <a href="mailto:zynora@gmail.com">zynora@gmail.com</a>.
        </p>
      </ContentSection>
    </>
  )
}

function DisclaimerContent() {
  return (
    <>
      <ContentSection title="Directory information">
        <p>
          ZYNORA is an independent directory for discovering AI tools. Listings,
          descriptions, categories, pricing, capabilities, and availability are
          provided for general informational purposes. Details can change, and
          we do not guarantee that any listing is complete, current, suitable,
          or error-free. Check with the provider before relying on a detail or
          making a purchase.
        </p>
      </ContentSection>
      <ContentSection title="No endorsement or professional advice">
        <p>
          Inclusion of a tool does not constitute endorsement, certification,
          or a recommendation by ZYNORA. Directory content is not legal,
          financial, medical, or other professional advice. Evaluate a tool
          independently, including its privacy, security, and terms, before
          sharing information or using it for important decisions.
        </p>
      </ContentSection>
      <ContentSection title="Third-party websites and advertising">
        <p>
          External websites and products are operated by their respective
          providers. ZYNORA is not responsible for their content, availability,
          policies, or outcomes. Advertisements may be served through Google
          AdSense; an advertisement is not a ZYNORA recommendation. If a
          listing or link is ever part of a paid or affiliate arrangement, we
          will identify it where required.
        </p>
      </ContentSection>
    </>
  )
}

function CookiesContent() {
  return (
    <>
      <p className="info-page__updated">Last updated: November 20, 2026</p>
      <ContentSection title="What cookies are">
        <p>
          Cookies are small files stored by a website or its partners in your
          browser. Similar technologies, such as pixels or local storage, can
          also help deliver or measure website features and advertising.
        </p>
      </ContentSection>
      <ContentSection title="How cookies may be used on ZYNORA">
        <ul>
          <li>
            <strong>Site operation:</strong> hosting or security services may
            use technical storage or request data to deliver and protect the
            directory.
          </li>
          <li>
            <strong>Advertising:</strong> Google AdSense and its partners may
            use cookies or similar technologies to serve and measure ads, and
            to personalize ads where permitted by your settings and applicable
            consent requirements.
          </li>
        </ul>
        <p>
          Third-party cookies are controlled by their providers. For details
          about Google advertising technologies, see Google&apos;s{' '}
          <a
            href="https://policies.google.com/technologies/ads"
            rel="noreferrer"
            target="_blank"
          >
            Advertising policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            rel="noreferrer"
            target="_blank"
          >
            partner-site information
          </a>
          .
        </p>
      </ContentSection>
      <ContentSection title="Managing cookies">
        <p>
          Most browsers let you block, clear, or restrict cookies in their
          settings. Blocking some cookies may affect advertising or other
          third-party features. You can also manage ad personalization through{' '}
          <a
            href="https://adssettings.google.com/"
            rel="noreferrer"
            target="_blank"
          >
            Google Ads Settings
          </a>
          . Your browser settings do not necessarily remove data already held
          by an advertising provider.
        </p>
      </ContentSection>
      <ContentSection title="Contact">
        <p>
          Questions about this policy? Email{' '}
          <a href="mailto:zynora@gmail.com">zynora@gmail.com</a> or read our{' '}
          <AppLink href="/privacy-policy">Privacy Policy</AppLink>.
        </p>
      </ContentSection>
    </>
  )
}

function SubmitToolContent() {
  const [status, setStatus] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const toolName = String(formData.get('toolName') ?? '').trim()
    const website = String(formData.get('website') ?? '').trim()
    const logoUrl = String(formData.get('logoUrl') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()

    const isHttpUrl = (value: string) => {
      try {
        return ['http:', 'https:'].includes(new URL(value).protocol)
      } catch {
        return false
      }
    }

    if (!isHttpUrl(website) || !isHttpUrl(logoUrl)) {
      setStatus('Please enter valid HTTP or HTTPS links for the website and logo.')
      return
    }

    const emailSubject = `AI tool submission: ${toolName}`
    const emailBody = [
      `Tool name: ${toolName}`,
      `Official website: ${website}`,
      `Logo image URL: ${logoUrl}`,
      `Description: ${description || 'Not provided'}`,
    ].join('\n')

    window.location.href =
      `mailto:zynora@gmail.com?subject=${encodeURIComponent(emailSubject)}` +
      `&body=${encodeURIComponent(emailBody)}`

    setStatus(
      'Your email app should open with the submission details. Send the email to complete your submission; our team will review it within 24 hours of receipt.',
    )
  }

  return (
    <>
      <ContentSection title="Suggest a tool for the directory">
        <p>
          Know an AI tool that belongs in ZYNORA? Share its official website and
          a link to its logo. Our team will evaluate received submissions
          within 24 hours.
        </p>
      </ContentSection>
      <form className="submit-tool-form" onSubmit={handleSubmit}>
        <label className="submit-tool-form__field" htmlFor="submit-tool-name">
          Tool name <span>Required</span>
          <input
            autoComplete="off"
            id="submit-tool-name"
            maxLength={120}
            name="toolName"
            placeholder="e.g. Example AI"
            required
            type="text"
          />
        </label>
        <label
          className="submit-tool-form__field"
          htmlFor="submit-tool-website"
        >
          Official website <span>Required</span>
          <input
            autoComplete="url"
            id="submit-tool-website"
            name="website"
            placeholder="https://example.com"
            required
            type="url"
          />
        </label>
        <label className="submit-tool-form__field" htmlFor="submit-tool-logo">
          Logo image URL <span>Required</span>
          <input
            autoComplete="url"
            id="submit-tool-logo"
            name="logoUrl"
            placeholder="https://example.com/logo.png"
            required
            type="url"
          />
          <small>Use a publicly accessible image link (PNG, SVG, JPG, or WebP).</small>
        </label>
        <label
          className="submit-tool-form__field"
          htmlFor="submit-tool-description"
        >
          Short description <span>Optional</span>
          <textarea
            id="submit-tool-description"
            maxLength={600}
            name="description"
            placeholder="What does this tool help people do?"
            rows={4}
          />
        </label>
        <button className="button button--accent" type="submit">
          Submit AI Tool
        </button>
        <p aria-live="polite" className="submit-tool-form__status" role="status">
          {status}
        </p>
        <p className="submit-tool-form__note">
          Submissions open your email app so you can send the details to{' '}
          <a href="mailto:zynora@gmail.com">zynora@gmail.com</a>. If it does not
          open, email us directly with the same information.
        </p>
      </form>
    </>
  )
}

const frequentlyAskedQuestions = [
  {
    question: 'What is ZYNORA?',
    answer:
      'ZYNORA is a directory that helps you explore AI tools across categories such as writing, chatbots, research, image and design, video, audio, coding, and productivity.',
  },
  {
    question: 'How do I find a tool for a specific task?',
    answer:
      'Use the search on the homepage or browse the Categories page. Categories and subcategories group tools by their primary use so you can narrow your discovery.',
  },
  {
    question: 'Are the tools listed by ZYNORA free?',
    answer:
      'Some providers offer free plans or trials, while others are paid or use mixed pricing. Pricing can change, so check the provider’s official site for current plans and limitations.',
  },
  {
    question: 'Does ZYNORA endorse or verify every tool?',
    answer:
      'No. A listing is for discovery and does not imply endorsement, certification, or a guarantee. Review the provider’s terms, privacy, security, and product details yourself.',
  },
  {
    question: 'What should I do if a listing is inaccurate or a link is broken?',
    answer:
      'Send the tool name, listing URL, and the correction or working official link to zynora@gmail.com. We review directory feedback but cannot guarantee a particular change.',
  },
  {
    question: 'How can I suggest a tool?',
    answer:
      'Email zynora@gmail.com with the tool name, its official website, and a short explanation of what it does. Suggestions are reviewed for relevance to the directory.',
  },
  {
    question: 'Why do I see advertisements?',
    answer:
      'ZYNORA uses Google AdSense to support the directory. Google and its partners may use cookies or similar technologies for advertising and measurement. See our Privacy Policy and Cookie Policy for details.',
  },
  {
    question: 'Can ZYNORA help with an issue in a listed AI product?',
    answer:
      'ZYNORA does not operate the listed tools. For account, billing, technical support, or product questions, contact the provider directly.',
  },
]

function FAQContent() {
  return (
    <div className="info-page__faq">
      {frequentlyAskedQuestions.map(({ question, answer }) => (
        <details className="info-page__faq-item" key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
      <p className="info-page__note">
        Still have a question? <AppLink href="/contact-us">Contact us</AppLink>.
      </p>
    </div>
  )
}

const pageContent: Record<string, () => ReactNode> = {
  '/about-us': AboutContent,
  '/contact-us': ContactContent,
  '/privacy-policy': PrivacyContent,
  '/terms-and-conditions': TermsContent,
  '/disclaimer': DisclaimerContent,
  '/cookie-policy': CookiesContent,
  '/submit-ai-tool': SubmitToolContent,
  '/faq': FAQContent,
}

function InfoPage({ page }: { page: InfoPageDefinition }) {
  const Content = pageContent[page.path]

  return (
    <main className="info-page site-container">
      <div className="info-page__inner">
        <header className="info-page__header">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="info-page__description">{page.description}</p>
        </header>
        <article className="info-page__content">
          <Content />
        </article>
      </div>
    </main>
  )
}

export default InfoPage
