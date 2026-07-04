# Spacing

## Scale

```
0   1   2   4   6   8   10  12  14  16  18  20  24  28  32  36  40  44  48
52  56  60  64  72  80  96  112  128  144  160
```

All values are in pixels.

## Usage

Use Tailwind spacing classes directly:
- `p-4` → 16px padding
- `gap-2` → 8px gap
- `m-6` → 12px margin

The spacing tokens are defined in `lib/tokens/spacing.ts`.

## Guidelines

- **4px grid** — Most spacing is in increments of 4px.
- **2px exception** — `1px` and `2px` for borders and hairline separators.
- **Compact UI** — Use 12px (`spacing.12`) and 16px (`spacing.16`) for most padding.
- **Generous** — Use 24px+ for section spacing.
