import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FloatingSidebar } from '@/components/layout'
import { cn } from '@/utils'
import { CheckCircle2, BookOpen, Check } from 'lucide-react'
import { MatchLoadingScreen } from './MatchLoadingScreen'
import { LeaderboardScreen } from '../leaderboard/LeaderboardScreen'
import { FriendsPanel } from '../friends/FriendsPanel'
import { ChatPanel } from '../friends/ChatPanel'
import { SettingsPanel } from '../settings/SettingsPanel'
import { LobbyCustomizerPanel } from '../settings/LobbyCustomizerPanel'
import customEntityImg from '@/assets/images/screen/avatar/Entity.png'
import customShadowImg from '@/assets/images/screen/avatar/Shadow.png'
import customShadowBg from '@/assets/images/screen/background/shadow_bg.png'
import customHellBg from '@/assets/images/screen/background/Hell.png'

// Import modular Arena UI components
import { ArenaLayout } from '@/components/arena/ArenaLayout'
import { ArenaTopbar } from '@/components/arena/ArenaTopbar'
import { ProblemPanel } from '@/components/arena/ProblemPanel'
import { EditorToolbar } from '@/components/arena/EditorToolbar'
import { CodeEditor } from '@/components/arena/CodeEditor'
import { LobbySidebar } from '@/components/arena/LobbySidebar'
import { ConsolePanel } from '@/components/arena/ConsolePanel'

import { io, Socket } from 'socket.io-client'

// Import modular bright theme components
import { HomeTopBar } from './HomeTopBar'
import { HomeHero } from './HomeHero'
import { HomeFocusCard } from './HomeFocusCard'
import { IdentityHero } from './IdentityHero'
import { HomeActionCard } from './HomeActionCard'
import { HomeRecentActivity } from './HomeRecentActivity'
import { config as voidConfig } from '@/assets/identities/void/config'

