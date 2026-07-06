import React, { useState } from 'react'
import { LobbyMemberCard } from './LobbyMemberCard'
import { LiveFeed, LiveFeedItem } from './LiveFeed'
import { ChatFeed, ChatMessage } from './ChatFeed'
import { cn } from '@/utils'
import { Users, Activity, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react'

interface LobbySidebarProps {
  isBright?: boolean
  members?: { name: string; status: string }[]
  activities?: LiveFeedItem[]
  chatMessages?: ChatMessage[]
  onSendMessage?: (text: string) => void
  typingUser?: { name: string; isTeammate: boolean } | null
}

// Complete rich esports mock activities
const defaultActivities: LiveFeedItem[] = [
  { id: '1', type: 'run', text: 'Tests started running', time: 'Just now' },
  { id: '2', type: 'pass', text: 'Problem solved', time: 'Just now' }
]

// Teammate/Opponent color-coded mock chat messages
const defaultMessages: ChatMessage[] = [
  { id: '1', sender: 'System', text: "Lobby connected.", isTeammate: true, time: 'Just now' }
]

export function LobbySidebar({
  isBright = false,
  members = [],
  activities = defaultActivities,
  chatMessages,
  onSendMessage,
  typingUser
}: LobbySidebarProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'chat'>('feed')
  const [localChatMessages, setLocalChatMessages] = useState<ChatMessage[]>(defaultMessages)
  const [isLobbyExpanded, setIsLobbyExpanded] = useState(true)

  const handleSendMessage = (text: string) => {
    if (onSendMessage) {
      onSendMessage(text)
    } else {
      const newMsg: ChatMessage = {
        id: String(Date.now()),
        sender: 'You',
        text,
        isTeammate: true,
        time: 'Just now'
      }
      setLocalChatMessages(prev => [...prev, newMsg])
    }
  }

  const currentChatMessages = chatMessages || localChatMessages
  const activeCount = members.length
  const maxCount = 2

  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden select-none transition-colors duration-300",
      isBright 
        ? "bg-white/94 backdrop-blur-md border-l border-slate-200/50" 
        : "bg-[#080c12]/75 backdrop-blur-md border-l border-slate-900/50"
    )}>
      {/* 1. Collapsible Lobby Header (👥 Lobby (3/4)) - borderless for breathing room */}
      <button 
        onClick={() => setIsLobbyExpanded(!isLobbyExpanded)}
        className={cn(
          "w-full flex items-center justify-between p-3.5 font-sans shrink-0 hover:bg-slate-500/5 select-none cursor-pointer outline-none transition-colors duration-205",
          isBright ? "text-slate-705" : "text-slate-350"
        )}
      >
        <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] flex items-center gap-1.5">
          {isLobbyExpanded ? <ChevronDown size={11} className="text-violet-500" /> : <ChevronRight size={11} className="text-slate-500" />}
          👥 Lobby ({activeCount}/{maxCount})
        </span>
      </button>

      {/* 2. Banner Member List (Visible only when expanded) */}
      {isLobbyExpanded && (
        <div className={cn(
          "p-3.5 pt-0 border-b flex flex-col gap-2 overflow-y-auto no-scrollbar shrink-0 max-h-[260px] transition-all duration-300",
          isBright ? "border-slate-200/80" : "border-slate-900"
        )}>
          {members.map((member) => (
            <LobbyMemberCard 
              key={member.name} 
              name={member.name}
              status={member.status}
              isBright={isBright}
            />
          ))}
        </div>
      )}

      {/* 3. Segmented Tab Controls (Live | Chat) - elegant 34px height */}
      <div className={cn(
        "px-4 py-2 border-b shrink-0 flex justify-center h-[38px] items-center",
        isBright ? "border-slate-200/80" : "border-slate-900"
      )}>
        <div className={cn(
          "w-full flex p-0.5 rounded-xl transition-colors duration-300 select-none h-[28px] items-center",
          isBright ? "bg-slate-100/90" : "bg-slate-950/60"
        )}>
          <button 
            onClick={() => setActiveTab('feed')}
            className={cn(
              "flex-grow flex items-center justify-center gap-1.5 py-1 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 h-full",
              activeTab === 'feed'
                ? (isBright ? "bg-white text-purple-700 shadow-sm border-b border-purple-500" : "bg-slate-800 text-purple-400 shadow-sm border-b border-purple-500")
                : (isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-205")
            )}
          >
            <Activity size={10} />
            Live
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={cn(
              "flex-grow flex items-center justify-center gap-1.5 py-1 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 h-full",
              activeTab === 'chat'
                ? (isBright ? "bg-white text-purple-700 shadow-sm border-b border-purple-500" : "bg-slate-800 text-purple-400 shadow-sm border-b border-purple-500")
                : (isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-205")
            )}
          >
            <MessageSquare size={10} />
            Chat
          </button>
        </div>
      </div>

      {/* 4. Switched Content Region */}
      <div className="flex-1 p-4 overflow-hidden relative flex flex-col min-h-0">
        <div 
          className="absolute inset-0 p-4 flex flex-col transition-all duration-300 ease-out"
          style={{
            opacity: activeTab === 'feed' ? 1 : 0,
            visibility: activeTab === 'feed' ? 'visible' : 'hidden',
            pointerEvents: activeTab === 'feed' ? 'auto' : 'none',
            transform: activeTab === 'feed' ? 'translateY(0)' : 'translateY(8px)'
          }}
        >
          <LiveFeed activities={activities} isBright={isBright} />
        </div>

        <div 
          className="absolute inset-0 p-4 flex flex-col transition-all duration-300 ease-out"
          style={{
            opacity: activeTab === 'chat' ? 1 : 0,
            visibility: activeTab === 'chat' ? 'visible' : 'hidden',
            pointerEvents: activeTab === 'chat' ? 'auto' : 'none',
            transform: activeTab === 'chat' ? 'translateY(0)' : 'translateY(-8px)'
          }}
        >
          <ChatFeed 
            messages={currentChatMessages} 
            onSendMessage={handleSendMessage}
            isBright={isBright}
            typingUser={typingUser}
          />
        </div>
      </div>
    </div>
  )
}
