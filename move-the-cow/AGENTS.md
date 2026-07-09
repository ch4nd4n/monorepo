# AGENTS.md — Move-the-Cow

Guidance for coding agents working in `move-the-cow/`.

## Scope
- Follow ticket #3 focus: structure and style first.
- Treat Issue #2 as gameplay requirements source of truth.
- Do not alter requirements semantics unless explicitly requested.

## Required reading before edits
1. `documentation/architecture.md`
2. `documentation/code-style.md`
3. `documentation/requirements-source.md`

## Coding rules
- Keep concerns separated:
  - board data (`src/boards.js`)
  - game logic (`src/game.js`)
  - UI/DOM (`src/ui.js`)
- Prefer small pure functions for logic.
- Avoid global mutable state.
- Keep CSS low-specificity and class-based.

## Change policy
- Keep changes minimal and focused.
- Update docs when module boundaries or conventions change.
- For requirements changes: update source issue first (#2), then mirror to repo docs when that follow-up exists.

## PR checklist
- [ ] Structure remains modular
- [ ] Style guide followed
- [ ] Docs updated where needed
- [ ] Manual test notes included
