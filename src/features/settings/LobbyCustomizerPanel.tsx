import { motion } from 'motion/react'
import { ChevronLeft, Check, Sparkles, Image } from 'lucide-react'
import { cn } from '@/utils'

interface LobbyCustomizerPanelProps {
  isBright: boolean
  onBack: () => void
  currentAvatar: string
  onChangeAvatar: (avatarId: string) => void
  currentBackground: string
  onChangeBackground: (bgId: string) => void
  avatarOptions: { id: string; name: string; color: string }[]
  backgroundOptions: { id: string; name: string; color: string }[]
}

export function LobbyCustomizerPanel({
  isBright,
  onBack,
  currentAvatar,
  onChangeAvatar,
  currentBackground,
  onChangeBackground,
  avatarOptions,
  backgroundOptions
}: LobbyCustomizerPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className={cn(
        "w-full h-[278px] rounded-[28px] p-5 flex flex-col justify-between select-none text-left glass-card border border-white/40 shadow-sm",
        isBright ? "text-slate-800" : "text-white"
      )}
    >
      {/* Header with Back Button */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/20 shrink-0">
        <button
          onClick={onBack}
          className={cn(
            "flex items-center gap-1 text-[10px] font-black uppercase tracking-tight transition-colors cursor-pointer",
            isBright ? "text-indigo-600 hover:text-indigo-800" : "text-indigo-400 hover:text-indigo-300"
          )}
        >
          <ChevronLeft size={13} />
          Play Modes
        </button>
        <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">
          Lobby Customizer
        </span>
      </div>

      {/* Selector Sections */}
      <div className="flex-1 grid grid-cols-2 gap-4.5 py-3 min-h-0">
        {/* Left Side: Avatar Customization */}
        <div className="flex flex-col min-h-0">
          <span className={cn(
            "text-[9px] font-black uppercase tracking-wider block mb-1.5 flex items-center gap-1",
            isBright ? "text-slate-600" : "text-slate-400"
          )}>
            <Sparkles size={10} className="text-violet-500" />
            Floating Hero
          </span>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5">
            {avatarOptions.map((opt) => {
              const isSelected = currentAvatar === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => onChangeAvatar(opt.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all duration-150 cursor-pointer active:scale-98",
                    isSelected
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                      : (isBright 
                        ? "bg-white/50 border-slate-200/40 text-slate-700 hover:bg-white/80" 
                        : "bg-slate-900/40 border-white/5 text-slate-300 hover:bg-slate-900/60")
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", opt.color)} />
                    {opt.name}
                  </div>
                  {isSelected && <Check size={10} strokeWidth={3} />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Side: Background Customization */}
        <div className="flex flex-col min-h-0">
          <span className={cn(
            "text-[9px] font-black uppercase tracking-wider block mb-1.5 flex items-center gap-1",
            isBright ? "text-slate-600" : "text-slate-400"
          )}>
            <Image size={10} className="text-violet-500" />
            Scenery Sky
          </span>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5">
            {backgroundOptions.map((opt) => {
              const isSelected = currentBackground === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => onChangeBackground(opt.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all duration-150 cursor-pointer active:scale-98",
                    isSelected
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                      : (isBright 
                        ? "bg-white/50 border-slate-200/40 text-slate-700 hover:bg-white/80" 
                        : "bg-slate-900/40 border-white/5 text-slate-300 hover:bg-slate-900/60")
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", opt.color)} />
                    {opt.name}
                  </div>
                  {isSelected && <Check size={10} strokeWidth={3} />}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onBack}
        className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase transition-all duration-150 cursor-pointer shadow-sm active:scale-95 text-center shrink-0"
      >
        Confirm Selection
      </button>
    </motion.div>
  )
}
