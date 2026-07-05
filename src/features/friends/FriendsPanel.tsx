import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, X, MessageSquare, UserPlus, Star, ChevronLeft } from 'lucide-react'
import { cn } from '@/utils'

interface Friend {
  name: string
  avatarText: string
  avatarColor: string
  score: number
  status: 'online' | 'offline' | 'in-match' | 'queueing'
  statusText: string
}

const mockFriends: Friend[] = [
  { name: 'Kaelen', avatarText: 'KA', avatarColor: 'bg-blue-600', score: 2920, status: 'online', statusText: 'Online' },
  { name: 'Sora_Dev', avatarText: 'SO', avatarColor: 'bg-rose-600', score: 2820, status: 'in-match', statusText: 'In Match' },
  { name: 'dev_knight', avatarText: 'DK', avatarColor: 'bg-amber-600', score: 2450, status: 'queueing', statusText: 'Queueing' },
  { name: 'Nexus_Core', avatarText: 'NX', avatarColor: 'bg-emerald-600', score: 2390, status: 'online', statusText: 'Online' },
  { name: 'Ghost_Coder', avatarText: 'GH', avatarColor: 'bg-slate-700', score: 2210, status: 'offline', statusText: 'Offline' },
  { name: 'Cipher_Dev', avatarText: 'CI', avatarColor: 'bg-teal-600', score: 2110, status: 'offline', statusText: 'Offline' }
]

interface FriendsPanelProps {
  isOpen: boolean
  onClose: () => void
  isBright: boolean
  onOpenChat: (friendName: string) => void
  activeChatFriend: string | null
}

