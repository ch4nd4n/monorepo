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

## Tailwind / CSS
- Prefer Tailwind utility classes for component styling.
- Keep shared global styles in `styles/main.css`.
- Use custom CSS only when utilities are insufficient.
- Keep specificity low and avoid `!important`.

## Naming
- Files: kebab-case (`game-controls.js` if split later).
- Variables/functions: camelCase.
- Constants: UPPER_SNAKE_CASE when truly constant.
- CSS classes (when custom classes are needed): kebab-case and descriptive (`board-cell`, `is-blocked`).

## Tooling conventions
- Use `pnpm` for dependency and script management.
- Do not commit npm lockfiles; use `pnpm-lock.yaml`.

## Error handling and feedback
- Return explicit validation outcomes from game logic.
- Surface user-friendly messages in UI for invalid moves.
