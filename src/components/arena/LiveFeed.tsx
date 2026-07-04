import { useEffect, useRef } from 'react'
import { cn } from '@/utils'
import { ChevronRight, Check, AlertTriangle, Trophy, Flame, Gem } from 'lucide-react'

export interface LiveFeedItem {
  id: string
  type: 'run' | 'pass' | 'fail' | 'solve' | 'rank' | 'combo' | 'badge'
  text: string
  time: string
}

interface LiveFeedProps {
  activities: LiveFeedItem[]
  isBright?: boolean
}

export function LiveFeed({ activities, isBright = false }: LiveFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of feed when events update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [activities])

  const getEventIconAndStyle = (type: string) => {
    switch (type) {
      case 'run':
        return {
          icon: <ChevronRight size={11} className="text-amber-500 fill-amber-500/10" />,
          bgClass: isBright ? 'bg-amber-50 border-amber-100/50 text-amber-800' : 'bg-amber-500/5 border-amber-500/10 text-amber-400'
        }
      case 'pass':
      case 'solve':
        return {
          icon: <Check size={11} className="text-emerald-500 font-bold" />,
          bgClass: isBright ? 'bg-emerald-50 border-emerald-100/50 text-emerald-800' : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'
        }
      case 'fail':
        return {
          icon: <AlertTriangle size={11} className="text-rose-500" />,
          bgClass: isBright ? 'bg-rose-50 border-rose-100/50 text-rose-800' : 'bg-rose-500/5 border-rose-500/10 text-rose-450'
        }
      case 'rank':
        return {
          icon: <Trophy size={11} className="text-violet-500 fill-violet-500/10" />,
          bgClass: isBright ? 'bg-violet-50 border-violet-100/50 text-violet-850' : 'bg-violet-500/5 border-violet-500/10 text-violet-400'
        }
      case 'combo':
        return {
          icon: <Flame size={11} className="text-orange-500 fill-orange-500/10" />,
          bgClass: isBright ? 'bg-orange-50 border-orange-100/50 text-orange-850' : 'bg-orange-500/5 border-orange-500/10 text-orange-400'
        }
      case 'badge':
        return {
          icon: <Gem size={11} className="text-cyan-500 fill-cyan-500/10" />,
          bgClass: isBright ? 'bg-cyan-50 border-cyan-100/50 text-cyan-850' : 'bg-cyan-500/5 border-cyan-500/10 text-cyan-400'
        }
      default:
        return {
          icon: <ChevronRight size={11} className="text-slate-400" />,
          bgClass: isBright ? 'bg-slate-50 border-slate-100/50 text-slate-700' : 'bg-slate-500/5 border-slate-500/10 text-slate-400'
        }
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div 
        ref={containerRef}
        className="space-y-1.5 overflow-y-auto no-scrollbar flex-1 pr-1 font-mono text-[10px]"
      >
        {activities.map((act) => {
          const config = getEventIconAndStyle(act.type)
          return (
            <div 
              key={act.id} 
              className={cn(
                "flex items-center gap-2 py-1 px-2.5 rounded-lg border leading-tight transition-all duration-200",
                config.bgClass
              )}
            >
              <span className="flex-shrink-0">{config.icon}</span>
              <span className="flex-1 break-words font-medium">{act.text}</span>
              <span className="text-[8.5px] text-slate-550 shrink-0 font-sans">{act.time}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
