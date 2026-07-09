# Move-the-Cow Requirements

> Mirrored from GitHub Issue #2: https://github.com/ch4nd4n/monorepo/issues/2
> 
> This document is a versioned repository mirror of Issue #2 and preserves the same requirement semantics.

## move-the-cow — Requirements

Based on the reference worksheet image, implement a grid-based puzzle game where the player moves a cow to grass while respecting wall segments.

### 1) Core objective
- Build a game where the player moves the **cow** from a start tile to the **grass** goal tile.

### 2) Board model
Each puzzle board must define:
- `rows`, `cols`
- `start` (cow position)
- `goal` (grass position)
- `blockedEdges` (wall segments between adjacent cells)

Recommended JSON shape (0-indexed coordinates):

```json
{
  "id": "board-1",
  "rows": 4,
  "cols": 2,
  "start": { "r": 0, "c": 0 },
  "goal": { "r": 3, "c": 0 },
  "blockedEdges": [
    [[0, 0], [1, 0]],
    [[1, 1], [2, 1]],
    [[2, 0], [3, 0]]
  ]
}
```

### 3) Movement rules
- Allowed moves: **Up, Down, Left, Right**
- One tile per move
- No diagonal movement
- Cannot move outside board bounds
- Cannot cross any edge listed in `blockedEdges`

### 4) Win condition
- Puzzle is solved when player position equals `goal`.

### 5) Move validation
For each attempted move:
1. Target cell is in bounds
2. Move is orthogonal and exactly one cell
3. Edge between current and target is not blocked

### 6) Answer/path output
Support both formats:
- Step list: `Right, Down, Left, ...`
- Compressed form: `Right 2, Down 1, ...`

### 7) Initial puzzle set
Implement at least the 3 boards represented in the image:
- Board 1: 4x2 with 3 blocked edges
- Board 2: 2x5 with wall segments near the goal path
- Board 3: 4x4 with internal blocked structure requiring route planning around walls

### 8) Done criteria
- Player can complete all provided boards via valid moves only
- Invalid moves (wall/out-of-bounds) are prevented or rejected with clear feedback
- Win state is clearly shown when cow reaches grass
