# Coding Standards

These standards are locked from the coding-style grilling session and apply to MVP implementation.

## 1) TypeScript
- Use strict TypeScript (`strict: true`).
- Avoid `any`.
- Prefer explicit return types on exported functions.

## 2) File naming and symbols
- Use **kebab-case** for file names.
- Components: `.tsx` files in kebab-case (e.g., `workout-screen.tsx`).
- Logic/modules: `.ts` files in kebab-case (e.g., `command-policy.ts`).
- Types/interfaces: PascalCase type names.
- Constants: UPPER_SNAKE_CASE only for true constants.

## 3) React style
- Prefer thin components; extract logic into hooks/services.
- Use explicit props types/interfaces and plain function components.
- Avoid `React.FC` by default.
- Keep hooks focused; avoid effect-heavy logic.
- Use `useMemo`/`useCallback` only when needed and justified.
- Move complex side-effect orchestration to services/orchestrators.

## 4) Imports and module boundaries
- Use path aliases (avoid deep `../../..` imports).
- Prefer named exports.
- Use default exports only when necessary.
- Use barrel files only at intentional public boundaries (feature root).
- Avoid nested/deep barrel files.

## 5) Dependency direction
- `app` may import `features` and `shared`.
- `features` may import `shared` and their own internals.
- A feature must not import another feature’s internals.
- Cross-feature usage should go through the target feature’s public API.

## 6) Business logic placement
- Keep business rules out of UI components.
- Enforce rules in central application command/policy layer.
- Domain modules should remain framework-agnostic where intended.

## 7) Error handling
- Use typed `Result<T, E>` for expected failures.
- Reserve thrown exceptions for truly exceptional conditions.

## 8) Immutability
- Prefer immutable updates by default.
- Pure functions for domain/policy logic.
- Any controlled mutation should be isolated and justified.

## 9) Comments and documentation
- Prefer self-documenting code.
- Add targeted comments only for non-obvious constraints/invariants.
- Public modules may include concise docblocks.

## 10) Testing style
- Prefer small, focused tests.
- Use Arrange-Act-Assert structure.
- Keep tests deterministic.
- For timing logic, use fake timers / clock injection to avoid flakiness.

## 11) Config and thresholds
- Centralize magic numbers/thresholds in typed config/constants modules.
- Include brief rationale where thresholds are non-obvious.

## 12) Git and commits
- Use small conventional commits.
- Keep one concern per commit.

## 13) Size guidelines (not hard blockers)
- Prefer files under ~300 LOC.
- Prefer functions under ~50 LOC.
- Split modules by responsibility.
- Reviewer discretion applies.

## 14) Tooling enforcement
- Use Prettier + strict ESLint.
- Enforce import order and unused imports checks.
- Run checks in pre-commit and CI.
