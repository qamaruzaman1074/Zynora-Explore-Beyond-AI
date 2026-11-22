import type {
  AICategory,
  Category,
  CategoryGroup,
  CategoryIconName,
  CategoryId,
} from '../types/tool'
import { tools } from './tools'

type CategorySeed = readonly [name: string, icon: CategoryIconName]

function child(name: string, icon: CategoryIconName): CategorySeed {
  return [name, icon]
}

function slugify(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function createCategory([name, icon]: CategorySeed): Category {
  return {
    slug: slugify(name),
    name,
    description: `Explore AI tools for ${name.toLowerCase()}.`,
    icon,
    toolCount: 0,
  }
}

function createGroup(
  name: string,
  description: string,
  icon: CategoryIconName,
  featured: boolean,
  children: readonly CategorySeed[],
): CategoryGroup {
  return {
    slug: slugify(name),
    name,
    description,
    icon,
    featured,
    children: children.map(createCategory),
  }
}

export const categoryGroups: readonly CategoryGroup[] = [
  createGroup(
    'Writing and content',
    'Tools that help create, refine, and publish written content.',
    'PenLine',
    true,
    [
      child('AI writing assistants', 'PenLine'),
      child('Copywriting and ad copy', 'Megaphone'),
      child('Blog and SEO content', 'FileText'),
      child('Email writing', 'Mail'),
      child('Grammar and editing', 'Pencil'),
      child('Paraphrasing and rewriting', 'Sparkles'),
      child('Story and creative writing', 'BookOpen'),
      child('Script writing', 'Clapperboard'),
      child('Social media content', 'MessagesSquare'),
    ],
  ),
  createGroup(
    'Chatbots and assistants',
    'Conversational assistants for everyday questions, support, and automation.',
    'MessageCircle',
    true,
    [
      child('General chatbots', 'Bot'),
      child('Personal assistants', 'UserRound'),
      child('Customer support chatbots', 'MessageCircle'),
      child('Agent builders and automation agents', 'Workflow'),
    ],
  ),
  createGroup(
    'Search and research',
    'Tools for discovering, checking, and synthesizing information.',
    'Search',
    true,
    [
      child('AI search engines', 'Search'),
      child('Academic research', 'GraduationCap'),
      child('Market and competitor research', 'BarChart3'),
    ],
  ),
  createGroup(
    'Image and design',
    'AI tools for generating, editing, and designing visual assets.',
    'Image',
    true,
    [
      child('Image generation', 'WandSparkles'),
      child('Image editing and retouching', 'Image'),
      child('Background removal', 'Shapes'),
      child('Image upscaling and restoration', 'Sparkles'),
      child('Logo and brand design', 'PenTool'),
      child('Graphic and poster design', 'Image'),
      child('Avatar and portrait generation', 'UserRound'),
      child('Interior and architecture design', 'House'),
      child('Fashion and product mockups', 'BriefcaseBusiness'),
      child('Illustration and character design', 'Pencil'),
      child('3D model generation', 'Shapes'),
    ],
  ),
  createGroup(
    'Video and animation',
    'Tools for creating, editing, and enhancing video and animation.',
    'Clapperboard',
    true,
    [
      child('Text-to-video', 'Video'),
      child('Video editing', 'Clapperboard'),
      child('AI avatars and presenters', 'UserRound'),
      child('Video repurposing and clips', 'Scissors'),
      child('Subtitles and captions', 'Captions'),
      child('Animation and motion graphics', 'Sparkles'),
      child('Video upscaling and enhancement', 'WandSparkles'),
      child('Lip sync and dubbing', 'AudioLines'),
    ],
  ),
  createGroup(
    'Audio and music',
    'AI tools for speech, sound, music, and audio production.',
    'Music2',
    true,
    [
      child('Text-to-speech', 'AudioLines'),
      child('Voice cloning', 'Mic'),
      child('Speech-to-text and transcription', 'Captions'),
      child('Music generation', 'Music2'),
      child('Podcast editing', 'Scissors'),
      child('Audio cleanup and noise removal', 'AudioLines'),
      child('Sound effects and voiceover', 'Mic'),
      child('Translation and live interpretation', 'Languages'),
    ],
  ),
  createGroup(
    'Coding and development',
    'Tools that help plan, write, test, and ship software.',
    'Code2',
    true,
    [
      child('Code assistants and autocomplete', 'Code2'),
      child('App and website builders', 'Shapes'),
      child('No-code and low-code', 'Workflow'),
      child('Code review and testing', 'SearchCheck'),
      child('Database and SQL helpers', 'Database'),
      child('API and documentation tools', 'FileText'),
      child('AI coding agents', 'Bot'),
    ],
  ),
  createGroup(
    'Productivity and business',
    'Assistants for organizing work, documents, and business processes.',
    'BriefcaseBusiness',
    true,
    [
      child('Note-taking and summarizing', 'FileText'),
      child('Meeting assistants', 'Users'),
      child('Presentation and slide makers', 'Presentation'),
      child('Spreadsheet and Excel helpers', 'Table2'),
      child('Project management', 'FolderKanban'),
      child('Calendar and scheduling', 'CalendarDays'),
      child('Document and PDF chat', 'Search'),
      child('Workflow automation', 'Workflow'),
      child('Knowledge bases', 'BookOpen'),
    ],
  ),
  createGroup(
    'Marketing, sales, and e-commerce',
    'Tools for reaching customers and improving marketing workflows.',
    'Megaphone',
    true,
    [
      child('SEO tools', 'Search'),
      child('Ad creation and optimization', 'Megaphone'),
      child('Lead generation and outreach', 'Mail'),
      child('CRM and sales assistants', 'Users'),
      child('E-commerce product descriptions', 'FileText'),
      child('Analytics and reporting', 'BarChart3'),
    ],
  ),
  createGroup(
    'Data and analytics',
    'Tools for analyzing data and building machine-learning workflows.',
    'BarChart3',
    false,
    [
      child('Data analysis and visualization', 'BarChart3'),
      child('Business intelligence', 'Table2'),
      child('Machine learning platforms', 'Database'),
    ],
  ),
  createGroup(
    'Education and learning',
    'Tools that support tutoring, practice, and learning.',
    'GraduationCap',
    true,
    [
      child('Tutoring and homework help', 'GraduationCap'),
      child('Language learning', 'Languages'),
      child('Course and quiz creation', 'ListChecks'),
      child('Flashcards and study tools', 'BookOpen'),
    ],
  ),
  createGroup(
    'More categories',
    'Explore specialist AI tools across industries and everyday needs.',
    'Shapes',
    false,
    [
      child('Legal and contract review', 'Scale'),
      child('Healthcare and wellness', 'HeartPulse'),
      child('Finance and accounting', 'BriefcaseBusiness'),
      child('HR and recruiting', 'Users'),
      child('Real estate', 'House'),
      child('Travel planning', 'Plane'),
      child('Gaming and game dev', 'Gamepad2'),
      child('Cybersecurity', 'ShieldCheck'),
      child('Prompt tools and libraries', 'Sparkles'),
    ],
  ),
]

export const featuredCategoryGroups = categoryGroups.filter(
  (group) => group.featured,
)

export const categoryToolAssignments: Readonly<
  Record<string, readonly string[]>
> = {
  chatgpt: [
    'general-chatbots',
    'personal-assistants',
    'ai-writing-assistants',
  ],
  claude: [
    'general-chatbots',
    'ai-writing-assistants',
    'document-and-pdf-chat',
  ],
  gemini: ['general-chatbots', 'personal-assistants'],
  perplexity: ['ai-search-engines', 'fact-checking'],
  'microsoft-copilot': [
    'general-chatbots',
    'personal-assistants',
    'meeting-assistants',
  ],
  phind: ['ai-search-engines', 'code-assistants-and-autocomplete'],
  midjourney: ['image-generation'],
  'leonardo-ai': ['image-generation', 'image-editing-and-retouching'],
  'adobe-firefly': [
    'image-generation',
    'image-editing-and-retouching',
    'graphic-and-poster-design',
  ],
  'canva-ai': [
    'graphic-and-poster-design',
    'logo-and-brand-design',
    'presentation-and-slide-makers',
  ],
  runway: ['text-to-video', 'video-editing', 'animation-and-motion-graphics'],
  pika: ['text-to-video', 'video-editing'],
  elevenlabs: [
    'text-to-speech',
    'voice-cloning',
    'sound-effects-and-voiceover',
  ],
  suno: ['music-generation'],
  descript: [
    'video-editing',
    'podcast-editing',
    'speech-to-text-and-transcription',
  ],
  synthesia: ['ai-avatars-and-presenters', 'text-to-video'],
  cursor: ['code-assistants-and-autocomplete', 'ai-coding-agents'],
  'github-copilot': [
    'code-assistants-and-autocomplete',
    'code-review-and-testing',
    'ai-coding-agents',
  ],
  lovable: ['app-and-website-builders', 'no-code-and-low-code'],
  replit: [
    'app-and-website-builders',
    'code-assistants-and-autocomplete',
    'ai-coding-agents',
    'devops-and-cloud',
  ],
  v0: [
    'app-and-website-builders',
    'no-code-and-low-code',
    'ui-and-ux-design',
  ],
  'notion-ai': [
    'note-taking-and-summarizing',
    'knowledge-bases',
    'ai-writing-assistants',
  ],
  grammarly: [
    'ai-writing-assistants',
    'grammar-and-editing',
    'paraphrasing-and-rewriting',
    'email-writing',
  ],
  deepl: ['translation-and-live-interpretation', 'ai-writing-assistants'],
  gamma: ['presentation-and-slide-makers'],
  zapier: ['workflow-automation'],
  make: ['workflow-automation'],
  n8n: ['workflow-automation'],
  elicit: ['academic-research', 'literature-review-and-citations'],
  consensus: [
    'academic-research',
    'literature-review-and-citations',
    'ai-search-engines',
  ],
}

export function getCategoryGroupBySlug(
  slug: string,
): CategoryGroup | undefined {
  return categoryGroups.find((group) => group.slug === slug)
}

export function getCategoryBySlug(
  groupSlug: string,
  categorySlug: string,
): Category | undefined {
  return getCategoryGroupBySlug(groupSlug)?.children.find(
    (category) => category.slug === categorySlug,
  )
}

export function getCategoryToolSlugs(categorySlug: string): string[] {
  const assignedTools = tools
    .filter((tool) => tool.categorySlugs?.includes(categorySlug))
    .map((tool) => tool.slug)
  const legacyTools = Object.entries(categoryToolAssignments)
    .filter(([, categorySlugs]) => categorySlugs.includes(categorySlug))
    .map(([toolSlug]) => toolSlug)

  return [...new Set([...assignedTools, ...legacyTools])]
}

export function getGroupToolSlugs(groupSlug: string): string[] {
  const group = getCategoryGroupBySlug(groupSlug)
  if (!group) return []

  return [
    ...new Set(
      group.children.flatMap((category) =>
        getCategoryToolSlugs(category.slug),
      ),
    ),
  ]
}

export function getCategoryToolLabels(toolSlug: string): string[] {
  const tool = tools.find((candidate) => candidate.slug === toolSlug)
  const assignedSlugs = new Set([
    ...(categoryToolAssignments[toolSlug] ?? []),
    ...(tool?.categorySlugs ?? []),
  ])

  return categoryGroups.flatMap((group) => {
    const assignedCategories = group.children.filter((category) =>
      assignedSlugs.has(category.slug),
    )
    return assignedCategories.length
      ? [group.name, ...assignedCategories.map((category) => category.name)]
      : []
  })
}

export function getPrimaryCategoryGroupForTool(
  toolSlug: string,
): CategoryGroup | undefined {
  const tool = tools.find((candidate) => candidate.slug === toolSlug)
  const assignedSlugs = [
    ...(tool?.categorySlugs ?? []),
    ...(categoryToolAssignments[toolSlug] ?? []),
  ]

  for (const assignedSlug of assignedSlugs) {
    const group = categoryGroups.find((candidate) =>
      candidate.children.some((category) => category.slug === assignedSlug),
    )
    if (group) return group
  }
  return undefined
}

export type CategoryRoute =
  | { type: 'index' }
  | { type: 'group'; group: CategoryGroup }
  | { type: 'category'; group: CategoryGroup; category: Category }
  | { type: 'not-found' }

export function getCategoryRoute(pathname: string): CategoryRoute | null {
  if (pathname === '/categories' || pathname === '/categories/') {
    return { type: 'index' }
  }
  if (!pathname.startsWith('/categories/')) return null

  const match = pathname.match(/^\/categories\/([^/]+)(?:\/([^/]+))?\/?$/)
  if (!match) return { type: 'not-found' }

  const group = getCategoryGroupBySlug(match[1])
  if (!group) return { type: 'not-found' }
  if (!match[2]) return { type: 'group', group }

  const category = getCategoryBySlug(group.slug, match[2])
  return category
    ? { type: 'category', group, category }
    : { type: 'not-found' }
}

export const categories = [
  {
    id: 'chat-search',
    name: 'Chatbots & Search',
    slug: 'chatbots-search',
    description:
      'Conversational assistants and AI-powered information discovery.',
  },
  {
    id: 'image-design',
    name: 'Image & Design',
    slug: 'image-design',
    description: 'Generative tools for creating visual assets and designs.',
  },
  {
    id: 'video-audio',
    name: 'Video & Audio',
    slug: 'video-audio',
    description:
      'Tools for producing and editing video, voice, music, and audio.',
  },
  {
    id: 'coding-productivity',
    name: 'Coding & Productivity',
    slug: 'coding-productivity',
    description: 'AI coding environments and application-building tools.',
  },
  {
    id: 'writing-productivity',
    name: 'Writing & Productivity',
    slug: 'writing-productivity',
    description: 'AI features for writing, translation, and everyday work.',
  },
  {
    id: 'automation',
    name: 'Automation',
    slug: 'automation',
    description: 'Connect apps and automate repeatable workflows.',
  },
  {
    id: 'research-education',
    name: 'Research & Education',
    slug: 'research-education',
    description: 'Tools for finding and synthesizing research evidence.',
  },
] as const satisfies readonly AICategory[]

export function getCategoryById(id: CategoryId): AICategory {
  const category = categories.find((item) => item.id === id)
  if (!category) {
    throw new Error(`Category "${id}" is not registered.`)
  }
  return category
}
