import { createTimerEngine } from '@features/timer-domain/domain/timer-engine';
import { evaluateCommandPolicy } from '@features/workout-session/commands/command-policy';
import type {
  CommandPolicyResult,
  NormalizedCommand,
  WorkoutState,
} from '@features/workout-session/commands/command-types';

export interface WorkoutControllerConfig {
  workMs: number;
  restMs: number;
  rounds: number;
  prerollEnabled: boolean;
  prerollSeconds: number;
  minCommandConfidence: number;
}

export interface SessionSummary {
  startedAtMs: number;
  endedAtMs: number;
  elapsedMs: number;
  roundsCompleted: number;
}

export interface WorkoutControllerState {
  workoutState: WorkoutState;
  phase: 'idle' | 'preroll' | 'work' | 'rest' | 'completed';
  round: number;
  remainingMs: number;
  elapsedMs: number;
  lastMessage: string;
  summary: SessionSummary | null;
}

export interface WorkoutController {
  dispatch(command: NormalizedCommand): CommandPolicyResult;
  tick(nowMs: number): void;
  getState(): WorkoutControllerState;
}

export function createWorkoutController(config: WorkoutControllerConfig): WorkoutController {
  const timer = createTimerEngine({
    workMs: config.workMs,
    restMs: config.restMs,
    rounds: config.rounds,
    prerollSeconds: config.prerollEnabled ? config.prerollSeconds : 0,
  });

  let startedAtMs = 0;
  let currentNow = 0;

  let state: WorkoutControllerState = {
    workoutState: 'idle',
    phase: 'idle',
    round: 0,
    remainingMs: config.workMs,
    elapsedMs: 0,
    lastMessage: 'Idle',
    summary: null,
  };

  function sync(nowMs: number): void {
    currentNow = nowMs;
    const snap = timer.getSnapshot(nowMs);
    state = {
      ...state,
      phase: snap.phase,
      round: snap.round,
      remainingMs: snap.remainingMs,
      elapsedMs: snap.elapsedMs,
      workoutState:
        snap.phase === 'idle'
          ? 'idle'
          : snap.phase === 'preroll'
            ? 'preroll'
            : snap.phase === 'completed'
              ? 'completed'
              : state.workoutState === 'paused'
                ? 'paused'
                : 'running',
    };
  }

  function dispatch(command: NormalizedCommand): CommandPolicyResult {
    const policyResult = evaluateCommandPolicy({
      command,
      workout: { state: state.workoutState, remainingMs: state.remainingMs },
      minConfidence: config.minCommandConfidence,
    });

    if (policyResult.decision === 'rejected') {
      state = { ...state, lastMessage: policyResult.reason };
      return policyResult;
    }

    switch (command.type) {
      case 'START': {
        startedAtMs = command.timestampMs;
        timer.start(command.timestampMs);
        sync(command.timestampMs);
        state = { ...state, lastMessage: 'Started' };
        break;
      }
      case 'PAUSE': {
        timer.pause(command.timestampMs);
        sync(command.timestampMs);
        state = { ...state, workoutState: 'paused', lastMessage: 'Paused' };
        break;
      }
      case 'RESUME': {
        timer.resume(command.timestampMs);
        sync(command.timestampMs);
        state = { ...state, workoutState: 'running', lastMessage: 'Resumed' };
        break;
      }
      case 'NEXT': {
        // keep MVP simple: jump by making timer snapshot advance via now+remaining
        sync(command.timestampMs + state.remainingMs);
        state = { ...state, lastMessage: 'Skipped to next interval' };
        break;
      }
      case 'STOP': {
        sync(command.timestampMs);
        state = {
          ...state,
          workoutState: 'stopped',
          lastMessage: 'Stopped',
          summary: {
            startedAtMs,
            endedAtMs: command.timestampMs,
            elapsedMs: Math.max(0, command.timestampMs - startedAtMs),
            roundsCompleted: state.round,
          },
        };
        break;
      }
      case 'RESET': {
        timer.reset();
        sync(command.timestampMs);
        state = {
          ...state,
          workoutState: 'idle',
          phase: 'idle',
          elapsedMs: 0,
          round: 0,
          remainingMs: config.workMs,
          summary: null,
          lastMessage: 'Workout reset',
        };
        break;
      }
    }

    return policyResult;
  }

  function tick(nowMs: number): void {
    if (state.workoutState === 'stopped') {
      return;
    }

    sync(nowMs);
  }

  function getState(): WorkoutControllerState {
    return state;
  }

  sync(currentNow);

  return {
    dispatch,
    tick,
    getState,
  };
}
