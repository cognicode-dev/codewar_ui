import { cn } from '@/utils'

interface LobbyMemberCardProps {
  name: string
  status: string
  isBright?: boolean
}

function getStatusDetails(status: string) {
  const norm = status.toLowerCase().trim()
  if (norm.includes('accept')) {
    return { dotClass: 'bg-emerald-550', text: 'Accepted', textClass: 'text-emerald-600 dark:text-emerald-450' }
  } else if (norm.includes('run') || norm.includes('test')) {
    return { dotClass: 'bg-orange-500', text: 'Running', textClass: 'text-orange-500' }
  } else if (norm.includes('code')) {
    return { dotClass: 'bg-blue-500', text: 'Coding', textClass: 'text-blue-505 dark:text-blue-400' }
  } else if (norm.includes('submit')) {
    return { dotClass: 'bg-purple-500', text: 'Submitting', textClass: 'text-purple-600 dark:text-purple-400' }
  } else if (norm.includes('wrong') || norm.includes('wa') || norm.includes('error')) {
    return { dotClass: 'bg-rose-550', text: 'Wrong Answer', textClass: 'text-rose-600 dark:text-rose-450' }
  } else {
    return { dotClass: 'bg-slate-400', text: 'Idle', textClass: 'text-slate-450 dark:text-slate-400' }
  }
}

function getBannerClass(name: string, isBright: boolean) {
  const normalized = name.toLowerCase()
  if (normalized.includes('kaelen')) {
    return isBright 
      ? "from-indigo-600/15 via-violet-500/5 to-slate-50/90 border-indigo-500" 
      : "from-indigo-950/70 via-purple-950/40 to-[#0e121b]/95 border-indigo-500"
  } else if (normalized.includes('sora')) {
    return isBright 
      ? "from-emerald-600/15 via-teal-500/5 to-slate-50/90 border-emerald-500" 
      : "from-emerald-950/70 via-teal-950/40 to-[#0e121b]/95 border-emerald-500"
  } else if (normalized.includes('nexus')) {
    return isBright 
      ? "from-rose-600/15 via-orange-500/5 to-slate-50/90 border-rose-500" 
      : "from-rose-950/70 via-orange-950/40 to-[#0e121b]/95 border-rose-500"
  } else if (normalized.includes('ghost')) {
    return isBright 
      ? "from-cyan-600/15 via-blue-500/5 to-slate-50/90 border-cyan-500" 
      : "from-[#0c2e3a]/70 via-blue-950/40 to-[#0e121b]/95 border-cyan-500"
  } else {
    return isBright 
      ? "from-slate-500/15 via-slate-400/5 to-slate-50/90 border-slate-500" 
      : "from-slate-800/60 via-slate-900/40 to-[#0e121b]/95 border-slate-500"
  }
}

export function LobbyMemberCard({ name, status, isBright = false }: LobbyMemberCardProps) {
  const statusDetails = getStatusDetails(status)
  const bannerGradient = getBannerClass(name, isBright)

  return (
    <div className={cn(
      "relative flex flex-col justify-center px-4 h-[65px] rounded-xl border border-l-[3px] transition-all duration-300 bg-gradient-to-r select-none overflow-hidden",
      bannerGradient,
      isBright ? "border-slate-200/80 shadow-sm" : "border-slate-900/50"
    )}>
      {/* Decorative grid pattern in banner for premium appearance */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-40" />

      <div className="flex items-center justify-between z-10 relative">
        <span className={cn("text-xs font-bold font-mono tracking-wider uppercase", isBright ? "text-slate-800" : "text-white")}>
          {name}
        </span>
        <div className="flex items-center gap-1.5 select-none">
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 animate-pulse", statusDetails.dotClass)} />
          <span className={cn("text-[10px] font-mono font-bold uppercase tracking-wider", statusDetails.textClass)}>
            {statusDetails.text}
          </span>
        </div>
      </div>
    </div>
  )
}
