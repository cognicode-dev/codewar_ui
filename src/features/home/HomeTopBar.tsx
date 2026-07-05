import { Bell, Mail, ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'

export function HomeTopBar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-[64px] flex items-center justify-between px-8 select-none shrink-0"
    >
      {/* Left: CodeWar Logo - shifted 40px left and scaled up by 15% */}
      <div 
        className="flex items-center gap-2"
        style={{
          transform: 'translateX(-40px) scale(1.15)',
          transformOrigin: 'left center'
        }}
      >
        <span className="text-[#7C3AED] font-bold font-mono text-2xl tracking-tighter">&gt;_</span>
        <span 
          className="font-black uppercase tracking-wider text-sm"
          style={{
            color: '#1A1533'
          }}
        >
          CodeWar
        </span>
      </div>

      {/* Center: Nothing */}
      <div />

      {/* Right: Notifications, Messages, Profile info - tight vertical layout */}
      <div className="flex items-center gap-5">
        {/* Notifications & Messages */}
        <div className="flex items-center gap-5 text-slate-400">
          <button className="relative p-1.5 rounded-lg hover:bg-slate-100 hover:text-[#1A1533] transition-colors cursor-pointer">
            <Bell size={20} strokeWidth={2} style={{ color: '#6B7280' }} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
          </button>
          <button className="relative p-1.5 rounded-lg hover:bg-slate-100 hover:text-[#1A1533] transition-colors cursor-pointer">
            <Mail size={20} strokeWidth={2} style={{ color: '#6B7280' }} />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
