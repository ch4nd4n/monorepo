# Contributing

## Before coding
1. Read `documentation/architecture.md`.
2. Read `documentation/code-style.md`.
3. Check current scope in ticket #3.
4. Treat Issue #2 as gameplay requirements source of truth.

## Implementation checklist
- Keep concerns separated: data vs logic vs UI.
- Add or update docs when structure/style changes.
- Avoid introducing frameworks unless explicitly requested.
- Keep PRs small and focused.

## Adding new boards
- Update board data file only.
- Do not hard-code board-specific logic in UI or game engine.

## Pull request expectations
- Clear summary of what changed.
- Short test notes (manual steps + expected outcomes).
- Confirm style guide compliance.
