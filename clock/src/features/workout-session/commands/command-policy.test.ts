import { describe, expect, it } from 'vitest';

import { evaluateCommandPolicy } from '@features/workout-session/commands/command-policy';
import type { NormalizedCommand, WorkoutContext } from '@features/workout-session/commands/command-types';

const baseContext: WorkoutContext = {
  state: 'idle',
  remainingMs: 10_000,
};

function command(type: NormalizedCommand['type'], confidence = 0.95): NormalizedCommand {
  return {
    type,
    source: 'voice',
    timestampMs: Date.now(),
    confidence,
    normalizedPhrase: 'clock start',
  };
}

describe('evaluateCommandPolicy', () => {
  it('rejects low confidence voice commands', () => {
    const result = evaluateCommandPolicy({
      command: command('START', 0.2),
      workout: baseContext,
      minConfidence: 0.6,
    });

    expect(result.decision).toBe('rejected');
    expect(result.reason).toContain('confidence');
  });

  it('rejects start command when already running', () => {
    const result = evaluateCommandPolicy({
      command: command('START'),
      workout: { ...baseContext, state: 'running' },
      minConfidence: 0.6,
    });

    expect(result).toEqual({ decision: 'rejected', reason: 'Already running' });
  });

  it('accepts reset from any state', () => {
    const result = evaluateCommandPolicy({
      command: command('RESET'),
      workout: { ...baseContext, state: 'running' },
      minConfidence: 0.6,
    });

    expect(result.decision).toBe('accepted');
  });
});
