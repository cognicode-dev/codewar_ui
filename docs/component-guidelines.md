# Component Guidelines

## Structure

```
components/
├── arena/       → Arena-specific compound components
├── navigation/  → Nav bars, menus
├── sidebar/     → Sidebar variants
├── problem/     → Problem description, examples
├── editor/      → Monaco wrapper, toolbar
├── activity/    → Activity feeds, chat
├── team/        → Team panel, player cards
├── footer/      → Status bars, bottom toolbar
└── ui/          → Primitives (Button, Card, Badge, etc.)
```

## Rules

### 1. 250 Line Maximum
No component exceeds 250 lines. Split large components into smaller ones.

### 2. Composition
Build complex UIs by composing small components. The `ArenaLayout` composes `ProblemPanel`, `EditorPanel`, `TeamPanel`, etc.

### 3. Design Tokens Only
- Colors → CSS variables (via `bg-bg`, `text-fg`, `border-border`)
- Spacing → Tailwind spacing (`p-4`, `gap-2`)
- Shadows → `shadow-panel`, `shadow-floating`, `shadow-dialog`
- Motion → `lib/tokens/motion.ts` presets

### 4. Imports
Always use the `@/` path alias:
```ts
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
```

### 5. Variants
Use CVA for component variants:
```ts
const buttonVariants = cva('base-classes', {
  variants: { variant: { primary: '...', ghost: '...' } },
})
```

### 6. Types
Application types live in `src/types/index.ts`. Co-locate component prop types.

### 7. Mock Data → Real Data
Start with mock data from `src/mock/`. Later replace with `useQuery(...)` — zero UI changes needed.
