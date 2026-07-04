export const duration = {
  instant: 0,
  faster: 75,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 400,
  slowest: 500,
  display: 700,
} as const

export const easing = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

export const motion = {
  hover: {
    scale: 1.02,
    duration: duration.fast,
    easing: easing.out,
  },
  tap: {
    scale: 0.98,
    duration: duration.faster,
    easing: easing.in,
  },
  modal: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    duration: duration.normal,
    easing: easing.out,
  },
  page: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    duration: duration.slow,
    easing: easing.smooth,
  },
  panel: {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    duration: duration.normal,
    easing: easing.out,
  },
  sidebar: {
    duration: duration.slow,
    easing: easing.smooth,
  },
  tooltip: {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
    duration: duration.fast,
    easing: easing.out,
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    duration: duration.normal,
  },
  slideUp: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    duration: duration.slow,
    easing: easing.smooth,
  },
} as const

export type DurationToken = keyof typeof duration
export type EasingToken = keyof typeof easing
