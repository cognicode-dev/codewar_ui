import React, { useState } from 'react'
import { LobbyMemberCard } from './LobbyMemberCard'
import { LiveFeed, LiveFeedItem } from './LiveFeed'
import { ChatFeed, ChatMessage } from './ChatFeed'
import { cn } from '@/utils'
import { Users, Activity, MessageSquare } from 'lucide-react'

interface LobbySidebarProps {
  activeCount?: number
  maxCount?: number
  isBright?: boolean
}

// Complete rich esports mock activities
const defaultActivities: LiveFeedItem[] = [
  { id: '1', type: 'run', text: 'Kaelen started running tests', time: '5m ago' },
  { id: '2', type: 'pass', text: 'Kaelen solved in 28ms', time: '4m ago' },
  { id: '3', type: 'fail', text: 'Nexus WA', time: '3m ago' },
  { id: '4', type: 'run', text: 'Ghost running...', time: '2m ago' },
  { id: '5', type: 'badge', text: 'You fastest runtime', time: '1m ago' },
  { id: '6', type: 'combo', text: 'Combo +3 active', time: '30s ago' },
  { id: '7', type: 'rank', text: 'Team Rank #1 achieved', time: '10s ago' }
]

// Teammate/Opponent color-coded mock chat messages
const defaultMessages: ChatMessage[] = [
  { id: '1', sender: 'Kaelen', text: "I'll optimize DFS.", isTeammate: true, time: '2m ago' },
  { id: '2', sender: 'dev.exe', text: "I'll handle graph.", isTeammate: true, time: '1m ago' },
  { id: '3', sender: 'Ghost', text: "gg", isTeammate: false, time: '45s ago' },
  { id: '4', sender: 'Cipher', text: "nice race", isTeammate: false, time: '15s ago' }
]

const defaultMembers = [
  { name: 'Kaelen', status: 'Coding' },
  { name: 'Sora_Dev', status: 'Running tests' },
  { name: 'Nexus_Core', status: 'Wrong Answer' },
  { name: 'Ghost', status: 'Idle' }
]

export function LobbySidebar({
  activeCount = 3,
  maxCount = 4,
  isBright = false,
}: LobbySidebarProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'chat'>('feed')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(defaultMessages)

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'You',
      text,
      isTeammate: true,
      time: 'Just now'
    }
    setChatMessages(prev => [...prev, newMsg])
  }

  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden select-none transition-colors duration-300",
      isBright 
        ? "bg-white/94 backdrop-blur-md border-l border-slate-200/50" 
        : "bg-[#080c12]/75 backdrop-blur-md border-l border-slate-900/50"
    )}>
      {/* 1. Header & Member Count */}
      <div className={cn(
        "p-4 border-b flex items-center justify-between font-sans shrink-0",
        isBright ? "border-slate-200/80 text-slate-700" : "border-slate-900 text-slate-350"
      )}>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] flex items-center gap-1.5">
          <Users size={12} className="text-violet-500/80" />
          Lobby Members
        </span>
        <span className={cn(
          "text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border",
          isBright 
            ? "text-emerald-700 bg-emerald-50 border-emerald-200/50" 
            : "text-emerald-400 bg-emerald-500/5 border-emerald-500/10"
        )}>
          {activeCount} / {maxCount}
        </span>
      </div>

      {/* 2. Banner Member List */}
      <div className={cn(
        "p-4 border-b flex flex-col gap-2.5 overflow-y-auto no-scrollbar shrink-0 max-h-[295px]",
        isBright ? "border-slate-200/80" : "border-slate-900"
      )}>
        {defaultMembers.map((member) => (
          <LobbyMemberCard 
            key={member.name} 
            name={member.name}
            status={member.status}
            isBright={isBright}
          />
        ))}
      </div>

      {/* 3. Segmented Tab Controls (Live | Chat) */}
      <div className={cn(
        "px-4 py-2.5 border-b shrink-0 flex justify-center",
        isBright ? "border-slate-200/80" : "border-slate-900"
      )}>
        <div className={cn(
          "w-full flex p-1 rounded-xl transition-colors duration-300 select-none",
          isBright ? "bg-slate-100/90" : "bg-slate-950/60"
        )}>
          <button 
            onClick={() => setActiveTab('feed')}
            className={cn(
              "flex-grow flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[10.5px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200",
              activeTab === 'feed'
                ? (isBright ? "bg-white text-purple-700 shadow-sm border-b border-purple-500" : "bg-slate-800 text-purple-400 shadow-sm border-b border-purple-500")
                : (isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-200")
            )}
          >
            <Activity size={11} />
            Live
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={cn(
              "flex-grow flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[10.5px] font-bold uppercase tracking-wide cursor-pointer transition-all duration-200",
              activeTab === 'chat'
                ? (isBright ? "bg-white text-purple-700 shadow-sm border-b border-purple-500" : "bg-slate-800 text-purple-400 shadow-sm border-b border-purple-500")
                : (isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-200")
            )}
          >
            <MessageSquare size={11} />
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
          <LiveFeed activities={defaultActivities} isBright={isBright} />
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
            messages={chatMessages} 
            onSendMessage={handleSendMessage}
            isBright={isBright}
          />
        </div>
      </div>
    </div>
  )
}
