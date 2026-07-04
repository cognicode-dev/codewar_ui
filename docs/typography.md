# Typography

## Fonts

| Family | Usage | Source |
|--------|-------|--------|
| `Inter` | UI text, headings | system font stack |
| `JetBrains Mono` | Code, monospace | `@fontsource/jetbrains-mono` (optional install) |

## Type Scale

| Token | Size | Line Height | Letter Spacing | Usage |
|-------|------|-------------|----------------|-------|
| `xs` | 10px | 14px | 0.02em | Labels, badges |
| `sm` | 12px | 16px | 0.01em | Secondary text |
| `base` | 14px | 20px | 0em | Body, buttons |
| `md` | 15px | 22px | 0em | Card titles |
| `lg` | 16px | 24px | -0.01em | Section headings |
| `xl` | 18px | 26px | -0.01em | Small page titles |
| `2xl` | 20px | 28px | -0.02em | Medium headings |
| `3xl` | 24px | 32px | -0.02em | Large headings |
| `4xl` | 30px | 36px | -0.03em | Display |
| `5xl` | 36px | 44px | -0.03em | Hero |
| `6xl` | 48px | 56px | -0.04em | Giant |

## Usage

Apply via Tailwind classes:
- `text-xs`, `text-sm`, `text-base`, `text-lg`
- `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- `font-sans`, `font-mono`

Or reference `lib/tokens/typography.ts` for programmatic access.
