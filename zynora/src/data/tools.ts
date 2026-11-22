import adobefireflyLogo from '../assets/tool-logos/adobefirefly.svg'
import chatgptLogo from '../assets/tool-logos/openai.svg'
import copilotLogo from '../assets/tool-logos/copilot.svg'
import lovableLogo from '../assets/tool-logos/lovable.svg'
import makeLogo from '../assets/tool-logos/make.svg'
import midjourneyLogo from '../assets/tool-logos/midjourney.svg'
import perplexityLogo from '../assets/tool-logos/perplexity.svg'
import phindLogo from '../assets/tool-logos/phind.svg'
import type { AITool, LogoProvenance } from '../types/tool'

type CuratedTool = Omit<
  AITool,
  'logoProvenance' | 'logoVerificationStatus' | 'logoSourceUrl'
> &
  Partial<
    Pick<
      AITool,
      'logoProvenance' | 'logoVerificationStatus' | 'logoSourceUrl'
    >
  >

const curatedToolDefinitions: readonly CuratedTool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    slug: 'chatgpt',
    categoryId: 'chat-search',
    shortDescription:
      'An AI assistant for writing, research, problem-solving, and multimodal tasks.',
    officialWebsite: 'https://chatgpt.com/',
    logo: chatgptLogo,
    pricing: 'Freemium',
    featured: true,
    tags: ['assistant', 'chat', 'search', 'writing', 'coding'],
  },
  {
    id: 'claude',
    name: 'Claude',
    slug: 'claude',
    categoryId: 'chat-search',
    shortDescription:
      'An AI assistant for writing, analysis, coding, and working with documents.',
    officialWebsite: 'https://claude.ai/',
    logo: '/tool-logos/claude.png',
    pricing: 'Freemium',
    featured: true,
    tags: ['assistant', 'chat', 'analysis', 'writing', 'coding'],
    logoProvenance: 'official',
    logoVerificationStatus: 'verified',
    logoSourceUrl: 'https://claude.ai/',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    slug: 'deepseek',
    categorySlugs: ['general-chatbots'],
    shortDescription:
      'An AI assistant for conversations, research, reasoning, and code.',
    officialWebsite: 'https://www.deepseek.com/',
    logo: "/tool-logos/deepseek.ico",
    pricing: 'Freemium',
    featured: true,
    tags: ['assistant', 'chatbot', 'research', 'coding'],
    logoProvenance: "favicon",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://www.deepseek.com/favicon.ico",
  },
  {
    id: 'gemini',
    name: 'Gemini',
    slug: 'gemini',
    categoryId: 'chat-search',
    shortDescription:
      'Google’s AI assistant for research, writing, creative work, and connected services.',
    officialWebsite: 'https://gemini.google.com/',
    logo: "/tool-logos/gemini.svg",
    pricing: 'Freemium',
    featured: true,
    tags: ['assistant', 'google', 'multimodal', 'search', 'writing'],
    logoProvenance: "metadata",
    logoVerificationStatus: "verified",
    logoSourceUrl: "https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg",
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    slug: 'perplexity',
    categoryId: 'chat-search',
    shortDescription:
      'An answer engine that searches the web and provides cited responses.',
    officialWebsite: 'https://www.perplexity.ai/',
    logo: perplexityLogo,
    pricing: 'Freemium',
    featured: true,
    tags: ['answer engine', 'search', 'research', 'citations'],
  },
  {
    id: 'microsoft-copilot',
    name: 'Microsoft Copilot',
    slug: 'microsoft-copilot',
    categoryId: 'chat-search',
    shortDescription:
      'Microsoft’s AI assistant for conversations, content creation, and work tasks.',
    officialWebsite: 'https://copilot.com/',
    logo: copilotLogo,
    pricing: 'Freemium',
    featured: false,
    tags: ['assistant', 'microsoft', 'search', 'productivity'],
  },
  {
    id: 'phind',
    name: 'Phind',
    slug: 'phind',
    categoryId: 'chat-search',
    shortDescription:
      'An AI search assistant focused on software development questions.',
    officialWebsite: 'https://www.phind.com/',
    logo: phindLogo,
    pricing: 'Freemium',
    featured: false,
    tags: ['developer search', 'coding', 'search'],
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    slug: 'midjourney',
    categoryId: 'image-design',
    shortDescription:
      'A generative platform for creating images from text prompts.',
    officialWebsite: 'https://www.midjourney.com/',
    logo: midjourneyLogo,
    pricing: 'Freemium',
    featured: true,
    tags: ['image generation', 'art', 'design'],
  },
  {
    id: 'adobe-firefly',
    name: 'Adobe Firefly',
    slug: 'adobe-firefly',
    categoryId: 'image-design',
    shortDescription:
      'Adobe’s generative AI tools for creating and editing visual content.',
    officialWebsite: 'https://firefly.adobe.com/',
    logo: adobefireflyLogo,
    pricing: 'Freemium',
    featured: false,
    tags: ['image generation', 'design', 'adobe', 'video'],
  },
  {
    id: 'runway',
    name: 'Runway',
    slug: 'runway',
    categoryId: 'video-audio',
    shortDescription:
      'Creative AI tools for generating and editing video, images, and audio.',
    officialWebsite: 'https://runway.com/',
    logo: "/tool-logos/runway.png",
    pricing: 'Freemium',
    featured: false,
    tags: ['video generation', 'video editing', 'creative'],
    logoProvenance: "metadata",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://runway.com/images/logos/runway-logo.png",
  },
  {
    id: 'pika',
    name: 'Pika',
    slug: 'pika',
    categoryId: 'video-audio',
    shortDescription: 'A generative AI platform for creating and editing videos.',
    officialWebsite: 'https://pika.art/',
    logo: "/tool-logos/pika.png",
    pricing: 'Freemium',
    featured: false,
    tags: ['video generation', 'video editing'],
    logoProvenance: "metadata",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://pika.art/brand/pika-logo-512.png",
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    slug: 'elevenlabs',
    categoryId: 'video-audio',
    shortDescription:
      'AI voice and audio tools for speech generation, dubbing, and sound.',
    officialWebsite: 'https://elevenlabs.io/',
    logo: "/tool-logos/elevenlabs.ico",
    pricing: 'Freemium',
    featured: false,
    tags: ['text to speech', 'voice', 'audio', 'dubbing'],
    logoProvenance: "metadata",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://elevenlabs.io/favicon.ico",
  },
  {
    id: 'suno',
    name: 'Suno',
    slug: 'suno',
    categoryId: 'video-audio',
    shortDescription: 'Creates songs from text prompts and musical ideas.',
    officialWebsite: 'https://suno.com/',
    logo: "/tool-logos/suno.svg",
    pricing: 'Freemium',
    featured: false,
    tags: ['music generation', 'audio', 'songs'],
    logoProvenance: "metadata",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://cdn-o.suno.com/Logo-7.svg",
  },
  {
    id: 'descript',
    name: 'Descript',
    slug: 'descript',
    categoryId: 'video-audio',
    shortDescription:
      'An audio and video editor with transcription and AI-assisted editing.',
    officialWebsite: 'https://www.descript.com/',
    logo: "/tool-logos/descript.svg",
    pricing: 'Freemium',
    featured: false,
    tags: ['video editing', 'audio editing', 'transcription'],
    logoProvenance: "metadata",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://static-cdn.descript.com/descript-website/images/descript-nav-logo-light.svg",
  },
  {
    id: 'cursor',
    name: 'Cursor',
    slug: 'cursor',
    categoryId: 'coding-productivity',
    shortDescription:
      'An AI coding environment for writing, understanding, and modifying code.',
    officialWebsite: 'https://cursor.com/',
    logo: "/tool-logos/cursor.png",
    pricing: 'Freemium',
    featured: true,
    tags: ['code editor', 'coding', 'developer tools', 'agent'],
    logoProvenance: 'official',
    logoVerificationStatus: 'verified',
    logoSourceUrl: 'https://cursor.com/',
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    categoryId: 'coding-productivity',
    shortDescription:
      'AI coding assistance for supported editors and GitHub workflows.',
    officialWebsite: 'https://github.com/features/copilot',
    logo: "/tool-logos/github-copilot.svg",
    pricing: 'Freemium',
    featured: true,
    tags: ['coding', 'code completion', 'developer tools'],
    logoProvenance: "favicon",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg",
  },
  {
    id: 'lovable',
    name: 'Lovable',
    slug: 'lovable',
    categoryId: 'coding-productivity',
    shortDescription:
      'An AI app builder for turning instructions into web applications.',
    officialWebsite: 'https://lovable.dev/',
    logo: lovableLogo,
    pricing: 'Freemium',
    featured: false,
    tags: ['app builder', 'coding', 'web development'],
  },
  {
    id: 'replit',
    name: 'Replit',
    slug: 'replit',
    categoryId: 'coding-productivity',
    shortDescription:
      'An online development platform with AI assistance for building and deploying apps.',
    officialWebsite: 'https://replit.com/',
    logo: "/tool-logos/replit.webp",
    pricing: 'Freemium',
    featured: false,
    tags: ['coding', 'app builder', 'development environment'],
    logoProvenance: "favicon",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://replit.com/public/icons/favicon-prompt-192-rebrand.png",
  },
  {
    id: 'v0',
    name: 'v0',
    slug: 'v0',
    categoryId: 'coding-productivity',
    shortDescription:
      'An AI tool for generating web interfaces and applications from prompts.',
    officialWebsite: 'https://v0.app/',
    logo: "/tool-logos/v0.png",
    pricing: 'Freemium',
    featured: false,
    tags: ['interface generation', 'web development', 'coding'],
    logoProvenance: "favicon",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://v0.app/assets/apple-icon.png",
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    slug: 'notion-ai',
    categoryId: 'writing-productivity',
    shortDescription:
      'AI features in Notion for writing, summarizing, and working with workspace content.',
    officialWebsite: 'https://www.notion.com/',
    logo: "/tool-logos/notion-ai.png",
    pricing: 'Freemium',
    featured: false,
    tags: ['writing', 'workspace', 'summarization', 'productivity'],
    logoProvenance: "metadata",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://www.notion.com/front-static/logo-ios.png",
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    slug: 'grammarly',
    categoryId: 'writing-productivity',
    shortDescription:
      'Writing assistance for grammar, clarity, tone, and text generation.',
    officialWebsite: 'https://www.grammarly.com/',
    logo: "/tool-logos/grammarly.svg",
    pricing: 'Freemium',
    featured: false,
    tags: ['writing', 'grammar', 'editing'],
    logoProvenance: "official",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://www.grammarly.com/",
  },
  {
    id: 'deepl',
    name: 'DeepL',
    slug: 'deepl',
    categoryId: 'writing-productivity',
    shortDescription:
      'Machine translation and writing assistance for supported languages.',
    officialWebsite: 'https://www.deepl.com/',
    logo: "/tool-logos/deepl.svg",
    pricing: 'Freemium',
    featured: false,
    tags: ['translation', 'writing', 'languages'],
    logoProvenance: "metadata",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://static.deepl.com/img/logo/deepl-logo-blue.svg",
  },
  {
    id: 'zapier',
    name: 'Zapier',
    slug: 'zapier',
    categoryId: 'automation',
    shortDescription:
      'A workflow automation platform that connects apps and tasks.',
    officialWebsite: 'https://zapier.com/',
    logo: "/tool-logos/zapier.png",
    pricing: 'Freemium',
    featured: false,
    tags: ['automation', 'integrations', 'workflow'],
    logoProvenance: "metadata",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://res.cloudinary.com/zapier-media/image/upload/f_png,h_224/v1757453971/Zapier_Logo_yjhvbo",
  },
  {
    id: 'make',
    name: 'Make',
    slug: 'make',
    categoryId: 'automation',
    shortDescription:
      'A visual platform for connecting applications and building workflows.',
    officialWebsite: 'https://www.make.com/',
    logo: makeLogo,
    pricing: 'Freemium',
    featured: false,
    tags: ['automation', 'integrations', 'visual workflow'],
  },
  {
    id: 'n8n',
    name: 'n8n',
    slug: 'n8n',
    categoryId: 'automation',
    shortDescription:
      'A workflow automation platform with self-hosted and hosted options.',
    officialWebsite: 'https://n8n.io/',
    logo: "/tool-logos/n8n.ico",
    pricing: 'Freemium',
    featured: false,
    tags: ['automation', 'workflow', 'self hosted'],
    logoProvenance: "favicon",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://n8n.io/favicon.ico",
  },
  {
    id: 'consensus',
    name: 'Consensus',
    slug: 'consensus',
    categoryId: 'research-education',
    shortDescription:
      'An AI academic search engine for finding and understanding research papers.',
    officialWebsite: 'https://consensus.app/',
    logo: "/tool-logos/consensus.png",
    pricing: 'Freemium',
    featured: false,
    tags: ['research', 'academic search', 'scientific papers'],
    logoProvenance: "metadata",
    logoVerificationStatus: "unverified",
    logoSourceUrl: "https://consensus.app/images/icon-512.png",
  },
]

