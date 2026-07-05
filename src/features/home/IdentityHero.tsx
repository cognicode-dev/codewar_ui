import { motion } from 'motion/react'
import { config as voidConfig } from '@/assets/identities/void/config'

interface IdentityHeroProps {
  identity?: typeof voidConfig
  isActive?: boolean
  avatarConfig?: {
    name: string
    glowColor: string
    dropShadowColor: string
    filterStyle: string
  }
}

export function IdentityHero({ identity = voidConfig, isActive = true, avatarConfig }: IdentityHeroProps) {
  const activeConfig = avatarConfig || {
    name: identity.name,
    glowColor: identity.glowColor,
    dropShadowColor: 'rgba(124, 58, 237, 0.35)',
    filterStyle: 'none'
  }

  // Generate 25 tiny, subtle floating dust particles
  const particles = isActive ? Array.from({ length: 25 }).map((_, i) => {
    const top = `${(i * 37 + 13) % 90}%`
    const left = `${(i * 59 + 7) % 90}%`
    const size = `${(i % 2) + 1.2}px`
    const delay = `${(i * 0.3).toFixed(1)}s`
    const duration = `${(i % 3) * 4 + 7}s`
    return (
      <motion.div
        key={i}
        className="absolute bg-white rounded-full pointer-events-none z-24"
        style={{
          top,
          left,
          width: size,
          height: size,
          opacity: 0.05
        }}
        animate={{
          y: [-12, 12],
          opacity: [0.03, 0.07, 0.03]
        }}
        transition={{
          duration: parseFloat(duration),
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: parseFloat(delay)
        }}
      />
    )
  }) : null

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center select-none overflow-visible cursor-default pointer-events-none"
      style={{ perspective: 1000 }}
    >
      {/* Layer 0: Ambient Backlight Glow - z-5, huge, soft purple atmospheric light */}
      <div
        className="absolute rounded-full pointer-events-none select-none z-5"
        style={{
          width: '1200px',
          height: '900px',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: `radial-gradient(circle, ${activeConfig.glowColor} 0%, rgba(124, 58, 237, 0.05) 50%, transparent 80%)`,
          filter: 'blur(180px)',
          opacity: 0.5
        }}
      />

      {/* Layer 0.5: Ambient Bloom - z-6, soft environment halo bloom */}
      <div
        className="absolute pointer-events-none select-none z-6"
        style={{
          width: '960px',
          height: '740px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translateX(-24px) translateY(-40px)', // Aligned horizontally to root scenery offset
          background: `radial-gradient(circle, ${activeConfig.glowColor} 0%, rgba(124, 58, 237, 0.04) 60%, transparent 90%)`,
          filter: 'blur(180px)',
          opacity: 0.08
        }}
      />

      {/* Layer 2.5: Character Separation Vignette (Darkens environment 5-8% behind avatar for contrast) */}
      <div 
        className="absolute rounded-full pointer-events-none z-18"
        style={{
          width: '450px',
          height: '450px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translateX(-50px) translateY(-20px)',
          background: 'radial-gradient(circle, rgba(10, 5, 25, 0.35) 0%, rgba(10, 5, 25, 0.08) 60%, transparent 90%)',
          filter: 'blur(40px)',
          mixBlendMode: 'multiply',
          opacity: 0.8
        }}
      />

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
            alt={`${activeConfig.name} Avatar`}
            className="h-[82%] object-contain overflow-visible opacity-100" // Fully opaque character stays solid
            decoding="async"
            style={{
              filter: `drop-shadow(0 0 35px ${activeConfig.dropShadowColor}) drop-shadow(0 0 75px rgba(124, 58, 237, 0.15)) ${activeConfig.filterStyle}`, // Crisp rim light bloom and theme shift
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
          background: `radial-gradient(ellipse at center, ${activeConfig.glowColor.replace('0.18', '0.28')} 0%, ${activeConfig.glowColor.replace('0.18', '0.06')} 50%, transparent 80%)`,
          filter: 'blur(35px)',
        }}
      />

      {/* Layer 5: Very subtle foreground lighting overlay - z-30 */}
      <div 
        className="absolute inset-0 z-30 pointer-events-none mix-blend-overlay opacity-25"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)'
        }}
      />

      {/* Dust Particles - z-24 */}
      {particles}
    </div>
  )
}
