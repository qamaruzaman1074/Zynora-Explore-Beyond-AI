export type HeroToolIcon =
  | 'chat'
  | 'search'
  | 'image'
  | 'video'
  | 'audio'
  | 'code'
  | 'presentation'

export type HeroSearchToolEntry = {
  slug: string
  categoryLabel: string
  icon: HeroToolIcon
  popular?: boolean
}

export const heroSearchTools: readonly HeroSearchToolEntry[] = [
  {
    slug: 'chatgpt',
    categoryLabel: 'Chatbot',
    icon: 'chat',
    popular: true,
  },
  {
    slug: 'claude',
    categoryLabel: 'Chatbot and writing',
    icon: 'chat',
  },
  {
    slug: 'perplexity',
    categoryLabel: 'Search',
    icon: 'search',
  },
  {
    slug: 'midjourney',
    categoryLabel: 'Image and design',
    icon: 'image',
  },
  {
    slug: 'runway',
    categoryLabel: 'Video',
    icon: 'video',
  },
  {
    slug: 'elevenlabs',
    categoryLabel: 'Audio and voice',
    icon: 'audio',
  },
  {
    slug: 'cursor',
    categoryLabel: 'Coding',
    icon: 'code',
  },
  {
    slug: 'gamma',
    categoryLabel: 'Presentations',
    icon: 'presentation',
  },
]
