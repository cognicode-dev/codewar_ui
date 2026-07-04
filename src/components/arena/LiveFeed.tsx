import { Trophy } from 'lucide-react'
import { cn } from '@/utils'

interface LiveFeedItem {
  text: string
  time: string
  icon: React.ReactNode
}

interface LiveFeedProps {
  activities: LiveFeedItem[]
  isBright?: boolean
}

export function LiveFeed({ activities, isBright = false }: LiveFeedProps) {
  return (
    <div className="flex flex-col h-full">
      <span className="text-[10px] font-bold text-slate-500/60 uppercase tracking-[0.15em] block mb-4 flex items-center gap-1.5 select-none">
        <Trophy size={14} className="text-slate-550" />
        Live Feed
      </span>
      
      <div className="space-y-3 overflow-y-auto no-scrollbar flex-1 pr-1">
        {activities.map((act, i) => (
          <div key={i} className={cn("flex items-start gap-2.5 text-xs transition-colors", isBright ? "text-slate-600" : "text-slate-400")}>
            <span className="mt-0.5 flex-shrink-0">{act.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="leading-relaxed text-[11px] break-words">{act.text}</p>
              <span className="text-[9px] text-slate-500/80 block mt-0.5">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
