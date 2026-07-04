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

        {/* Vertical divider */}
        <div className="h-5 w-px bg-slate-200" />

        {/* Profile Info - enlarged avatar to 44px (w-11 h-11) */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="relative">
            <img
              src="/avatar.png"
              alt="User Avatar"
              className="w-11 h-11 rounded-full object-cover border border-slate-200"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#F7F8FC] bg-[#10B981]" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1">
              <span 
                className="text-xs font-bold group-hover:text-[#7C3AED] transition-colors"
                style={{
                  color: '#1A1533'
                }}
              >
                dev.exe
              </span>
              <ChevronDown size={12} strokeWidth={2} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
            <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
              Online
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
