import { motion } from 'motion/react'

interface HomeHeroProps {
  username?: string
  isBright?: boolean
}

export function HomeHero({ username, isBright = true }: HomeHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3 text-left font-sans select-none"
    >
      <span 
        className="block font-semibold tracking-tight"
        style={{
          fontSize: '36px',
          color: '#4F46E5', // Rich indigo for attention and high legibility
          lineHeight: '1.1'
        }}
      >
        Welcome,
      </span>
      <h1 
        className="font-extrabold uppercase tracking-tight"
        style={{
          fontSize: '64px',
          color: isBright ? '#1A1533' : '#F3F4F6',
          lineHeight: '0.95'
        }}
      >
        {username || 'dev.exe'}
      </h1>
      <p 
        className="font-medium"
        style={{
          fontSize: '18px',
          color: isBright ? '#4B5563' : '#9CA3AF', // Premium subtitle contrast
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
