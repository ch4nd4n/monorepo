# Testing Approach (Current Scope)

## Type
Manual testing for structure-first phase.

## Minimum manual checks
1. App loads with no console errors.
2. Board rendering is consistent with data definition.
3. Valid moves update state correctly.
4. Invalid moves are blocked (out-of-bounds / wall crossing).
5. Win state is triggered only on goal cell.

## Regression checks
- Switching boards resets state correctly.
- Move history/path output remains in sync with state.

## Future (optional)
- Add unit tests for move validation and edge normalization.
- Add snapshot-style checks for board-to-DOM rendering map.
