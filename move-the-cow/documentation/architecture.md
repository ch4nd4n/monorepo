# Architecture

## Goal
Keep the app modular and readable using Vanilla JavaScript with Tailwind CSS, powered by Vite for local development and builds.

## Directory layout
```text
move-the-cow/
  index.html
  README.md
  AGENTS.md
  vite.config.js
  assets/
  documentation/
  src/
    main.js
  styles/
    main.css
```

## Module boundaries (planned)
- `src/boards.js`
  - Board data definitions.
  - No UI logic.
- `src/game.js`
  - Core game state and move validation.
  - No direct DOM manipulation.
- `src/ui.js`
  - DOM rendering and input wiring.
  - Calls game logic APIs; does not contain rules.
- `src/utils.js`
  - Shared helpers (formatting, normalization, etc.).

## Tooling
- Package manager: `pnpm`
- Dev server: `pnpm dev`
- Production build: `pnpm build`
- Local preview: `pnpm preview`

## Design principles
1. Single responsibility per file.
2. Keep game rules in one place (`game.js`).
3. Keep board configuration data-only.
4. Prefer small, pure functions for logic.
5. Keep UI rendering deterministic from state.
6. Keep Tailwind usage in markup, with minimal custom CSS in `styles/main.css`.
