import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-bg-alt text-fg-muted border border-border',
        accent: 'bg-accent-soft text-accent',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        error: 'bg-error/10 text-error',
        dot: 'bg-bg-alt text-fg-muted border border-border pl-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dotColor?: string
}

export function Badge({ className, variant, dotColor, children, ...props }: BadgeProps) {
  if (variant === 'dot') {
    return (
      <span className={cn(badgeVariants({ variant }), className)} {...props}>
        <span
          className="mr-1 h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: dotColor || 'currentColor' }}
        />
        {children}
      </span>
    )
  }

  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  )
}
