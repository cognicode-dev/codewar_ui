import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Trophy, Users, Search, Star, Sparkles, Loader2 } from 'lucide-react'
import { cn, apiFetch } from '@/utils'

interface LeaderboardEntry {
  rank: number
  name: string
  avatarText: string
  avatarColor: string
  score: number
  hs: number
  isSelf?: boolean
}

export function LeaderboardScreen({ 
  isBright,
  onTokenRefreshed,
  onLogout,
}: { 
  isBright: boolean;
  onTokenRefreshed?: (newToken: string, newUser: any) => void;
  onLogout?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'global' | 'friends'>('global')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [highlightedPlayer, setHighlightedPlayer] = useState<string | null>(null)
  
  const [globalPlayers, setGlobalPlayers] = useState<LeaderboardEntry[]>([])
  const [friendsPlayers, setFriendsPlayers] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const activePlayers = activeTab === 'global' ? globalPlayers : friendsPlayers

  const getAvatarColor = (rating: number) => {
    if (rating >= 2000) return 'bg-purple-650'
    if (rating >= 1800) return 'bg-cyan-600'
    if (rating >= 1600) return 'bg-teal-650'
    if (rating >= 1400) return 'bg-amber-600'
    return 'bg-slate-600'
  }

  const loadLeaderboardData = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    const currentUser = userStr ? JSON.parse(userStr) : null

    try {
      // 1. Fetch Global rankings
      const globalRes = await apiFetch("http://localhost:3001/profiles/leaderboard", {}, onTokenRefreshed, onLogout)
      if (globalRes.ok) {
        const globalData = await globalRes.json()
        const mappedGlobal = globalData.data.map((r: any, idx: number) => ({
          rank: idx + 1,
          name: r.username,
          avatarText: r.username.slice(0, 2).toUpperCase(),
          avatarColor: getAvatarColor(r.rating),
          score: r.rating,
          hs: r.gamesPlayed,
          isSelf: currentUser && r.username === currentUser.username
        }))
        setGlobalPlayers(mappedGlobal)
      }

      // 2. Fetch friends and build friends leaderboard
      if (token) {
        // Fetch current user rating first to include them in the friends rankings
        const meRes = await apiFetch("http://localhost:3001/profiles/me", {}, onTokenRefreshed, onLogout)
        let meEntry: any = null
        if (meRes.ok) {
          const meData = await meRes.json()
          meEntry = {
            id: meData.userId,
            username: meData.username,
            rating: meData.rating || 1000,
            level: meData.statistics?.level || 1,
            gamesPlayed: meData.statistics?.gamesPlayed || 0
          }
        }

        const friendsRes = await apiFetch("http://localhost:3001/social/friends", {}, onTokenRefreshed, onLogout)
        if (friendsRes.ok) {
          const friendsData = await friendsRes.json()
          
          // Combine me + friends
          const allFriendCompetitors = [...friendsData]
          if (meEntry) {
            allFriendCompetitors.push(meEntry)
          }

          // Sort by rating desc
          allFriendCompetitors.sort((a, b) => (b.rating || 1000) - (a.rating || 1000))

          const mappedFriends = allFriendCompetitors.map((f: any, idx: number) => ({
            rank: idx + 1,
            name: f.username,
            avatarText: f.username.slice(0, 2).toUpperCase(),
            avatarColor: getAvatarColor(f.rating || 1000),
            score: f.rating || 1000,
            hs: f.gamesPlayed || 0,
            isSelf: currentUser && f.username === currentUser.username
          }))
          setFriendsPlayers(mappedFriends)
        }
      }
    } catch (err) {
      console.error("Error loading leaderboard standings:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeaderboardData()
  }, [activeTab])

  // Autocomplete matching scoring logic
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase().trim()
    const matches = activePlayers.map(player => {
      const name = player.name.toLowerCase()
      let matchScore = 0

      if (name === query) {
        matchScore = 100 // Perfect match
      } else if (name.startsWith(query)) {
        matchScore = 80  // Starts-with prefix match
      } else if (name.includes(query)) {
        matchScore = 50  // Contains substring match
      }

      return { player, matchScore }
    })
    .filter(item => item.matchScore > 0)
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore
      }
      return b.player.score - a.player.score // Secondary sort by points
    })
    .map(item => item.player)

    return matches.slice(0, 6)
  }

  const suggestions = getSearchSuggestions()

  // Handle clicking outside the search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectPlayer = (name: string) => {
    setHighlightedPlayer(name)
    setSearchQuery('')
    setIsSearchFocused(false)
    
    // Auto clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedPlayer(null)
    }, 3000)
  }

  // Find current user row
  const selfPlayer = activePlayers.find(p => p.isSelf)

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start p-6 pl-[60px] pr-[60px] pt-4 pb-[20px] max-w-[1280px] mx-auto w-full select-none text-left z-20 overflow-y-auto no-scrollbar">
      
      {/* Top Header Section */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 relative z-30">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 shadow-md">
            <Trophy size={20} className="text-violet-500 animate-pulse" />
          </div>
          <div>
            <h1 className={cn(
              "text-xl font-black uppercase tracking-tight",
              isBright ? "text-slate-900" : "text-white"
            )}>
              Leaderboard
            </h1>
            <p className={cn("text-[10px] font-extrabold opacity-60 tracking-wider", isBright ? "text-slate-500" : "text-slate-400")}>
              CODEWAR STATS RANKINGS
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Switch Global vs Friends */}
          <div className={cn(
            "p-1 rounded-2xl border flex items-center gap-1",
            isBright ? "bg-white/40 border-slate-200/50" : "bg-slate-950/40 border-white/5"
          )}>
            <button
              onClick={() => setActiveTab('global')}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase flex items-center gap-2 transition-all cursor-pointer",
                activeTab === 'global'
                  ? (isBright ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-950 shadow-md")
                  : "text-slate-500 hover:text-slate-400"
              )}
            >
              <Sparkles size={11} />
              Global
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase flex items-center gap-2 transition-all cursor-pointer",
                activeTab === 'friends'
                  ? (isBright ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-950 shadow-md")
                  : "text-slate-500 hover:text-slate-400"
              )}
            >
              <Users size={11} />
              Friends
            </button>
          </div>

          {/* Autocomplete Search Bar */}
          <div className="relative w-[280px]">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300",
              isSearchFocused
                ? "border-indigo-500 bg-slate-950/20 shadow-[0_0_12px_rgba(99,102,241,0.12)]"
                : (isBright ? "bg-white/40 border-slate-200/50" : "bg-slate-950/40 border-white/5")
            )}>
              <Search size={13} className="text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search player..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsSearchFocused(true)
                }}
                onFocus={() => setIsSearchFocused(true)}
                className={cn(
                  "bg-transparent border-none text-xs font-medium w-full focus:outline-none placeholder-slate-400",
                  isBright ? "text-slate-800" : "text-white"
                )}
              />
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchQuery.trim() && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "absolute left-0 right-0 top-full mt-2 rounded-2xl border p-2 shadow-2xl z-40 max-h-[280px] overflow-y-auto no-scrollbar",
                    isBright 
                      ? "bg-white/95 border-slate-200/80 backdrop-blur-xl" 
                      : "bg-[#0b0f19]/95 border-white/10 backdrop-blur-xl"
                  )}
                >
                  <div className="px-2 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Most Accurate Matches ({suggestions.length})
                  </div>
                  {suggestions.length > 0 ? (
                    <div className="space-y-1 mt-1">
                      {suggestions.map((player) => (
                        <button
                          key={player.name}
                          onClick={() => handleSelectPlayer(player.name)}
                          className={cn(
                            "w-full px-3 py-2 rounded-xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer",
                            isBright ? "hover:bg-slate-100" : "hover:bg-white/5"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white",
                              player.avatarColor
                            )}>
                              {player.avatarText}
                            </div>
                            <div>
                              <span className={cn(
                                "text-xs font-bold block",
                                isBright ? "text-slate-800" : "text-white"
                              )}>
                                {player.name}
                              </span>
                              <span className="text-[10px] text-violet-500 font-semibold">Rank #{player.rank}</span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-indigo-405">
                            {player.score} ELO
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500 font-medium">
                      No matching players found.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="w-full flex-grow flex flex-col min-h-0 relative z-10">
        
        {/* Table Headers */}
        <div className={cn(
          "w-full grid grid-cols-4 px-5 py-2.5 border-b text-[11px] font-extrabold uppercase tracking-wider mb-2",
          isBright ? "border-slate-200/50 text-slate-500" : "border-white/5 text-slate-400"
        )}>
          <div>Position</div>
          <div>Player</div>
          <div className="text-right">Points</div>
          <div className="text-right pr-4">Matches</div>
        </div>

        {/* Rows Client Area */}
        <div className="flex-grow overflow-y-auto no-scrollbar py-1.5 space-y-2 max-h-[460px]">
          {loading && activePlayers.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={24} className="animate-spin text-slate-500" />
            </div>
          ) : activePlayers.length > 0 ? (
            activePlayers.map((player) => {
              const isHighlight = highlightedPlayer === player.name
              
              let borderStyle = isBright ? "border-white/50" : "border-white/5"
              let bgStyle = isBright 
                ? "bg-white/25 border-white/50 backdrop-blur-md"
                : "bg-slate-950/20 border-white/5 backdrop-blur-md"
              let laurels = null

              if (player.rank === 1) {
                borderStyle = isBright ? "border-amber-400/80" : "border-amber-500/25"
                bgStyle = isBright 
                  ? "bg-gradient-to-r from-amber-50/70 via-white/40 to-amber-50/20" 
                  : "bg-gradient-to-r from-amber-950/15 via-[#0b0f19]/75 to-amber-950/5"
                laurels = "👑"
              } else if (player.rank === 2) {
                borderStyle = isBright ? "border-slate-400/70" : "border-slate-500/15"
                bgStyle = isBright 
                  ? "bg-gradient-to-r from-slate-100/70 via-white/40 to-slate-50/20" 
                  : "bg-gradient-to-r from-slate-800/15 via-[#0b0f19]/75 to-slate-800/5"
                laurels = "⭐"
              } else if (player.rank === 3) {
                borderStyle = isBright ? "border-orange-400/60" : "border-orange-500/15"
                bgStyle = isBright 
                  ? "bg-gradient-to-r from-orange-50/70 via-white/40 to-orange-50/20" 
                  : "bg-gradient-to-r from-orange-950/15 via-[#0b0f19]/75 to-orange-950/5"
                laurels = "🔥"
              }

              let customShadow = "0 2px 6px rgba(0,0,0,0.01)"
              if (isHighlight) {
                customShadow = "0 12px 24px rgba(99, 102, 241, 0.18)"
              } else if (player.rank === 1) {
                customShadow = isBright 
                  ? "0 8px 24px rgba(245, 158, 11, 0.06), 0 2px 6px rgba(0, 0, 0, 0.02)" 
                  : "0 10px 25px rgba(0, 0, 0, 0.35)"
              } else if (player.rank === 2) {
                customShadow = isBright 
                  ? "0 8px 24px rgba(100, 116, 139, 0.06), 0 2px 6px rgba(0, 0, 0, 0.02)" 
                  : "0 10px 25px rgba(0, 0, 0, 0.35)"
              } else if (player.rank === 3) {
                customShadow = isBright 
                  ? "0 8px 24px rgba(249, 115, 22, 0.06), 0 2px 6px rgba(0, 0, 0, 0.02)" 
                  : "0 10px 25px rgba(0, 0, 0, 0.35)"
              } else {
                customShadow = isBright 
                  ? "0 6px 20px rgba(28, 20, 50, 0.03), 0 2px 6px rgba(28, 20, 50, 0.01)" 
                  : "0 8px 25px rgba(0, 0, 0, 0.3)"
              }

              return (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: isHighlight ? 1.025 : 1,
                    boxShadow: customShadow
                  }}
                  whileHover={{
                    scale: 1.012,
                    y: -2,
                    borderColor: player.rank === 1 
                      ? "rgba(245, 158, 11, 0.5)" 
                      : player.rank === 2
                      ? "rgba(100, 116, 139, 0.4)"
                      : player.rank === 3
                      ? "rgba(249, 115, 22, 0.4)"
                      : isBright 
                      ? "rgba(255, 255, 255, 0.75)" 
                      : "rgba(255, 255, 255, 0.18)",
                    boxShadow: player.rank === 1
                      ? (isBright ? "0 12px 30px rgba(245, 158, 11, 0.15)" : "0 16px 36px rgba(245, 158, 11, 0.06)")
                      : player.rank === 2
                      ? (isBright ? "0 12px 30px rgba(100, 116, 139, 0.12)" : "0 16px 36px rgba(100, 116, 139, 0.06)")
                      : player.rank === 3
                      ? (isBright ? "0 12px 30px rgba(249, 115, 22, 0.12)" : "0 16px 36px rgba(249, 115, 22, 0.06)")
                      : isBright 
                      ? "0 12px 28px rgba(28, 20, 50, 0.06)" 
                      : "0 14px 30px rgba(0, 0, 0, 0.45)"
                  }}
                  transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
                  className={cn(
                    "w-full grid grid-cols-4 items-center px-5 py-2.5 rounded-2xl border relative overflow-hidden group",
                    borderStyle,
                    bgStyle,
                    isHighlight && "border-indigo-500 bg-indigo-500/5"
                  )}
                >
                  {isHighlight && (
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none animate-pulse" />
                  )}

                  {/* Column 1: Rank Position */}
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-xs font-black italic tracking-tighter flex items-center justify-center rounded-lg w-7 h-7 shrink-0",
                      player.rank === 1 && "text-amber-500 bg-amber-500/10 border border-amber-500/20",
                      player.rank === 2 && "text-slate-400 bg-slate-400/10 border border-slate-400/20",
                      player.rank === 3 && "text-orange-505 bg-orange-500/10 border border-orange-500/20",
                      player.rank > 3 && (isBright ? "text-slate-600 bg-slate-100" : "text-slate-400 bg-slate-900/60")
                    )}>
                      {player.rank}
                    </span>
                    {laurels && (
                      <span className="text-xs font-semibold filter drop-shadow">
                        {laurels}
                      </span>
                    )}
                  </div>

                  {/* Column 2: Player Profile info */}
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-[34px] h-[34px] rounded-xl flex items-center justify-center font-black text-xs text-white shadow-sm relative overflow-hidden shrink-0",
                      player.avatarColor
                    )}>
                      {player.avatarText}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    </div>
                    <div>
                      <span className={cn(
                        "font-bold text-xs block",
                        isBright ? "text-slate-805" : "text-white"
                      )}>
                        {player.name}
                        {player.isSelf && " (You)"}
                      </span>
                      <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">
                        {player.score >= 1800 ? 'Diamond' : player.score >= 1600 ? 'Platinum' : player.score >= 1400 ? 'Gold' : 'Silver'}
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Points ELO */}
                  <div className={cn(
                    "text-right text-sm font-black font-mono tracking-tight",
                    isBright ? "text-slate-950" : "text-white"
                  )}>
                    {player.score}
                  </div>

                  {/* Column 4: Matches played */}
                  <div className={cn(
                    "text-right font-mono font-bold pr-4 text-xs",
                    isBright ? "text-slate-605" : "text-slate-300"
                  )}>
                    {player.hs}
                  </div>

                </motion.div>
              )
            })
          ) : (
            <div className="text-center py-10 text-xs font-semibold uppercase text-slate-500 tracking-wider">
              No competitors ranked yet.
            </div>
          )}
        </div>

        {/* Sticky bottom row for current user standing */}
        {selfPlayer && (
          <div className="pt-3.5 mt-auto">
            <div className="px-2 py-0.5 text-[9px] font-black uppercase text-indigo-500 tracking-wider flex items-center gap-1.5 mb-1.5">
              <Star size={10} className="animate-spin-slow" />
              Your Standing Position
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: highlightedPlayer === selfPlayer.name ? 1.025 : 1,
                boxShadow: isBright 
                  ? "0 8px 24px rgba(99, 102, 241, 0.06)" 
                  : "0 10px 30px rgba(99, 102, 241, 0.08)"
              }}
              whileHover={{
                scale: 1.012,
                y: -2,
                borderColor: "rgba(99, 102, 241, 0.8)",
                boxShadow: isBright 
                  ? "0 16px 36px rgba(99, 102, 241, 0.15)" 
                  : "0 16px 36px rgba(99, 102, 241, 0.22)"
              }}
              transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
              className={cn(
                "w-full grid grid-cols-4 items-center px-5 py-3 rounded-2xl border-2 relative overflow-hidden",
                isBright 
                  ? "bg-gradient-to-r from-indigo-50/80 to-white/95 border-indigo-500/60 text-slate-805" 
                  : "bg-gradient-to-r from-indigo-950/20 to-slate-950/85 border-indigo-500/40 text-white"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none animate-pulse" />

              {/* Position rank */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-black italic tracking-tighter flex items-center justify-center rounded-lg w-7 h-7 shrink-0 bg-indigo-500 text-white border border-indigo-400">
                  {selfPlayer.rank}
                </span>
                <span className="text-[10px] font-black tracking-widest text-indigo-500 uppercase">
                  YOU
                </span>
              </div>

              {/* Player info */}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-[34px] h-[34px] rounded-xl flex items-center justify-center font-black text-xs text-white shadow-sm relative overflow-hidden shrink-0",
                  selfPlayer.avatarColor
                )}>
                  {selfPlayer.avatarText}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                </div>
                <div>
                  <span className="font-bold text-xs block">
                    {selfPlayer.name}
                  </span>
                  <span className="text-[9px] text-violet-400 font-bold uppercase tracking-wider">
                    {selfPlayer.score >= 1800 ? 'Diamond Tier' : selfPlayer.score >= 1600 ? 'Platinum Tier' : 'Gold Tier'}
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="text-right text-sm font-black font-mono tracking-tight text-indigo-500">
                {selfPlayer.score}
              </div>

              {/* Matches played */}
              <div className="text-right font-mono font-bold pr-4 text-xs text-indigo-500">
                {selfPlayer.hs}
              </div>

            </motion.div>
          </div>
        )}

      </div>

    </div>
  )
}
