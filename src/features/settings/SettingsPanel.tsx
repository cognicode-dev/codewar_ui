import { motion, AnimatePresence } from 'motion/react'
import { X, Settings, User, Sliders, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  isBright: boolean
  themeMode: 'bright' | 'dark'
  onToggleTheme: () => void
  onLobbySettingsClick: () => void
  activeAvatarName: string
}

export function SettingsPanel({
  isOpen,
  onClose,
  isBright,
  themeMode,
  onToggleTheme,
  onLobbySettingsClick,
  activeAvatarName
}: SettingsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.35, x: -20, y: 220 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.35, x: -20, y: 220 }}
          transition={{ type: 'spring', stiffness: 340, damping: 24 }}
          style={{ transformOrigin: 'left bottom' }}
          className={cn(
            "absolute bottom-4 left-[108px] w-[300px] h-[370px] rounded-[24px] border backdrop-blur-2xl z-40 flex flex-col p-4.5 overflow-hidden",
            isBright
              ? "bg-white/45 border-white/60 shadow-[0_20px_50px_rgba(28,20,50,0.06),_inset_0_1px_0_rgba(255,255,255,0.4)] text-slate-800"
              : "bg-slate-950/45 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.05)] text-white"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-200/20">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Settings size={14} />
              </div>
              <div>
                <h3 className={cn(
                  "text-xs font-black uppercase tracking-tight",
                  isBright ? "text-slate-900" : "text-white"
                )}>
                  Settings
                </h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                  Customize Environment
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

          {/* Profile Card Section (Profile Button moved here) */}
          <div className={cn(
            "p-3 rounded-2xl border flex flex-col gap-3 mb-4",
            isBright ? "bg-white/30 border-white/50" : "bg-slate-950/30 border-white/5"
          )}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-xs text-white">
                  DE
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div>
                <span className={cn("font-bold text-xs block", isBright ? "text-slate-800" : "text-white")}>
                  dev.exe
                </span>
                <span className={cn(
                  "text-[9px] font-extrabold uppercase tracking-wider block mt-0.5",
                  isBright ? "text-slate-600" : "text-slate-400"
                )}>
                  Online • 2920 ELO
                </span>
              </div>
            </div>

            <button
              onClick={() => alert('Profile Window Triggered')}
              className="w-full py-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase transition-all duration-150 cursor-pointer active:scale-95 flex items-center justify-center gap-1"
            >
              <User size={10} />
              Profile Settings
            </button>
          </div>

          {/* Settings Items Rows */}
          <div className="flex-grow space-y-3.5">
            {/* Theme Mode Toggle Row */}
            <div className="flex items-center justify-between px-1">
              <div>
                <span className={cn("text-xs font-bold block", isBright ? "text-slate-800" : "text-white")}>
                  Theme Mode
                </span>
                <span className={cn(
                  "text-[9px] font-extrabold uppercase tracking-wider block mt-0.5",
                  isBright ? "text-slate-600" : "text-slate-400"
                )}>
                  Switch backdrop scenery
                </span>
              </div>
              
              {/* Premium Switch slide toggle */}
              <button
                onClick={onToggleTheme}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors duration-200 relative p-1 cursor-pointer",
                  themeMode === 'bright' ? "bg-indigo-500" : "bg-slate-700"
                )}
              >
                <motion.div
                  layout
                  className="w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ x: themeMode === 'bright' ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Lobby Customization Selector Row */}
            <div
              onClick={() => {
                onLobbySettingsClick()
                onClose()
              }}
              className={cn(
                "flex items-center justify-between p-2.5 rounded-xl border transition-all duration-150 cursor-pointer active:scale-98",
                isBright ? "bg-white/30 hover:bg-white/50 border-white/50" : "bg-white/5 hover:bg-white/10 border-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-1.5 rounded-lg border",
                  isBright ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-white/5 border-white/5 text-slate-300"
                )}>
                  <Sliders size={13} />
                </div>
                <div>
                  <span className={cn("text-xs font-bold block", isBright ? "text-slate-800" : "text-white")}>
                    Lobby Customizer
                  </span>
                  <span className={cn(
                    "text-[9px] font-extrabold uppercase tracking-wider block mt-0.5",
                    isBright ? "text-slate-600" : "text-slate-400"
                  )}>
                    Hero: {activeAvatarName}
                  </span>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
