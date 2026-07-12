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
});
