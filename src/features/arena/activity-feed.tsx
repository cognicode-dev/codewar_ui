import { useState } from 'react'
import { Bell, MessageSquare, Activity as ActivityIcon } from 'lucide-react'
import { cn } from '@/utils'
import type { Activity, ChatMessage } from '@/types'

type Tab = 'activity' | 'chat'

interface ActivityFeedProps {
  activities: Activity[]
  messages: ChatMessage[]
}

export function ActivityFeed({ activities, messages }: ActivityFeedProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chat')

  return (
    <div className="flex flex-1 flex-col overflow-hidden border-t border-border">
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors',
            activeTab === 'chat' ? 'text-accent border-b-2 border-accent' : 'text-fg-subtle hover:text-fg-muted',
          )}
        >
          <MessageSquare size={12} />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors',
            activeTab === 'activity' ? 'text-accent border-b-2 border-accent' : 'text-fg-subtle hover:text-fg-muted',
          )}
        >
          <ActivityIcon size={12} />
          Activity
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chat' ? (
          <ChatTab messages={messages} />
        ) : (
          <ActivityTab activities={activities} />
        )}
      </div>
    </div>
  )
}

function ChatTab({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="space-y-1 p-3">
      {messages.map((msg) => (
        <div key={msg.id} className={cn(
          'rounded-lg px-3 py-2 text-xs',
          msg.type === 'system' || msg.type === 'submit' ? 'bg-bg-alt text-fg-subtle' : 'hover:bg-bg-hover',
        )}>
          {msg.type === 'message' ? (
            <div>
              <span className="font-medium text-fg">{msg.username}</span>
              <span className="ml-1.5 text-fg-muted">{msg.content}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Bell size={10} className="text-accent" />
              <span>{msg.content}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ActivityTab({ activities }: { activities: Activity[] }) {
  return (
    <div className="space-y-0.5 p-3">
      {activities.map((act) => (
        <div key={act.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-fg-muted hover:bg-bg-hover">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-[9px] font-medium text-accent">
            {act.username.charAt(0).toUpperCase()}
          </div>
          <span className="flex-1">
            <span className="font-medium text-fg">{act.username}</span>
            {' '}{act.action}
            {act.target && <span className="text-accent"> {act.target}</span>}
          </span>
        </div>
      ))}
    </div>
  )
}
