import { cn } from '@/utils'

interface LobbyMemberCardProps {
  name: string
  status: string
  isBright?: boolean
}

function getStatusDetails(status: string) {
  const norm = status.toLowerCase().trim()
  if (norm.includes('accept')) {
    return { dotClass: 'bg-emerald-500', text: 'Accepted', textClass: 'text-emerald-600 dark:text-emerald-400' }
  } else if (norm.includes('run') || norm.includes('test')) {
    return { dotClass: 'bg-amber-500', text: 'Running Tests...', textClass: 'text-amber-600 dark:text-amber-400' }
  } else if (norm.includes('code')) {
    return { dotClass: 'bg-blue-500', text: 'Coding...', textClass: 'text-blue-605 dark:text-blue-400' }
  } else if (norm.includes('submit')) {
    return { dotClass: 'bg-purple-500', text: 'Submitting...', textClass: 'text-purple-600 dark:text-purple-400' }
  } else if (norm.includes('wrong') || norm.includes('wa') || norm.includes('error')) {
    return { dotClass: 'bg-rose-500', text: status, textClass: 'text-rose-600 dark:text-rose-400' }
  } else {
    return { dotClass: 'bg-slate-400', text: 'Idle', textClass: 'text-slate-500 dark:text-slate-400' }
  }
}

function getBannerClass(name: string, isBright: boolean) {
  const normalized = name.toLowerCase()
  if (normalized.includes('kaelen')) {
    return isBright 
      ? "from-violet-500/15 via-violet-100/5 to-transparent border-violet-500" 
      : "from-violet-600/25 via-violet-900/5 to-transparent border-violet-500"
  } else if (normalized.includes('sora')) {
    return isBright 
      ? "from-emerald-500/15 via-emerald-100/5 to-transparent border-emerald-500" 
      : "from-emerald-600/25 via-emerald-900/5 to-transparent border-emerald-500"
  } else if (normalized.includes('nexus')) {
    return isBright 
      ? "from-rose-500/15 via-rose-100/5 to-transparent border-rose-500" 
      : "from-rose-600/25 via-rose-900/5 to-transparent border-rose-500"
  } else if (normalized.includes('ghost')) {
    return isBright 
      ? "from-cyan-500/15 via-cyan-100/5 to-transparent border-cyan-500" 
      : "from-cyan-600/25 via-cyan-900/5 to-transparent border-cyan-500"
  } else {
    return isBright 
      ? "from-slate-400/15 via-slate-100/5 to-transparent border-slate-400" 
      : "from-slate-600/20 via-slate-800/5 to-transparent border-slate-500"
  }
}

export function LobbyMemberCard({ name, status, isBright = false }: LobbyMemberCardProps) {
  const statusDetails = getStatusDetails(status)
  const bannerGradient = getBannerClass(name, isBright)

  return (
    <div className={cn(
      "flex flex-col justify-center p-3.5 h-14 rounded-xl border-l-[3px] border-y border-r transition-all duration-300 bg-gradient-to-r",
      bannerGradient,
      isBright 
        ? "border-slate-200/80 bg-white/40" 
        : "border-slate-900/50 bg-[#080c14]/20"
    )}>
      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-bold font-sans tracking-wide", isBright ? "text-slate-850" : "text-slate-100")}>
          {name}
        </span>
        <div className="flex items-center gap-1.5 select-none">
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 animate-pulse", statusDetails.dotClass)} />
          <span className={cn("text-[10px] font-mono font-semibold uppercase tracking-wider", statusDetails.textClass)}>
            {statusDetails.text}
          </span>
        </div>
      </div>
    </div>
  )
}
