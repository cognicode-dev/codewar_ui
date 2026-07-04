import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils'
import { Send } from 'lucide-react'

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
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden pb-1">
      {/* Scrollable Message History */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pr-2 min-h-0"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col text-xs leading-normal">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={cn(
                "inline-block w-1.5 h-1.5 rounded-full shrink-0 mr-0.5",
                msg.isTeammate ? "bg-emerald-500" : "bg-rose-500"
              )} />
              <span className={cn(
                "font-bold font-sans tracking-wide",
                msg.isTeammate 
                  ? "text-emerald-600 dark:text-emerald-400" 
                  : "text-rose-600 dark:text-rose-400"
              )}>
                {msg.sender}
              </span>
              <span className="text-[9px] text-slate-500/80 font-mono ml-auto">
                {msg.time}
              </span>
            </div>
            <p className={cn(
              "pl-3.5 mt-0.5 font-sans leading-relaxed break-words",
              isBright ? "text-slate-805" : "text-slate-100"
            )}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      {/* Input Message Area */}
      <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message..."
          className={cn(
            "flex-1 px-3 py-1.5 rounded-xl border text-xs outline-none transition-all duration-200",
            isBright 
              ? "bg-[#F2F4FA]/80 border-slate-205 text-slate-850 placeholder-slate-450 focus:border-purple-500/50" 
              : "bg-slate-900/60 border-slate-900/60 text-slate-200 placeholder-slate-550 focus:border-purple-550/40"
          )}
        />
        <button 
          type="submit"
          disabled={!inputText.trim()}
          className={cn(
            "p-2 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-250 disabled:opacity-40 disabled:cursor-not-allowed",
            isBright 
              ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9]" 
              : "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
          )}
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  )
}
