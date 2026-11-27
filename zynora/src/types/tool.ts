export type PricingTier =
  | 'Free'
  | 'Freemium'
  | 'Free Trial'
  | 'Paid'
  | 'Premium'
  | 'Unverified'

export type LogoProvenance =
  | 'official'
  | 'metadata'
  | 'favicon'
  | 'placeholder'
  | 'legacy'

export type LogoVerificationStatus = 'verified' | 'unverified'

export type CategoryId =
  | 'chat-search'
  | 'image-design'
  | 'video-audio'
  | 'coding-productivity'
  | 'writing-productivity'
  | 'automation'
  | 'research-education'

export type AICategory = {
  id: CategoryId
  name: string
  slug: string
  description: string
}

export type CategoryIconName =
  | 'Accessibility'
  | 'AudioLines'
  | 'Baby'
  | 'BarChart3'
  | 'BookOpen'
  | 'Bot'
  | 'BriefcaseBusiness'
  | 'CalendarDays'
  | 'Captions'
  | 'Clapperboard'
  | 'Cloud'
  | 'Code2'
  | 'Database'
  | 'Dumbbell'
  | 'FileText'
  | 'FolderKanban'
  | 'Gamepad2'
  | 'Globe2'
  | 'GraduationCap'
  | 'HeartPulse'
  | 'House'
  | 'Image'
  | 'Languages'
  | 'ListChecks'
  | 'Mail'
  | 'Megaphone'
  | 'MessageCircle'
  | 'MessagesSquare'
  | 'Mic'
  | 'Music2'
  | 'PenLine'
  | 'PenTool'
  | 'Pencil'
  | 'Plane'
  | 'Presentation'
  | 'Scissors'
  | 'Scale'
  | 'Search'
  | 'SearchCheck'
  | 'Shapes'
  | 'ShieldCheck'
  | 'Sparkles'
  | 'Table2'
  | 'UserRound'
  | 'Users'
  | 'Video'
  | 'WandSparkles'
  | 'Workflow'

export type Category = {
  slug: string
  name: string
  description: string
  icon: CategoryIconName
  toolCount: number
}

export type CategoryGroup = {
  slug: string
  name: string
  description: string
  icon: CategoryIconName
  featured: boolean
  children: Category[]
}

export type AITool = {
  id: string
  name: string
  slug: string
  categoryId?: CategoryId
  categorySlugs?: readonly string[]
  openSource?: boolean | 'Unverified'
  shortDescription: string
  officialWebsite: string | null
  logo: string | null
  logoProvenance: LogoProvenance
  logoVerificationStatus: LogoVerificationStatus
  logoSourceUrl: string | null
  pricing: PricingTier
  featured: boolean
  tags: readonly string[]
  popularity?: number
  longDescription?: string
  features?: readonly string[]
  useCases?: readonly string[]
  lastVerified?: string
  pricingNotes?: string
}
