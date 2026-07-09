# Testing Approach (Current Scope)

## Type
Manual testing for structure-first phase.

## Current checks (this ticket)
1. App loads with no console errors.
2. Tailwind styles are applied in dev mode.
3. Vite build succeeds with no errors.
4. Preview server serves built assets correctly.

## Future checks (gameplay phase)
1. Board rendering matches data definition.
2. Valid moves update state correctly.
3. Invalid moves are blocked (out-of-bounds / wall crossing).
4. Win state is triggered only on goal cell.
5. Switching boards resets state correctly.
6. Move history/path output remains in sync with state.

## Future automation (optional)
- Add unit tests for move validation and edge normalization.
- Add snapshot-style checks for board-to-DOM rendering map.