// Viewport-fixed ambient drifting gradients (Framer Motion driven) - used only in Dark Theme
function AnimatedBackground() {
  return (
    <div className="bg-glow-container">
      <motion.div
        className="ambient ambient-blue"
        animate={{
          x: [-120, 180, 80, -100, -120],
          y: [40, -60, 120, 40, 40],
          scale: [1, 1.08, 0.95, 1, 1],
        }}
        transition={{
          duration: 70,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="ambient ambient-purple"
        animate={{
          x: [120, -100, 40, 150, 120],
          y: [-50, 80, -80, 60, -50],
          scale: [0.95, 1.05, 0.9, 1.08, 0.95],
        }}
        transition={{
          duration: 82,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}

const dummyCode = `// type your code here
import * as fs from 'fs';`

export function EmptyHomePage() {
  const [activeId, setActiveId] = useState('play')
  const [showFriendsPanel, setShowFriendsPanel] = useState(false)
  const [activeChatFriend, setActiveChatFriend] = useState<string | null>(null)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy')
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Array'])
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const [themeMode, setThemeMode] = useState<'bright' | 'dark'>('bright')
  const [customAvatar, setCustomAvatar] = useState('dread')
  const [customBackground, setCustomBackground] = useState('purple')
  const [showLobbySettings, setShowLobbySettings] = useState(false)
  const [inRoom, setInRoom] = useState(false) // Starts outside room in the new Home Dashboard direction
  const [language, setLanguage] = useState('TypeScript')
  const [theme, setTheme] = useState('Glass Dark')
  const [codeValue, setCodeValue] = useState(dummyCode)

  const [matchState, setMatchState] = useState<'idle' | 'searching' | 'loading'>('idle')
  const [selectedMatchType, setSelectedMatchType] = useState('Ranked 2v2')
  const [searchTimer, setSearchTimer] = useState(0)

  // Socket & Auth States
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<any>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null)
  const [socket, setSocket] = useState<Socket | null>(null)
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authUsername, setAuthUsername] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)

  // Matchmaking lobby/acceptance states
  const [matchmakingLobbyId, setMatchmakingLobbyId] = useState<string | null>(null)
  const [lobbyPlayers, setLobbyPlayers] = useState<{ id: string; username: string }[]>([])
  const [acceptedPlayerIds, setAcceptedPlayerIds] = useState<string[]>([])
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [acceptCountdown, setAcceptCountdown] = useState(15)

  // Active game room state
  const [roomState, setRoomState] = useState<any>(null)
  const [currentMatchState, setCurrentMatchState] = useState<any>(null)
  const [matchStartedAt, setMatchStartedAt] = useState<string | null>(null)
  const [matchResult, setMatchResult] = useState<{
    status: 'VICTORY' | 'DEFEAT' | 'ABORTED'
    winnerUsername?: string
    reason?: string
  } | null>(null)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [activeProblem, setActiveProblem] = useState<any>(null)
  const [loadingProblem, setLoadingProblem] = useState(false)
  const [activeSubmission, setActiveSubmission] = useState<any>(null)
  const [submissionsHistory, setSubmissionsHistory] = useState<any[]>([])
  const [typingMap, setTypingMap] = useState<Record<string, boolean>>({})
  const [statusMap, setStatusMap] = useState<Record<string, string>>({})
  const [lobbyMessages, setLobbyMessages] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])

  const socketRef = useRef<Socket | null>(null)

  // Establish socket connection on token load
  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setSocket(null)
      }
      return
    }

    const s = io("ws://localhost:3002", {
      auth: { token }
    })
    socketRef.current = s
    setSocket(s)

    s.on("connect", () => {
      console.log("Connected to CodeWar WebSocket server")
    })

    s.on("queue:status", (envelope: any) => {
      const { state } = envelope.payload
      if (state === 'QUEUED') {
        setMatchState('searching')
      } else if (state === 'IDLE') {
        setMatchState('idle')
      }
    })

    s.on("match:found", (envelope: any) => {
      const { matchmakerMatchId, players } = envelope.payload
      setMatchmakingLobbyId(matchmakerMatchId)
      setLobbyPlayers(players || [])
      setAcceptedPlayerIds([])
      // Auto accept the match immediately and skip the modal
      s.emit("match:accept")
    })

    s.on("match:accepted", (envelope: any) => {
      const { acceptedPlayerIds } = envelope.payload
      setAcceptedPlayerIds(acceptedPlayerIds)
    })

    s.on("match:declined", () => {
      setShowAcceptModal(false)
      setMatchmakingLobbyId(null)
      setMatchState('idle')
    })

    s.on("match.started", (envelope: any) => {
      const matchStateData = envelope.payload
      setCurrentMatchState(matchStateData)
      setMatchStartedAt(matchStateData.startedAt)
      setShowAcceptModal(false)
      setMatchState('loading') // triggers the MatchLoadingScreen
    })

    s.on("match.finished", (envelope: any) => {
      const { winnerUserId } = envelope.payload
      setMatchResult({
        status: winnerUserId === user?.id ? 'VICTORY' : 'DEFEAT',
        winnerUsername: winnerUserId === user?.id ? user?.username : 'Opponent'
      })
    })

    s.on("match.aborted", (envelope: any) => {
      const { reason } = envelope.payload
      setMatchResult({
        status: 'ABORTED',
        reason: reason || 'Match was aborted'
      })
    })

    s.on("room.updated", (envelope: any) => {
      const freshRoomState = envelope.payload
      setRoomState(freshRoomState)
    })

    s.on("submission.updated", (envelope: any) => {
      const payload = envelope.payload || envelope
      const { submissionId, status, verdict, timeMs, memoryMb } = payload

      setActiveSubmission((prev: any) => {
        if (prev && prev.id === submissionId) {
          return {
            ...prev,
            status,
            verdict,
            timeMs,
            memoryMb
          }
        }
        return prev
      })

      if (status === 'COMPLETED' || status === 'FAILED') {
        socketRef.current?.emit("room:status", { status: verdict || status })
        
        fetch(`http://localhost:3001/submissions/${submissionId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data => {
          setActiveSubmission({
            id: data.id,
            status: data.status,
            verdict: data.verdict,
            timeMs: data.timeMs,
            memoryMb: data.memoryMb,
            error: data.error
          })

          setSubmissionsHistory(prev => {
            if (prev.some(s => s.id === data.id)) {
              return prev.map(s => s.id === data.id ? data : s)
            }
            return [data, ...prev]
          })
        })
        .catch(err => {
          console.error("Failed to fetch full submission details:", err)
        })
      }
    })

    s.on("room:typing:state", (envelope: any) => {
      const payload = envelope.payload || envelope
      const { userId, isTyping } = payload
      setTypingMap(prev => ({ ...prev, [userId]: isTyping }))
    })

    s.on("room:status:state", (envelope: any) => {
      const payload = envelope.payload || envelope
      const { userId, status } = payload
      setStatusMap(prev => ({ ...prev, [userId]: status }))
    })

    s.on("room:chat:message", (msg: any) => {
      const isMe = msg.senderId === user?.id
      setLobbyMessages(prev => [...prev, {
        id: String(Date.now() + Math.random()),
        sender: isMe ? 'You' : msg.senderName,
        text: msg.content,
        isTeammate: true,
        time: 'Just now'
      }])
    })

    return () => {
      s.disconnect()
      socketRef.current = null
      setSocket(null)
    }
  }, [token])

  // Accept countdown timer
  useEffect(() => {
    let interval: any = null
    if (showAcceptModal && acceptCountdown > 0) {
      interval = setInterval(() => {
        setAcceptCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showAcceptModal, acceptCountdown])

  // Fetch problem details when match starts
  useEffect(() => {
    if (!currentMatchState || !currentMatchState.problemId) {
      setActiveProblem(null)
      return
    }

    const fetchProblem = async () => {
      setLoadingProblem(true)
      try {
        const res = await fetch(`http://localhost:3001/problems/${currentMatchState.problemId}`)
        if (res.ok) {
          const data = await res.json()
          setActiveProblem(data)
        } else {
          console.error("Failed to fetch problem:", res.statusText)
        }
      } catch (err) {
        console.error("Error fetching problem details:", err)
      } finally {
        setLoadingProblem(false)
      }
    }

    fetchProblem()
  }, [currentMatchState])

  // Sync code template when language changes or problem loads
  useEffect(() => {
    if (!activeProblem) return
    const lowerLang = language.toLowerCase()
    const langTemplate = activeProblem.latestVersion?.languages?.[lowerLang]?.template || 
                         activeProblem.latestVersion?.languages?.typescript?.template || 
                         "// Write your code here"
    setCodeValue(langTemplate)
  }, [language, activeProblem])

  // Standard search timer counting up
  useEffect(() => {
    let interval: any = null
    if (matchState === 'searching') {
      setSearchTimer(0)
      interval = setInterval(() => {
        setSearchTimer((prev) => prev + 1)
      }, 1000)
    } else {
      setSearchTimer(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [matchState])

  const startSearch = (type: string) => {
    setSelectedMatchType(type)
    setMatchState('searching')
    const mode = type === 'Ranked 2v2' ? '2v2' : 'solo'
    socketRef.current?.emit("queue:join", { mode })
  }

  const cancelSearch = () => {
    setMatchState('idle')
    socketRef.current?.emit("queue:leave")
  }

  const handleCodeSubmit = async (isRun: boolean) => {
    if (!activeProblem) return

    setActiveSubmission({
      status: 'PENDING',
      verdict: null,
      timeMs: null,
      memoryMb: null,
      error: null
    })

    socket?.emit("room:status", { status: isRun ? "Running tests" : "Submitting" })

    try {
      const res = await fetch("http://localhost:3001/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: activeProblem.id,
          code: codeValue,
          language: language.toLowerCase()
        })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        setActiveSubmission({
          status: 'FAILED',
          error: errorData.message || "Failed to submit code to server"
        })
        socket?.emit("room:status", { status: "Coding" })
      } else {
        const data = await res.json()
        setActiveSubmission({
          id: data.id,
          status: data.status,
          verdict: data.verdict,
          timeMs: data.timeMs,
          memoryMb: data.memoryMb,
          error: null
        })
      }
    } catch (err) {
      console.error("Submission failed:", err)
      setActiveSubmission({
        status: 'FAILED',
        error: "Connection error: Failed to reach API server"
      })
      socket?.emit("room:status", { status: "Coding" })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setShowSettingsPanel(false)
  }

  const handleTabChange = (id: string) => {
    if (id === 'friends') {
      setShowFriendsPanel(prev => {
        const next = !prev
        if (!next) {
          setActiveChatFriend(null)
        }
        return next
      })
    } else {
      setActiveId(id)
      setShowFriendsPanel(false)
      setActiveChatFriend(null)
    }
  }

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    )
  }

  const avatarConfigs: Record<string, { name: string; glowColor: string; image: string }> = {
    dread: {
      name: 'Dread Knight',
      glowColor: 'rgba(124, 58, 237, 0.18)',
      image: voidConfig.avatar
    },
    entity: {
      name: 'Entity',
      glowColor: 'rgba(6, 182, 212, 0.18)',
      image: customEntityImg
    },
    shadow: {
      name: 'Shadow',
      glowColor: 'rgba(147, 51, 234, 0.18)',
      image: customShadowImg
    }
  }

  const backgroundConfigs: Record<string, { name: string; image: string }> = {
    purple: {
      name: 'Purple Atmosphere',
      image: voidConfig.background
    },
    shadow: {
      name: 'Shadow Realm',
      image: customShadowBg
    },
    hell: {
      name: 'Hell',
      image: customHellBg
    }
  }

  const avatarOptions = [
    { id: 'dread', name: 'Dread Knight', glowColor: 'rgba(124, 58, 237, 0.18)', filterStyle: 'none', image: voidConfig.avatar },
    { id: 'entity', name: 'Entity', glowColor: 'rgba(6, 182, 212, 0.18)', filterStyle: 'none', image: customEntityImg },
    { id: 'shadow', name: 'Shadow', glowColor: 'rgba(147, 51, 234, 0.18)', filterStyle: 'none', image: customShadowImg }
  ]

  const backgroundOptions = [
    { id: 'purple', name: 'Purple Atmosphere', filterStyle: 'none', baseImage: voidConfig.background },
    { id: 'shadow', name: 'Shadow Realm', filterStyle: 'none', baseImage: customShadowBg },
    { id: 'hell', name: 'Hell', filterStyle: 'none', baseImage: customHellBg }
  ]

  const isBright = themeMode === 'bright'

  // Interactive Play Matchmaking Dashboard - Rebuilt with Bright Apple + Arc + Linear Design Language
  const renderPlayDashboard = () => {
    return (
      <div className="flex-1 flex flex-col h-full bg-transparent overflow-visible pl-[40px] pr-[40px] pt-[2px] pb-[16px] max-w-[1440px] mx-auto w-full select-none text-left">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-row items-stretch mt-2 gap-8 overflow-visible min-h-0">
          
          {/* Left + Center Area (Flex Column) */}
          <div className="flex-grow flex flex-col justify-between h-full overflow-visible min-w-0">
            
            {/* Main Top Content (Left Column + Center Column) */}
            <div className="flex-grow flex flex-col lg:flex-row items-stretch gap-8 overflow-visible min-h-0">
              {/* Left Column: Heading & Focus Card */}
              <motion.div 
                animate={matchState === 'loading' ? { x: -400, opacity: 0 } : { x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full lg:w-[35%] min-w-[280px] max-w-[330px] shrink-0 flex flex-col justify-between py-2 gap-4 overflow-visible relative z-20"
              >
                <HomeHero username={user?.username} isBright={isBright} />
                <HomeFocusCard 
                  matchState={matchState}
                  searchTimer={searchTimer}
                  selectedMatchType={selectedMatchType}
                  onCancel={cancelSearch}
                  onStartSearch={() => startSearch('Ranked Solo')}
                  onOptionsClick={() => setShowOptionsModal(true)}
                />
              </motion.div>

              {/* Center Column: Identity Hero (Avatar) */}
              <motion.div 
                animate={matchState === 'loading' ? { scale: 0.75, opacity: 0, y: 40 } : { scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex-grow min-h-0 flex items-center justify-center relative overflow-visible z-10"
              >
                <IdentityHero 
                  isActive={activeId === 'play'} 
                  identity={{
                    ...voidConfig,
                    avatar: avatarConfigs[customAvatar].image,
                    glowColor: avatarConfigs[customAvatar].glowColor
                  }}
                />
              </motion.div>
            </div>

            {/* Bottom Panel: Recent Activity */}
            <motion.div 
              animate={matchState === 'loading' ? { y: 200, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-[110px] mt-4 shrink-0 overflow-visible relative z-20"
            >
              <HomeRecentActivity />
            </motion.div>
          </div>

          {/* Right Column: Action Cards stacked vertically */}
          <motion.div 
            animate={matchState === 'loading' ? { x: 400, opacity: 0 } : { x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[300px] shrink-0 flex flex-col gap-[20px] justify-center py-2 overflow-visible relative z-20"
          >
            <HomeActionCard 
              title="Ranked 2v2" 
              subtitle="Compete and climb" 
              type="ranked-2v2" 
              onClick={() => startSearch('Ranked 2v2')}
            />

            <HomeActionCard 
              title="Ranked Solo" 
              subtitle="Prove your limits" 
              type="ranked-solo" 
              onClick={() => startSearch('Ranked Solo')}
            />
            <HomeActionCard 
              title="Custom Match" 
              subtitle="Create or join a room" 
              type="custom" 
              onClick={() => startSearch('Custom Match')}
            />
          </motion.div>
        </div>
      </div>
    )
  }

  // Subpage wrapper to show which tab is currently active (fully unified to eliminate layout thrashing)
  const renderMainContent = () => {
    return (
      <div className="flex h-screen bg-transparent text-slate-655 overflow-hidden relative">
        {/* Left Sidebar Spacer: Unified and locked at 120px to keep dock position absolute-stable */}
        <motion.div 
          animate={matchState === 'loading' ? { x: -140, opacity: 0 } : { x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-[120px] flex-shrink-0 relative z-10"
        >
          <FloatingSidebar 
            activeId={showFriendsPanel ? 'friends' : activeId} 
            onChangeActiveId={handleTabChange} 
            inRoom={inRoom}
            onSettingsClick={() => setShowSettingsPanel(prev => !prev)}
          />
        </motion.div>

        {/* Friends side panel drawer */}
        <FriendsPanel 
          isOpen={showFriendsPanel}
          onClose={() => {
            setShowFriendsPanel(false)
            setActiveChatFriend(null)
          }}
          isBright={isBright}
          onOpenChat={(friendName) => setActiveChatFriend(prev => prev === friendName ? null : friendName)}
          activeChatFriend={activeChatFriend}
          socket={socket}
          token={token}
          onLogout={handleLogout}
        />

        {/* Chat side panel drawer */}
        <ChatPanel
          isOpen={!!activeChatFriend && showFriendsPanel}
          friendName={activeChatFriend || ''}
          onClose={() => setActiveChatFriend(null)}
          isBright={isBright}
        />

        {/* Settings panel drawer */}
        <SettingsPanel
          isOpen={showSettingsPanel}
          onClose={() => setShowSettingsPanel(false)}
          isBright={isBright}
          themeMode={themeMode}
          onToggleTheme={() => setThemeMode(prev => prev === 'bright' ? 'dark' : 'bright')}
          user={user}
          onLogout={handleLogout}
          onUpdateUser={(updatedUser) => setUser(updatedUser)}
          onUpdateToken={setToken}
        />
        
        {/* Right content viewport container */}
        <div className="flex-1 flex overflow-hidden relative z-10 bg-transparent min-w-0">
          
          {/* View 1: Main Dashboards (Play & Other Tabs) */}
          <div 
            className="absolute inset-0 flex flex-col transition-[transform,opacity] duration-300 ease-out"
            style={{
              opacity: !inRoom ? 1 : 0,
              visibility: !inRoom ? 'visible' : 'hidden',
              pointerEvents: !inRoom ? 'auto' : 'none',
              transform: !inRoom ? 'translate3d(0, 0, 0)' : 'translate3d(0, 15px, 0)',
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: !inRoom ? 20 : 10
            }}
          >
            {/* Top Bar - Spans full width at the top with matching layout padding alignment */}
            <motion.div 
              animate={matchState === 'loading' ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pl-[40px] pr-[40px] w-full flex-shrink-0"
            >
              <HomeTopBar />
            </motion.div>
            
            {/* Dashboard Content Client Viewport */}
            <div className="flex-grow min-h-0 relative w-full h-full">
              {/* Play Dashboard Container */}
              <div 
                className="transition-[transform,opacity] duration-300 ease-out"
                style={{
                  opacity: (activeId === 'play') ? 1 : 0,
                  visibility: (activeId === 'play') ? 'visible' : 'hidden',
                  pointerEvents: (activeId === 'play') ? 'auto' : 'none',
                  transform: (activeId === 'play') ? 'translate3d(0,0,0) scale(1)' : 'translate3d(0,0,0) scale(0.985)',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  inset: 0
                }}
              >
                {renderPlayDashboard()}
              </div>

              {/* Other Dashboards Container */}
              {activeId === 'ranked' && (
                <LeaderboardScreen isBright={isBright} />
              )}

              {activeId !== 'play' && activeId !== 'ranked' && (
                <div className="flex-1 flex flex-col justify-center items-center p-8 select-none bg-transparent h-full">
                  <motion.div 
                    key={activeId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={cn(
                      "text-center p-10 max-w-md rounded-3xl shadow-2xl relative",
                      isBright ? "glass-card border-purple-200/30 text-slate-600" : "bg-[#070b13]/55 border border-slate-900/60 text-slate-200"
                    )}
                  >
                    {!isBright && <div className="absolute -inset-1 rounded-3xl bg-blue-500/5 blur-xl pointer-events-none" />}
                    
                    <h1 className={cn("text-xl font-bold tracking-wide uppercase mb-3", isBright ? "text-[#1E1B4B]" : "text-slate-100")}>
                      {activeId.charAt(0).toUpperCase() + activeId.slice(1)} Dashboard
                    </h1>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      You are currently viewing the {activeId} area. This interface simulates integration with our premium navigation routing context.
                    </p>
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          {/* View 2: Arena Layout - Dynamically mounted in the same DOM tree, transition via CSS */}
          <div 
            className="absolute inset-0 flex flex-col transition-[transform,opacity] duration-300 ease-out animate-fade-in"
            style={{
              opacity: inRoom ? 1 : 0,
              visibility: inRoom ? 'visible' : 'hidden',
              pointerEvents: inRoom ? 'auto' : 'none',
              transform: inRoom ? 'translate3d(0, 0, 0)' : 'translate3d(0, -15px, 0)',
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: inRoom ? 20 : 10
            }}
          >
            <ArenaLayout 
              isBright={isBright}
              topNav={
                <ArenaTopbar 
                  activeId={activeId}
                  onChangeActiveId={setActiveId}
                  inRoom={inRoom}
                  isBright={isBright}
                  matchStartedAt={matchStartedAt}
                  onLeave={() => {
                    setShowLeaveConfirm(true)
                  }}
                />
              }
              sidebar={null}
              problemPanel={
                activeProblem ? (
                  <ProblemPanel 
                    title={activeProblem.title}
                    difficulty={activeProblem.difficulty}
                    points={activeProblem.difficulty === 'EASY' ? 100 : activeProblem.difficulty === 'MEDIUM' ? 250 : 500}
                    acceptance="75%"
                    estTime={activeProblem.difficulty === 'EASY' ? "15 mins" : activeProblem.difficulty === 'MEDIUM' ? "30 mins" : "45 mins"}
                    memory={`${activeProblem.latestVersion?.memoryLimit || 256} MB`}
                    timeLimit={`${(activeProblem.latestVersion?.timeLimit || 1000) / 1000}s`}
                    statementHtml={activeProblem.latestVersion?.statement ? [activeProblem.latestVersion.statement] : []}
                    constraints={activeProblem.latestVersion?.constraints ? [activeProblem.latestVersion.constraints] : []}
                    examples={activeProblem.latestVersion?.examples || []}
                    tags={activeProblem.tags || []}
                    isBright={isBright}
                  />
                ) : (
                  <div className={cn(
                    "flex flex-col items-center justify-center h-full font-sans select-none text-xs gap-3",
                    isBright ? "text-slate-500 bg-white" : "text-slate-400 bg-slate-950"
                  )}>
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    Loading Arena Challenge...
                  </div>
                )
              }
              editorToolbar={
                <EditorToolbar 
                  filename={language.toLowerCase() === 'python' ? 'solution.py' : language.toLowerCase() === 'java' ? 'Solution.java' : 'solution.ts'}
                  activeLanguage={language}
                  onLanguageChange={setLanguage}
                  activeTheme={theme}
                  onThemeChange={setTheme}
                  isBright={isBright}
                  onReset={() => {
                    if (activeProblem) {
                      const lowerLang = language.toLowerCase()
                      const langTemplate = activeProblem.latestVersion?.languages?.[lowerLang]?.template || 
                                           activeProblem.latestVersion?.languages?.typescript?.template || 
                                           "// Write your code here"
                      setCodeValue(langTemplate)
                    } else {
                      setCodeValue(dummyCode)
                    }
                  }}
                  onRun={() => handleCodeSubmit(true)}
                  onSubmit={() => handleCodeSubmit(false)}
                />
              }
              codeEditor={
                <CodeEditor 
                  value={codeValue}
                  language={language}
                  theme={theme}
                  isBright={isBright}
                  onChange={setCodeValue}
                  onTyping={(isTyping) => socket?.emit("room:typing", { isTyping })}
                />
              }
              lobbySidebar={
                <LobbySidebar 
                  members={roomState ? Object.values(roomState.participants).map((p: any) => {
                    const isTyping = typingMap[p.userId]
                    const customStatus = statusMap[p.userId]
                    
                    let statusText = 'offline'
                    if (isTyping) {
                      statusText = 'typing'
                    } else if (customStatus) {
                      statusText = customStatus
                    } else if (p.isConnected) {
                      statusText = 'Coding'
                    }
                    
                    return {
                      name: p.username,
                      status: statusText
                    }
                  }) : []}
                  chatMessages={lobbyMessages}
                  onSendMessage={(text) => socket?.emit("room:chat", { content: text })}
                  typingUser={(() => {
                    const opponentUser = roomState ? Object.values(roomState.participants).find((p: any) => p.userId !== user?.id) : null
                    const isOpponentTyping = opponentUser ? typingMap[(opponentUser as any).userId] : false
                    return isOpponentTyping && opponentUser ? { name: (opponentUser as any).username, isTeammate: false } : null
                  })()}
                  isBright={isBright}
                />
              }
              consolePanel={
                <ConsolePanel 
                  isBright={isBright}
                  initialCollapsed={true}
                  examples={activeProblem?.latestVersion?.examples || []}
                  activeSubmission={activeSubmission}
                  submissions={submissionsHistory}
                />
              }
            />
          </div>

          {/* Match Loading Screen */}
          <AnimatePresence>
            {matchState === 'loading' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-transparent"
              >
                <MatchLoadingScreen 
                  isBright={isBright}
                  matchType={selectedMatchType}
                  myTeam={[
                    { 
                      name: user?.username || 'You', 
                      elo: user?.ratings?.[0]?.rating ?? 1000, 
                      language, 
                      avatarText: (user?.username || 'You').slice(0, 2).toUpperCase(), 
                      avatarColor: 'bg-indigo-600', 
                      accuracy: '100%', 
                      isSelf: true 
                    }
                  ]}
                  enemyTeam={[
                    {
                      name: (() => {
                        const opponent = roomState ? Object.values(roomState.participants).find((p: any) => p.userId !== user?.id) : null
                        return (opponent as any)?.username || 'Opponent'
                      })(),
                      elo: 1000,
                      language: 'TypeScript',
                      avatarText: (() => {
                        const opponent = roomState ? Object.values(roomState.participants).find((p: any) => p.userId !== user?.id) : null
                        return ((opponent as any)?.username || 'Opponent').slice(0, 2).toUpperCase()
                      })(),
                      avatarColor: 'bg-rose-600',
                      accuracy: '100%'
                    }
                  ]}
                  onLoadingComplete={() => {
                    setMatchState('idle')
                    setInRoom(true)
                    setActiveId('arena')
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  if (!token) {
    const handleAuthSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setAuthError(null)
      try {
        const url = authMode === 'login' 
          ? 'http://localhost:3001/auth/login' 
          : 'http://localhost:3001/auth/register'
        
        const body = authMode === 'login'
          ? { email: authEmail, password: authPassword }
          : { username: authUsername, email: authEmail, password: authPassword }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.message || 'Authentication failed')
        }

        let loginData = data
        if (authMode === 'register') {
          // auto log in
          const loginRes = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: authEmail, password: authPassword })
          })
          loginData = await loginRes.json()
        }

        localStorage.setItem('token', loginData.accessToken)
        localStorage.setItem('user', JSON.stringify(loginData.user))
        setToken(loginData.accessToken)
        setUser(loginData.user)
      } catch (err: any) {
        setAuthError(err.message)
      }
    }

    return (
      <div className={cn(
        "relative h-screen w-screen overflow-hidden flex items-center justify-center font-sans",
        isBright ? "bg-[#F7F8FC] text-[#1A1533]" : "bg-[#0E1118] text-[#1E1B4B]"
      )}>
        {/* Ambient glow backgrounds */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div 
            className="absolute"
            style={{
              top: '-300px',
              left: '-300px',
              width: '1200px',
              height: '1200px',
              background: 'radial-gradient(circle at center, #F2ECFF 0%, rgba(242, 236, 255, 0.15) 60%, transparent 80%)',
              opacity: 0.5,
              filter: 'blur(40px)',
            }}
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "w-[400px] rounded-[32px] p-8 border backdrop-blur-2xl z-20 flex flex-col gap-6 select-none",
            isBright
              ? "bg-white/80 border-slate-200/50 shadow-2xl text-slate-800"
              : "bg-[#070b13]/85 border-slate-900/60 shadow-[0_30px_70px_rgba(0,0,0,0.6)] text-white"
          )}
        >
          <div className="text-center space-y-2">
            <span className="text-[#7C3AED] font-black font-mono text-3xl tracking-tighter">&gt;_ CODEWAR</span>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {authMode === 'login' ? 'Welcome back, developer' : 'Create credentials'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Username</label>
                <input 
                  type="text" 
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  required
                  className={cn(
                    "w-full px-4 py-3 rounded-2xl border text-xs outline-none transition-all duration-200",
                    isBright 
                      ? "bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900" 
                      : "bg-slate-900/50 border-slate-800 focus:border-indigo-500 text-white"
                  )}
                  placeholder="username"
                />
              </div>
            )}

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Email Address</label>
              <input 
                type="email" 
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
                className={cn(
                  "w-full px-4 py-3 rounded-2xl border text-xs outline-none transition-all duration-200",
                  isBright 
                    ? "bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900" 
                    : "bg-slate-900/50 border-slate-800 focus:border-indigo-500 text-white"
                )}
                placeholder="developer@codewar.com"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Password</label>
              <input 
                type="password" 
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
                className={cn(
                  "w-full px-4 py-3 rounded-2xl border text-xs outline-none transition-all duration-200",
                  isBright 
                    ? "bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900" 
                    : "bg-slate-900/50 border-slate-800 focus:border-indigo-500 text-white"
                )}
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/10 text-[11px] font-bold text-center">
                {authError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider shadow-lg active:scale-[0.98] transition-all cursor-pointer"
            >
              {authMode === 'login' ? 'Sign In' : 'Register Account'}
            </button>
          </form>

          <div className="text-center mt-2">
            <button
              onClick={() => {
                setAuthMode(prev => prev === 'login' ? 'register' : 'login')
                setAuthError(null)
              }}
              className="text-[11px] font-extrabold uppercase text-indigo-500 hover:text-indigo-600 cursor-pointer"
            >
              {authMode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={cn(
      "relative h-screen w-screen overflow-hidden transition-colors duration-300",
      isBright ? "bg-[#F7F8FC] text-[#1A1533]" : "bg-[#0E1118] text-[#1E1B4B]"
    )}>
      {/* Light Theme Background: permanently mounted, fades in/out dynamically */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none transition-all duration-500 ease-in-out"
        style={{
          opacity: isBright ? 1 : 0,
          visibility: isBright ? 'visible' : 'hidden'
        }}
      >
        {/* Gradient 1 (Top Left): #FFF7F2, 1200px, opacity 0.45 */}
        <div 
          className="absolute"
          style={{
            top: '-300px',
            left: '-300px',
            width: '1200px',
            height: '1200px',
            background: 'radial-gradient(circle at center, #FFF7F2 0%, rgba(255, 247, 242, 0.4) 30%, rgba(255, 247, 242, 0.1) 60%, transparent 80%)',
            opacity: 0.45,
            filter: 'blur(20px)',
            willChange: 'transform'
          }}
        />
        {/* Gradient 2 (Top Center): #F2ECFF, 1500px, opacity 0.55 */}
        <div 
          className="absolute"
          style={{
            top: '-400px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '1500px',
            height: '1500px',
            background: 'radial-gradient(circle at center, #F2ECFF 0%, rgba(242, 236, 255, 0.4) 30%, rgba(242, 236, 255, 0.1) 60%, transparent 80%)',
            opacity: 0.55,
            filter: 'blur(20px)',
            willChange: 'transform'
          }}
        />
        {/* Gradient 3 (Bottom Right): #EEF3FF, 1200px, opacity 0.45 */}
        <div 
          className="absolute"
          style={{
            bottom: '-400px',
            right: '-300px',
            width: '1200px',
            height: '1200px',
            background: 'radial-gradient(circle at center, #EEF3FF 0%, rgba(238, 243, 255, 0.4) 30%, rgba(238, 243, 255, 0.1) 60%, transparent 80%)',
            opacity: 0.45,
            filter: 'blur(20px)',
            willChange: 'transform'
          }}
        />
        {/* Gradient 4 (Center Subtle): #F5EEFF, 900px, opacity 0.22 */}
        <div 
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '900px',
            height: '900px',
            background: 'radial-gradient(circle at center, #F5EEFF 0%, rgba(245, 238, 255, 0.4) 30%, rgba(245, 238, 255, 0.1) 60%, transparent 80%)',
            opacity: 0.22,
            filter: 'blur(20px)',
            willChange: 'transform'
          }}
        />

        {/* Panoramic Scenery Backdrop: Stretched to full-screen (absolute inset-0) to permanently hide container edges */}
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center hero-elliptical-mask-v3 z-10"
        >
          {/* Layer 1: Base Scenery Image - Renders pre-blurred WebP inside room to eliminate GPU Gaussian blur convolution overhead */}
          <img
            src={(inRoom || activeId === 'ranked') && customBackground === 'purple' 
              ? voidConfig.backgroundBlurred 
              : backgroundConfigs[customBackground].image}
            alt="Environment Backdrop"
            className="absolute inset-0 w-full h-full object-cover"
            decoding="async"
            style={{
              filter: (inRoom || activeId === 'ranked') ? 'blur(15px) brightness(0.85) contrast(0.95)' : 'none',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              willChange: 'filter, opacity'
            }}
          />

          {/* Layer 2: Asymmetrical Left/Right linear fade (Left transparent at 16%, Right starts fading at 88% to match reference) */}
          <div 
            className="absolute inset-0 pointer-events-none z-12"
            style={{
              background: isBright
                ? 'linear-gradient(90deg, #F7F8FC 0%, rgba(247, 248, 252, 0.8) 5%, transparent 16%, transparent 88%, rgba(247, 248, 252, 0.8) 96%, #F7F8FC 100%)'
                : 'linear-gradient(90deg, #090615 0%, rgba(9, 6, 21, 0.8) 5%, transparent 16%, transparent 88%, rgba(9, 6, 21, 0.8) 96%, #090615 100%)'
            }}
          />

          {/* Layer 3: Asymmetrical Top/Bottom linear fade (Top is soft 22% at 0%, transparent at 6%; Bottom starts fading at 78%) */}
          <div 
            className="absolute inset-0 pointer-events-none z-13"
            style={{
              background: 'linear-gradient(180deg, rgba(247, 248, 252, 0.22) 0%, transparent 6%, transparent 78%, rgba(247, 248, 252, 0.8) 90%, #F7F8FC 100%)'
            }}
          />

          {/* Layer 4: Elliptical radial fade overlay to cover corners - Expanded transparent viewport to 55% */}
          <div 
            className="absolute inset-0 pointer-events-none z-14"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 55%, rgba(247, 244, 255, 0.25) 72%, rgba(247, 248, 252, 0.9) 88%, #F7F8FC 100%)'
            }}
          />

          {/* Layer 4.5: Purple Volumetric Atmosphere overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-14"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(175, 120, 255, 0.25) 0%, transparent 70%)'
            }}
          />

          {/* Layer 6: Bottom Mist Overlay - maintained at 200px with smoother bottom-up gradient blending */}
          <div 
            className="absolute left-0 right-0 bottom-0 h-[200px] pointer-events-none z-15"
            style={{
              background: 'linear-gradient(to top, #F7F8FC 5%, #F7F4FF 30%, rgba(247, 244, 255, 0.35) 60%, transparent 100%)'
            }}
          />

          {/* Layer 9: Ambient Bloom box shadow */}
          <div
            className="absolute pointer-events-none select-none z-18"
            style={{
              width: '100%',
              height: '100%',
              boxShadow: '0 0 250px rgba(170, 120, 255, 0.15)',
              borderRadius: '40px',
              opacity: 0.8
            }}
          />
        </div>
      </div>

      {/* Dark Theme Background: permanently mounted, fades in/out dynamically */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none transition-all duration-500 ease-in-out"
        style={{
          opacity: isBright ? 0 : 1,
          visibility: isBright ? 'hidden' : 'visible'
        }}
      >
        <AnimatedBackground />
        <div className="workspace-vignette" />
        <div className="workspace-noise" />
      </div>

      {/* Main Page Layout Content */}
      <div className={cn("relative z-10 w-full h-full overflow-hidden", isBright && "light-theme")}>
        {activeId === 'ranked' && (
          <div 
            className="absolute inset-0 z-5 transition-all duration-500 ease-in-out pointer-events-none backdrop-blur-[12px]"
            style={{
              background: isBright 
                ? 'rgba(247, 248, 252, 0.45)' 
                : 'rgba(14, 17, 24, 0.5)'
            }}
          />
        )}
        {renderMainContent()}

        {/* Options Pop-up Window Modal */}
        <AnimatePresence>
          {showOptionsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 backdrop-blur-sm p-4"
            >
              {/* Modal Overlay Close (Clicked anywhere other than inside panel will close it) */}
              <div className="absolute inset-0 cursor-default" onClick={() => setShowOptionsModal(false)} />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.35, x: -300, y: 150 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.35, x: -300, y: 150 }}
                transition={{ type: 'spring', stiffness: 340, damping: 24 }}
                style={{
                  transformOrigin: 'bottom left',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)'
                }}
                className="relative w-[360px] rounded-[28px] border border-white/60 bg-white/70 backdrop-blur-2xl p-5 shadow-2xl flex flex-col gap-4 text-slate-800 z-10"
              >
                {/* Header (No cross X button) */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/40">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                      Options
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                      Customize Arena Parameters
                    </span>
                  </div>
                </div>

                {/* Difficulty Level Section */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider block">
                    Difficulty Level
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {['Basic', 'Easy', 'Medium', 'Hard'].map((diff) => {
                      const isSelected = selectedDifficulty === diff
                      return (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setSelectedDifficulty(diff)}
                          className={cn(
                            "py-2 rounded-xl text-xs font-bold transition-all duration-150 border cursor-pointer active:scale-95",
                            isSelected
                              ? "bg-indigo-500 border-indigo-400 text-white shadow-sm"
                              : "bg-white/50 hover:bg-white/80 border-slate-200/40 text-slate-700"
                          )}
                        >
                          {diff}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Topics Section */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider block">
                    Topics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['String', 'Array', 'LinkedList', 'Stack/Queue', 'Tree', 'DP', 'Hash Table'].map((topic) => {
                      const isSelected = selectedTopics.includes(topic)
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleTopic(topic)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase transition-all duration-150 border cursor-pointer flex items-center gap-1 active:scale-95",
                            isSelected
                              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600"
                              : "bg-white/50 hover:bg-white/80 border-slate-200/40 text-slate-600"
                        )}
                      >
                        {isSelected && <Check size={9} strokeWidth={3} />}
                        {topic}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={() => setShowOptionsModal(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black uppercase transition-all duration-150 cursor-pointer shadow-sm active:scale-95 text-center mt-2"
              >
                Confirm Setup
              </button>
            </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAcceptModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "w-[440px] rounded-[32px] p-6 border text-center relative",
                isBright 
                  ? "bg-white/90 border-slate-200/50 shadow-2xl text-slate-800"
                  : "bg-[#070b13]/90 border-slate-900/60 shadow-[0_30px_70px_rgba(0,0,0,0.6)] text-white"
              )}
            >
              <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full border border-indigo-500/20 text-indigo-500 text-xs font-mono font-bold">
                {acceptCountdown}s
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7C3AED]">Match Found!</span>
                  <h2 className={cn("text-xl font-bold mt-1", isBright ? "text-slate-900" : "text-white")}>Ready for Battle?</h2>
                </div>

                {/* Players info */}
                <div className="flex items-center justify-center gap-6 py-4">
                  {lobbyPlayers.map((p, idx) => {
                    const isAccepted = acceptedPlayerIds.includes(p.id)
                    return (
                      <div key={p.id} className="flex flex-col items-center gap-2">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs text-white relative",
                          idx === 0 ? "bg-indigo-600" : "bg-rose-600"
                        )}>
                          {p.username.slice(0, 2).toUpperCase()}
                          {isAccepted && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center">
                              <Check size={8} className="text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-semibold max-w-[100px] truncate">{p.username}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => socket?.emit("match:accept")}
                    className="flex-1 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
                  >
                    Accept Match
                  </button>
                  <button
                    onClick={() => socket?.emit("match:decline")}
                    className="flex-1 py-3 rounded-2xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {matchResult && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] flex items-center justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className={cn(
                "w-[420px] rounded-[36px] p-8 border text-center shadow-[0_30px_70px_rgba(0,0,0,0.6)] flex flex-col gap-6 relative select-none",
                isBright 
                  ? "bg-white/90 border-slate-200/50 text-slate-800"
                  : "bg-[#070b13]/90 border-slate-900/60 text-white"
              )}
            >
              <div className="space-y-2">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.25em] block",
                  matchResult.status === 'VICTORY' ? 'text-emerald-500' : matchResult.status === 'DEFEAT' ? 'text-rose-500' : 'text-amber-500'
                )}>
                  Match Outcome
                </span>
                
                <h2 className="text-3xl font-black tracking-tight uppercase">
                  {matchResult.status}
                </h2>
              </div>

              <div className={cn(
                "p-5 rounded-2xl border text-left space-y-3.5",
                isBright ? "bg-slate-50 border-slate-200/60" : "bg-slate-950/40 border-white/5"
              )}>
                {matchResult.status === 'VICTORY' && (
                  <p className="text-xs font-semibold leading-relaxed">
                     Congratulations! You conquered the Arena and emerged victorious. ELO rating has been updated.
                  </p>
                )}
                {matchResult.status === 'DEFEAT' && (
                  <p className="text-xs font-semibold leading-relaxed">
                     Opponent solved the challenge faster. Keep practicing to refine your speed and accuracy.
                  </p>
                )}
                {matchResult.status === 'ABORTED' && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Reason</span>
                    <p className="text-xs font-bold leading-relaxed">{matchResult.reason}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setInRoom(false)
                  setActiveId('play')
                  setRoomState(null)
                  setCurrentMatchState(null)
                  setMatchStartedAt(null)
                  setMatchResult(null)
                  setLobbyMessages([])
                }}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer active:scale-[0.97]"
              >
                Return to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Leave Confirmation Overlay Modal */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={cn(
                "w-[400px] rounded-[32px] p-6 border text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-5 relative select-none",
                isBright 
                  ? "bg-white/90 border-slate-200/50 text-slate-800"
                  : "bg-[#070b13]/90 border-slate-900/60 text-white"
              )}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 block">
                  Abandon Duel
                </span>
                <h2 className="text-xl font-bold tracking-tight">Are you sure?</h2>
              </div>

              <p className={cn(
                "text-xs leading-relaxed font-semibold p-4 rounded-2xl border",
                isBright ? "bg-rose-50/50 border-rose-200/40 text-slate-600" : "bg-rose-500/5 border-rose-500/10 text-rose-200"
              )}>
                Leaving the match now will result in an automatic forfeit. You will lose ELO rating.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowLeaveConfirm(false)
                    socket?.emit("room:leave", (res: any) => {
                      if (res && res.success) {
                        setInRoom(false)
                        setActiveId('play')
                        setRoomState(null)
                        setCurrentMatchState(null)
                        setMatchStartedAt(null)
                      }
                    })
                  }}
                  className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md"
                >
                  Yes, Abandon
                </button>
                
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className={cn(
                    "flex-1 py-3 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95",
                    isBright 
                      ? "border-slate-200 hover:bg-slate-50 text-slate-700" 
                      : "border-white/10 hover:bg-white/5 text-slate-300"
                  )}
                >
                  Keep Coding
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
