# Frontend Architecture (MVP)

This document captures the implementation architecture for the Voice-Controlled Workout Clock frontend MVP.

## 1) Architecture goals
- Keep timer behavior deterministic and testable.
- Isolate voice/platform variability behind adapters.
- Centralize business rules so voice and manual controls behave identically.
- Keep UX as one primary workout screen while preserving bookmarkable/shareable overlay states.
- Prepare clean seams for future backend integration.

## 2) High-level structure

### 2.1 App shell and routing
- Primary route: `/workout`
- URL-addressable overlays (query param `panel`):
  - `/workout?panel=settings`
  - `/workout?panel=commands`
  - `/workout?panel=summary`

This preserves one-screen workflow while allowing bookmarking/shareability.

### 2.2 Feature/domain-first module layout

```txt
src/
  app/
    routing/
    providers/
    composition/
  features/
    timer-domain/
    workout-session/
    voice-control/
    settings/
    feedback/
    session-summary/
    diagnostics/
  shared/
    ui/
    types/
    utils/
```

## 3) Domain and state model

### 3.1 Core principle
- Timer logic is framework-agnostic (pure TypeScript domain module).
- React is an adapter/presentation layer over domain snapshots and events.

### 3.2 State machine (explicit)
Use explicit app/workout states rather than scattered booleans:
- `idle`
- `preroll`
- `running`
- `paused`
- `stopped`
- `completed`
- `reconnectingVoice`
- `micOff`

Voice mode state is explicit and visible in UI badge:
- `continuous`
- `tapToTalkFallback`
- `micOff`

## 4) Command and policy architecture

### 4.1 Command flow
1. Input source (voice/manual) emits intent.
2. Voice parser maps recognized phrase to `NormalizedCommand`.
3. Central Application Command/Policy layer validates command against current state/rules.
4. If accepted, dispatch to timer domain.
5. Emit domain/app events.
6. FeedbackOrchestrator handles visual/audio/vibration responses.
7. Diagnostics log captures decision + outcome.

### 4.2 NormalizedCommand model
Each command includes metadata for debug and decisioning:
- `type` (START, PAUSE, RESUME, NEXT, STOP, RESET)
- `rawPhrase`
- `normalizedPhrase`
- `confidence`
- `source` (voice/manual)
- `voiceMode`
- `timestamp`
- `decision` (accepted/rejected)
- `decisionReason`

### 4.3 Central policy rules (examples)
- Required prefix: `Clock`.
- Strict exact phrases only.
- Confidence threshold enforced.
- Low confidence/ambiguous: reject + prompt repeat.
- `START` while running: reject + "Already running".
- Settings edits allowed only in idle/paused.
- `STOP` immediate.
- `RESET` allowed in any state.

## 5) Key interfaces (ports/adapters)

### 5.1 VoiceAdapter
Abstract speech input implementation from UI.

Responsibilities:
- Start/stop listening
- Continuous mode where supported
- Tap/hold-to-talk fallback support
- Emit raw recognition events/errors

Implementations:
- `WebSpeechAdapter`
- `IOSFallbackBehavior` (strategy/flags inside adapter orchestration)

### 5.2 CapabilityService
Computes capability profile once at startup and exposes it:
- Speech recognition support
- Continuous listening support
- Vibration support
- Platform/browser hints (for iOS fallback behavior)

### 5.3 SettingsRepository
Persistence abstraction:
- Local implementation for MVP (`localStorage`)
- Versioned schema for migration safety
- Future API-backed implementation without UI refactor

### 5.4 FeedbackOrchestrator
Consumes app/domain events and triggers:
- Visual confirmations/errors
- Audio confirmations and interval cues
- Optional vibration cues

### 5.5 Backend ports (future-ready)
Define typed interfaces now (local/no-op implementations in MVP):
- `WorkoutSessionPort`
- `SettingsSyncPort`

## 6) Timer and rendering strategy

### 6.1 Timer accuracy
- Canonical elapsed/remaining time computed from clock-delta in timer domain.
- Avoid relying solely on interval tick counts.

### 6.2 UI rendering cadence
- UI consumes snapshots from domain.
- Render ticker cadence is configurable in Settings (safe defaults and bounded range).
- Rendering cadence must not alter canonical timer progression.

## 7) Permissions, failure handling, fallback
- Mic permission requested only via explicit **Enable Voice** action.
- If denied: manual-controls-only mode + guidance banner.
- On recognition drop: auto-retry with reconnecting state.
- Bounded retry attempts; then set mic-off state + banner.

## 8) Privacy and diagnostics
- No persistent voice transcript/history.
- Session-only structured event log buffer.
- Debug panel (toggleable) shows last phrase, confidence, decision outcome.
- Optional copy/export of session diagnostics (manual action only).

## 9) Testing strategy map

### 9.1 Unit tests
- Timer domain state transitions and clock-delta accuracy.
- Command policy acceptance/rejection rules.
- Normalized command mapping.

### 9.2 Contract tests
- VoiceAdapter interface conformance.
- SettingsRepository schema/version behavior.
- CapabilityService capability resolution.

### 9.3 Integration tests
Critical flows:
- start → preroll → running
- pause/resume
- next interval
- stop/reset behaviors
- permission denied fallback
- recognition drop retry/fallback

## 10) Platform validation priorities
- Required launch validation: Desktop Chrome, Android Chrome.
- High-priority validation during MVP: iOS Safari fallback behavior and UX consistency.

## 11) Implementation notes
- Keep business rules out of components.
- Keep adapter-specific logic out of domain.
- Prefer typed events and small module interfaces to reduce coupling.
- Maintain one source of truth for state transitions (state machine + policy layer).
