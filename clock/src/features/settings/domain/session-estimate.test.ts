import { describe, expect, it } from 'vitest';

import { estimateSessionDurationMs, isOverPreferredDuration } from '@features/settings/domain/session-estimate';

describe('session estimate', () => {
  it('estimates total duration including preroll', () => {
    const total = estimateSessionDurationMs({
      workMs: 30_000,
      restMs: 10_000,
      rounds: 2,
      prerollEnabled: true,
      prerollSeconds: 3,
    });

    expect(total).toBe(83_000);
  });

  it('checks preferred max threshold', () => {
    const over = isOverPreferredDuration(31 * 60_000, 30);
    expect(over).toBe(true);
  });
});
