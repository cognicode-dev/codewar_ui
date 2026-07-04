import { Terminal, Play, ChevronUp } from 'lucide-react'
import { Button, Tooltip, Separator } from '@/components/ui'
import { cn } from '@/utils'

interface BottomToolbarProps {
  status?: 'idle' | 'running' | 'success' | 'error'
  onRun?: () => void
  onSubmit?: () => void
  className?: string
}

const statusConfig = {
  idle: { label: 'Ready', color: 'text-fg-subtle', dot: 'bg-neutral-400' },
  running: { label: 'Running...', color: 'text-accent', dot: 'bg-accent' },
  success: { label: 'Accepted', color: 'text-success', dot: 'bg-success' },
  error: { label: 'Error', color: 'text-error', dot: 'bg-error' },
}

export function BottomToolbar({ status = 'idle', onRun, onSubmit, className }: BottomToolbarProps) {
  const config = statusConfig[status]

  return (
    <div className={cn('flex h-9 items-center justify-between border-t border-border bg-bg-alt px-3', className)}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs" title="Terminal">
          <Terminal size={12} className="text-fg-subtle" />
          <span className="text-fg-subtle">Output</span>
        </div>
        <Separator orientation="vertical" className="h-3" />
        <div className="flex items-center gap-1.5 text-xs">
          <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
          <span className={cn('font-medium', config.color)}>{config.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip content="Run tests">
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={onRun}>
            <Play size={12} />
            Run
          </Button>
        </Tooltip>
        <Tooltip content="Submit solution">
          <Button variant="primary" size="sm" className="gap-1 text-xs" onClick={onSubmit}>
            <ChevronUp size={12} />
            Submit
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}
