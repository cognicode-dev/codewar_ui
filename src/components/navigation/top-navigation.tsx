import { Moon, Sun, Bell, Settings, Users } from 'lucide-react'
import { Button, Separator, Badge, Tooltip } from '@/components/ui'
import { useTheme } from '@/app/providers'

interface TopNavigationProps {
  title?: string
}

export function TopNavigation({ title = 'Code Arena' }: TopNavigationProps) {
  const { theme, toggle } = useTheme()

  return (
    <div className="flex h-11 items-center justify-between border-b border-border bg-bg-alt px-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-fg">{title}</span>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip content="Team">
          <Button variant="ghost" size="icon">
            <Users size={16} />
          </Button>
        </Tooltip>

        <Tooltip content="Notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={16} />
            <Badge variant="error" className="absolute -right-0.5 -top-0.5 h-4 min-w-4 px-1 text-[10px]">
              3
            </Badge>
          </Button>
        </Tooltip>

        <Tooltip content={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
          <Button variant="ghost" size="icon" onClick={toggle}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <Tooltip content="Settings">
          <Button variant="ghost" size="icon">
            <Settings size={16} />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}
