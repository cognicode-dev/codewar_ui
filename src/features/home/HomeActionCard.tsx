import { Swords, Compass, User, Gamepad2, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

interface HomeActionCardProps {
  title: string
  subtitle: string
  type: 'ranked-2v2' | 'practice' | 'ranked-solo' | 'custom'
  onClick?: () => void
}

const iconMap = {
  'ranked-2v2': {
    icon: Swords,
    bg: 'rgba(124, 58, 237, 0.08)',
    color: '#7C3AED'
  },
  'practice': {
    icon: Compass,
    bg: 'rgba(59, 130, 246, 0.08)',
    color: '#3B82F6'
  },
  'ranked-solo': {
    icon: User,
    bg: 'rgba(124, 58, 237, 0.08)',
    color: '#7C3AED'
  },
  'custom': {
    icon: Gamepad2,
    bg: 'rgba(17, 17, 26, 0.05)',
    color: '#6B7280'
  },
}

export function HomeActionCard({ title, subtitle, type, onClick }: HomeActionCardProps) {
  const config = iconMap[type]
  const Icon = config.icon

  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        y: -4,
        scale: 1.015,
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-[84px] rounded-[24px] px-5 flex items-center justify-between text-left cursor-pointer glass-card select-none group font-sans shrink-0"
    >
      <div className="flex items-center gap-4">
        {/* Left Icon: Translucent glass color rounded square tile at 48px */}
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0"
          style={{
            background: config.bg,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 255, 255, 0.65)',
          }}
        >
          <Icon size={20} strokeWidth={2} style={{ color: config.color }} />
        </div>
        
        {/* Title / Subtitle */}
        <div className="space-y-0.5">
          <h3 
            className="font-semibold leading-tight animate-fade-in"
            style={{
              fontSize: '16px',
              color: '#1A1533'
            }}
          >
            {title}
          </h3>
          <p 
            className="font-medium leading-tight mt-0.5"
            style={{
              fontSize: '12px',
              color: '#4B5563' // High-contrast slate gray for subtitle descriptions
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Chevron */}
      <ChevronRight size={18} strokeWidth={2} className="text-slate-400 group-hover:translate-x-0.5 transition-transform duration-200" />
    </motion.button>
  )
}
