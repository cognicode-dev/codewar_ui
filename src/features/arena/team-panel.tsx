import { Trophy, Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, Separator } from '@/components/ui'
import { cn } from '@/utils'
import type { Team } from '@/types'

interface TeamPanelProps {
  team: Team
}

const statusColor: Record<string, string> = {
  online: 'bg-success',
  offline: 'bg-neutral-400',
  away: 'bg-warning',
  idle: 'bg-warning',
  typing: 'bg-accent',
}

const statusLabel: Record<string, string> = {
  online: 'Online',
  offline: 'Offline',
  away: 'Away',
  idle: 'Idle',
  typing: 'Typing...',
}

export function TeamPanel({ team }: TeamPanelProps) {
  return (
    <Card className="rounded-none border-x-0 border-t-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users size={14} className="text-accent" />
          Team
        </CardTitle>
        <Badge variant="accent" className="text-[10px]">#{team.rank}</Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center gap-2 text-xs text-fg-muted">
          <Trophy size={12} className="text-warning" />
          <span>{team.score} pts</span>
          <Separator orientation="vertical" className="h-3" />
          <span className="text-fg-subtle">{team.name}</span>
        </div>

        <div className="space-y-1.5">
          {team.members.map((member) => (
            <div key={member.id} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-bg-hover transition-colors">
              <div className="relative">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent">
                  {member.username.charAt(0).toUpperCase()}
                </div>
                <span className={cn(
                  'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg',
                  statusColor[member.status] || 'bg-neutral-400',
                )} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-fg">{member.username}</div>
                <div className="text-[10px] text-fg-subtle">{statusLabel[member.status] || member.status}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
