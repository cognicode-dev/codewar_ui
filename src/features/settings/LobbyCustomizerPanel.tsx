import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check } from 'lucide-react'
import { cn } from '@/utils'

interface LobbyCustomizerPanelProps {
  isOpen: boolean
  onClose: () => void
  isBright: boolean
  currentAvatar: string
  onChangeAvatar: (avatarId: string) => void
  currentBackground: string
  onChangeBackground: (bgId: string) => void
  avatarOptions: { id: string; name: string; glowColor: string; filterStyle: string; image: string }[]
  backgroundOptions: { id: string; name: string; filterStyle: string; baseImage: string }[]
}

export function LobbyCustomizerPanel({
  isOpen,
  onClose,
  isBright,
  currentAvatar,
  onChangeAvatar,
  currentBackground,
  onChangeBackground,
  avatarOptions,
  backgroundOptions
}: LobbyCustomizerPanelProps) {
  const [activeTab, setActiveTab] = useState<'avatar' | 'background'>('avatar')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 120 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: 120 }}
          transition={{ type: 'spring', stiffness: 340, damping: 24 }}
          style={{ transformOrigin: 'right center' }}
          className={cn(
            "absolute right-4 top-4 bottom-4 w-[310px] rounded-[28px] border backdrop-blur-3xl z-40 flex flex-col p-4 shadow-2xl overflow-hidden justify-between",
            isBright 
              ? "bg-white/90 border-white/60 shadow-[0_20px_50px_rgba(28,20,50,0.06)] text-slate-800" 
              : "bg-slate-900/95 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white"
          )}
        >
          {/* Top Switcher Tab Buttons */}
          <div className="shrink-0 flex gap-2 p-1 bg-slate-100/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/20 mb-4">
            <button
              onClick={() => setActiveTab('avatar')}
              className={cn(
                "flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-150 cursor-pointer active:scale-95",
                activeTab === 'avatar' 
                  ? "bg-indigo-500 text-white shadow-sm" 
                  : (isBright ? "text-slate-500 hover:text-slate-850" : "text-slate-400 hover:text-white")
              )}
            >
              Avatar
            </button>
            <button
              onClick={() => setActiveTab('background')}
              className={cn(
                "flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-150 cursor-pointer active:scale-95",
                activeTab === 'background' 
                  ? "bg-indigo-500 text-white shadow-sm" 
                  : (isBright ? "text-slate-500 hover:text-slate-850" : "text-slate-400 hover:text-white")
              )}
            >
              Background
            </button>
          </div>

          {/* Grid Content Selector Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-1">
            {activeTab === 'avatar' ? (
              <div className="grid grid-cols-2 gap-3 p-1">
                {avatarOptions.map((opt) => {
                  const isSelected = currentAvatar === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onChangeAvatar(opt.id)}
                      className={cn(
                        "relative aspect-square rounded-2xl border overflow-hidden flex items-center justify-center p-3 transition-all duration-250 cursor-pointer active:scale-95 group",
                        isSelected 
                          ? "border-indigo-500 ring-2 ring-indigo-500/25" 
                          : (isBright ? "border-slate-200/60 hover:border-slate-350" : "border-white/5 hover:border-white/10")
                      )}
                      style={{
                        background: isBright ? 'rgba(247, 248, 252, 0.45)' : 'rgba(15, 10, 30, 0.4)'
                      }}
                    >
                      {/* Inner Ambient Glow */}
                      <div 
                        className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity" 
                        style={{
                          background: `radial-gradient(circle, ${opt.glowColor} 0%, transparent 70%)`
                        }}
                      />
                      
                      {/* Avatar Image preview */}
                      <img 
                        src={opt.image} 
                        alt={opt.name} 
                        className="max-h-[85%] object-contain relative z-10 transition-transform duration-200 group-hover:scale-105"
                        style={{
                          filter: opt.filterStyle
                        }}
                      />

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4.5 h-4.5 rounded-full bg-indigo-500 flex items-center justify-center text-white relative z-20 shadow-sm border border-white/20">
                          <Check size={9} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-1">
                {backgroundOptions.map((opt) => {
                  const isSelected = currentBackground === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onChangeBackground(opt.id)}
                      className={cn(
                        "relative aspect-[4/3] rounded-2xl border overflow-hidden transition-all duration-250 cursor-pointer active:scale-95 group",
                        isSelected 
                          ? "border-indigo-500 ring-2 ring-indigo-500/25" 
                          : (isBright ? "border-slate-200/60 hover:border-slate-350" : "border-white/5 hover:border-white/10")
                      )}
                    >
                      {/* Background scenery thumbnail preview */}
                      <img 
                        src={opt.baseImage} 
                        alt={opt.name} 
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        style={{
                          filter: opt.filterStyle
                        }}
                      />

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4.5 h-4.5 rounded-full bg-indigo-500 flex items-center justify-center text-white relative z-20 shadow-sm border border-white/20">
                          <Check size={9} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] font-black uppercase transition-all duration-150 cursor-pointer shadow-sm active:scale-95 text-center shrink-0 mt-4"
          >
            Save
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
