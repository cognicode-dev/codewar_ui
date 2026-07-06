import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Code2, Zap } from 'lucide-react'
import { cn } from '@/utils'

interface Player {
  name: string
  elo: number
  language: string
  avatarText: string
  avatarColor: string
  accuracy: string
  isSelf?: boolean
}

interface MatchLoadingScreenProps {
  isBright: boolean
  matchType: string
  onLoadingComplete: () => void
  myTeam?: Player[]
  enemyTeam?: Player[]
}

export function MatchLoadingScreen({ 
  isBright, 
  matchType, 
  onLoadingComplete,
  myTeam: customMyTeam,
  enemyTeam: customEnemyTeam
}: MatchLoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Establishing connection to sandbox...')
  const [playerProgress, setPlayerProgress] = useState({
    user: 0,
    teammate: 0,
    enemy1: 0,
    enemy2: 0,
  })

  // Simulated player details (default fallbacks)
  const defaultMyTeam: Player[] = [
    { name: 'dev.exe', elo: 1850, language: 'TypeScript', avatarText: 'DEV', avatarColor: 'bg-indigo-600', accuracy: '98.4%', isSelf: true },
    { name: 'Kaelen', elo: 1920, language: 'Python', avatarText: 'KA', avatarColor: 'bg-amber-600', accuracy: '95.1%' }
  ]

  const defaultEnemyTeam: Player[] = [
    { name: 'Sora_Dev', elo: 1820, language: 'C++', avatarText: 'SO', avatarColor: 'bg-rose-600', accuracy: '96.2%' },
    { name: 'Nexus_Core', elo: 1450, language: 'Rust', avatarText: 'NX', avatarColor: 'bg-emerald-600', accuracy: '90.8%' }
  ]

  const myTeam = customMyTeam || defaultMyTeam
  const enemyTeam = customEnemyTeam || defaultEnemyTeam

  // Global loading states and texts
  useEffect(() => {
    const start = Date.now()
    const duration = 4000 // 4 seconds total loading time

    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const newProgress = Math.min(100, Math.floor((elapsed / duration) * 100))
      
      setProgress(newProgress)

      // Update loading message based on progress
      if (newProgress < 20) {
        setStatusText('Allocating secure execution sandbox...')
      } else if (newProgress < 40) {
        setStatusText('Spawning high-performance container compilers...')
      } else if (newProgress < 60) {
        setStatusText('Fetching algorithm test suites from database...')
      } else if (newProgress < 80) {
        setStatusText('Synchronizing IDE environments...')
      } else if (newProgress < 95) {
        setStatusText('Injecting input parameters and secrets...')
      } else {
        setStatusText('Deactivating security gates... Launching Arena!')
      }

      // Progressively update individual player loads
      // Make the user load very fast, teammate medium, enemy1 slightly lagging, enemy2 a bit jumpy
      setPlayerProgress({
        user: Math.min(100, Math.floor(newProgress * 1.15)),
        teammate: Math.min(100, Math.floor(newProgress * 0.98)),
        enemy1: Math.min(100, Math.floor(newProgress * 0.92)),
        enemy2: Math.min(100, Math.floor(newProgress * 0.88 + (newProgress > 50 ? 5 : 0))),
      })

      if (newProgress >= 100) {
        clearInterval(timer)
        setTimeout(() => {
          onLoadingComplete()
        }, 800) // Small delay at 100% for impact
      }
    }, 50)

    return () => clearInterval(timer)
  }, [onLoadingComplete])

  const getPlayerProgressValue = (index: number, isEnemyTeam: boolean) => {
    if (!isEnemyTeam) {
      return index === 0 ? playerProgress.user : playerProgress.teammate
    } else {
      return index === 0 ? playerProgress.enemy1 : playerProgress.enemy2
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-between items-center select-none p-8 z-30 font-sans overflow-hidden">
      {/* Background glow effects specific to MatchLoading */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 0.8
          }}
        />
        {/* Left Side Blue/Cyan Aura */}
        <div 
          className="absolute"
          style={{
            top: '50%',
            left: '10%',
            transform: 'translateY(-50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 75%)',
            filter: 'blur(100px)',
            opacity: 0.7
          }}
        />
        {/* Right Side Pink/Purple Aura */}
        <div 
          className="absolute"
          style={{
            top: '50%',
            right: '10%',
            transform: 'translateY(-50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.07) 0%, transparent 75%)',
            filter: 'blur(100px)',
            opacity: 0.7
          }}
        />
      </div>

      {/* Top Section: Title & Match Information */}
      <div className="w-full max-w-[1200px] flex justify-between items-center z-10 pt-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Zap size={20} className="text-indigo-500 animate-pulse" />
          </div>
          <div>
            <span className={cn(
              "text-[10px] font-extrabold tracking-widest uppercase block",
              isBright ? "text-indigo-600" : "text-indigo-400"
            )}>
              {matchType} Matchmaking
            </span>
            <h2 className={cn(
              "text-lg font-bold leading-none mt-0.5",
              isBright ? "text-slate-900" : "text-white"
            )}>
              SECURE CHANNELS SECURED
            </h2>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-3 border",
            isBright 
              ? "bg-white/40 border-slate-200/50 text-slate-600" 
              : "bg-slate-950/40 border-white/5 text-slate-300"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PING: 14ms (US-EAST)</span>
          <span className="opacity-30">|</span>
          <span>SANDBOX-ID: #8921-A</span>
        </motion.div>
      </div>

      {/* Middle Section: Player Cards & Versus */}
      <div className="w-full max-w-[1200px] flex-grow flex items-center justify-between gap-8 z-10 my-4">
        
        {/* Left Team (User's Team) */}
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <div className="flex items-center justify-between pl-4">
            <span className={cn(
              "text-xs font-black tracking-widest uppercase",
              isBright ? "text-indigo-600" : "text-indigo-400"
            )}>
              ALLY TEAM
            </span>
            <span className={cn("text-xs font-semibold opacity-60", isBright ? "text-slate-500" : "text-slate-400")}>
              AVG ELO: 1885
            </span>
          </div>

          <div className="space-y-4">
            {myTeam.map((player, idx) => {
              const playerProgressVal = getPlayerProgressValue(idx, false)
              return (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, x: -60, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative overflow-hidden rounded-3xl p-5 border flex items-center justify-between group",
                    player.isSelf 
                      ? (isBright 
                          ? "bg-gradient-to-r from-indigo-50/70 to-indigo-100/30 border-indigo-200/60 shadow-lg" 
                          : "bg-gradient-to-r from-indigo-950/30 to-slate-900/40 border-indigo-500/20 shadow-lg")
                      : (isBright ? "glass-card border-white/50" : "bg-[#0b0f19]/60 border-white/5")
                  )}
                >
                  {/* Decorative background accent for self */}
                  {player.isSelf && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                  )}

                  {/* Player Loading Bar Overlay */}
                  <div 
                    className={cn(
                      "absolute bottom-0 left-0 h-1 transition-all duration-300 ease-out",
                      player.isSelf ? "bg-indigo-500" : "bg-indigo-400/50"
                    )}
                    style={{ width: `${playerProgressVal}%` }}
                  />

                  {/* Player Info Left */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={cn(
                      "w-[52px] h-[52px] rounded-2xl flex items-center justify-center font-extrabold text-sm text-white shadow-md relative overflow-hidden",
                      player.avatarColor
                    )}>
                      {player.avatarText}
                      {/* Subtly animated scanline on avatars */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent translate-y-[-100%] animate-[pulse_2.5s_infinite]" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-bold text-base",
                          isBright ? "text-slate-800" : "text-white"
                        )}>
                          {player.name}
                        </span>
                        {player.isSelf && (
                          <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-[9px] font-black uppercase text-indigo-500 tracking-wider">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5 text-xs">
                        <span className="font-semibold text-indigo-500">{player.elo} ELO</span>
                        <span className="opacity-30">|</span>
                        <span className={cn("font-medium", isBright ? "text-slate-500" : "text-slate-400")}>
                          Accuracy: {player.accuracy}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Language and Progress Badge Right */}
                  <div className="text-right flex flex-col items-end gap-1.5 relative z-10">
                    <div className={cn(
                      "px-3 py-1 rounded-xl text-[10px] font-extrabold tracking-wider border flex items-center gap-1.5 uppercase",
                      isBright 
                        ? "bg-slate-100 border-slate-200 text-slate-600" 
                        : "bg-slate-900 border-white/5 text-slate-300"
                    )}>
                      <Code2 size={11} className="text-indigo-400" />
                      {player.language}
                    </div>
                    <span className={cn(
                      "text-xs font-mono font-bold tracking-tight",
                      playerProgressVal >= 100 ? "text-emerald-500" : (isBright ? "text-slate-500" : "text-slate-400")
                    )}>
                      {playerProgressVal >= 100 ? 'READY' : `${playerProgressVal}%`}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Center VS Panel */}
        <div className="w-[100px] flex flex-col items-center justify-center relative self-stretch">
          {/* Vertical Divider line */}
          <div className={cn(
            "w-px flex-1",
            isBright 
              ? "bg-gradient-to-b from-transparent via-slate-200/80 to-transparent" 
              : "bg-gradient-to-b from-transparent via-white/10 to-transparent"
          )} />

          {/* VS Circular Orb */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center border-2 font-black italic tracking-tighter text-xl my-6 relative shadow-lg z-20",
              isBright 
                ? "bg-white border-slate-200 text-[#1E1B4B] shadow-purple-500/5" 
                : "bg-slate-950 border-white/10 text-white shadow-indigo-500/10"
            )}
          >
            {/* Spinning orbital ring */}
            <div className="absolute -inset-1.5 rounded-full border border-dashed border-indigo-500/40 animate-[spin_10s_linear_infinite]" />
            {/* Subtle glow layers */}
            <div className="absolute inset-0 bg-indigo-500/5 rounded-full animate-ping opacity-70" />
            
            <span className="relative z-10 pl-0.5">VS</span>
          </motion.div>

          <div className={cn(
            "w-px flex-1",
            isBright 
              ? "bg-gradient-to-b from-transparent via-slate-200/80 to-transparent" 
              : "bg-gradient-to-b from-transparent via-white/10 to-transparent"
          )} />
        </div>

        {/* Right Team (Enemy Team) */}
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <div className="flex items-center justify-between pr-4">
            <span className={cn(
              "text-xs font-black tracking-widest uppercase",
              isBright ? "text-rose-600" : "text-rose-400"
            )}>
              OPPONENT TEAM
            </span>
            <span className={cn("text-xs font-semibold opacity-60", isBright ? "text-slate-500" : "text-slate-400")}>
              AVG ELO: 1635
            </span>
          </div>

          <div className="space-y-4">
            {enemyTeam.map((player, idx) => {
              const playerProgressVal = getPlayerProgressValue(idx, true)
              return (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, x: 60, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative overflow-hidden rounded-3xl p-5 border flex items-center justify-between group",
                    isBright ? "glass-card border-white/50" : "bg-[#0b0f19]/60 border-white/5"
                  )}
                >
                  {/* Player Loading Bar Overlay */}
                  <div 
                    className="absolute bottom-0 right-0 h-1 bg-rose-500/50 transition-all duration-300 ease-out"
                    style={{ width: `${playerProgressVal}%` }}
                  />

                  {/* Player Info Left */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={cn(
                      "w-[52px] h-[52px] rounded-2xl flex items-center justify-center font-extrabold text-sm text-white shadow-md relative overflow-hidden",
                      player.avatarColor
                    )}>
                      {player.avatarText}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent translate-y-[-100%] animate-[pulse_2.5s_infinite]" />
                    </div>

                    <div className="space-y-1">
                      <span className={cn(
                        "font-bold text-base block",
                        isBright ? "text-slate-800" : "text-white"
                      )}>
                        {player.name}
                      </span>
                      <div className="flex items-center gap-2.5 text-xs">
                        <span className="font-semibold text-rose-500">{player.elo} ELO</span>
                        <span className="opacity-30">|</span>
                        <span className={cn("font-medium", isBright ? "text-slate-500" : "text-slate-400")}>
                          Accuracy: {player.accuracy}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Language and Progress Badge Right */}
                  <div className="text-right flex flex-col items-end gap-1.5 relative z-10">
                    <div className={cn(
                      "px-3 py-1 rounded-xl text-[10px] font-extrabold tracking-wider border flex items-center gap-1.5 uppercase",
                      isBright 
                        ? "bg-slate-100 border-slate-200 text-slate-600" 
                        : "bg-slate-900 border-white/5 text-slate-300"
                    )}>
                      <Code2 size={11} className="text-rose-400" />
                      {player.language}
                    </div>
                    <span className={cn(
                      "text-xs font-mono font-bold tracking-tight",
                      playerProgressVal >= 100 ? "text-emerald-500" : (isBright ? "text-slate-500" : "text-slate-400")
                    )}>
                      {playerProgressVal >= 100 ? 'READY' : `${playerProgressVal}%`}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Bottom Section: Central Loading Progress Bar & Status messages */}
      <div className="w-full max-w-[800px] flex flex-col items-center gap-4 z-10 pb-8">
        <div className="w-full flex justify-between items-center px-1 text-xs">
          <motion.span 
            key={statusText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.7, y: 0 }}
            className={cn(
              "font-semibold tracking-wide italic",
              isBright ? "text-slate-700" : "text-slate-300"
            )}
          >
            {statusText}
          </motion.span>
          <span className={cn("font-mono font-bold", isBright ? "text-indigo-600" : "text-indigo-400")}>
            {progress}%
          </span>
        </div>

        {/* Global Loading Bar Container */}
        <div className={cn(
          "w-full h-2.5 rounded-full overflow-hidden p-0.5 border relative",
          isBright ? "bg-slate-200/50 border-slate-300/30" : "bg-slate-950/50 border-white/5"
        )}>
          {/* Animated Glow on loading progress */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
          {/* Subtle light bar reflect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />
        </div>


      </div>
    </div>
  )
}
