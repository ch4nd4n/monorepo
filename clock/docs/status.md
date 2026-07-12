# Status

Living log of what's been done against the Kairos mockup (`Kairos App (standalone).html`) and what's queued up next. Not a replacement for `decision-log.md` (product decisions) or `mvp-checklist.md` (PRD-derived scope) — this is a working changelog for the ongoing visual/UX alignment pass.

## Done (2026-07-13)

- **Color palette** — extracted the mockup's dark/light `oklch()` tokens, converted to hex, wired into `tailwind.config.ts` / `src/index.css` (background, surface, border, accent + accent-hover/press/on-accent, positive, danger). Replaced ad-hoc `stone-*`/`rose-*`/`emerald-*` utilities in light-theme branches with matching `light-*` tokens.
- **Audio cues** — distinct tones via `src/shared/utils/audio-cues.ts`: double-blip on workout start, single blip on manual control actions, ascending triad on completion, and a 3-2-1 "beep, beep, beeeeep" countdown scheduled on the AudioContext clock before every phase transition (preroll→work, work→rest, rest→work).
- **Icon system** — added `lucide-react` + `iconDisplayMode` setting (`text` / `iconsWithText` default / `iconsOnly`). Shared `IconLabel`/`IconButton` primitives render icons at 16px normally, 20px in icons-only mode, without changing button/element size. Wired into header, `ControlGrid`, `UtilityActions`, `Panel`/`SettingsModal` close buttons, and the interval stepper (+/- now Lucide `Minus`/`Plus`).
- **Layout spacing** — merged the header and A/B/C mode-toggle rows into one, tightened `TimerCard`'s secondary status-line spacing so the clock reads as the dominant element.
- Visual regression baseline (`tests/e2e/visual-regression.spec.ts-snapshots/`) refreshed to match; `test:visual:update` script fixed to force-overwrite (`--update-snapshots=all`) instead of silently keeping a stale baseline within diff tolerance.

## Next TODO — design polish pass

1. **Settings page**
   - Color palette is off vs. the mockup — align to the token system from the color-fix pass.
   - Use segmented push-buttons like the mockup instead of the current control style.
   - Work/Rest fields should match the home page's (`IntervalSetupCard`) stepper design instead of the plain `<Input type="number">` fields.
   - Form field colors are off.
   - Evaluate shadcn form primitives for more consistent theming — worth a spike before committing.
   - Improve checkbox styling (native checkboxes look out of place next to the rest of the UI).
2. **Border radius** — component radii don't match the mockup's scale (`--radius-sm: 4px`, `--radius-md: 6px`, `--radius-lg: 8px`, deliberately small — "never pills"). Audit `tailwind.config.ts`'s `borderRadius.lg: 0.75rem` and per-component `rounded-*` usage against this.
3. **Spacing consistency** — "Total N minutes" sits too close to the buttons below it in `IntervalSetupCard`. Do a full spacing review/decide-and-fix pass rather than a one-off patch.
4. **Voice Commands panel** — current layout (`Panel` with a plain `<ul>`) looks rough; needs real visual design.
5. **Session Summary layout** — same `Panel` + plain `<ul>` treatment; needs a proper layout (the `positive` green token exists but is unused here).
6. **Timer color by phase** (per mockup — rest phase has no distinct hue, it aliases muted text color: `--phase-rest: var(--text-2)`):
   - Work → accent color (current behavior, correct).
   - Rest → subtle gray/muted, not accent.
   - Paused → pulsing, but dim/subtle — not the bright accent color it uses today.
