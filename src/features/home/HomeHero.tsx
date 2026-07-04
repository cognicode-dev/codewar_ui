import { motion } from 'motion/react'

export function HomeHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3 text-left font-sans select-none"
    >
      <span 
        className="block font-normal tracking-tight"
        style={{
          fontSize: '36px',
          color: '#8487C7',
          lineHeight: '1.1'
        }}
      >
        Welcome,
      </span>
      <h1 
        className="font-extrabold uppercase tracking-tight"
        style={{
          fontSize: '64px',
          color: '#1A1533',
          lineHeight: '0.95'
        }}
      >
        dev.exe
      </h1>
      <p 
        className="font-normal"
        style={{
          fontSize: '18px',
          color: '#6B7280',
          lineHeight: '1.5',
          maxWidth: '320px',
          paddingTop: '2px'
        }}
      >
        Every algorithm you write shapes your legacy.
      </p>
    </motion.div>
  )
}
