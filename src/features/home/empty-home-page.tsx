import { useState } from 'react'
import { motion } from 'motion/react'
import { ArenaLayout, FloatingSidebar } from '@/components/layout'
import { cn } from '@/utils'
import { 
  Trophy, 
  Users, 
  Zap, 
  BookOpen, 
  CheckCircle2, 
  Cpu
} from 'lucide-react'

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

export function EmptyHomePage() {
  const [activeId, setActiveId] = useState('play')
  const [inRoom, setInRoom] = useState(false) // Starts outside room in the new Home Dashboard direction

  const isBright = activeId === 'play' || inRoom

  // Mock subcomponents to populate the layout with premium visuals
  const mockTopNav = (
    <div className={cn(
      "flex h-12 items-center justify-between border-b px-6 text-xs font-medium select-none z-20 relative transition-all duration-300",
      isBright ? "border-slate-200/80 bg-[#ffffff]/60 backdrop-blur-md text-slate-600" : "border-slate-900 bg-[#05070c]/90 text-slate-400"
    )}>
      <div className="flex items-center gap-6">
        <div className={cn("flex items-center gap-2", isBright ? "text-[#1E1B4B]" : "text-slate-200")}>
          <span className={cn("font-bold font-mono text-sm", isBright ? "text-[#7C3AED]" : "text-blue-400")}>&gt;_</span>
          <span className="font-bold uppercase tracking-wider text-[10px]">CodeWar</span>
        </div>
        <div className={cn("h-4 w-px", isBright ? "bg-slate-200" : "bg-slate-900")} />
        <div className="flex items-center gap-4">
          {inRoom ? (
            <span 
              onClick={() => setActiveId('arena')} 
              className={cn(
                "cursor-pointer transition-colors px-2.5 py-1 rounded border", 
                activeId === 'arena' 
                  ? (isBright ? "text-slate-800 font-semibold bg-white border-slate-200 shadow-sm" : "text-slate-100 font-semibold bg-slate-955 border-slate-900") 
                  : (isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-200")
              )}
            >
              Arena
            </span>
          ) : (
            <span 
              onClick={() => setActiveId('play')} 
              className={cn(
                "cursor-pointer transition-colors px-2.5 py-1 rounded border", 
                activeId === 'play' 
                  ? (isBright ? "text-slate-800 font-semibold bg-white border-slate-200 shadow-sm" : "text-slate-100 font-semibold bg-slate-955 border-slate-900") 
                  : (isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-200")
              )}
            >
              Play
            </span>
          )}
          <span 
            onClick={() => setActiveId('ranked')} 
            className={cn(
              "cursor-pointer transition-colors px-2.5 py-1 rounded border", 
              activeId === 'ranked' 
                ? (isBright ? "text-slate-800 font-semibold bg-white border-slate-200 shadow-sm" : "text-slate-100 font-semibold bg-slate-955 border-slate-900") 
                : (isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-200")
            )}
          >
            Ranked
          </span>
          <span 
            onClick={() => setActiveId('practice')} 
            className={cn(
              "cursor-pointer transition-colors px-2.5 py-1 rounded border", 
              activeId === 'practice' 
                ? (isBright ? "text-slate-800 font-semibold bg-white border-slate-200 shadow-sm" : "text-slate-100 font-semibold bg-slate-955 border-slate-900") 
                : (isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-200")
            )}
          >
            Practice
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className={cn("text-[10px]", isBright ? "text-slate-500" : "text-slate-550")}>SERVER: OPTIMAL</span>
        </div>
        <div className={cn("h-4 w-px", isBright ? "bg-slate-200" : "bg-slate-900")} />
        <div className={cn("flex items-center gap-1.5", isBright ? "text-amber-600" : "text-amber-500/80")}>
          <Zap size={12} className={cn("fill-amber-500/10", isBright ? "text-amber-600" : "text-amber-500/80")} />
          <span className="font-bold">1,820 LP</span>
        </div>
        <div className={cn("h-4 w-px", isBright ? "bg-slate-200" : "bg-slate-900")} />
        <div className="flex items-center gap-4">
          <span onClick={() => setActiveId('settings')} className={cn("cursor-pointer transition-colors", isBright ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-slate-200")}>Settings</span>
          {inRoom && (
            <span 
              onClick={() => {
                setInRoom(false)
                setActiveId('play')
              }} 
              className="text-rose-500/80 hover:text-rose-450 cursor-pointer transition-colors font-semibold"
            >
              Leave
            </span>
          )}
        </div>
      </div>
    </div>
  )

  const mockProblemPanel = (
    <div className={cn(
      "flex flex-col h-full p-6 overflow-y-auto no-scrollbar transition-colors duration-300",
      isBright ? "text-slate-700" : "text-slate-300"
    )}>
      <div className="flex flex-wrap items-center gap-2 mb-4 text-[10px] font-bold tracking-wider select-none">
        <span className={cn("px-3 py-1 rounded border uppercase", isBright ? "bg-[#FFF7F2] text-orange-600 border-orange-500/15" : "bg-[#1c140e] text-amber-500 border-amber-500/15")}>
          Medium
        </span>
        <span className={cn("px-3 py-1 rounded border uppercase", isBright ? "bg-[#FFFDF2] text-amber-600 border-amber-500/15" : "bg-[#1c1c0e] text-yellow-500 border-yellow-500/15")}>
          250 Pts
        </span>
        <span className={cn("px-3 py-1 rounded border uppercase", isBright ? "bg-[#F2FCF7] text-emerald-600 border-emerald-500/15" : "bg-[#0e1c14] text-emerald-400 border-emerald-500/15")}>
          72.4% Acc.
        </span>
      </div>

      <div className="mb-4">
        <h2 className={cn("text-xl font-extrabold tracking-tight leading-tight", isBright ? "text-[#1E1B4B]" : "text-white")}>
          Find Duplicate Number
        </h2>
      </div>

      <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mb-6 border-b pb-4", isBright ? "text-slate-500 border-slate-200/80" : "text-slate-400/90 border-slate-900/60")}>
        <div>Est. Time: <span className="text-purple-600 font-semibold">25 mins</span></div>
        <div className={cn(isBright ? "text-slate-300" : "text-slate-700")}>•</div>
        <div>Memory: <span className={cn("font-medium", isBright ? "text-slate-700" : "text-slate-355")}>256 MB</span></div>
        <div className={cn(isBright ? "text-slate-300" : "text-slate-700")}>•</div>
        <div>Time: <span className={cn("font-medium", isBright ? "text-slate-700" : "text-slate-355")}>1.5s</span></div>
      </div>

      <div className="space-y-5 text-sm leading-relaxed pr-1 flex-1">
        <p className={isBright ? "text-slate-600" : "text-slate-300"}>
          Given an array of integers <code className={cn("px-2 py-0.5 rounded font-mono text-xs border", isBright ? "bg-[#F2F4FA]/80 text-[#7C3AED] border-slate-200" : "bg-[#030407] text-[#7ba4d9] border-slate-900/60")}>nums</code> containing <code className={cn("px-2 py-0.5 rounded font-mono text-xs border", isBright ? "bg-[#F2F4FA]/80 text-[#7C3AED] border-slate-200" : "bg-[#030407] text-[#7ba4d9] border-slate-900/60")}>n + 1</code> integers where each integer is in the range <code className={cn("px-2 py-0.5 rounded font-mono text-xs border", isBright ? "bg-[#F2F4FA]/80 text-[#7C3AED] border-slate-200" : "bg-[#030407] text-[#7ba4d9] border-slate-900/60")}>[1, n]</code> inclusive.
        </p>
        <p className={isBright ? "text-slate-600" : "text-slate-300"}>
          There is only <strong>one repeated number</strong> in <code className={cn("px-2 py-0.5 rounded font-mono text-xs border", isBright ? "bg-[#F2F4FA]/80 text-[#7C3AED] border-slate-200" : "bg-[#030407] text-[#7ba4d9] border-slate-900/60")}>nums</code>, return <em>this repeated number</em>.
        </p>
        
        <div className={cn("pl-4 py-3 pr-3 rounded-r-lg border-l-2 border-y-transparent border-r-transparent space-y-1.5 text-xs", isBright ? "bg-[#F2F4FA]/80 border-l-amber-500/60" : "bg-[#030407] border-l-amber-500/40")}>
          <div className={cn("font-semibold uppercase tracking-widest text-[9px] select-none", isBright ? "text-slate-500" : "text-slate-400")}>
            Constraint
          </div>
          <p className={cn("leading-relaxed", isBright ? "text-slate-600" : "text-slate-400/90")}>
            You must solve the problem <strong>without</strong> modifying the array <code className={cn("px-1.5 py-0.5 rounded font-mono", isBright ? "bg-white/80 text-[#7C3AED] border border-slate-100" : "bg-[#0c0d12] text-[#7ba4d9]")}>nums</code> and use only constant extra space.
          </p>
        </div>
        
        <div className="pt-2">
          <span className={cn("text-xs font-bold uppercase tracking-wider block mb-2.5 select-none", isBright ? "text-slate-500" : "text-slate-400")}>
            Quick Example
          </span>
          <pre className={cn("p-4 rounded-xl border text-xs font-mono overflow-x-auto leading-relaxed", isBright ? "bg-[#F2F4FA]/80 border-slate-200 text-slate-700" : "bg-[#030407] border-slate-900 text-slate-300")}>
            Input: nums = [1,3,4,2,2]
            Output: 2
          </pre>
        </div>

        <div className={cn("border-t pt-5 mt-4 flex flex-wrap gap-1.5 select-none", isBright ? "border-slate-200" : "border-slate-900")}>
          {['Array', 'Two Pointers', 'Binary Search', 'Cycle Detection'].map((tag) => (
            <span 
              key={tag} 
              className={cn("px-2.5 py-1 rounded text-[10px] font-semibold border transition-colors", isBright ? "bg-white/70 text-slate-600 border-slate-200 hover:text-slate-800 hover:border-slate-350" : "bg-[#030407] text-slate-500 border-slate-900/60 hover:text-slate-400 hover:border-slate-805")}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  const mockEditorPanel = (
    <div className="flex flex-col h-full">
      <div className={cn("flex h-11 items-center justify-between border-b px-4 text-xs transition-colors duration-300", isBright ? "border-slate-200/80 text-slate-700" : "border-slate-900 text-slate-350")}>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className={cn("font-mono font-semibold", isBright ? "text-slate-700" : "text-slate-300")}>solution.ts</span>
        </div>
        <div className="flex items-center gap-2">
          <button className={cn("flex items-center gap-1.5 px-3 py-1 rounded border transition-colors", isBright ? "bg-white/80 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800" : "bg-slate-900 text-slate-400 border-slate-800/60 hover:bg-slate-800 hover:text-slate-200")}>
            <Cpu size={12} />
            <span>TypeScript</span>
          </button>
        </div>
      </div>
      
      <div className={cn("flex-1 p-6 font-mono text-sm overflow-y-auto transition-colors duration-300", isBright ? "bg-[#ffffff]/30 text-slate-800" : "bg-[#080b11]/90 text-slate-400")}>
        <div className={cn("text-xs select-none space-y-1 inline-block text-right pr-4 border-r mr-4", isBright ? "text-slate-400 border-slate-200" : "text-slate-600 border-slate-900")}>
          <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
        </div>
        <div className="inline-block align-top space-y-1">
          <div><span className={cn(isBright ? "text-purple-700 font-semibold" : "text-purple-400")}>export</span> <span className={cn(isBright ? "text-blue-700 font-semibold" : "text-blue-400")}>function</span> <span className={cn(isBright ? "text-amber-700 font-semibold" : "text-yellow-400")}>findDuplicate</span>(nums: <span className={cn(isBright ? "text-emerald-700 font-semibold" : "text-emerald-400")}>number[]</span>): <span className={cn(isBright ? "text-emerald-700 font-semibold" : "text-emerald-400")}>number</span> &#123;</div>
          <div className="pl-4"><span className="text-slate-500">// Floyd's Tortoise and Hare (Cycle Detection)</span></div>
          <div className="pl-4"><span className={cn(isBright ? "text-purple-700 font-semibold" : "text-purple-400")}>let</span> tortoise = nums[<span className="text-amber-500 font-semibold">0</span>];</div>
          <div className="pl-4"><span className={cn(isBright ? "text-purple-700 font-semibold" : "text-purple-400")}>let</span> hare = nums[<span className="text-amber-500 font-semibold">0</span>];</div>
          <div className="pl-4">&nbsp;</div>
          <div className="pl-4"><span className={cn(isBright ? "text-purple-700 font-semibold" : "text-purple-400")}>do</span> &#123;</div>
          <div className="pl-8">tortoise = nums[tortoise];</div>
          <div className="pl-8">hare = nums[nums[hare]];</div>
          <div className="pl-4">&#125; <span className={cn(isBright ? "text-purple-700 font-semibold" : "text-purple-400")}>while</span> (tortoise !== hare);</div>
          <div className="pl-4">&nbsp;</div>
          <div className="pl-4"><span className="text-slate-500">// Find index where duplicate cycle starts...</span></div>
        </div>
      </div>
    </div>
  )

  const mockTeamPanel = (
    <div className={cn("flex flex-col border-b p-6 flex-1 transition-colors duration-300", isBright ? "border-slate-200/80" : "border-slate-900")}>
      <span className="text-[10px] font-bold text-slate-500/60 uppercase tracking-[0.15em] block mb-4 flex items-center gap-1.5 select-none">
        <Users size={14} className="text-slate-550" />
        Lobby Members
        <span className={cn("ml-auto text-[10px] px-2 py-0.5 rounded border lowercase tracking-normal", isBright ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-emerald-400/80 bg-emerald-500/5 border-emerald-500/10")}>
          Active: 3/4
        </span>
      </span>
      
      <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1 pr-1">
        {[
          { name: 'Kaelen', lp: '1,920 LP', status: 'Coding...', color: 'bg-amber-500/60' },
          { name: 'Sora_Dev', lp: '1,820 LP', status: 'Ready', color: 'bg-emerald-500/65' },
          { name: 'Nexus_Core', lp: '1,450 LP', status: 'Submitted (Wrong Answer)', color: 'bg-rose-500/60' },
        ].map((member) => (
          <div key={member.name} className={cn("flex items-center justify-between p-2.5 rounded-lg border transition-all duration-300", isBright ? "bg-[#ffffff]/80 border-slate-200/80" : "bg-[#080c14]/25 border-slate-900/40")}>
            <div className="flex items-center gap-2.5">
              <div className={`w-2.5 h-2.5 rounded-full ${member.color}`} />
              <div>
                <span className={cn("text-xs font-semibold block", isBright ? "text-slate-700" : "text-slate-350")}>{member.name}</span>
                <span className={cn("text-[10px]", isBright ? "text-slate-400" : "text-slate-550")}>{member.lp}</span>
              </div>
            </div>
            <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded border transition-colors", isBright ? "text-slate-600 bg-[#F2F4FA]/80 border-slate-200" : "text-slate-400/70 bg-slate-900/40 border-slate-800/30")}>
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  const mockActivityPanel = (
    <div className="flex flex-col p-6 h-[220px]">
      <span className="text-[10px] font-bold text-slate-500/60 uppercase tracking-[0.15em] block mb-4 flex items-center gap-1.5 select-none">
        <Trophy size={14} className="text-slate-550" />
        Live Feed
      </span>
      
      <div className="space-y-3 overflow-y-auto no-scrollbar flex-1 pr-1">
        {[
          { text: 'Kaelen solved #92 in 14 mins', time: '2m ago', icon: <CheckCircle2 size={12} className="text-emerald-500/70" /> },
          { text: 'Nexus_Core submitted TypeScript error', time: '5m ago', icon: <BookOpen size={12} className="text-slate-500" /> },
        ].map((act, i) => (
          <div key={i} className={cn("flex items-start gap-2.5 text-xs transition-colors", isBright ? "text-slate-600" : "text-slate-400")}>
            <span className="mt-0.5 flex-shrink-0">{act.icon}</span>
            <div className="flex-1">
              <p className="leading-relaxed text-[11px]">{act.text}</p>
              <span className="text-[9px] text-slate-500/80 block mt-0.5">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const mockFooter = (
    <div className={cn("flex h-8 items-center justify-between border-t px-6 text-[10px] font-mono transition-colors duration-300", isBright ? "border-slate-200/80 bg-[#ffffff]/60 backdrop-blur-md text-slate-500" : "border-slate-900 bg-[#04060a]/90 backdrop-blur-md text-slate-500")}>
      <span />
      <div className="flex items-center gap-4">
        <span>RTT: 12ms</span>
        <span>LATENCY: 42ms</span>
      </div>
    </div>
  )

  // Interactive Play Matchmaking Dashboard - Rebuilt with Bright Apple + Arc + Linear Design Language
  const renderPlayDashboard = () => {
    return (
      <div className="flex-1 flex flex-col h-full bg-transparent overflow-visible pl-[40px] pr-[40px] pt-[2px] pb-[16px] max-w-[1440px] mx-auto w-full select-none text-left">
        {/* Top Bar - Spans full width at the top */}
        <HomeTopBar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-row items-stretch mt-2 gap-8 overflow-visible min-h-0">
          
          {/* Left + Center Area (Flex Column) */}
          <div className="flex-grow flex flex-col justify-between h-full overflow-visible min-w-0">
            
            {/* Main Top Content (Left Column + Center Column) */}
            <div className="flex-grow flex flex-col lg:flex-row items-stretch gap-8 overflow-visible min-h-0">
              {/* Left Column: Heading & Focus Card */}
              <div className="w-full lg:w-[35%] min-w-[280px] max-w-[330px] shrink-0 flex flex-col justify-between py-2 gap-4 overflow-visible relative z-20">
                <HomeHero />
                <HomeFocusCard />
              </div>

              {/* Center Column: Identity Hero */}
              <div className="flex-1 min-h-0 flex items-center justify-center relative overflow-visible z-10">
                <IdentityHero isActive={activeId === 'play'} />
              </div>
            </div>

            {/* Bottom Panel: Recent Activity */}
            <div className="h-[110px] mt-4 shrink-0 overflow-visible relative z-20">
              <HomeRecentActivity />
            </div>
          </div>

          {/* Right Column: Four Compact Action Cards stacked vertically */}
          <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-[20px] justify-center py-2 overflow-visible relative z-20">
            <HomeActionCard 
              title="Ranked 2v2" 
              subtitle="Compete and climb" 
              type="ranked-2v2" 
              onClick={() => {
                setInRoom(true)
                setActiveId('arena')
              }}
            />
            <HomeActionCard 
              title="Practice Arena" 
              subtitle="Hone your skills" 
              type="practice" 
              onClick={() => {
                setInRoom(true)
                setActiveId('arena')
              }}
            />
            <HomeActionCard 
              title="Ranked Solo" 
              subtitle="Prove your limits" 
              type="ranked-solo" 
              onClick={() => {
                setInRoom(true)
                setActiveId('arena')
              }}
            />
            <HomeActionCard 
              title="Custom Match" 
              subtitle="Create or join a room" 
              type="custom" 
              onClick={() => {
                setInRoom(true)
                setActiveId('arena')
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Subpage wrapper to show which tab is currently active
  const renderMainContent = () => {
    if (activeId === 'arena' && inRoom) {
      return (
        <ArenaLayout
          sidebar={
            <FloatingSidebar 
              activeId={activeId} 
              onChangeActiveId={setActiveId} 
              inRoom={inRoom}
            />
          }
          topNav={mockTopNav}
          problemPanel={mockProblemPanel}
          editorPanel={mockEditorPanel}
          teamPanel={mockTeamPanel}
          activityPanel={mockActivityPanel}
          footer={mockFooter}
        />
      )
    }

    // Default screen wrapper for non-arena sidebar options to show full content
    return (
      <div className="flex h-screen bg-transparent text-slate-655 overflow-hidden relative">
        <div className="w-[136px] flex-shrink-0 relative z-10">
          <FloatingSidebar 
            activeId={activeId} 
            onChangeActiveId={setActiveId} 
            inRoom={inRoom}
          />
        </div>
        
        <div className="flex-1 flex overflow-visible relative z-10 bg-transparent">
          {/* Play Dashboard Container: permanently mounted to eliminate mounting jank and keep animations warm */}
          <div 
            className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
            style={{
              opacity: (activeId === 'play' && !inRoom) ? 1 : 0,
              visibility: (activeId === 'play' && !inRoom) ? 'visible' : 'hidden',
              pointerEvents: (activeId === 'play' && !inRoom) ? 'auto' : 'none',
              transform: (activeId === 'play' && !inRoom) ? 'translateY(0)' : 'translateY(10px)',
              position: (activeId === 'play' && !inRoom) ? 'relative' : 'absolute',
              width: '100%',
              height: '100%'
            }}
          >
            {renderPlayDashboard()}
          </div>

          {/* Placeholder Dashboard for other tabs: mounted dynamically when not on play dashboard */}
          {activeId !== 'play' && !inRoom && (
            <div className="flex-1 flex flex-col justify-center items-center p-8 select-none bg-transparent">
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
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  You are currently viewing the {activeId} area. This interface simulates integration with our premium navigation routing context.
                </p>
                {inRoom && (
                  <button 
                    onClick={() => setActiveId('arena')}
                    className="px-4 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-semibold text-xs border border-blue-500/20 transition-all cursor-pointer"
                  >
                    Return to Arena
                  </button>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "relative min-h-screen transition-colors duration-300",
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
            src={inRoom ? voidConfig.backgroundBlurred : voidConfig.background}
            alt="Environment Backdrop"
            className="absolute inset-0 w-full h-full object-cover"
            decoding="async"
            style={{
              filter: inRoom 
                ? 'brightness(1.04) contrast(0.95) saturate(1.08)' 
                : 'brightness(1.02) contrast(0.95) saturate(1.08)'
            }}
          />

          {/* Layer 2: Asymmetrical Left/Right linear fade (Left transparent at 16%, Right starts fading at 88% to match reference) */}
          <div 
            className="absolute inset-0 pointer-events-none z-12"
            style={{
              background: 'linear-gradient(90deg, #F7F8FC 0%, rgba(247, 248, 252, 0.8) 5%, transparent 16%, transparent 88%, rgba(247, 248, 252, 0.8) 96%, #F7F8FC 100%)'
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
      <div className={cn("relative z-10 w-full h-full min-h-screen", isBright && "light-theme")}>
        {renderMainContent()}
      </div>
    </div>
  )
}
