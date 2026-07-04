import { useState } from 'react'
import { motion } from 'motion/react'
import { PanelLeftClose, PanelLeft, Code2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

interface FloatingSidebarProps {
  items: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }[]
  className?: string
}

export function FloatingSidebar({ items, className }: FloatingSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 48 : 92 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex flex-col border-r border-border bg-bg-alt',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        {!collapsed && (
          <span className="flex items-center gap-2 text-sm font-semibold text-fg">
            <Code2 size={16} className="text-accent" />
            Arena
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && 'mx-auto')}
        >
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </Button>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {items.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? 'secondary' : 'ghost'}
            size="sm"
            onClick={item.onClick}
            className={cn(
              'justify-start gap-3',
              collapsed && 'justify-center px-0',
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Button>
        ))}
      </nav>
    </motion.aside>
  )
}
