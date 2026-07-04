import { motion } from 'motion/react'

export function HomeHeroPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center select-none overflow-visible pointer-events-none">
      {/* Glow 1: Color rgba(199,90,255,.22), Size 700px, Blur 140px */}
      <div 
        className="absolute rounded-full pointer-events-none select-none z-0"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(199, 90, 255, 0.22) 0%, transparent 70%)',
          filter: 'blur(140px)',
          transform: 'translateY(-30px)' // Center behind translated hero image
        }}
      />

      {/* Glow 2: Color rgba(120,80,255,.12), Size 1000px, Blur 200px */}
      <div 
        className="absolute rounded-full pointer-events-none select-none z-0"
        style={{
          width: '1000px',
          height: '1000px',
          background: 'radial-gradient(circle, rgba(120, 80, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(200px)',
          transform: 'translateY(-30px)' // Center behind translated hero image
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: -30 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full max-w-[480px] max-h-[480px] flex items-center justify-center overflow-visible z-10"
      >
        <img
          src="/hero_placeholder.png"
          alt="Identity Artwork Placeholder"
          className="w-full h-full object-contain opacity-[0.92]"
          style={{
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)'
          }}
        />
      </motion.div>
    </div>
  )
}
