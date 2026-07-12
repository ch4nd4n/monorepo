import { describe, expect, it } from 'vitest';

import { parseVoicePhrase } from '@features/voice-control/application/phrase-parser';

describe('parseVoicePhrase', () => {
  it('parses valid command with required prefix', () => {
    const parsed = parseVoicePhrase('Clock, start');

    expect(parsed).toEqual({
      ok: true,
      value: {
        type: 'START',
        normalizedPhrase: 'clock start',
      },
    });
  });

  it('rejects phrase missing prefix', () => {
    const parsed = parseVoicePhrase('start');

    expect(parsed.ok).toBe(false);
  });

  it('rejects unsupported synonym', () => {
    const parsed = parseVoicePhrase('Clock, continue');

    expect(parsed.ok).toBe(false);
  });
});
