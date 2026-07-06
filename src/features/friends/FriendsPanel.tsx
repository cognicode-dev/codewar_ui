import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, X, MessageSquare, UserPlus, Star, ChevronLeft, UserX, Loader2, MoreVertical, Check } from 'lucide-react'
import { cn, apiFetch } from '@/utils'
import { Socket } from 'socket.io-client'

interface Friend {
  id: string
  name: string
  avatarText: string
  avatarColor: string
  score: number
  status: 'online' | 'offline' | 'in-match' | 'queueing'
  statusText: string
}

interface FriendsPanelProps {
  isOpen: boolean
  onClose: () => void
  isBright: boolean
  onOpenChat: (friendName: string) => void
  activeChatFriend: string | null
  socket: Socket | null
  token: string | null
  onLogout?: () => void
  onTokenRefreshed?: (newToken: string, newUser: any) => void
}

export function FriendsPanel({ 
  isOpen, 
  onClose, 
  isBright, 
  onOpenChat, 
  activeChatFriend,
  socket,
  token,
  onLogout,
  onTokenRefreshed,
}: FriendsPanelProps) {
  const [activeView, setActiveView] = useState<'friends' | 'requests'>('friends')
  const [searchQuery, setSearchQuery] = useState('')
  const [incomingRequests, setIncomingRequests] = useState<any[]>([])
  const [friendsList, setFriendsList] = useState<Friend[]>([])
  const [loadingData, setLoadingData] = useState(false)

  // Add friend form state
  const [showAddFriendInput, setShowAddFriendInput] = useState(false)
  const [addFriendName, setAddFriendName] = useState('')
  const [addFriendError, setAddFriendError] = useState<string | null>(null)
  const [addFriendSuccess, setAddFriendSuccess] = useState<string | null>(null)
  const [sendingRequest, setSendingRequest] = useState(false)

  const [activeDropdownFriendId, setActiveDropdownFriendId] = useState<string | null>(null)
  const [invitedMap, setInvitedMap] = useState<Record<string, boolean>>({})

  const handleInviteFriend = (friendName: string) => {
    setInvitedMap(prev => ({ ...prev, [friendName]: true }))
    setTimeout(() => {
      setInvitedMap(prev => ({ ...prev, [friendName]: false }))
    }, 3000)

    if (socket && socket.connected) {
      socket.emit("room:invite", { targetUsername: friendName })
    }
  }

  const handleUnauthorized = () => {
    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.reload()
    }
  }

  const filteredFriends = friendsList.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  const getAvatarColor = (rank: string) => {
    switch (rank.toUpperCase()) {
      case 'MASTER': return 'bg-purple-650'
      case 'DIAMOND': return 'bg-cyan-600'
      case 'PLATINUM': return 'bg-teal-655'
      case 'GOLD': return 'bg-amber-600'
      default: return 'bg-slate-600'
    }
  }

  const loadSocialData = async () => {
    if (!token) return
    setLoadingData(true)
    try {
      // 1. Fetch requests
      const reqRes = await apiFetch("http://localhost:3001/social/requests", {}, onTokenRefreshed, onLogout)
      if (!reqRes.ok) {
        return
      }
      if (reqRes.ok) {
        const reqData = await reqRes.json()
        setIncomingRequests(reqData.incoming.map((r: any) => ({
          id: r.id,
          name: r.user.username,
          avatarText: r.user.username.slice(0, 2).toUpperCase(),
          avatarColor: 'bg-indigo-600',
          score: 1000
        })))
      }

      // 2. Query socket list for friends with presence, or fallback to REST friends
      if (socket && socket.connected) {
        socket.emit("social:list", (res: any) => {
          if (res && res.success && res.connections) {
            const mappedFriends = res.connections.friends.map((f: any) => {
              const lowerState = (f.presence?.state || 'offline').toLowerCase()
              return {
                id: f.userId || f.id,
                name: f.username,
                avatarText: f.username.slice(0, 2).toUpperCase(),
                avatarColor: getAvatarColor(f.rank || 'Silver'),
                score: f.rating || 1000,
                status: lowerState === 'offline' ? 'offline' : lowerState === 'in_match' ? 'in-match' : lowerState === 'in_queue' ? 'queueing' : 'online',
                statusText: lowerState === 'offline' ? 'Offline' : lowerState === 'in_match' ? 'In Match' : lowerState === 'in_queue' ? 'Queueing' : 'Online'
              }
            })
            setFriendsList(mappedFriends)
          }
        })
      } else {
        const friendsRes = await apiFetch("http://localhost:3001/social/friends", {}, onTokenRefreshed, onLogout)
        if (!friendsRes.ok) {
          return
        }
        if (friendsRes.ok) {
          const friendsData = await friendsRes.json()
          setFriendsList(friendsData.map((f: any) => ({
            id: f.id,
            name: f.username,
            avatarText: f.username.slice(0, 2).toUpperCase(),
            avatarColor: getAvatarColor(f.rank || 'Silver'),
            score: f.rating || 1000,
            status: 'offline',
            statusText: 'Offline'
          })))
        }
      }
    } catch (err) {
      console.error("Error loading social connections:", err)
    } finally {
      setLoadingData(false)
    }
  }

  // Load friends/requests when panel is opened or socket is ready
  useEffect(() => {
    if (!isOpen || !token) return

    loadSocialData()

    if (socket) {
      const handlePresenceUpdate = (payload: any) => {
        console.log("Presence update received in FriendsPanel:", payload)
        const { userId, state } = payload
        setFriendsList(prev => prev.map(f => {
          if (f.id === userId) {
            const lowerState = state.toLowerCase()
            return {
              ...f,
              status: lowerState === 'offline' ? 'offline' : lowerState === 'in_match' ? 'in-match' : lowerState === 'in_queue' ? 'queueing' : 'online',
              statusText: lowerState === 'offline' ? 'Offline' : lowerState === 'in_match' ? 'In Match' : lowerState === 'in_queue' ? 'Queueing' : 'Online'
            }
          }
          return f
        }))
      }

      const handleConnect = () => {
        console.log("FriendsPanel: Socket connected, reloading social data")
        loadSocialData()
      }

      socket.on("presence:updated", handlePresenceUpdate)
      socket.on("connect", handleConnect)

      return () => {
        socket.off("presence:updated", handlePresenceUpdate)
        socket.off("connect", handleConnect)
      }
    }
  }, [isOpen, token, socket])

  const handleAcceptRequest = async (request: any) => {
    if (!token) return
    try {
      const res = await apiFetch(`http://localhost:3001/social/requests/${request.id}/accept`, {
        method: 'POST'
      }, onTokenRefreshed, onLogout)
      if (!res.ok) {
        return
      }
      if (res.ok) {
        setIncomingRequests(prev => prev.filter(r => r.id !== request.id))
        loadSocialData()
      }
    } catch (err) {
      console.error("Failed to accept friend request:", err)
    }
  }

  const handleDeclineRequest = async (request: any) => {
    if (!token) return
    try {
      const res = await apiFetch(`http://localhost:3001/social/requests/${request.id}/decline`, {
        method: 'POST'
      }, onTokenRefreshed, onLogout)
      if (!res.ok) {
        return
      }
      if (res.ok) {
        setIncomingRequests(prev => prev.filter(r => r.id !== request.id))
      }
    } catch (err) {
      console.error("Failed to decline friend request:", err)
    }
  }

  const handleRemoveFriend = async (friendId: string) => {
    if (!token) return
    if (!confirm("Are you sure you want to remove this friend?")) return
    try {
      const res = await apiFetch(`http://localhost:3001/social/friends/${friendId}`, {
        method: 'DELETE'
      }, onTokenRefreshed, onLogout)
      if (!res.ok) {
        return
      }
      if (res.ok) {
        setFriendsList(prev => prev.filter(f => f.id !== friendId))
      }
    } catch (err) {
      console.error("Failed to remove friend:", err)
    }
  }

  const handleSendRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !addFriendName.trim()) return

    setSendingRequest(true)
    setAddFriendError(null)
    setAddFriendSuccess(null)

    try {
      const res = await apiFetch("http://localhost:3001/social/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          targetUsername: addFriendName.trim()
        })
      }, onTokenRefreshed, onLogout)

      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setAddFriendSuccess(data.message || "Friend request sent!")
        setAddFriendName('')
        loadSocialData()
        setTimeout(() => setAddFriendSuccess(null), 3000)
      } else {
        setAddFriendError(data.message || data.error || "Failed to send friend request")
      }
    } catch (err) {
      console.error("Failed to send request:", err)
      setAddFriendError("Connection error: Failed to reach server")
    } finally {
      setSendingRequest(false)
    }
  }

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online': return 'bg-emerald-500'
      case 'in-match': return 'bg-rose-500'
      case 'queueing': return 'bg-amber-505'
      case 'offline': return 'bg-slate-400'
    }
  }

  const getStatusTextColor = (status: Friend['status']) => {
    switch (status) {
      case 'online': return isBright ? 'text-emerald-600' : 'text-emerald-400'
      case 'in-match': return isBright ? 'text-rose-600' : 'text-rose-450'
      case 'queueing': return isBright ? 'text-amber-600' : 'text-amber-450'
      case 'offline': return isBright ? 'text-slate-500' : 'text-slate-400'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.35, x: -20, y: 80 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.35, x: -20, y: 80 }}
          transition={{ type: 'spring', stiffness: 340, damping: 24 }}
          style={{ transformOrigin: 'left center' }}
          className={cn(
            "absolute top-4 bottom-4 left-[108px] w-[300px] rounded-[24px] border backdrop-blur-2xl z-40 flex flex-col p-4.5 overflow-hidden",
            isBright
              ? "bg-white/45 border-white/60 shadow-[0_20px_50px_rgba(28,20,50,0.06),_inset_0_1px_0_rgba(255,255,255,0.4)] text-slate-805"
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
                    isBright ? "text-indigo-650 hover:text-indigo-800" : "text-indigo-400 hover:text-indigo-300"
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
                  <span className={cn(
                    "text-[10px] font-extrabold uppercase tracking-wider",
                    isBright ? "text-slate-600" : "text-slate-400"
                  )}>
                    {friendsList.filter(f => f.status !== 'offline').length} active online
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-1.5">
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

          {/* View 1: Incoming Friend Requests */}
          {activeView === 'requests' ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="text-[10px] font-black uppercase text-indigo-500 mb-2.5 tracking-wider">
                Incoming Friend Requests ({incomingRequests.length})
              </div>
              {loadingData && incomingRequests.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 size={20} className="animate-spin text-slate-500" />
                </div>
              ) : incomingRequests.length > 0 ? (
                <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1">
                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
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
                          <span className={cn(
                            "text-[9px] font-extrabold uppercase tracking-wider block mt-0.5",
                            isBright ? "text-slate-600" : "text-slate-400"
                          )}>{req.score} ELO</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase transition-all duration-150 cursor-pointer shadow-sm active:scale-95 shrink-0"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(req)}
                          className={cn(
                            "p-1.5 rounded-lg border transition-all duration-150 cursor-pointer active:scale-90 shrink-0",
                            isBright ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600" : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300"
                          )}
                        >
                          <X size={12} />
                        </button>
                      </div>
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
                {loadingData && friendsList.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center py-10">
                    <Loader2 size={20} className="animate-spin text-slate-500" />
                  </div>
                ) : filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => {
                    const isOnline = friend.status !== 'offline'
                    const isChatActive = activeChatFriend === friend.name

                    return (
                      <div
                        key={friend.id}
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
                              isBright ? "text-slate-805" : "text-white"
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
                        <div className="flex items-center gap-1.5 shrink-0 relative">
                          {isOnline && (
                            <button
                              title="Invite to match"
                              onClick={() => handleInviteFriend(friend.name)}
                              className={cn(
                                "p-1.5 rounded-lg border transition-all duration-150 cursor-pointer active:scale-90",
                                invitedMap[friend.name]
                                  ? "bg-emerald-500 border-emerald-400 text-white"
                                  : (isBright
                                    ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-605"
                                    : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300")
                              )}
                            >
                              {invitedMap[friend.name] ? <Check size={11} className="animate-bounce" /> : <UserPlus size={11} />}
                            </button>
                          )}
                          
                          {/* Options menu with three dots */}
                          <div className="relative shrink-0">
                            <button
                              title="More options"
                              onClick={() => setActiveDropdownFriendId(prev => prev === friend.id ? null : friend.id)}
                              className={cn(
                                "p-1.5 rounded-lg border transition-all duration-150 cursor-pointer active:scale-90",
                                activeDropdownFriendId === friend.id
                                  ? "bg-indigo-500 border-indigo-400 text-white"
                                  : (isBright
                                    ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-605"
                                    : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300")
                              )}
                            >
                              <MoreVertical size={11} />
                            </button>

                            <AnimatePresence>
                              {activeDropdownFriendId === friend.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40 bg-transparent"
                                    onClick={() => setActiveDropdownFriendId(null)}
                                  />
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                    transition={{ duration: 0.12 }}
                                    className={cn(
                                      "absolute right-0 top-full mt-1.5 w-28 rounded-xl border p-1 z-50 shadow-xl backdrop-blur-xl",
                                      isBright
                                        ? "bg-white/95 border-slate-200/80 text-slate-800"
                                        : "bg-slate-900/95 border-white/10 text-white"
                                    )}
                                  >
                                    <button
                                      onClick={() => {
                                        onOpenChat(friend.name)
                                        setActiveDropdownFriendId(null)
                                      }}
                                      className={cn(
                                        "w-full px-2 py-1.5 rounded-lg text-left text-[9px] font-black uppercase flex items-center gap-1.5 transition-colors cursor-pointer",
                                        isBright ? "hover:bg-slate-100 text-slate-800" : "hover:bg-white/5 text-slate-200"
                                      )}
                                    >
                                      <MessageSquare size={10} />
                                      Message
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleRemoveFriend(friend.id)
                                        setActiveDropdownFriendId(null)
                                      }}
                                      className="w-full px-2 py-1.5 rounded-lg text-left text-[9px] font-black uppercase flex items-center gap-1.5 transition-colors text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                    >
                                      <UserX size={10} />
                                      Remove
                                    </button>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    No friends found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sticky Bottom controls panel */}
          <div className="mt-4 pt-3.5 border-t border-slate-900/10 dark:border-white/5 flex flex-col gap-2 shrink-0">
            {showAddFriendInput ? (
              <form onSubmit={handleSendRequestSubmit} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Friend's username..."
                    value={addFriendName}
                    onChange={(e) => setAddFriendName(e.target.value)}
                    className={cn(
                      "flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-none placeholder-slate-400 font-semibold",
                      isBright ? "bg-white border-slate-200 text-slate-800" : "bg-slate-950/30 border-white/5 text-slate-200"
                    )}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={sendingRequest}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {sendingRequest ? <Loader2 size={10} className="animate-spin" /> : "Send"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddFriendInput(false)
                      setAddFriendName('')
                      setAddFriendError(null)
                    }}
                    className={cn(
                      "p-1.5 rounded-xl border transition-all cursor-pointer",
                      isBright ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600" : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300"
                    )}
                  >
                    <X size={12} />
                  </button>
                </div>
                {addFriendError && (
                  <div className="text-[10px] text-rose-500 font-semibold px-1">{addFriendError}</div>
                )}
                {addFriendSuccess && (
                  <div className="text-[10px] text-emerald-500 font-semibold px-1">{addFriendSuccess}</div>
                )}
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView(prev => prev === 'requests' ? 'friends' : 'requests')}
                  className={cn(
                    "relative flex-1 py-2 rounded-xl border text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98",
                    activeView === 'requests'
                      ? "bg-indigo-500 text-white border-indigo-400"
                      : (isBright 
                        ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600" 
                        : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300")
                  )}
                >
                  Requests
                  {incomingRequests.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[8px] font-black leading-none">
                      {incomingRequests.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setShowAddFriendInput(true)}
                  className={cn(
                    "flex-1 py-2 rounded-xl border text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98",
                    isBright 
                      ? "bg-slate-100 hover:bg-slate-200 border-slate-200/50 text-slate-600" 
                      : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300"
                  )}
                >
                  <UserPlus size={11} />
                  Add Friend
                </button>
              </div>
            )}
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
