# Training Plan

16-week sport climbing macrocycle. Goal: UIAA 8 indoor / UIAA 7 outdoor. Start: 2026-05-04.

## Stack

Pure vanilla HTML/CSS/JS — no build step, no dependencies.

- `index.html` — shell, layout
- `style.css` — dark theme, component styles
- `data.js` — `PHASES`, `EXERCISES`, week templates, `WEEKS` array
- `app.js` — rendering, sidebar, calendar, modals

## Data model

`EXERCISES` — keyed object (`A`, `T1`–`T9`, `C1`–`C4`, `D1`–`D4`, `E1`–`E3`). Each has `content[]` blocks (types: `section`, `kv`, `text`, `table`, `list`, `warn`).

`WEEKS` — generated array of 16 weeks. Each week has `days[]` built from templates in `T`. Template map: `WEEK_TEMPLATE_MAP`.

## Deploy

GitHub Pages from `main` root. No build. See README.
