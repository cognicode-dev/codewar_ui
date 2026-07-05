import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Settings, Play, Terminal } from 'lucide-react'
import { sidebarStaticConfig, type SidebarNavItem } from '@/sidebar.config'
import { cn } from '@/utils'

interface FloatingSidebarProps {
  activeId: string
  onChangeActiveId: (id: string) => void
  inRoom: boolean // Context-aware lobby/match state
  className?: string
}

export function FloatingSidebar({
  activeId,
  onChangeActiveId,
  inRoom,
  className,
}: FloatingSidebarProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Enable layoutId transitions only after the initial sidebar fade-in animation finishes
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Build dynamic first navigation item depending on user's room state
  const firstItem: SidebarNavItem = inRoom
    ? { id: 'arena', label: 'Arena', icon: Terminal, href: '/arena' }
    : { id: 'play', label: 'Play', icon: Play, href: '/play' }

  // Exactly 5 items, Home completely removed
  const sidebarConfig = [firstItem, ...sidebarStaticConfig]

  const activeIndex = sidebarConfig.findIndex((item) => item.id === activeId)

  return (
    <motion.aside
      initial={{ opacity: 0, x: -30, y: '-50%' }}
      animate={{ opacity: 1, x: 0, y: '-50%' }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className={cn('sidebar-dock', className)}
      aria-label="Sidebar Navigation"
    >
      {/* Layered Subtle Noise Texture */}
      <div className="sidebar-noise" />

      {/* Navigation list distributed equally via flexbox */}
      <nav className="nav-list-container no-scrollbar">
        {sidebarConfig.map((item: SidebarNavItem, index: number) => {
          const Icon = item.icon
          const isActive = item.id === activeId
          const isPrimary = item.id === 'arena' || item.id === 'play'
          
          // Calculate physical proximity distance
          const distance = Math.abs(index - activeIndex)
          
          // Proximity opacity hierarchy: Active = 100%, Nearby = 78%, Far = 65% for high-contrast clarity
          const defaultOpacity = isActive ? 1.0 : distance === 1 ? 0.78 : 0.65

          return (
            <div key={item.id} className="nav-item-wrapper">
              {/* Active Indicator Bar (Thin pink-purple glowing pill) */}
              {isActive && (
                <motion.div
                  layoutId={isMounted ? 'activeBar' : undefined}
                  className="active-bar-indicator"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}

              {/* Layer 1 of Active Item: Ambient Glow (Strong for primary, soft for secondary) */}
              {isActive && (
                <motion.div
                  layoutId={isMounted ? 'activeGlow' : undefined}
                  className={isPrimary ? 'active-ambient-glow' : 'active-ambient-glow-secondary'}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}

              {/* Layer 2 of Active Item: Floating Rounded Square */}
              <motion.button
                onClick={() => {
                  if (item.id === 'practice' || item.id === 'statistics') return
                  onChangeActiveId(item.id)
                }}
                style={{
                  cursor: (item.id === 'practice' || item.id === 'statistics') ? 'not-allowed' : 'pointer'
                }}
                animate={{
                  opacity: (item.id === 'practice' || item.id === 'statistics') ? 0.35 : defaultOpacity,
                }}
                whileHover={(item.id === 'practice' || item.id === 'statistics') ? {} : {
                  opacity: 1.0,
                  y: -1, // Symmetrical lift
                  scale: 1.02, // Symmetrical scale
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                }}
                className={cn(
                  'nav-item-btn focus-ring',
                  isActive && (isPrimary ? 'active-surface' : 'active-surface-secondary')
                )}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Layer 3 of Active Item: Centered Icon with transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={item.id} // Re-renders and triggers transition on context swap
                    initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="flex items-center justify-center"
                  >
                    <Icon
                      size={22}
                      strokeWidth={2}
                      className="nav-item-icon"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Notification count badge */}
                {item.badge !== undefined && (
                  <span className="nav-item-badge">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            </div>
          )
        })}
      </nav>

      {/* Bottom Profile Section separated by auto margin */}
      <div className="avatar-dock">
        <motion.button
          animate={{
            opacity: 0.78, // Understated rest state (increased for clarity)
          }}
          whileHover={{
            opacity: 1.0,
            y: -1,
            scale: 1.02,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 20,
          }}
          className="avatar-btn focus-ring"
          aria-label="Settings Menu"
        >
          <Settings size={22} strokeWidth={2} />
        </motion.button>
      </div>
    </motion.aside>
  )
}
