export const fontFamily = {
  sans: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', 'Consolas', monospace",
} as const

export const fontSize = {
  xs: ['10px', { lineHeight: '14px', letterSpacing: '0.02em' }],
  sm: ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],
  base: ['14px', { lineHeight: '20px', letterSpacing: '0em' }],
  md: ['15px', { lineHeight: '22px', letterSpacing: '0em' }],
  lg: ['16px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
  xl: ['18px', { lineHeight: '26px', letterSpacing: '-0.01em' }],
  '2xl': ['20px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
  '3xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
  '4xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.03em' }],
  '5xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.03em' }],
  '6xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.04em' }],
} as const

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export type FontFamilyToken = keyof typeof fontFamily
export type FontSizeToken = keyof typeof fontSize
export type FontWeightToken = keyof typeof fontWeight
