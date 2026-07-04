# Colors

## Semantic Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg` | `#ffffff` | `#0a0a0a` | Page background |
| `--bg-alt` | `#fafafa` | `#141414` | Alternative background |
| `--bg-hover` | `#f5f5f5` | `#1f1f1f` | Hover state |
| `--bg-active` | `#ebebeb` | `#292929` | Active/pressed state |
| `--bg-surface` | `#ffffff` | `#141414` | Card/surface background |
| `--bg-elevated` | `#ffffff` | `#1f1f1f` | Elevated (dropdowns, popovers) |
| `--bg-overlay` | `rgba(0,0,0,0.5)` | `rgba(0,0,0,0.7)` | Modal overlays |
| `--fg` | `#1f1f1f` | `#ebebeb` | Primary text |
| `--fg-muted` | `#525252` | `#a3a3a3` | Secondary text |
| `--fg-subtle` | `#8a8a8a` | `#6b6b6b` | Tertiary text |
| `--border` | `#e0e0e0` | `#292929` | Default border |
| `--accent` | `#6366f1` | `#6366f1` | Primary accent (Indigo) |

## Usage in Tailwind

Use semantic tokens as classes:
- `bg-bg`, `bg-bg-alt`, `bg-accent`
- `text-fg`, `text-fg-muted`, `text-accent`
- `border-border`, `border-accent`

## Raw Palette

The full palette is defined in `lib/tokens/colors.ts` and includes brand (50–950), neutral (0–1000), success, warning, error, syntax highlighting, and editor-specific colors.
