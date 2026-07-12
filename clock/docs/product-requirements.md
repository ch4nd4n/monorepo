# Product Requirements Document (PRD)

## 1) Product Name
Kairos

## 2) Problem Statement
During workouts, users often cannot conveniently interact with a timer using touch controls. They need a hands-free way to start, pause, resume, skip, and stop workout timing flows.

## 3) Goals
- Deliver a usable frontend MVP for voice-driven workout timing.
- Support clear visual + audio feedback with minimal interaction friction.
- Keep core workout flow available offline.
- Design frontend in a way that can integrate with backend APIs later.

## 4) Target Users
- Individuals doing HIIT, circuit, and interval workouts.
- Users who need hands-free timer control (e.g., during floor exercises).

## 5) MVP Scope (Locked)

### 5.1 Voice interaction model
- Fixed command set (strict exact phrases only).
- Required prefix on every command: **"Clock"**.
- English-only in MVP.
- Recognition rule: exact phrase + confidence threshold.
- Low confidence/ambiguous input: ignore and prompt repeat (never best-guess execute).
- Continuous listening as default mode.
- iOS fallback allowed: tap/hold-to-talk when continuous listening is constrained.

### 5.2 Supported voice commands (exact)
- "Clock, start"
- "Clock, pause"
- "Clock, resume"
- "Clock, next"
- "Clock, stop"
- "Clock, reset"

### 5.3 Command behavior rules
- "Clock, stop" executes immediately.
- "Clock, reset" allowed at any time.
- If already running and user says "Clock, start": ignore and show "Already running" feedback.
- Voice control active on workout screen only.

### 5.4 Workout/timer model
- One default workout template for MVP.
- Template parameters editable: work duration, rest duration, rounds.
- Pre-roll countdown default: 3 seconds.
- Pre-roll configurable in settings and can be toggled off.
- Timer core must be clock-delta based (not tick-only interval logic).

### 5.5 UX and feedback
- One-screen primary workout experience with large/high-contrast timer.
- Visual + audio confirmation on recognized commands.
- Voice mode status badge visible (e.g., Continuous, Tap-to-talk fallback, Mic Off).
- Manual mic toggle available.
- Voice Commands help overlay accessible anytime on workout screen.
- Optional lock screen mode during active session, with clear unlock affordance.

### 5.6 Permissions, failures, and recovery
- Voice permission requested only via explicit **Enable Voice** action.
- If mic permission denied: continue with full manual controls + clear re-enable guidance.
- If recognition drops mid-session: auto-retry with status ("Reconnecting voice…").
- Reconnect retry policy (MVP):
  - Maximum retries: **3** attempts per disconnect event.
  - Retry delay: **~800ms** between attempts.
  - On successful reconnect, reset retry counter.
  - If retries are exhausted, fallback to **mic-off** mode and show banner guidance to tap **Enable Voice**.
- Manual controls must remain fully usable during reconnect attempts and fallback state.

### 5.7 Accessibility and cues
- Visual + audio cues for transitions.
- Optional vibration cues where supported.
- Default vibration: on mobile, off desktop.

### 5.8 Persistence and privacy
- Persist last-used workout/settings config locally.
- No persistent voice transcript/history.
- Optional debug panel (toggleable) with last heard phrase, confidence, and decision outcome for current session.

### 5.9 Session summary
- Lightweight local session summary after stop/completion.

### 5.10 Duration warnings
- No hard enforced session length cap.
- Show non-blocking warning when estimated total duration exceeds user-configured preferred max session time.
- Warning visible in both Settings and Start screen.
- Default preferred max session time: 30 minutes.

### 5.11 Platform targets
- Launch required: Android Chrome + Desktop Chrome.
- iOS Safari: high-priority parallel target during MVP development.

## 6) Non-Goals / Out of Scope (MVP)
- User accounts/authentication.
- Cloud sync / cross-device persistence.
- Backend APIs (initial release is frontend-first local behavior).
- Workout history analytics backend.
- Social features.
- Wearable integrations.
- Multilingual voice commands.
- User-configurable wake word/magic word.
- Natural-language command understanding beyond strict exact phrases.
- Multiple built-in workout templates.

## 7) Success Metrics (Initial)
- Command recognition success rate (session-level).
- False-trigger rate.
- Time-to-first-workout.
- Session completion rate.
- Frequency of manual fallback usage.

## 8) Risks & Unknowns
- Browser voice recognition reliability across environments.
- iOS browser limitations for continuous listening.
- Noisy gym environments affecting speech input.
- Permission friction reducing voice feature adoption.

## 9) Milestones
- M0: Discovery + grill-me outcomes captured.
- M1: Frontend architecture proposal.
- M2: Frontend MVP implementation.
- M3: Validation and polish (including device/browser matrix).
- M4: Backend API planning.
