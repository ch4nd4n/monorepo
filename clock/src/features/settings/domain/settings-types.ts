export interface UserSettings {
  workMs: number;
  restMs: number;
  rounds: number;
  prerollEnabled: boolean;
  prerollSeconds: number;
  preferredMaxSessionMinutes: number;
  renderFps: number;
  vibrationEnabled: boolean;
  minCommandConfidence: number;
}

export const DEFAULT_SETTINGS: UserSettings = {
  workMs: 30_000,
  restMs: 10_000,
  rounds: 5,
  prerollEnabled: true,
  prerollSeconds: 3,
  preferredMaxSessionMinutes: 30,
  renderFps: 4,
  vibrationEnabled: false,
  minCommandConfidence: 0.6,
};
