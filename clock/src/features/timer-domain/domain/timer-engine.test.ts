import { describe, expect, it } from 'vitest';

import { createTimerEngine } from '@features/timer-domain/domain/timer-engine';

describe('timer engine', () => {
  it('tracks elapsed using clock-delta', () => {
    const engine = createTimerEngine({
      workMs: 30_000,
      restMs: 10_000,
      rounds: 2,
      prerollSeconds: 3,
    });

    engine.start(1_000);

    const snapshot = engine.getSnapshot(3_000);

    expect(snapshot.elapsedMs).toBe(2_000);
    expect(snapshot.phase).toBe('preroll');
  });

  it('moves to running after preroll', () => {
    const engine = createTimerEngine({
      workMs: 30_000,
      restMs: 10_000,
      rounds: 1,
      prerollSeconds: 3,
    });

    engine.start(1_000);

    const snapshot = engine.getSnapshot(5_000);

    expect(snapshot.phase).toBe('work');
    expect(snapshot.round).toBe(1);
    expect(snapshot.remainingMs).toBe(29_000);
  });

  it('pauses and resumes without losing elapsed time', () => {
    const engine = createTimerEngine({
      workMs: 10_000,
      restMs: 5_000,
      rounds: 1,
      prerollSeconds: 0,
    });

    engine.start(0);
    engine.pause(4_000);
    engine.resume(10_000);

    const snapshot = engine.getSnapshot(12_000);

    expect(snapshot.elapsedMs).toBe(6_000);
    expect(snapshot.phase).toBe('work');
  });

  it('reset returns timer to idle baseline', () => {
    const engine = createTimerEngine({
      workMs: 30_000,
      restMs: 10_000,
      rounds: 1,
      prerollSeconds: 3,
    });

    engine.start(0);
    engine.reset();

    const snapshot = engine.getSnapshot(10_000);

    expect(snapshot.phase).toBe('idle');
    expect(snapshot.elapsedMs).toBe(0);
    expect(snapshot.remainingMs).toBe(30_000);
  });
});
