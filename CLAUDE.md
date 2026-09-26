# CLAUDE.md

Single-page portfolio at quyenjd.github.io. Create React App (react-scripts 5) + TypeScript 5 + MUI 9, deployed to GitHub Pages by `.github/workflows/deploy.yml` on push to `main`.

## Rules

- All content comes from `src/data/*.json`; components never hard-code content. Types in `src/data/types.ts`. Descriptions are Markdown with inline HTML allowed (`components/Markdown.tsx`, `rehype-raw`; content is our own JSON, not user input).
- Keep code concise. No extra dependencies unless clearly needed (animations are CSS keyframes / MUI transitions).
- `npm run typecheck && npm run lint && CI=true npm run build` must pass; CI treats ESLint warnings as errors.
- `.npmrc` uses `legacy-peer-deps` (react-scripts pins TS 4) and `ajv@8` is pinned for webpack. Do not remove.
- MUI 9: no system props on components (`mb`, `fontWeight`, and also `color` on Typography, which is silently ignored); everything goes in `sx`.
- Every image uses `Img` from `src/lib.ts` (rounded corners). Dates are `YYYY-MM`; `end: null` = Present, omitted `end` = single month (projects only).
- Hover styles go inside `[HOVER]` (`@media (hover: hover)`) so touch devices never get stuck hover states.
- Font: Cascadia Code (Google Fonts).

## Layout

`App.tsx` is a full-viewport container with native CSS scroll-snap (`y mandatory`) for mouse/trackpad, and no snapping on touch devices (`@media (hover: none) and (pointer: coarse)`, because iOS snaps back to a tall section's top); each `Section` is at least one viewport tall and snaps at its start (`scroll-snap-stop: always`). Sections taller than the viewport scroll freely inside; no end-of-section snap point and no JS wheel/scroll handling (tried and reverted: too buggy across browsers). Viewport height is `VH` from `src/lib.ts` (a `--vh` variable set from `window.innerHeight` in `index.tsx`), never `dvh`. Titled sections pin the title to the top; untitled ones center content.

1. **Hero** — dark; avatar left, name, location + current role lines, bio right; one column on mobile; bouncing chevron (`ScrollHint`) at the bottom scrolls to the next section.
2. **Experience** — horizontal company timeline (most recent first) above a panel. Items: name above dot, period below (always rendered, hidden when inactive, so widths never change); names/periods never wrap; 1rem gap with the connector line bridging it; rail scrolls horizontally and centers the selected item. Panel: logo header + vertical role timeline (dot centered on the title box via computed offset); exactly one role open per company, clicking the open one does nothing; single-role companies are always open and not clickable; role dots are clickable. The section grows with its content (no inner scrolling). Switching slides the old panel out and the new one in (direction-aware) while the wrapper height animates. Prev/next chevrons flank the panel on desktop (hidden below `md`); on touch, a horizontal swipe on the panel (`touch-action: pan-y`) switches company.
3. **Projects** — one-column row cards (`logo` left; `image` appears only in the sheet; a YouTube URL as `image` embeds the video). Click opens a bottom sheet (85% height) sliding up, blurred backdrop, drag handle + close button in a header row, swipe down to dismiss.
4. **Contact** — blurred background image, title, row of icon links (`contact.json`); bouncing up-chevron scrolls back to the top.

## Interaction

- ButtonBase items use `disableRipple` with subtle hover (dot pop / background tint). Timeline items are `component="div"` with `justifyContent: flex-start` so dots stay level.
- Keyboard: ↑/↓ move one stop (the target stop is tracked so presses chain and mid-scroll reversals work); ←/→ switch company and Tab / Shift+Tab cycle its roles while Experience is on screen; in Projects, one card is focused (lifted) by mouse hover or Tab / Shift+Tab, and Enter opens it. Native Tab focus navigation is disabled on purpose.
