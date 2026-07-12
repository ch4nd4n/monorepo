export type CommandType = 'START' | 'PAUSE' | 'RESUME' | 'NEXT' | 'STOP' | 'RESET';

export type CommandSource = 'voice' | 'manual';

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
  remainingMs: number;
}

export interface NormalizedCommand {
  type: CommandType;
  source: CommandSource;
  timestampMs: number;
  confidence?: number;
  normalizedPhrase?: string;
}

export interface CommandPolicyResult {
  decision: 'accepted' | 'rejected';
  reason: string;
}
