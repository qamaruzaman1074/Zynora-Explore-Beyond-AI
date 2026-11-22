import {
  Accessibility,
  AudioLines,
  Baby,
  BarChart3,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  Captions,
  Clapperboard,
  Cloud,
  Code2,
  Database,
  Dumbbell,
  FileText,
  FolderKanban,
  Gamepad2,
  Globe2,
  GraduationCap,
  HeartPulse,
  House,
  Image,
  Languages,
  ListChecks,
  Mail,
  Megaphone,
  MessageCircle,
  MessagesSquare,
  Mic,
  Music2,
  PenLine,
  PenTool,
  Pencil,
  Plane,
  Presentation,
  Scale,
  Scissors,
  Search,
  SearchCheck,
  Shapes,
  ShieldCheck,
  Sparkles,
  Table2,
  UserRound,
  Users,
  Video,
  WandSparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import type { CategoryIconName } from '../types/tool'

const categoryIcons: Record<CategoryIconName, LucideIcon> = {
  Accessibility,
  AudioLines,
  Baby,
  BarChart3,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  Captions,
  Clapperboard,
  Cloud,
  Code2,
  Database,
  Dumbbell,
  FileText,
  FolderKanban,
  Gamepad2,
  Globe2,
  GraduationCap,
  HeartPulse,
  House,
  Image,
  Languages,
  ListChecks,
  Mail,
  Megaphone,
  MessageCircle,
  MessagesSquare,
  Mic,
  Music2,
  PenLine,
  PenTool,
  Pencil,
  Plane,
  Presentation,
  Scale,
  Scissors,
  Search,
  SearchCheck,
  Shapes,
  ShieldCheck,
  Sparkles,
  Table2,
  UserRound,
  Users,
  Video,
  WandSparkles,
  Workflow,
}

type CategoryIconProps = {
  className?: string
  name: CategoryIconName
  size?: number
}

function CategoryIcon({ className, name, size = 24 }: CategoryIconProps) {
  const Icon = categoryIcons[name]
  return (
    <Icon
      aria-hidden="true"
      className={className}
      size={size}
      strokeWidth={1.5}
    />
  )
}

export default CategoryIcon
