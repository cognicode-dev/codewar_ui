import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Send, X, Terminal } from 'lucide-react'
import { cn } from '@/utils'

interface ChatMessage {
  sender: 'me' | 'them'
  text: string
  time: string
}

interface ChatPanelProps {
  isOpen: boolean
  friendName: string
  onClose: () => void
  isBright: boolean
}

export function ChatPanel({ isOpen, friendName, onClose, isBright }: ChatPanelProps) {
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load default mock chat history when a new friend is selected
  useEffect(() => {
    if (friendName) {
      setMessages([
        { sender: 'them', text: `Hey Aubrey! Are you ready to play some ranked games?`, time: '3:40 PM' },
        { sender: 'me', text: `Hey ${friendName}! Yes, just finishing up. ELO grind time.`, time: '3:42 PM' },
        { sender: 'them', text: `Awesome. Send me an invite when you are online.`, time: '3:43 PM' }
      ])
    }
  }, [friendName])

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMsg: ChatMessage = {
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, newMsg])
    setInputText('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -40, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className={cn(
            "absolute top-4 bottom-4 left-[416px] w-[300px] rounded-[24px] border backdrop-blur-2xl z-40 flex flex-col p-4.5 overflow-hidden",
            isBright
              ? "bg-white/45 border-white/60 shadow-[0_20px_50px_rgba(28,20,50,0.06),_inset_0_1px_0_rgba(255,255,255,0.4)] text-slate-800"
              : "bg-slate-950/45 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.05)] text-white"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-200/20">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Terminal size={14} />
              </div>
              <div>
                <h3 className={cn(
                  "text-xs font-black uppercase tracking-tight truncate max-w-[170px]",
                  isBright ? "text-slate-900" : "text-white"
                )}>
                  Chat with {friendName}
                </h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                  Direct Sandbox Connection
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className={cn(
                "p-1.5 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95",
                isBright 
                  ? "bg-slate-100/50 hover:bg-slate-200/50 border-slate-200/50 text-slate-600" 
                  : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300"
              )}
            >
              <X size={13} />
            </button>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pr-1 py-1">
            {messages.map((msg, index) => {
              const isMe = msg.sender === 'me'
              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    isMe ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "px-3 py-2 rounded-2xl text-xs font-medium leading-relaxed shadow-sm",
                    isMe
                      ? "bg-indigo-500 text-white rounded-tr-none"
                      : (isBright
                        ? "bg-white/80 border border-slate-200/50 text-slate-800 rounded-tl-none"
                        : "bg-slate-900/60 border border-white/5 text-slate-200 rounded-tl-none")
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-wider">
                    {msg.time}
                  </span>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-200/20"
          >
            <input
              type="text"
              placeholder="Type message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={cn(
                "flex-grow text-[10px] px-2.5 py-2 rounded-xl border focus:outline-none focus:border-indigo-500",
                isBright 
                  ? "bg-white border-slate-200 text-slate-800" 
                  : "bg-slate-900 border-white/10 text-white"
              )}
              autoFocus
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-all duration-150 cursor-pointer shadow-sm active:scale-95 shrink-0"
            >
              <Send size={11} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
