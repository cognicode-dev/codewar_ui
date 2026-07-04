import { useEffect, useState } from 'react'
import { Zap, Settings, LogOut, ShieldAlert } from 'lucide-react'
import { cn } from '@/utils'

interface ArenaTopbarProps {
  activeId: string
  onChangeActiveId: (id: string) => void
  inRoom: boolean
  isBright?: boolean
  onLeave?: () => void
}

export function ArenaTopbar({
  activeId,
  onChangeActiveId,
  inRoom,
  isBright = false,
  onLeave,
}: ArenaTopbarProps) {
  // Simple countdown timer ticking down from 14:52 for organic match atmosphere
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 52)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 25 * 60))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <header className={cn(
      "flex h-12 w-full items-center justify-between border-b px-6 text-xs font-medium select-none z-20 relative transition-all duration-300",
      isBright 
        ? "border-slate-200/80 bg-[#ffffff]/60 backdrop-blur-md text-slate-600" 
        : "border-slate-900 bg-[#05070c]/90 text-slate-400"
    )}>
      {/* Left side: Branding & Navigation Tabs */}
      <div className="flex items-center gap-6">
        <div className={cn("flex items-center gap-2", isBright ? "text-[#1E1B4B]" : "text-slate-200")}>
          <span className={cn("font-bold font-mono text-sm", isBright ? "text-[#7C3AED]" : "text-blue-400")}>&gt;_</span>
          <span className="font-bold uppercase tracking-wider text-[10px]">CodeWar</span>
        </div>
        <div className={cn("h-4 w-px", isBright ? "bg-slate-200" : "bg-slate-900")} />
        <div className="flex items-center gap-4">
          <span 
            onClick={() => onChangeActiveId('arena')} 
            className={cn(
              "cursor-pointer transition-colors px-2.5 py-1 rounded border", 
              activeId === 'arena' 
                ? (isBright ? "text-slate-800 font-semibold bg-white border-slate-200 shadow-sm" : "text-slate-100 font-semibold bg-slate-955 border-slate-900") 
                : (isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-200")
            )}
          >
            Arena
          </span>
          <span 
            onClick={() => onChangeActiveId('ranked')} 
            className={cn(
              "cursor-pointer transition-colors px-2.5 py-1 rounded border", 
              activeId === 'ranked' 
                ? (isBright ? "text-slate-800 font-semibold bg-white border-slate-200 shadow-sm" : "text-slate-100 font-semibold bg-slate-955 border-slate-900") 
                : (isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-200")
            )}
          >
            Ranked
          </span>
          <span 
            onClick={() => onChangeActiveId('practice')} 
            className={cn(
              "cursor-pointer transition-colors px-2.5 py-1 rounded border", 
              activeId === 'practice' 
                ? (isBright ? "text-slate-800 font-semibold bg-white border-slate-200 shadow-sm" : "text-slate-100 font-semibold bg-slate-955 border-slate-900") 
                : (isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-200")
            )}
          >
            Practice
          </span>
        </div>
      </div>

      {/* Center/Right: Match countdown timer */}
      {inRoom && (
        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-xl border font-mono font-bold text-sm tracking-wider shadow-sm select-none",
          isBright 
            ? "bg-[#FCF2F2] border-rose-500/25 text-rose-600" 
            : "bg-[#1c0e0e] border-rose-500/20 text-rose-500"
        )}>
          <ShieldAlert size={14} className="animate-pulse" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      )}

      {/* Right side: Settings & Leave Controls */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className={cn("text-[10px]", isBright ? "text-slate-500" : "text-slate-550")}>SERVER: OPTIMAL</span>
        </div>
        <div className={cn("h-4 w-px", isBright ? "bg-slate-200" : "bg-slate-900")} />
        <div className={cn("flex items-center gap-1.5", isBright ? "text-amber-600" : "text-amber-500/80")}>
          <Zap size={12} className={cn("fill-amber-500/10", isBright ? "text-amber-600" : "text-amber-500/80")} />
          <span className="font-bold">1,820 LP</span>
        </div>
        <div className={cn("h-4 w-px", isBright ? "bg-slate-200" : "bg-slate-900")} />
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onChangeActiveId('settings')}
            className={cn(
              "cursor-pointer flex items-center justify-center p-1 rounded-lg transition-colors hover:bg-slate-100", 
              isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-200"
            )}
            title="Settings"
          >
            <Settings size={15} />
          </button>
          
          {inRoom && onLeave && (
            <button 
              onClick={onLeave}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-bold border border-rose-500/20 transition-all duration-200 active:scale-95 text-[11px]"
              title="Leave Room"
            >
              <LogOut size={12} />
              <span>Leave</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