function getLegacyLogoMetadata(
  logo: string | null,
): Pick<
  AITool,
  'logoProvenance' | 'logoVerificationStatus' | 'logoSourceUrl'
> {
  if (!logo) {
    return {
      logoProvenance: 'placeholder',
      logoVerificationStatus: 'unverified',
      logoSourceUrl: null,
    }
  }

  let logoProvenance: LogoProvenance = 'legacy'
  let logoSourceUrl: string | null = null

  try {
    const url = new URL(logo)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      logoSourceUrl = logo
      if (/\/favicon(?:\.[^/]+)?$/i.test(url.pathname)) {
        logoProvenance = 'favicon'
      }
    }
  } catch {
    // Imported local assets have no known original source URL.
  }

  return {
    logoProvenance,
    logoVerificationStatus: 'unverified',
    logoSourceUrl,
  }
}

const curatedTools: readonly AITool[] = curatedToolDefinitions.map((tool) => {
  const legacyMetadata = getLegacyLogoMetadata(tool.logo)

  return {
    ...tool,
    ...legacyMetadata,
    logoProvenance: tool.logoProvenance ?? legacyMetadata.logoProvenance,
    logoVerificationStatus:
      tool.logoVerificationStatus ?? legacyMetadata.logoVerificationStatus,
    logoSourceUrl:
      tool.logoSourceUrl === undefined
        ? legacyMetadata.logoSourceUrl
        : tool.logoSourceUrl,
  }
})

