import { cn } from '@/utils'

interface ProblemHeaderProps {
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  points: number
  acceptance: string
  isBright?: boolean
}

export function ProblemHeader({
  title,
  difficulty,
  points,
  acceptance,
  isBright = false,
}: ProblemHeaderProps) {
  const diffColorClass = 
    difficulty === 'Easy' 
      ? (isBright ? 'bg-[#F2FCF7] text-emerald-600 border-emerald-500/15' : 'bg-[#0e1c14] text-emerald-400 border-emerald-500/15')
      : difficulty === 'Medium'
      ? (isBright ? 'bg-[#FFF7F2] text-orange-600 border-orange-500/15' : 'bg-[#1c140e] text-amber-500 border-amber-500/15')
      : (isBright ? 'bg-[#FCF2F2] text-rose-600 border-rose-500/15' : 'bg-[#1c0e0e] text-rose-400 border-rose-500/15')

  return (
    <div className="mb-4 space-y-3">
      {/* Metrics Row */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wider select-none">
        <span className={cn('px-2.5 py-0.5 rounded border uppercase', diffColorClass)}>
          {difficulty}
        </span>
        <span className={cn('px-2.5 py-0.5 rounded border uppercase', isBright ? 'bg-[#FFFDF2] text-amber-600 border-amber-500/15' : 'bg-[#1c1c0e] text-yellow-500 border-yellow-500/15')}>
          {points} Pts
        </span>
        <span className={cn('px-2.5 py-0.5 rounded border uppercase', isBright ? 'bg-[#F2FCF7] text-emerald-600 border-emerald-500/15' : 'bg-[#0e1c14] text-emerald-400 border-emerald-500/15')}>
          {acceptance} Acc.
        </span>
      </div>

      {/* Title */}
      <h2 className={cn('text-xl font-extrabold tracking-tight leading-tight', isBright ? 'text-[#1E1B4B]' : 'text-white')}>
        {title}
      </h2>
    </div>
  )
}
