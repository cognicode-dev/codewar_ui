# Background Template Design Guidelines

To maintain consistent compositions, legibility, and prevent layout conflicts when adding future theme backgrounds (e.g. cyberpunk, fantasy, sci-fi, samurai), all designs must adhere to the following composition safe zones:

## Layout Safe Zones

```
 0% ────────────────────────── 22% ────────────────────────── 78% ───────────────────────── 100%
  ┌─────────────────────────────┬─────────────────────────────┬────────────────────────────┐
  │      Left UI Exclusion      │        Character Center     │     Right UI Exclusion     │
  │     (Practice text, lp)     │       (Identity Avatar)     │        (Mode Cards)        │
  │                             │                             │                            │
  │     No portals, giant trees │   Important environment     │    No high-contrast details│
  │     or bright shapes here.  │   details go in 35% - 65%.  │    that compete with UI.   │
  └─────────────────────────────┴─────────────────────────────┴────────────────────────────┘
```

- **Top safe area**: `20px` (avoid obscuring the main header widgets).
- **Character center**: `50%` (aligns perfectly with the identity hero placement).
- **Important environment focal points**: `35%–65%` (mount shadows, portals, artifacts in the middle zone).
- **Left UI exclusion zone**: `0–22%` (protects text labels and sidebar controls from overlay noise).
- **Right UI exclusion zone**: `78–100%` (protects the action lobby select cards from visual noise).
- **Bottom fade starts**: `85%` (smooth blend into lower widgets).
- **Maximum brightness**: `35%` (ensures dark/light layout widgets remain high contrast).
- **Maximum saturation**: `55%` (maintains dynamic readability).
