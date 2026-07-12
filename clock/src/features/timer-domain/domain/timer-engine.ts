export interface TimerConfig {
  workMs: number;
  restMs: number;
  rounds: number;
  prerollSeconds: number;
}

export interface TimerSnapshot {
  elapsedMs: number;
  remainingMs: number;
  phase: 'idle' | 'preroll' | 'work' | 'rest' | 'completed';
  round: number;
}

interface TimerState {
  status: 'idle' | 'running' | 'paused' | 'stopped';
  startedAtMs: number;
  accumulatedPausedMs: number;
  pauseStartedAtMs: number | null;
}

export interface TimerEngine {
  start(startedAtMs: number): void;
  pause(pausedAtMs: number): void;
  resume(resumedAtMs: number): void;
  reset(): void;
  getSnapshot(nowMs: number): TimerSnapshot;
}

export function createTimerEngine(config: TimerConfig): TimerEngine {
  const state: TimerState = {
    status: 'idle',
    startedAtMs: 0,
    accumulatedPausedMs: 0,
    pauseStartedAtMs: null,
  };

  function start(startedAtMs: number): void {
    state.status = 'running';
    state.startedAtMs = startedAtMs;
    state.accumulatedPausedMs = 0;
    state.pauseStartedAtMs = null;
  }

  function pause(pausedAtMs: number): void {
    if (state.status !== 'running') {
      return;
    }

    state.status = 'paused';
    state.pauseStartedAtMs = pausedAtMs;
  }

  function resume(resumedAtMs: number): void {
    if (state.status !== 'paused' || state.pauseStartedAtMs === null) {
      return;
    }

    state.status = 'running';
    state.accumulatedPausedMs += resumedAtMs - state.pauseStartedAtMs;
    state.pauseStartedAtMs = null;
  }

  function reset(): void {
    state.status = 'idle';
    state.startedAtMs = 0;
    state.accumulatedPausedMs = 0;
    state.pauseStartedAtMs = null;
  }

  function getElapsed(nowMs: number): number {
    if (state.status === 'idle') {
      return 0;
    }

    if (state.status === 'paused' && state.pauseStartedAtMs !== null) {
      return state.pauseStartedAtMs - state.startedAtMs - state.accumulatedPausedMs;
    }

    return nowMs - state.startedAtMs - state.accumulatedPausedMs;
  }

  function getSnapshot(nowMs: number): TimerSnapshot {
    const elapsedMs = Math.max(0, getElapsed(nowMs));
    const prerollMs = config.prerollSeconds * 1000;

    if (state.status === 'idle') {
      return { elapsedMs: 0, remainingMs: config.workMs, phase: 'idle', round: 0 };
    }

    if (elapsedMs < prerollMs) {
      return {
        elapsedMs,
        remainingMs: prerollMs - elapsedMs,
        phase: 'preroll',
        round: 0,
      };
    }

    const workoutElapsed = elapsedMs - prerollMs;
    const cycleMs = config.workMs + config.restMs;
    const cycleIndex = Math.floor(workoutElapsed / cycleMs);

    if (cycleIndex >= config.rounds) {
      return { elapsedMs, remainingMs: 0, phase: 'completed', round: config.rounds };
    }

    const cycleElapsed = workoutElapsed % cycleMs;
    if (cycleElapsed < config.workMs) {
      return {
        elapsedMs,
        remainingMs: config.workMs - cycleElapsed,
        phase: 'work',
        round: cycleIndex + 1,
      };
    }

    return {
      elapsedMs,
      remainingMs: cycleMs - cycleElapsed,
      phase: 'rest',
      round: cycleIndex + 1,
    };
  }

  return {
    start,
    pause,
    resume,
    reset,
    getSnapshot,
  };
}
