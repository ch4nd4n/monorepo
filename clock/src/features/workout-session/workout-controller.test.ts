import { describe, expect, it } from 'vitest';

import { createWorkoutController } from '@features/workout-session/workout-controller';

describe('workout controller', () => {
  it('starts with preroll and transitions to running', () => {
    const controller = createWorkoutController({
      workMs: 20_000,
      restMs: 10_000,
      rounds: 1,
      prerollEnabled: true,
      prerollSeconds: 3,
      minCommandConfidence: 0.6,
    });

    controller.dispatch({ type: 'START', source: 'manual', timestampMs: 0 });

    expect(controller.getState().workoutState).toBe('preroll');

    controller.tick(4_000);
    expect(controller.getState().workoutState).toBe('running');
  });

  it('rejects start when already running', () => {
    const controller = createWorkoutController({
      workMs: 20_000,
      restMs: 10_000,
      rounds: 1,
      prerollEnabled: false,
      prerollSeconds: 0,
      minCommandConfidence: 0.6,
    });

    controller.dispatch({ type: 'START', source: 'manual', timestampMs: 0 });
    const result = controller.dispatch({ type: 'START', source: 'manual', timestampMs: 1_000 });

    expect(result.decision).toBe('rejected');
    expect(result.reason).toBe('Already running');
  });

  it('creates summary on stop', () => {
    const controller = createWorkoutController({
      workMs: 10_000,
      restMs: 5_000,
      rounds: 1,
      prerollEnabled: false,
      prerollSeconds: 0,
      minCommandConfidence: 0.6,
    });

    controller.dispatch({ type: 'START', source: 'manual', timestampMs: 0 });
    controller.tick(3_000);
    controller.dispatch({ type: 'STOP', source: 'manual', timestampMs: 3_000 });

    const summary = controller.getState().summary;
    expect(summary).not.toBeNull();
    expect(summary?.elapsedMs).toBe(3_000);
  });

  it('keeps remaining time stable after stop', () => {
    const controller = createWorkoutController({
      workMs: 10_000,
      restMs: 5_000,
      rounds: 1,
      prerollEnabled: false,
      prerollSeconds: 0,
      minCommandConfidence: 0.6,
    });

    controller.dispatch({ type: 'START', source: 'manual', timestampMs: 0 });
    controller.tick(2_000);
    controller.dispatch({ type: 'STOP', source: 'manual', timestampMs: 2_000 });

    const stoppedRemaining = controller.getState().remainingMs;
    controller.tick(7_000);

    expect(controller.getState().workoutState).toBe('stopped');
    expect(controller.getState().remainingMs).toBe(stoppedRemaining);
  });

  it('reset returns workout to idle baseline and stays stable', () => {
    const controller = createWorkoutController({
      workMs: 30_000,
      restMs: 10_000,
      rounds: 2,
      prerollEnabled: true,
      prerollSeconds: 3,
      minCommandConfidence: 0.6,
    });

    controller.dispatch({ type: 'START', source: 'manual', timestampMs: 0 });
    controller.tick(4_000);
    controller.dispatch({ type: 'RESET', source: 'manual', timestampMs: 4_000 });

    const stateAfterReset = controller.getState();
    expect(stateAfterReset.workoutState).toBe('idle');
    expect(stateAfterReset.phase).toBe('idle');
    expect(stateAfterReset.remainingMs).toBe(30_000);

    controller.tick(9_000);
    expect(controller.getState().workoutState).toBe('idle');
    expect(controller.getState().remainingMs).toBe(30_000);
  });
});
