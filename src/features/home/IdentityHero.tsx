import { motion } from 'motion/react'
import { config as voidConfig } from '@/assets/identities/void/config'

interface IdentityHeroProps {
  identity?: typeof voidConfig
  isActive?: boolean
}

export function IdentityHero({ identity = voidConfig, isActive = true }: IdentityHeroProps) {
  // Generate 25 tiny, subtle floating dust particles
  const particles = isActive ? Array.from({ length: 25 }).map((_, i) => {
    const top = `${(i * 37 + 13) % 90}%`
    const left = `${(i * 59 + 7) % 90}%`
    const delay = `${((i * 17) % 30) / 10}s`
    const size = `${(i % 3) + 1.5}px`
    return { id: i, top, left, delay, size }
  }) : []

  return (
    <div className="absolute inset-0 select-none pointer-events-none overflow-visible">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Glow 1 (Top Center Focus): Purple ambient light */}
        <div 
          className="absolute"
          style={{
            width: '900px',
            height: '900px',
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: `radial-gradient(circle, ${identity.glowColor} 0%, rgba(124, 58, 237, 0.05) 50%, transparent 80%)`,
            filter: 'blur(180px)',
            opacity: 0.5
          }}
        />

        {/* Glow 2 (Avatar Backdrop Rim): Centered behind character */}
        <div 
          className="absolute"
          style={{
            width: '800px',
            height: '800px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translateX(-24px) translateY(-40px)', // Aligned horizontally to root scenery offset
            background: `radial-gradient(circle, ${identity.glowColor} 0%, rgba(124, 58, 237, 0.04) 60%, transparent 90%)`,
            filter: 'blur(180px)',
            opacity: 0.08
          }}
        />
        
        {/* Particle System: Tiny floating dust specs */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute bg-white/25 dark:bg-white/10 rounded-full"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [-12, 12],
              opacity: [0.15, 0.45, 0.15],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 5 + (p.id % 4),
              repeat: Infinity,
              repeatType: 'mirror',
              delay: parseFloat(p.delay),
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Layer 3: Character Avatar - z-20, floats weightlessly, shifted left for layout alignment */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none overflow-visible"
        style={{ transform: 'translateX(-50px) translateY(-50px)' }} // Shifted left and upward by 50px
      >
        <motion.div
          animate={isActive ? { y: [-6, 6] } : { y: 0 }}
          transition={isActive ? {
            repeat: Infinity,
            repeatType: 'mirror',
            duration: 4,
            ease: 'easeInOut'
          } : { duration: 0.1 }}
          className="w-full h-full flex items-center justify-center overflow-visible"
        >
          <img
            src={identity.avatar}
            alt={`${identity.name} Avatar`}
            className="h-[82%] object-contain overflow-visible opacity-100" // Fully opaque character stays solid
            decoding="async"
            style={{
              filter: 'drop-shadow(0 0 35px rgba(124, 58, 237, 0.35)) drop-shadow(0 0 75px rgba(124, 58, 237, 0.15))', // Crisp rim light bloom
              transform: 'scale(1.5)' // Scaled UP by 50% on img tag to prevent Framer Motion translate overrides
            }}
          />
        </motion.div>
      </div>

      {/* Layer 4: Ground Glow - z-22, blends bottom of character robes */}
      <div
        className="absolute pointer-events-none select-none z-22"
        style={{
          bottom: '8%',
          left: '50%',
          transform: 'translateX(-50%) translateX(-50px)', // Centered on the character
          width: '450px',
          height: '120px',
          background: `radial-gradient(ellipse at center, ${identity.glowColor.replace('0.18', '0.28')} 0%, ${identity.glowColor.replace('0.18', '0.06')} 50%, transparent 80%)`,
          filter: 'blur(35px)',
        }}
      />
    </div>
  )
}