export function FriendsPanel({ isOpen, onClose, isBright, onOpenChat, activeChatFriend }: FriendsPanelProps) {
  const [activeView, setActiveView] = useState<'friends' | 'requests'>('friends')
  const [searchQuery, setSearchQuery] = useState('')
  const [incomingRequests, setIncomingRequests] = useState([
    { name: 'Code_Master', avatarText: 'CM', avatarColor: 'bg-indigo-600', score: 2040 }
  ])
  const [friendsList, setFriendsList] = useState<Friend[]>(mockFriends)

  const filteredFriends = friendsList.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  const handleAcceptRequest = (request: typeof incomingRequests[0]) => {
    setIncomingRequests(prev => prev.filter(r => r.name !== request.name))
    setFriendsList(prev => [
      { name: request.name, avatarText: request.avatarText, avatarColor: request.avatarColor, score: request.score, status: 'online', statusText: 'Online' },
      ...prev
    ])
  }

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500'
      case 'in-match':
        return 'bg-rose-500'
      case 'queueing':
        return 'bg-amber-500'
      case 'offline':
        return 'bg-slate-400'
    }
  }

  const getStatusTextColor = (status: Friend['status']) => {
    switch (status) {
      case 'online':
        return 'text-emerald-500'
      case 'in-match':
        return 'text-rose-500'
      case 'queueing':
        return 'text-amber-500'
      case 'offline':
        return 'text-slate-400'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -60, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -60, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className={cn(
            "absolute top-4 bottom-4 left-[108px] w-[300px] rounded-[24px] border backdrop-blur-2xl z-40 flex flex-col p-4.5 overflow-hidden",
            isBright
              ? "bg-white/45 border-white/60 shadow-[0_20px_50px_rgba(28,20,50,0.06),_inset_0_1px_0_rgba(255,255,255,0.4)] text-slate-800"
              : "bg-slate-950/45 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.05)] text-white"
          )}
        >
          {/* Header section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              {activeView === 'requests' ? (
                <button
                  onClick={() => setActiveView('friends')}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-black uppercase tracking-tight transition-colors cursor-pointer",
                    isBright ? "text-indigo-600 hover:text-indigo-800" : "text-indigo-400 hover:text-indigo-300"
                  )}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
              ) : (
                <>
                  <h2 className={cn(
                    "text-base font-black uppercase tracking-tight flex items-center gap-1.5",
                    isBright ? "text-slate-900" : "text-white"
                  )}>
                    <Star size={14} className="text-violet-500 animate-pulse" />
                    Friends
                  </h2>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {friendsList.filter(f => f.status !== 'offline').length} active online
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Requests Toggle Button (Switches window view) */}
              <button
                onClick={() => setActiveView(prev => prev === 'requests' ? 'friends' : 'requests')}
                className={cn(
                  "relative px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase flex items-center gap-1 transition-all duration-200 cursor-pointer hover:scale-105",
                  activeView === 'requests'
                    ? "bg-indigo-500 text-white border-indigo-400"
                    : (isBright 
                      ? "bg-slate-100/50 hover:bg-slate-200/50 border-slate-200/50 text-slate-600" 
                      : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300")
                )}
              >
                Requests
                {incomingRequests.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-black absolute -top-1.5 -right-1.5">
                    {incomingRequests.length}
                  </span>
                )}
              </button>

              <button
                onClick={onClose}
                className={cn(
                  "p-1.5 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95",
                  isBright 
                    ? "bg-slate-100/50 hover:bg-slate-200/50 border-slate-200/50 text-slate-600" 
                    : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300"
                )}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* View 1: Incoming Friend Requests (Hides friendlist completely) */}
          {activeView === 'requests' ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="text-[10px] font-black uppercase text-indigo-500 mb-2.5 tracking-wider">
                Incoming Friend Requests ({incomingRequests.length})
              </div>
              {incomingRequests.length > 0 ? (
                <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1">
                  {incomingRequests.map((req) => (
                    <div
                      key={req.name}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border backdrop-blur-md",
                        isBright ? "bg-white/30 border-white/50" : "bg-slate-950/20 border-white/5"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0", req.avatarColor)}>
                          {req.avatarText}
                        </div>
                        <div className="min-w-0">
                          <span className={cn("font-bold text-xs block truncate", isBright ? "text-slate-800" : "text-white")}>
                            {req.name}
                          </span>
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mt-0.5">{req.score} ELO</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAcceptRequest(req)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase transition-all duration-150 cursor-pointer shadow-sm active:scale-95 shrink-0"
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  No pending requests
                </div>
              )}
            </div>
          ) : (
            /* View 2: Friend List */
            <div className="flex-1 flex flex-col min-h-0">
              {/* Search bar */}
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 mb-4",
                isBright ? "bg-white/50 border-slate-200/50 text-slate-800" : "bg-slate-950/30 border-white/5 text-slate-200"
              )}>
                <Search size={13} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Filter friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs font-semibold w-full focus:outline-none placeholder-slate-400"
                />
              </div>

              {/* Friends List Container */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => {
                    const isOnline = friend.status !== 'offline'
                    const isChatActive = activeChatFriend === friend.name

                    return (
                      <div
                        key={friend.name}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-xl border backdrop-blur-md transition-all duration-200",
                          isBright
                            ? "bg-white/30 border-white/50 shadow-sm"
                            : "bg-slate-950/20 border-white/5 shadow-sm"
                        )}
                      >
                        {/* Left: Avatar + Name/Status info */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar with Status indicator dot */}
                          <div className="relative shrink-0">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-sm",
                              friend.avatarColor
                            )}>
                              {friend.avatarText}
                            </div>
                            <span className={cn(
                              "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 shrink-0 z-10",
                              isBright ? "border-white" : "border-slate-900",
                              getStatusColor(friend.status)
                            )} />
                          </div>

                          {/* Name and Status tag */}
                          <div className="min-w-0">
                            <span className={cn(
                              "font-bold text-xs block truncate leading-tight",
                              isBright ? "text-slate-800" : "text-white"
                            )}>
                              {friend.name}
                            </span>
                            <span className={cn(
                              "text-[9px] font-extrabold uppercase tracking-wider block mt-0.5",
                              getStatusTextColor(friend.status)
                            )}>
                              {friend.statusText} • {friend.score} ELO
                            </span>
                          </div>
                        </div>

                        {/* Right: Quick Action icon buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {friend.status === 'online' && (
                            <button
                              title="Invite to game"
                              className={cn(
                                "p-1.5 rounded-lg border transition-all duration-150 cursor-pointer active:scale-90",
                                isBright
                                  ? "bg-indigo-50 hover:bg-indigo-100 border-indigo-100 text-indigo-600"
                                  : "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20 text-indigo-400"
                              )}
                            >
                              <UserPlus size={11} />
                            </button>
                          )}
                          {isOnline && (
                            <button
                              title="Send message"
                              onClick={() => onOpenChat(friend.name)}
                              className={cn(
                                "p-1.5 rounded-lg border transition-all duration-150 cursor-pointer active:scale-90",
                                isChatActive
                                  ? "bg-indigo-500 border-indigo-400 text-white"
                                  : (isBright
                                    ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600"
                                    : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300")
                              )}
                            >
                              <MessageSquare size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    No matching friends
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
