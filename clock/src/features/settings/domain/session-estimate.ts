import type { UserSettings } from '@features/settings/domain/settings-types';

type EstimateInput = Pick<
  UserSettings,
  'workMs' | 'restMs' | 'rounds' | 'prerollEnabled' | 'prerollSeconds'
>;

export function estimateSessionDurationMs(input: EstimateInput): number {
  const rounds = Math.max(0, input.rounds);
  const intervalTotal = rounds * (input.workMs + input.restMs);
  const preroll = input.prerollEnabled ? input.prerollSeconds * 1000 : 0;

  return intervalTotal + preroll;
}

export function isOverPreferredDuration(totalMs: number, preferredMinutes: number): boolean {
  return totalMs > preferredMinutes * 60_000;
}
