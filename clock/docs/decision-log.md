# Decision Log

Tracks product decisions made during initial grill-me discovery for Kairos.

## 2026-07-12 — Initial discovery decisions

### Voice command model
- Use a fixed MVP command set.
- Require magic word prefix on every command.
- Prefix is fixed to **"Clock"** for MVP.
- Commands are strict exact phrases only (no synonym support in MVP).
- English-only in MVP.
- Recognition requires exact phrase + confidence threshold.
- On low confidence/ambiguity: do not execute; prompt repeat.

### Supported commands
- "Clock, start"
- "Clock, pause"
- "Clock, resume"
- "Clock, next"
- "Clock, stop"
- "Clock, reset"

### Voice mode and platform behavior
- Continuous listening for MVP where supported.
- iOS can fallback to tap/hold-to-talk when continuous listening is constrained.
- Show visible Voice Mode status badge on workout screen.
- Include manual mic on/off toggle.
- Voice active on workout screen only.

### Command behavior rules
- "Clock, stop" executes immediately.
- "Clock, reset" allowed at any time.
- If already running and user says start: ignore and show "Already running" feedback.

### Timer/workout behavior
- Timer engine should be clock-delta based for accuracy.
- Include default 3-second pre-roll.
- Pre-roll configurable and can be disabled.
- Start with one default workout template.
- Template parameters editable (work/rest/rounds).
- Persist last-used config locally.

### UX/accessibility/feedback
- Visual + audio confirmation on recognized commands.
- Optional lock-screen mode during active session.
- Optional vibration cues (default on mobile, off desktop).
- Voice command help overlay available on workout screen.
- Lightweight local session summary after stop/completion.

### Permissions/failure handling
- Request mic permission only via explicit "Enable Voice" action.
- If mic permission denied: continue with manual controls + guidance banner.
- On recognition drop: auto-retry with status; bounded retries; fallback to mic-off + banner if unrecovered.
- Locked reconnect policy details:
  - Max retries per disconnect: 3
  - Retry delay: ~800ms
  - Retry counter resets on successful reconnect
  - Manual controls remain available during reconnect/fallback

### Duration warning policy
- No hard session-length cap.
- Show non-blocking warning if estimated total exceeds preferred max.
- Warning shown in Settings and Start screen.
- Preferred max session time is user-configurable.
- Default preferred max session time: 30 minutes.

### Privacy/debugging
- No persistent voice transcript/history.
- Optional toggleable debug panel with last heard phrase, confidence, and decision outcome.

### Platform priority
- Required launch targets: Android Chrome + Desktop Chrome.
- iOS Safari is high-priority during MVP development.

### Scope boundaries
- Frontend-first now; backend API later.
- Explicit MVP out-of-scope includes: auth, cloud sync, backend analytics, social, wearables, multilingual support, custom wake word, natural-language parsing, multiple built-in templates.
