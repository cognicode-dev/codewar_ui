# Design System

## Overview

Code Arena uses a token-based design system. Every visual property references a token — no hardcoded values.

## Architecture

```
lib/tokens/    → TypeScript token values
styles/        → CSS custom properties (themes)
components/ui/ → Primitive components
components/*/  → Composed components
```

## Principles

1. **Token First** — Every color, space, radius, shadow, and motion comes from a token file.
2. **Theme from Day 1** — Dark and light modes are supported from the start via CSS variables.
3. **Composition over Configuration** — Small, focused components are composed into larger ones.
4. **250 Line Limit** — No component exceeds 250 lines. If it does, split it.
5. **Consistent Motion** — All animations come from `lib/tokens/motion.ts`.

## Tech Stack

- **React 19** — UI library
- **Vite** — Build tool
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Utility-first CSS (via `@tailwindcss/vite`)
- **Motion (v12)** — Animation library (formerly Framer Motion)
- **Monaco Editor** — Code editor
- **React Router v7** — Routing
- **Lucide React** — Icons
- **shadcn/ui** — Component primitives (adapted)
- **CVA** — Class Variance Authority for component variants
- **clsx + tailwind-merge** — Class composition via `cn()`
