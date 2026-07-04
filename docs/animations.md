# Animations

## Motion System

All animations are centralized in `lib/tokens/motion.ts`. Every component references these tokens — never inline values.

## Tokens

### Duration
- `instant`: 0ms
- `faster`: 75ms (micro-interactions)
- `fast`: 150ms (hover, tap)
- `normal`: 200ms (panels, tooltips)
- `slow`: 300ms (page transitions, sidebars)
- `slower`: 400ms
- `slowest`: 500ms
- `display`: 700ms (hero animations)

### Easing
- `linear` — `linear`
- `in` — `cubic-bezier(0.4, 0, 1, 1)`
- `out` — `cubic-bezier(0, 0, 0.2, 1)`
- `inOut` — `cubic-bezier(0.4, 0, 0.2, 1)`
- `spring` — `cubic-bezier(0.34, 1.56, 0.64, 1)`
- `bounce` — `cubic-bezier(0.68, -0.55, 0.265, 1.55)`
- `smooth` — `cubic-bezier(0.16, 1, 0.3, 1)` (default for most)

## Presets

- `motion.hover` — scale 1.02, 150ms, ease-out
- `motion.tap` — scale 0.98, 75ms, ease-in
- `motion.modal` — fade + scale (0.95→1), 200ms
- `motion.page` — fade + slide-up (8px), 300ms, smooth
- `motion.panel` — fade + slide-up (4px), 200ms
- `motion.sidebar` — width transition, 300ms, smooth
- `motion.tooltip` — opacity + slide (4px), 150ms
- `motion.fadeIn` — opacity only, 200ms
- `motion.slideUp` — opacity + slide (12px), 300ms, smooth

## CSS Animations

Also available as Tailwind classes:
- `animate-fade-in`
- `animate-slide-up`
- `animate-slide-down`
- `animate-scale-in`
- `animate-spin`
- `animate-pulse`
