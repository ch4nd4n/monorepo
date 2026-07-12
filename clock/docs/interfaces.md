# TypeScript Interfaces and Contracts (MVP)

Implementation contracts only (no behavior yet).

## 1) Core command model

```ts
export type CommandType =
  | 'START'
  | 'PAUSE'
  | 'RESUME'
  | 'NEXT'
  | 'STOP'
  | 'RESET';

export type CommandSource = 'voice' | 'manual';

export type VoiceMode = 'continuous' | 'tapToTalkFallback' | 'micOff';

export type CommandDecision = 'accepted' | 'rejected';

export interface NormalizedCommand {
  type: CommandType;
  source: CommandSource;
  rawPhrase?: string;
  normalizedPhrase?: string;
  confidence?: number;
  voiceMode?: VoiceMode;
  timestampMs: number;
  decision?: CommandDecision;
  decisionReason?: string;
}
```

## 2) App/workout state model

```ts
export type WorkoutState =
  | 'idle'
  | 'preroll'
  | 'running'
  | 'paused'
  | 'stopped'
  | 'completed'
  | 'reconnectingVoice'
  | 'micOff';

export interface WorkoutContext {
  state: WorkoutState;
  currentRound: number;
  totalRounds: number;
  remainingMs: number;
  elapsedMs: number;
  isLocked: boolean;
}
```

## 3) Voice adapter contract

```ts
export interface VoiceRecognitionEvent {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  timestampMs: number;
}

export interface VoiceRecognitionError {
  code: string;
  message: string;
  recoverable: boolean;
  timestampMs: number;
}

export interface VoiceAdapter {
  requestPermission(): Promise<'granted' | 'denied' | 'prompt'>;
  startListening(mode: 'continuous' | 'tapToTalk'): Promise<void>;
  stopListening(): Promise<void>;
  onResult(handler: (event: VoiceRecognitionEvent) => void): () => void;
  onError(handler: (error: VoiceRecognitionError) => void): () => void;
  onStateChange(handler: (state: 'idle' | 'listening' | 'stopped') => void): () => void;
}
```

## 4) Command policy + dispatcher

```ts
export interface CommandPolicyInput {
  command: NormalizedCommand;
  workout: WorkoutContext;
  minConfidence: number;
  requiredPrefix: string; // "clock"
}

export interface CommandPolicyResult {
  decision: 'accepted' | 'rejected';
  reason: string;
}

export interface CommandPolicy {
  evaluate(input: CommandPolicyInput): CommandPolicyResult;
}

export interface CommandDispatcher {
  dispatch(command: NormalizedCommand): Promise<CommandPolicyResult>;
}
```

## 5) Timer domain contracts

```ts
export interface TimerSnapshot {
  nowMs: number;
  elapsedMs: number;
  remainingMs: number;
  round: number;
  totalRounds: number;
  phase: 'work' | 'rest' | 'preroll' | 'completed';
}

export interface TimerConfig {
  workMs: number;
  restMs: number;
  rounds: number;
  prerollSeconds: number;
  renderFps: number;
}

export interface TimerEngine {
  configure(config: TimerConfig): void;
  start(startedAtMs: number): void;
  pause(pausedAtMs: number): void;
  resume(resumedAtMs: number): void;
  next(nowMs: number): void;
  stop(nowMs: number): void;
  reset(nowMs: number): void;
  getSnapshot(nowMs: number): TimerSnapshot;
}
```

## 6) Settings repository

```ts
export interface UserSettings {
  workMs: number;
  restMs: number;
  rounds: number;
  prerollEnabled: boolean;
  prerollSeconds: number;
  renderFps: number;
  vibrationEnabled: boolean;
  preferredMaxSessionMinutes: number; // default 30
  minCommandConfidence: number;
}

export interface SettingsRepository {
  load(): Promise<UserSettings | null>;
  save(settings: UserSettings): Promise<void>;
  clear(): Promise<void>;
  getVersion(): number;
}
```

## 7) Capability service

```ts
export interface CapabilityProfile {
  speechSupported: boolean;
  continuousListeningSupported: boolean;
  vibrationSupported: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  browser: string;
}

export interface CapabilityService {
  detect(): CapabilityProfile;
}
```

## 8) Feedback orchestrator

```ts
export type FeedbackEventType =
  | 'COMMAND_ACCEPTED'
  | 'COMMAND_REJECTED'
  | 'INTERVAL_CHANGED'
  | 'WORKOUT_COMPLETED'
  | 'VOICE_RECONNECTING'
  | 'VOICE_FALLBACK_MIC_OFF';

export interface FeedbackEvent {
  type: FeedbackEventType;
  timestampMs: number;
  payload?: Record<string, unknown>;
}

export interface FeedbackOrchestrator {
  handle(event: FeedbackEvent): Promise<void>;
}
```

## 9) Diagnostics log buffer

```ts
export interface DiagnosticEvent {
  name: string;
  timestampMs: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  data?: Record<string, unknown>;
}

export interface DiagnosticLogBuffer {
  push(event: DiagnosticEvent): void;
  list(): DiagnosticEvent[];
  clear(): void;
  exportText(): string;
}
```

## 10) Backend-ready ports (placeholders for later)

```ts
export interface WorkoutSessionPort {
  saveSession(summary: {
    startedAtMs: number;
    endedAtMs: number;
    roundsCompleted: number;
    interruptions: number;
  }): Promise<void>;
}

export interface SettingsSyncPort {
  pushSettings(settings: UserSettings): Promise<void>;
  pullSettings(): Promise<UserSettings | null>;
}
```

## 11) Route state contract

```ts
export type WorkoutPanel = 'settings' | 'commands' | 'summary' | null;

export interface WorkoutRouteState {
  panel: WorkoutPanel;
}
```

## Contract notes
- Keep interfaces stable; evolve via additive changes where possible.
- Timer and policy contracts are highest-risk: test these first.
- Adapter contracts should hide browser quirks from domain/application layers.
