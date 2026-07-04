import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/utils'
import { motion as motionTokens } from '@/theme/motion'

interface TooltipProps {
  content: string
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [show, setShow] = useState(false)

  const sideStyles: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  }

  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            className={cn(
              'pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-bg-inverse px-2 py-1 text-xs text-fg-inverse shadow-tooltip',
              sideStyles[side],
              className,
            )}
            initial={motionTokens.tooltip.initial}
            animate={motionTokens.tooltip.animate}
            exit={motionTokens.tooltip.exit}
            transition={{ duration: motionTokens.tooltip.duration / 1000, ease: 'easeOut' }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
