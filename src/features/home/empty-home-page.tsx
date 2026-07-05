import { useState, useEffect } from 'react'
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

const dummyCode = `export function findDuplicate(nums: number[]): number {
  // Floyd's Tortoise and Hare (Cycle Detection)
  let tortoise = nums[0];
  let hare = nums[0];
  
  do {
    tortoise = nums[tortoise];
    hare = nums[nums[hare]];
  } while (tortoise !== hare);
  
  // Find index where duplicate cycle starts...
  tortoise = nums[0];
  while (tortoise !== hare) {
    tortoise = nums[tortoise];
    hare = nums[hare];
  }
  
  return hare;
}`

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

  useEffect(() => {
    let interval: any = null
    if (matchState === 'searching') {
      setSearchTimer(0)
      interval = setInterval(() => {
        setSearchTimer((prev) => {
          const next = prev + 1
          if (next >= 3) {
            clearInterval(interval)
            setMatchState('loading')
            return 3
          }
          return next
        })
      }, 1000)
    } else {
      setSearchTimer(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [matchState])

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
                <HomeHero />
                <HomeFocusCard 
                  matchState={matchState}
                  searchTimer={searchTimer}
                  selectedMatchType={selectedMatchType}
                  onCancel={() => setMatchState('idle')}
                  onStartSearch={() => {
                    setSelectedMatchType('Ranked 2v2')
                    setMatchState('searching')
                  }}
                  onOptionsClick={() => setShowOptionsModal(true)}
                />
              </motion.div>

              {/* Center Column: Identity Hero (Avatar) */}
              <motion.div 
                animate={matchState === 'loading' ? { scale: 0.75, opacity: 0, y: 40 } : { scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 min-h-0 flex items-center justify-center relative overflow-visible z-10"
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
            animate={(matchState === 'loading' || showLobbySettings) ? { x: 400, opacity: 0 } : { x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[300px] shrink-0 flex flex-col gap-[20px] justify-center py-2 overflow-visible relative z-20"
          >
            <HomeActionCard 
              title="Ranked 2v2" 
              subtitle="Compete and climb" 
              type="ranked-2v2" 
              onClick={() => {
                setSelectedMatchType('Ranked 2v2')
                setMatchState('searching')
              }}
            />

            <HomeActionCard 
              title="Ranked Solo" 
              subtitle="Prove your limits" 
              type="ranked-solo" 
              onClick={() => {
                setSelectedMatchType('Ranked Solo')
                setMatchState('searching')
              }}
            />
            <HomeActionCard 
              title="Custom Match" 
              subtitle="Create or join a room" 
              type="custom" 
              onClick={() => {
                setSelectedMatchType('Custom Match')
                setMatchState('searching')
              }}
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
          onLobbySettingsClick={() => setShowLobbySettings(true)}
          activeAvatarName={avatarConfigs[customAvatar].name}
        />
        
        {/* Lobby customizer drawer */}
        <LobbyCustomizerPanel
          isOpen={showLobbySettings}
          onClose={() => setShowLobbySettings(false)}
          isBright={isBright}
          currentAvatar={customAvatar}
          onChangeAvatar={setCustomAvatar}
          currentBackground={customBackground}
          onChangeBackground={setCustomBackground}
          avatarOptions={avatarOptions}
          backgroundOptions={backgroundOptions}
        />
        
        {/* Right content viewport container */}
        <div className="flex-1 flex overflow-hidden relative z-10 bg-transparent min-w-0">
          
          {/* View 1: Main Dashboards (Play & Other Tabs) */}
          <div 
            className="absolute inset-0 flex flex-col transition-all duration-300 ease-out"
            style={{
              opacity: !inRoom ? 1 : 0,
              visibility: !inRoom ? 'visible' : 'hidden',
              pointerEvents: !inRoom ? 'auto' : 'none',
              transform: !inRoom ? 'translateY(0)' : 'translateY(15px)',
              position: !inRoom ? 'relative' : 'absolute',
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
                className="transition-all duration-300 ease-out"
                style={{
                  opacity: (activeId === 'play') ? 1 : 0,
                  visibility: (activeId === 'play') ? 'visible' : 'hidden',
                  pointerEvents: (activeId === 'play') ? 'auto' : 'none',
                  transform: (activeId === 'play') ? 'scale(1)' : 'scale(0.985)',
                  position: (activeId === 'play') ? 'relative' : 'absolute',
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
            className="absolute inset-0 flex flex-col transition-all duration-300 ease-out animate-fade-in"
            style={{
              opacity: inRoom ? 1 : 0,
              visibility: inRoom ? 'visible' : 'hidden',
              pointerEvents: inRoom ? 'auto' : 'none',
              transform: inRoom ? 'translateY(0)' : 'translateY(-15px)',
              position: inRoom ? 'relative' : 'absolute',
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
                  onLeave={() => {
                    setInRoom(false)
                    setActiveId('play')
                  }}
                />
              }
              sidebar={null}
              problemPanel={
                <ProblemPanel 
                  title="Find Duplicate Number"
                  difficulty="Medium"
                  points={250}
                  acceptance="72.4%"
                  estTime="25 mins"
                  memory="256 MB"
                  timeLimit="1.5s"
                  statementHtml={[
                    "Given an array of integers <code>nums</code> containing <code>n + 1</code> integers where each integer is in the range <code>[1, n]</code> inclusive.",
                    "There is only <strong>one repeated number</strong> in <code>nums</code>, return <em>this repeated number</em>."
                  ]}
                  constraints={[
                    "You must solve the problem <strong>without</strong> modifying the array <code>nums</code> and use only constant extra space."
                  ]}
                  examples={[
                    {
                      id: 1,
                      input: "nums = [1,3,4,2,2]",
                      output: "2"
                    }
                  ]}
                  tags={['Array', 'Two Pointers', 'Binary Search', 'Cycle Detection']}
                  isBright={isBright}
                />
              }
              editorToolbar={
                <EditorToolbar 
                  filename="solution.ts"
                  activeLanguage={language}
                  onLanguageChange={setLanguage}
                  activeTheme={theme}
                  onThemeChange={setTheme}
                  isBright={isBright}
                  onReset={() => setCodeValue(dummyCode)}
                  onRun={() => alert("Simulating compilation of " + language + " solution...")}
                  onSubmit={() => alert("Submitting solution for matching evaluation verification!")}
                />
              }
              codeEditor={
                <CodeEditor 
                  value={codeValue}
                  language={language}
                  theme={theme}
                  isBright={isBright}
                  onChange={setCodeValue}
                />
              }
              lobbySidebar={
                <LobbySidebar 
                  activeCount={3}
                  maxCount={4}
                  members={[
                    { name: 'Kaelen', lp: '1,920 LP', status: 'Coding...', colorClass: 'bg-amber-500/60' },
                    { name: 'Sora_Dev', lp: '1,820 LP', status: 'Ready', colorClass: 'bg-emerald-500/65' },
                    { name: 'Nexus_Core', lp: '1,450 LP', status: 'Submitted (Wrong Answer)', colorClass: 'bg-rose-500/60' },
                  ]}
                  activities={[
                    { text: 'Kaelen solved #92 in 14 mins', time: '2m ago', icon: <CheckCircle2 size={12} className="text-emerald-500/70" /> },
                    { text: 'Nexus_Core submitted TypeScript error', time: '5m ago', icon: <BookOpen size={12} className="text-slate-500" /> },
                  ]}
                  isBright={isBright}
                />
              }
              consolePanel={
                <ConsolePanel 
                  isBright={isBright}
                  initialCollapsed={true}
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
            background: 'radial-gradient(circle, #FFF7F2 0%, transparent 70%)',
            opacity: 0.45,
            filter: 'blur(120px)'
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
            background: 'radial-gradient(circle, #F2ECFF 0%, transparent 70%)',
            opacity: 0.55,
            filter: 'blur(140px)'
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
            background: 'radial-gradient(circle, #EEF3FF 0%, transparent 70%)',
            opacity: 0.45,
            filter: 'blur(120px)'
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
            background: 'radial-gradient(circle, #F5EEFF 0%, transparent 70%)',
            opacity: 0.22,
            filter: 'blur(160px)'
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
              filter: (inRoom || activeId === 'ranked') ? 'blur(15px) brightness(0.85) contrast(0.95)' : 'none'
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
            className="absolute inset-0 z-5 transition-all duration-500 ease-in-out pointer-events-none backdrop-blur-[35px]"
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
      </div>
    </div>
  )
}
