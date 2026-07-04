import { useEffect, useRef } from 'react'
import './ambient-engine.css'

export function AmbientEngine() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let frame = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    const maxOffset = 6

    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5
      const y = event.clientY / window.innerHeight - 0.5
      targetX = x * maxOffset
      targetY = y * maxOffset

      if (!frame) {
        frame = window.requestAnimationFrame(update)
      }
    }

    const update = () => {
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08

      root.style.setProperty('--ambient-x', `${currentX.toFixed(3)}px`)
      root.style.setProperty('--ambient-y', `${currentY.toFixed(3)}px`)

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        frame = window.requestAnimationFrame(update)
      } else {
        frame = 0
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  return (
    <div ref={rootRef} className="ambient-engine" aria-hidden="true">
      <div className="ambient-engine__blob ambient-engine__blob--blue">
        <div className="ambient-engine__blob-core" />
      </div>
      <div className="ambient-engine__blob ambient-engine__blob--purple">
        <div className="ambient-engine__blob-core" />
      </div>
      <div className="ambient-engine__blob ambient-engine__blob--cyan">
        <div className="ambient-engine__blob-core" />
      </div>
      <svg className="ambient-engine__noise" xmlns="http://www.w3.org/2000/svg">
        <filter id="ambient-fractal-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ambient-fractal-noise)" />
      </svg>
      <div className="ambient-engine__vignette" />
    </div>
  )
}
