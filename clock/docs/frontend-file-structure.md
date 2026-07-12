# Frontend File Structure Plan (MVP)

Concrete scaffold plan aligned to `docs/frontend-architecture.md`.

## Proposed tree

```txt
src/
  app/
    composition/
      App.tsx
    providers/
      AppProviders.tsx
    routing/
      routes.tsx
      workoutRouteState.ts

  features/
    workout-session/
      model/
        workoutSessionState.ts
        workoutSessionSelectors.ts
      commands/
        commandTypes.ts
        normalizedCommand.ts
        commandPolicy.ts
        commandDispatcher.ts
      ui/
        WorkoutScreen.tsx
        WorkoutHeader.tsx
        VoiceModeBadge.tsx
        ControlBar.tsx
        LockScreenOverlay.tsx

    timer-domain/
      domain/
        timerEngine.ts
        timerStateMachine.ts
        timerTypes.ts
        timerEvents.ts
      application/
        timerService.ts
      tests/
        timerEngine.test.ts
        timerStateMachine.test.ts

    voice-control/
      adapters/
        VoiceAdapter.ts
        WebSpeechAdapter.ts
        voiceAdapterFactory.ts
      application/
        voiceOrchestrator.ts
        phraseParser.ts
        confidencePolicy.ts
      ui/
        EnableVoiceButton.tsx
        MicToggle.tsx
        VoiceCommandsOverlay.tsx
      tests/
        phraseParser.test.ts

    settings/
      domain/
        settingsTypes.ts
        settingsSchema.ts
      ports/
        SettingsRepository.ts
      adapters/
        LocalSettingsRepository.ts
      application/
        settingsService.ts
      ui/
        SettingsPanel.tsx
        SessionDurationWarning.tsx

    feedback/
      application/
        FeedbackOrchestrator.ts
      ports/
        AudioFeedbackPort.ts
        VibrationFeedbackPort.ts
        VisualFeedbackPort.ts
      adapters/
        WebAudioFeedbackAdapter.ts
        WebVibrationAdapter.ts

    session-summary/
      model/
        summaryTypes.ts
        summaryBuilder.ts
      ui/
        SessionSummaryPanel.tsx

    diagnostics/
      model/
        diagnosticEvent.ts
      application/
        diagnosticLogBuffer.ts
      ui/
        DebugPanel.tsx

    capability/
      application/
        CapabilityService.ts
      model/
        capabilityProfile.ts

    backend-ports/
      WorkoutSessionPort.ts
      SettingsSyncPort.ts
      LocalWorkoutSessionPort.ts
      LocalSettingsSyncPort.ts

  shared/
    types/
      Result.ts
      Brand.ts
    utils/
      time.ts
      assertNever.ts
    ui/
      Button.tsx
      Badge.tsx
      Panel.tsx

  main.tsx
```

## Notes by layer

### `domain/`
Pure business logic, no React/browser API access.

### `application/`
Use-case orchestration, policy execution, event coordination.

### `ports/`
Interfaces that define boundaries.

### `adapters/`
Implementations for browser/local behavior.

### `ui/`
Presentation components and interaction wiring.

## Priority scaffold order
1. `timer-domain` + `workout-session/commands`
2. `settings` + local repository
3. `voice-control` adapter interface + parser
4. `feedback` + diagnostics
5. UI shell and overlays
6. backend ports placeholders

## Naming conventions
- Types/interfaces: `PascalCase`
- Files: `camelCase.ts` for logic, `PascalCase.tsx` for components
- Commands/events: uppercase literal unions (`START`, `PAUSE`, ...)
- Keep one primary responsibility per file

## Guardrails
- Do not place policy rules inside components.
- Do not access `localStorage` outside settings adapters.
- Do not call browser speech APIs outside voice adapters.
- Timer domain remains UI-framework agnostic.
