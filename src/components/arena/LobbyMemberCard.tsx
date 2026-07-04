import { cn } from '@/utils'

interface LobbyMemberCardProps {
  name: string
  lp: string
  status: string
  colorClass: string // Dot color e.g. bg-amber-500/60
  isBright?: boolean
}

export function LobbyMemberCard({ name, lp, status, colorClass, isBright = false }: LobbyMemberCardProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-2.5 rounded-[16px] border transition-all duration-300",
      isBright 
        ? "bg-[#ffffff]/80 border-slate-200/80 hover:border-slate-300 hover:bg-[#ffffff]" 
        : "bg-[#080c14]/25 border-slate-900/40 hover:border-slate-800 hover:bg-[#0c121e]/40"
    )}>
      <div className="flex items-center gap-2.5">
        <div className={`w-2 h-2 rounded-full ${colorClass} shrink-0 animate-pulse`} />
        <div>
          <span className={cn("text-xs font-semibold block leading-tight", isBright ? "text-slate-700" : "text-slate-300")}>
            {name}
          </span>
          <span className={cn("text-[10px]", isBright ? "text-slate-400" : "text-slate-550")}>
            {lp}
          </span>
        </div>
      </div>
      <span className={cn(
        "text-[10px] font-mono px-2 py-0.5 rounded border transition-colors select-none",
        isBright 
          ? "text-slate-600 bg-[#F2F4FA]/80 border-slate-200" 
          : "text-slate-400/70 bg-slate-900/40 border-slate-800/30"
      )}>
        {status}
      </span>
    </div>
  )
}
