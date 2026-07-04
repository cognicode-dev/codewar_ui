import { motion } from 'motion/react'
import { Trophy, X, Users, TrendingUp } from 'lucide-react'

const activityItems = [
  {
    type: 'victory',
    title: 'Victory',
    subtitle: 'Ranked 2v2',
    time: '2h ago',
    icon: Trophy,
    colorClass: 'text-[#10B981] bg-[#10B981]/8 border-[#10B981]/15',
  },
  {
    type: 'defeat',
    title: 'Defeat',
    subtitle: 'Ranked Solo',
    time: '5h ago',
    icon: X,
    colorClass: 'text-[#EF4444] bg-[#EF4444]/8 border-[#EF4444]/15',
  },
  {
    type: 'teammate',
    title: 'New Teammate',
    subtitle: 'Nexus_Core',
    time: 'Yesterday',
    icon: Users,
    colorClass: 'text-[#3B82F6] bg-[#3B82F6]/8 border-[#3B82F6]/15',
  },
  {
    type: 'streak',
    title: 'Streak Update',
    subtitle: '7 wins in a row',
    time: 'Yesterday',
    icon: TrendingUp,
    colorClass: 'text-[#7C3AED] bg-[#7C3AED]/8 border-[#7C3AED]/15',
  },
]

export function HomeRecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1.0, y: 0 }}
      whileHover={{ scale: 1.008 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full rounded-[32px] p-6 glass-card flex flex-col justify-center select-none text-left transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2 px-2">
        <span 
          className="font-semibold uppercase"
          style={{
            fontSize: '11px',
            color: '#8B92A6',
            letterSpacing: '1.2px'
          }}
        >
          Recent Activity
        </span>
        <button 
          className="font-semibold uppercase tracking-wider cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            fontSize: '11px',
            color: '#7C3AED'
          }}
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {activityItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <div key={idx} className="flex items-center gap-3 px-3 py-1.5 rounded-2xl hover:bg-white/20 transition-colors duration-200 cursor-pointer">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${item.colorClass} shrink-0`}>
                <Icon size={14} strokeWidth={2} />
              </div>
              <div>
                <h4 
                  className="font-semibold leading-tight"
                  style={{
                    fontSize: '13px',
                    color: '#1A1533'
                  }}
                >
                  {item.title}
                </h4>
                <p 
                  className="font-normal leading-tight mt-0.5"
                  style={{
                    fontSize: '11px',
                    color: '#8B92A6'
                  }}
                >
                  {item.subtitle}
                </p>
                <span 
                  className="block mt-0.5"
                  style={{
                    fontSize: '9px',
                    color: '#9CA3AF'
                  }}
                >
                  {item.time}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
