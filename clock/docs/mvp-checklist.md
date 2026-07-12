# MVP Implementation Checklist

Implementation-ready checklist derived from:
- `docs/product-requirements.md`
- `docs/decision-log.md`

## 1) Project setup
- [ ] Initialize frontend app scaffold.
- [ ] Define folder structure for:
  - [ ] Timer domain logic
  - [ ] Voice recognition adapter
  - [ ] UI/workout screen
  - [ ] Settings/state persistence
- [ ] Add environment-safe abstraction for browser speech APIs.
- [ ] Add API boundary interfaces (for future backend integration).

## 2) Core timer engine
- [ ] Implement clock-delta based timer core (no tick-only logic).
- [ ] Implement workout lifecycle states: idle, running, paused, stopped/completed.
- [ ] Implement interval progression: work/rest/round transitions.
- [ ] Implement 3-second pre-roll countdown.
- [ ] Add setting to disable pre-roll.
- [ ] Ensure reset works from any state.
- [ ] Ensure stop executes immediately.

## 3) Workout template/settings
- [ ] Provide one default template.
- [ ] Allow editing: work duration, rest duration, rounds.
- [ ] Restrict settings edits to idle/paused states only.
- [ ] Persist last-used settings locally.
- [ ] Add user-configurable preferred max session time (default 30 min).
- [ ] Compute estimated total workout duration.
- [ ] Show non-blocking warning if estimate exceeds preferred max.
- [ ] Show this warning in both Settings and Start screen.

## 4) Voice command system
- [ ] Add explicit **Enable Voice** action to request microphone permission.
- [ ] Handle permission denied with manual-controls-only fallback + guidance banner.
- [ ] Implement command parsing with strict exact phrases only:
  - [ ] "Clock, start"
  - [ ] "Clock, pause"
  - [ ] "Clock, resume"
  - [ ] "Clock, next"
  - [ ] "Clock, stop"
  - [ ] "Clock, reset"
- [ ] Enforce required prefix "Clock" on every command.
- [ ] Apply confidence threshold before command acceptance.
- [ ] On low confidence/ambiguity: ignore + prompt repeat.
- [ ] Ignore "Clock, start" while running + show "Already running" feedback.

## 5) Voice mode + platform behavior
- [ ] Continuous listening as default where supported.
- [ ] Implement iOS-compatible fallback to tap/hold-to-talk when needed.
- [ ] Add manual mic toggle (On/Off).
- [ ] Scope voice controls to workout screen only.
- [ ] Add auto-retry on recognition drop with reconnecting status.
- [ ] Add bounded retries, then fallback to mic-off + banner.
- [ ] Show visible voice mode/status badge:
  - [ ] Continuous
  - [ ] Tap-to-talk fallback
  - [ ] Mic Off

## 6) UX feedback/accessibility
- [ ] Large high-contrast timer on one-screen workout UI.
- [ ] Visual + audio confirmation for recognized commands.
- [ ] Audio/visual interval transition cues.
- [ ] Optional vibration toggle (default on mobile, off desktop).
- [ ] Add lock-screen mode during active session + clear unlock affordance.
- [ ] Add Voice Commands help overlay (exact phrase list).

## 7) Privacy + debugging
- [ ] Do not persist voice transcript/history.
- [ ] Keep voice debugging ephemeral for current session.
- [ ] Add optional debug panel toggle showing:
  - [ ] Last heard phrase
  - [ ] Confidence
  - [ ] Decision outcome (accepted/rejected + reason)

## 8) Session summary
- [ ] Show lightweight local summary after stop/completion.
- [ ] Include at least:
  - [ ] Total elapsed duration
  - [ ] Rounds completed
  - [ ] Basic interruption indicators (e.g., pauses)

## 9) Platform validation matrix
- [ ] Desktop Chrome validation pass.
- [ ] Android Chrome validation pass.
- [ ] iOS Safari high-priority validation pass.
- [ ] Record platform-specific constraints/workarounds.

## 10) Out-of-scope guardrails (MVP)
- [ ] No auth/account system.
- [ ] No backend API dependency for MVP operation.
- [ ] No cloud sync/cross-device persistence.
- [ ] No social/wearables integrations.
- [ ] No multilingual commands.
- [ ] No user-configurable wake word.
- [ ] No natural-language command parsing.
- [ ] No multiple built-in templates.

## 11) Done criteria
- [ ] User can run complete workout hands-free (where platform supports).
- [ ] App remains fully usable with manual controls only.
- [ ] Offline usage works for core timer + local settings.
- [ ] All locked PRD decisions reflected in implemented behavior.
