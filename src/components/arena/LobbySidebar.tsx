import { MatchInfoCard } from './MatchInfoCard'
import { LobbyMemberCard } from './LobbyMemberCard'
import { LiveFeed } from './LiveFeed'
import { cn } from '@/utils'

interface LobbySidebarProps {
  activeCount: number
  maxCount: number
  members: { name: string; lp: string; status: string; colorClass: string }[]
  activities: { text: string; time: string; icon: React.ReactNode }[]
  isBright?: boolean
}

export function LobbySidebar({
  activeCount,
  maxCount,
  members,
  activities,
  isBright = false,
}: LobbySidebarProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden select-none bg-transparent">
      {/* Lobby Members Card Section */}
      <div className={cn(
        "flex flex-col border-b p-6 flex-1 min-h-0 transition-colors duration-300",
        isBright ? "border-slate-200/80" : "border-slate-900"
      )}>
        <MatchInfoCard 
          activeCount={activeCount} 
          maxCount={maxCount} 
          isBright={isBright} 
        />
        <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1 pr-1">
          {members.map((member) => (
            <LobbyMemberCard 
              key={member.name} 
              name={member.name}
              lp={member.lp}
              status={member.status}
              colorClass={member.colorClass}
              isBright={isBright}
            />
          ))}
        </div>
      </div>

      {/* Live Feed Section */}
      <div className="flex flex-col p-6 h-[220px] flex-shrink-0">
        <LiveFeed 
          activities={activities} 
          isBright={isBright} 
        />
      </div>
    </div>
  )
}
