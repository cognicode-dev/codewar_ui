import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Swords, ChevronRight, Sliders, X, Check } from 'lucide-react'
import { cn } from '@/utils'

interface HomeFocusCardProps {
  matchState?: 'idle' | 'searching' | 'loading'
  searchTimer?: number
  selectedMatchType?: string
  onCancel?: () => void
  onStartSearch?: () => void
}

export function HomeFocusCard({
  matchState = 'idle',
  searchTimer = 0,
  selectedMatchType = 'Ranked 2v2',
  onCancel,
  onStartSearch
}: HomeFocusCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy')
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Array'])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const isSearching = matchState === 'searching'

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="w-[330px] h-[180px] rounded-[28px] p-5 flex flex-col justify-between select-none text-left glass-card"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0"
              style={{
                background: 'rgba(124, 58, 237, 0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.65)'
              }}
            >
              <Swords size={18} strokeWidth={2} className="text-[#7C3AED]" />
            </div>
            <div>
              <span 
                className="block font-semibold uppercase"
                style={{
                  fontSize: '11px',
                  color: '#5B21B6', // Deep purple-800 for strong card header legibility
                  letterSpacing: '1.2px',
                  lineHeight: 'tight'
                }}
              >
                Current Session
              </span>
              <h3 
                className="font-semibold leading-tight mt-0.5"
                style={{
                  fontSize: '18px',
                  color: '#1A1533'
                }}
              >
                {isSearching ? selectedMatchType : 'No Active Queue'}
              </h3>
              <span 
                className="font-medium flex items-center gap-1.5 leading-tight mt-1"
                style={{
                  fontSize: '12px',
                  color: '#4B5563' // High-contrast slate gray for status text
                }}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSearching ? 'bg-[#10B981] animate-pulse' : 'bg-slate-400'}`} />
                {isSearching ? `Searching... ${formatTime(searchTimer)}` : 'Ready to Match'}
              </span>
            </div>
          </div>
          {/* Action Button */}
          {isSearching && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (onCancel) onCancel()
              }}
              className="px-4 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-500/20 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm active:scale-95 shrink-0 mt-[16px]"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#eef0f6] w-full" />

      {/* Bottom section: Practice Setup Popup trigger */}
      <div 
        onClick={() => setShowModal(true)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100/50"
            style={{
              background: 'rgba(99, 102, 241, 0.08)',
            }}
          >
            <Sliders size={18} strokeWidth={2} />
          </div>
          <div>
            <span 
              className="font-bold block leading-tight text-xs text-[#1A1533]"
            >
              Practice Setup
            </span>
            <span 
              className="font-medium block leading-tight mt-0.5 text-[11px] text-[#4B5563]"
            >
              Select difficulty & topics
            </span>
          </div>
        </div>
        <ChevronRight size={16} strokeWidth={2} className="text-slate-400 group-hover:translate-x-0.5 transition-transform duration-200" />
      </div>

      {/* Pop-up Window Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 backdrop-blur-sm p-4">
            {/* Modal Overlay Close */}
            <div className="absolute inset-0 cursor-default" onClick={() => setShowModal(false)} />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-[360px] rounded-[28px] border border-white/60 bg-white/70 backdrop-blur-2xl p-5 shadow-2xl flex flex-col gap-4 text-slate-800 z-10"
              style={{
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/40">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                    Practice Setup
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                    Customize Arena Parameters
                  </span>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg border border-slate-200/50 bg-slate-100/50 hover:bg-slate-200/50 text-slate-600 transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <X size={13} />
                </button>
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
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black uppercase transition-all duration-150 cursor-pointer shadow-sm active:scale-95 text-center mt-2"
              >
                Confirm Setup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
