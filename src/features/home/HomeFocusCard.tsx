import { motion } from 'motion/react'
import { Swords, ChevronRight } from 'lucide-react'

export function HomeFocusCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="w-[330px] h-[180px] rounded-[28px] p-5 flex flex-col justify-between select-none text-left glass-card"
    >
      <div className="space-y-3">
        {/* Header */}
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
                color: '#8B5CF6',
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
              Ranked 2v2
            </h3>
            <span 
              className="font-normal flex items-center gap-1.5 leading-tight mt-1"
              style={{
                fontSize: '12px',
                color: '#8B92A6'
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shrink-0" />
              Searching...
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#eef0f6] w-full" />

      {/* Bottom section: Avatars & Queue status */}
      <div className="flex items-center justify-between cursor-pointer group">
        <div className="flex items-center gap-3">
          {/* Overlapping Avatars - scaled 50% larger (42px) with adjusted overlap */}
          <div className="flex -space-x-3.5">
            <div 
              className="w-[42px] h-[42px] rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
              style={{
                background: '#EEF2FF',
                color: '#3B82F6'
              }}
            >
              SD
            </div>
            <div 
              className="w-[42px] h-[42px] rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
              style={{
                background: '#7C3AED'
              }}
            >
              KD
            </div>
          </div>
          <div>
            <span 
              className="font-semibold block leading-tight"
              style={{
                fontSize: '12px',
                color: '#1A1533'
              }}
            >
              1 friend
            </span>
            <span 
              className="font-normal block leading-tight mt-0.5"
              style={{
                fontSize: '12px',
                color: '#8B92A6'
              }}
            >
              in queue
            </span>
          </div>
        </div>
        <ChevronRight size={16} strokeWidth={2} className="text-slate-400 group-hover:translate-x-0.5 transition-transform duration-200" />
      </div>
    </motion.div>
  )
}
