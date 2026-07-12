import type { UserSettings } from '@features/settings/domain/settings-types';

import { Input } from '@shared/ui/input';

interface SettingsEditorProps {
  settings: UserSettings;
  onChange: (settings: UserSettings) => void;
  locked: boolean;
}

export function SettingsEditor({ settings, onChange, locked }: SettingsEditorProps): JSX.Element {
  if (locked) {
    return <p className="text-sm text-muted-foreground">Settings are editable only when idle or paused.</p>;
  }

  return (
    <div className="grid gap-3">
      <label className="grid gap-1.5 text-sm">
        Work (seconds)
        <Input
          type="number"
          value={Math.floor(settings.workMs / 1000)}
          onChange={(event) => onChange({ ...settings, workMs: Number(event.target.value) * 1000 })}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        Rest (seconds)
        <Input
          type="number"
          value={Math.floor(settings.restMs / 1000)}
          onChange={(event) => onChange({ ...settings, restMs: Number(event.target.value) * 1000 })}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        Rounds
        <Input type="number" value={settings.rounds} onChange={(event) => onChange({ ...settings, rounds: Number(event.target.value) })} />
      </label>
      <label className="grid gap-1.5 text-sm">
        Preferred max session (minutes)
        <Input
          type="number"
          value={settings.preferredMaxSessionMinutes}
          onChange={(event) =>
            onChange({
              ...settings,
              preferredMaxSessionMinutes: Number(event.target.value),
            })
          }
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        Render FPS
        <Input
          type="number"
          value={settings.renderFps}
          onChange={(event) => onChange({ ...settings, renderFps: Number(event.target.value) })}
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={settings.prerollEnabled}
          onChange={(event) => onChange({ ...settings, prerollEnabled: event.target.checked })}
        />
        Pre-roll enabled
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={settings.vibrationEnabled}
          onChange={(event) => onChange({ ...settings, vibrationEnabled: event.target.checked })}
        />
        Vibration enabled
      </label>
    </div>
  );
}
