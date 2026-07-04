import {
  Users,
  Trophy,
  TrendingUp,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'

export interface SidebarNavItem {
  id: string
  label: string
  icon: LucideIcon
  href: string
  badge?: number | string
}

// Static navigation config items
export const sidebarStaticConfig: SidebarNavItem[] = [
  {
    id: 'ranked',
    label: 'Ranked',
    icon: Trophy,
    href: '/ranked',
  },
  {
    id: 'practice',
    label: 'Practice',
    icon: BookOpen,
    href: '/practice',
  },
  {
    id: 'friends',
    label: 'Friends',
    icon: Users,
    href: '/friends',
    badge: 4,
  },
  {
    id: 'statistics',
    label: 'Stats',
    icon: TrendingUp,
    href: '/statistics',
  },
]
