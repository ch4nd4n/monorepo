# Status

Living log of what's been done against the Kairos mockup (`Kairos App (standalone).html`) and what's queued up next. Not a replacement for `decision-log.md` (product decisions) or `mvp-checklist.md` (PRD-derived scope) — this is a working changelog for the ongoing visual/UX alignment pass.

## Done (2026-07-13)

- **Color palette** — extracted the mockup's dark/light `oklch()` tokens, converted to hex, wired into `tailwind.config.ts` / `src/index.css` (background, surface, border, accent + accent-hover/press/on-accent, positive, danger). Replaced ad-hoc `stone-*`/`rose-*`/`emerald-*` utilities in light-theme branches with matching `light-*` tokens.
- **Audio cues** — distinct tones via `src/shared/utils/audio-cues.ts`: double-blip on workout start, single blip on manual control actions, ascending triad on completion, and a 3-2-1 "beep, beep, beeeeep" countdown scheduled on the AudioContext clock before every phase transition (preroll→work, work→rest, rest→work).
- **Icon system** — added `lucide-react` + `iconDisplayMode` setting (`text` / `iconsWithText` default / `iconsOnly`). Shared `IconLabel`/`IconButton` primitives render icons at 16px normally, 20px in icons-only mode, without changing button/element size. Wired into header, `ControlGrid`, `UtilityActions`, `Panel`/`SettingsModal` close buttons, and the interval stepper (+/- now Lucide `Minus`/`Plus`).
- **Layout spacing** — merged the header and A/B/C mode-toggle rows into one, tightened `TimerCard`'s secondary status-line spacing so the clock reads as the dominant element.
- Visual regression baseline (`tests/e2e/visual-regression.spec.ts-snapshots/`) refreshed to match; `test:visual:update` script fixed to force-overwrite (`--update-snapshots=all`) instead of silently keeping a stale baseline within diff tolerance.

## Done (2026-07-13, later same day) — settings page redesign

- **Settings page colors** — `SettingsEditor` now takes `isLightTheme` (previously not threaded in at all) and every field is theme-aware. Fixed a real bug: `Input` hardcoded `bg-background`/`text-foreground` (dark tokens only), so "Preferred max session"/"Render FPS" rendered as dark-on-dark boxes inside the light-themed modal — now conditionally styled with `light-*` tokens.
- **Push buttons** — Theme (Light/Dark) and Button-labels (icon mode) segmented controls now use the same foreground/background-invert selected-state convention as `IntervalSetupCard`'s preset chips, instead of `Button`'s `default` variant (which hardcoded the *dark* accent color regardless of theme — so the light-theme selected state was previously wrong).
- **Work/Rest/Rounds fields** — extracted the home page's stepper into a shared `src/shared/ui/stepper.tsx` (`Stepper`) and reused it in both `IntervalSetupCard` and `SettingsEditor`, so the settings modal's fields are now visually identical to the home page instead of plain number inputs. Note: this drops direct numeric typing in favor of the home page's +/- only interaction — consistent by design, but worth knowing if large jumps (e.g. 30s → 3s) feel tedious.
- **Checkboxes** — replaced native `<input type="checkbox">` with a custom `src/shared/ui/checkbox.tsx` (`Checkbox`): accent-colored check mark, rounded border, theme-aware.
- **shadcn form primitives** — evaluated, decided against for now: the app already has its own small cva-based UI kit (`Button`/`Card`/`Badge`/`Input`) with the mockup's exact token names wired in; introducing shadcn would mean either running two styling systems side by side or re-theming shadcn's defaults to match, for marginal gain over just fixing the existing components (which turned out to be the real issue — missing theme-awareness, not the component library). Revisit only if form complexity grows significantly (e.g. real validation/multi-step forms).
- **Border radius** — root-caused: `tailwind.config.ts` overrode `borderRadius.lg` to `0.75rem` (12px), clashing with the mockup's `--radius-lg: 8px`. Removed the override — Tailwind's default scale (`rounded-md` 6px, `rounded-lg` 8px) already matches the mockup's `--radius-md`/`--radius-lg` exactly. Also changed `SettingsModal`'s container from `rounded-xl` (12px) to `rounded-lg` (8px) for consistency.
- **"Total N minutes" spacing** — was flush against the Start/Pause button below it (they're siblings in the same flex column with no gap). Added `mb-6` to `IntervalSetupCard`'s root section.
- Added `src/shared/ui/stepper.test.tsx` and `src/shared/ui/checkbox.test.tsx`; updated `tests/e2e/settings.spec.ts` to drive the new stepper buttons instead of `.fill()`; refreshed the visual baseline again.

## Next TODO — design polish pass

1. **Voice Commands panel** — current layout (`Panel` with a plain `<ul>`) looks rough; needs real visual design.
2. **Session Summary layout** — same `Panel` + plain `<ul>` treatment; needs a proper layout (the `positive` green token exists but is unused here).
3. **Timer color by phase** (per mockup — rest phase has no distinct hue, it aliases muted text color: `--phase-rest: var(--text-2)`):
   - Work → accent color (current behavior, correct).
   - Rest → subtle gray/muted, not accent.
   - Paused → pulsing, but dim/subtle — not the bright accent color it uses today.
