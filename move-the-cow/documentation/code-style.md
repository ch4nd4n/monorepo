# Code Style Guide

## JavaScript
- Use `const` by default; `let` only when reassignment is required.
- Use semicolons and single quotes.
- Prefer small named functions over long inline callbacks.
- Keep functions focused; avoid mixing data logic and DOM logic.
- Use clear names (`currentPosition`, `blockedEdges`, `isMoveValid`).
- Avoid global mutable state; keep state in one controller/module.

## HTML
- Use semantic structure (`main`, `section`, `button`, etc.).
- Keep markup minimal and predictable for JS hooks.
- Use `data-*` attributes for behavior hooks where helpful.

## CSS
- Keep styles in `styles/main.css` (or clearly named split files later).
- Use class-based selectors; avoid styling by element depth.
- Use CSS variables for theme tokens (color, spacing).
- Keep specificity low and avoid `!important`.

## Naming
- Files: kebab-case (`game-controls.js` if split later).
- Variables/functions: camelCase.
- Constants: UPPER_SNAKE_CASE when truly constant.
- CSS classes: kebab-case and descriptive (`board-cell`, `is-blocked`).

## Error handling and feedback
- Return explicit validation outcomes from game logic.
- Surface user-friendly messages in UI for invalid moves.
