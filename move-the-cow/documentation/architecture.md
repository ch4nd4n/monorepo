# Architecture

## Goal
Keep the app modular and readable using plain HTML/CSS/JavaScript.

## Directory layout
```text
move-the-cow/
  index.html
  AGENTS.md
  assets/
  documentation/
  src/
  styles/
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

## Design principles
1. Single responsibility per file.
2. Keep game rules in one place (`game.js`).
3. Keep board configuration data-only.
4. Prefer small, pure functions for logic.
5. Keep UI rendering deterministic from state.