function normalizeToolName(name: string) {
  return name.toLocaleLowerCase().replace(/[^a-z0-9]/g, '')
}

function isPricingTier(value: unknown): value is AITool['pricing'] {
  return (
    value === 'Free' ||
    value === 'Freemium' ||
    value === 'Free Trial' ||
    value === 'Paid' ||
    value === 'Premium' ||
    value === 'Unverified'
  )
}

function isLogoProvenance(value: unknown): value is AITool['logoProvenance'] {
  return (
    value === 'official' ||
    value === 'metadata' ||
    value === 'favicon' ||
    value === 'placeholder' ||
    value === 'legacy'
  )
}

function isLogoVerificationStatus(
  value: unknown,
): value is AITool['logoVerificationStatus'] {
  return value === 'verified' || value === 'unverified'
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isWorkbookTool(value: unknown): value is AITool {
  if (!value || typeof value !== 'object') return false

  const row = value as Record<string, unknown>
  const validNullableString = (field: string) =>
    row[field] === null || typeof row[field] === 'string'

  return (
    typeof row.id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.slug === 'string' &&
    isStringArray(row.categorySlugs) &&
    typeof row.shortDescription === 'string' &&
    validNullableString('officialWebsite') &&
    validNullableString('logo') &&
    isLogoProvenance(row.logoProvenance) &&
    isLogoVerificationStatus(row.logoVerificationStatus) &&
    validNullableString('logoSourceUrl') &&
    isPricingTier(row.pricing) &&
    typeof row.featured === 'boolean' &&
    isStringArray(row.tags) &&
    typeof row.popularity === 'number' &&
    Number.isFinite(row.popularity)
  )
}

function parseWorkbookTools(value: unknown): AITool[] {
  if (!Array.isArray(value)) {
    throw new Error('The workbook tool catalog must be an array.')
  }

  return value.map((entry, index) => {
    if (!isWorkbookTool(entry)) {
      throw new Error(`Workbook tool at index ${index} has invalid fields.`)
    }

    return entry
  })
}

export const tools: AITool[] = curatedTools.map((tool) => ({ ...tool }))

export function loadWorkbookTools(value: unknown) {
  const workbookTools = parseWorkbookTools(value)
  const workbookToolsByName = new Map(
    workbookTools.map((tool) => [normalizeToolName(tool.name), tool]),
  )
  const workbookLogoAliases: Readonly<Record<string, string>> = {
    'canva-ai': 'Canva',
  }
  const categorySlugOverrides: Readonly<Record<string, readonly string[]>> = {
    gamma: ['presentation-and-slide-makers'],
    grok: ['general-chatbots'],
  }
  const curatedToolNames = new Set(
    curatedTools.map((tool) => normalizeToolName(tool.name)),
  )
  const mergedTools: AITool[] = curatedTools.map((tool) => {
    const workbookTool = workbookToolsByName.get(normalizeToolName(tool.name))
    const aliasedWorkbookTool = workbookLogoAliases[tool.slug]
      ? workbookToolsByName.get(
          normalizeToolName(workbookLogoAliases[tool.slug]),
        )
      : null
    const workbookLogoTool =
      workbookTool && workbookTool.logo !== null
        ? workbookTool
        : aliasedWorkbookTool && aliasedWorkbookTool.logo !== null
          ? aliasedWorkbookTool
          : null
    const logoMetadata =
      tool.logo !== null
        ? {
            logoProvenance: tool.logoProvenance,
            logoVerificationStatus: tool.logoVerificationStatus,
            logoSourceUrl: tool.logoSourceUrl,
          }
        : workbookLogoTool
          ? {
              logoProvenance: workbookLogoTool.logoProvenance,
              logoVerificationStatus:
                workbookLogoTool.logoVerificationStatus,
              logoSourceUrl: workbookLogoTool.logoSourceUrl,
            }
          : getLegacyLogoMetadata(null)
    return {
      ...tool,
      categorySlugs:
        categorySlugOverrides[tool.slug] ??
        workbookTool?.categorySlugs ??
        tool.categorySlugs ??
        [],
      officialWebsite: tool.officialWebsite ?? workbookTool?.officialWebsite ?? null,
      logo: tool.logo ?? workbookTool?.logo ?? aliasedWorkbookTool?.logo ?? null,
      ...logoMetadata,
      tags: [...new Set([...tool.tags, ...(workbookTool?.tags ?? [])])],
      popularity: workbookTool?.popularity ?? 0,
    }
  })
  mergedTools.push(
    ...workbookTools
      .filter(
        (tool) => !curatedToolNames.has(normalizeToolName(tool.name)),
      )
      .map((tool) => ({
        ...tool,
        categorySlugs:
          categorySlugOverrides[tool.slug] ?? tool.categorySlugs,
      })),
  )
  tools.splice(0, tools.length, ...mergedTools)
}

export type ToolId = (typeof tools)[number]['id']

export function getToolBySlug(slug: string): AITool | undefined {
  return tools.find((tool) => tool.slug === slug)
}

export function getToolById(id: ToolId): (typeof tools)[number] {
  const tool = tools.find((item) => item.id === id)
  if (!tool) {
    throw new Error(`Tool "${id}" is not registered.`)
  }
  return tool
}
