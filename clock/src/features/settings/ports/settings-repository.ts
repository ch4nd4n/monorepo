import type { UserSettings } from '@features/settings/domain/settings-types';

export interface SettingsRepository {
  load(): Promise<UserSettings | null>;
  save(settings: UserSettings): Promise<void>;
  clear(): Promise<void>;
}
