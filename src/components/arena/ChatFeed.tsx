import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils'

export interface ChatMessage {
  id: string
  sender: string
  text: string
  isTeammate: boolean
  time: string
}

interface ChatFeedProps {
  messages: ChatMessage[]
  onSendMessage: (text: string) => void
  isBright?: boolean
}

export function ChatFeed({ messages, onSendMessage, isBright = false }: ChatFeedProps) {
  const [inputText, setInputText] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    onSendMessage(inputText)
    setInputText('')
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden pb-1 justify-between">
      {/* Scrollable Message History */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pr-2 min-h-0"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="group relative flex flex-col text-xs leading-normal select-text">
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "inline-block w-1.5 h-1.5 rounded-full shrink-0 mr-0.5 animate-pulse",
                msg.isTeammate ? "bg-emerald-500" : "bg-rose-500"
              )} />
              <span className={cn(
                "font-bold font-sans tracking-wide",
                msg.isTeammate 
                  ? "text-emerald-600 dark:text-emerald-400" 
                  : "text-rose-600 dark:text-rose-455"
              )}>
                {msg.sender}
              </span>
              
              {/* Hover Timestamp: fades in smoothly on message block hover */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[8.5px] text-slate-500 font-mono ml-2 select-none">
                {msg.time}
              </span>
            </div>
            {/* Dense 4px gap text wrapper */}
            <p className={cn(
              "pl-3.5 mt-[4px] font-sans leading-relaxed break-words",
              isBright ? "text-slate-805" : "text-slate-100"
            )}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      {/* Input Message Area - Contextual Placeholder & Arrow send */}
      <form onSubmit={handleSubmit} className="mt-3 flex items-center relative shrink-0">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message teammates..."
          className={cn(
            "w-full pl-3 pr-8 py-2 rounded-xl border text-xs outline-none transition-all duration-205",
            isBright 
              ? "bg-[#F2F4FA]/80 border-slate-205 text-slate-850 placeholder-slate-450 focus:border-purple-500/50" 
              : "bg-[#090d14]/75 border-slate-900 text-slate-200 placeholder-slate-550 focus:border-purple-550/40"
          )}
        />
        <button 
          type="submit"
          disabled={!inputText.trim()}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 p-1 text-sm font-semibold select-none cursor-pointer transition-colors duration-200",
            inputText.trim() 
              ? "text-purple-600 dark:text-purple-400 hover:scale-105" 
              : "text-slate-400/40 dark:text-slate-700/50 cursor-not-allowed"
          )}
        >
          ➜
        </button>
      </form>
    </div>
  )
}
