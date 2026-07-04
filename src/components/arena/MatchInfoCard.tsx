import { Users } from 'lucide-react'
import { cn } from '@/utils'

interface MatchInfoCardProps {
  activeCount: number
  maxCount: number
  isBright?: boolean
}

export function MatchInfoCard({ activeCount, maxCount, isBright = false }: MatchInfoCardProps) {
  return (
    <span className="text-[10px] font-bold text-slate-500/60 uppercase tracking-[0.15em] mb-4 flex items-center gap-1.5 select-none w-full">
      <Users size={14} className="text-slate-550" />
      Lobby Members
      <span className={cn(
        "ml-auto text-[10px] px-2 py-0.5 rounded border lowercase tracking-normal",
        isBright 
          ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" 
          : "text-emerald-400/80 bg-emerald-500/5 border-emerald-500/10"
      )}>
        Active: {activeCount}/{maxCount}
      </span>
    </span>
  )
}
