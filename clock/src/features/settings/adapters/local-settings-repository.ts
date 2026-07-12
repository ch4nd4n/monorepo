import {
  DEFAULT_SETTINGS,
  type UserSettings,
} from '@features/settings/domain/settings-types';
import type { SettingsRepository } from '@features/settings/ports/settings-repository';

const STORAGE_KEY = 'clock.settings.v1';

export class LocalSettingsRepository implements SettingsRepository {
  async load(): Promise<UserSettings | null> {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }

    try {
      const parsed = JSON.parse(raw) as UserSettings;
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  async save(settings: UserSettings): Promise<void> {
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  async clear(): Promise<void> {
    globalThis.localStorage.removeItem(STORAGE_KEY);
  }
}
