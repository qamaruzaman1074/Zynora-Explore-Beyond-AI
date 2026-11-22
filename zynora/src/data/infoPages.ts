export type InfoPageDefinition = {
  path: string
  title: string
  description: string
  eyebrow: string
}

export const infoPages: readonly InfoPageDefinition[] = [
  {
    path: '/about-us',
    title: 'About ZYNORA',
    description:
      'Learn how ZYNORA helps people discover AI tools across writing, research, design, coding, and more.',
    eyebrow: 'About us',
  },
  {
    path: '/contact-us',
    title: 'Contact ZYNORA',
    description:
      'Contact ZYNORA about the AI tools directory, listings, corrections, or privacy questions.',
    eyebrow: 'Get in touch',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy',
    description:
      'Read how ZYNORA handles personal information, cookies, and Google AdSense advertising.',
    eyebrow: 'Your privacy',
  },
  {
    path: '/terms-and-conditions',
    title: 'Terms & Conditions',
    description:
      'Terms for using the ZYNORA AI tools discovery directory and its third-party links.',
    eyebrow: 'Terms of use',
  },
  {
    path: '/disclaimer',
    title: 'Disclaimer',
    description:
      'Important information about ZYNORA listings, third-party AI tools, and directory content.',
    eyebrow: 'Please note',
  },
  {
    path: '/cookie-policy',
    title: 'Cookie Policy',
    description:
      'Learn how cookies and similar technologies may be used on ZYNORA, including by Google AdSense.',
    eyebrow: 'Cookies',
  },
  {
    path: '/submit-ai-tool',
    title: 'Submit an AI Tool',
    description:
      'Suggest an AI tool for the ZYNORA directory. Share its official website and logo for review.',
    eyebrow: 'Suggest a tool',
  },
  {
    path: '/faq',
    title: 'Frequently Asked Questions',
    description:
      'Answers about discovering AI tools, categories, listings, advertising, and contacting ZYNORA.',
    eyebrow: 'FAQ',
  },
]

export function getInfoPage(pathname: string) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  return infoPages.find((page) => page.path === normalizedPath)
}
