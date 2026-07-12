import type { CommandType } from '@features/workout-session/commands/command-types';

import { err, ok, type Result } from '@shared/types/result';

interface ParsedPhrase {
  type: CommandType;
  normalizedPhrase: string;
}

const COMMAND_MAP: Record<string, CommandType> = {
  start: 'START',
  pause: 'PAUSE',
  resume: 'RESUME',
  next: 'NEXT',
  stop: 'STOP',
  reset: 'RESET',
};

export function parseVoicePhrase(phrase: string): Result<ParsedPhrase, string> {
  const normalizedPhrase = normalize(phrase);
  const words = normalizedPhrase.split(' ').filter(Boolean);

  if (words.length !== 2) {
    return err('Unsupported command format');
  }

  const [prefix, command] = words;
  if (prefix !== 'clock') {
    return err('Missing required prefix');
  }

  const mapped = COMMAND_MAP[command];
  if (!mapped) {
    return err('Unsupported command');
  }

  return ok({ type: mapped, normalizedPhrase });
}

function normalize(value: string): string {
  return value.toLowerCase().replaceAll(',', ' ').replace(/\s+/g, ' ').trim();
}
