import type { IconDisplayMode, UserSettings } from '@features/settings/domain/settings-types';

import { Button } from '@shared/ui/button';
import { Checkbox } from '@shared/ui/checkbox';
import { Input } from '@shared/ui/input';
import { Stepper } from '@shared/ui/stepper';
import { cn } from '@shared/utils/cn';

interface SettingsEditorProps {
  settings: UserSettings;
  isLightTheme: boolean;
  onChange: (settings: UserSettings) => void;
  locked: boolean;
}

const ICON_MODE_OPTIONS: { value: IconDisplayMode; label: string }[] = [
  { value: 'text', label: 'Text only' },
  { value: 'iconsWithText', label: 'Icons + text' },
  { value: 'iconsOnly', label: 'Icons only' },
];

function segmentButtonClassName(selected: boolean, isLightTheme: boolean): string {
  return cn(
    'border text-xs',
    isLightTheme ? 'border-light-border' : 'border-border',
    selected && (isLightTheme ? 'bg-light-text text-light-bg' : 'bg-foreground text-background'),
  );
}

function fieldLabelClassName(isLightTheme: boolean): string {
  return cn('grid gap-1.5 text-sm', isLightTheme ? 'text-light-text' : 'text-foreground');
}

function inputClassName(isLightTheme: boolean): string {
  return isLightTheme
    ? 'border-light-border-strong bg-light-surface text-light-text placeholder:text-light-faint focus-visible:ring-light-accent/70'
    : '';
}

export function SettingsEditor({ settings, isLightTheme, onChange, locked }: SettingsEditorProps): JSX.Element {
  if (locked) {
    return (
      <p className={cn('text-sm', isLightTheme ? 'text-light-muted' : 'text-muted-foreground')}>
        Settings are editable only when idle or paused.
      </p>
    );
  }

  function update(delta: Partial<UserSettings>): void {
    onChange({ ...settings, ...delta });
  }

  return (
    <div className="grid gap-4">
      <div>
        <p className={cn('mb-1.5 text-sm', isLightTheme ? 'text-light-text' : 'text-foreground')}>Button labels</p>
        <div className="grid grid-cols-3 gap-2">
          {ICON_MODE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant="ghost"
              className={segmentButtonClassName(settings.iconDisplayMode === option.value, isLightTheme)}
              onClick={() => update({ iconDisplayMode: option.value })}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Stepper
          label="Work (seconds)"
          value={Math.floor(settings.workMs / 1000)}
          isLightTheme={isLightTheme}
          onMinus={() => update({ workMs: Math.max(1_000, settings.workMs - 1_000) })}
          onPlus={() => update({ workMs: settings.workMs + 1_000 })}
        />
        <Stepper
          label="Rest (seconds)"
          value={Math.floor(settings.restMs / 1000)}
          isLightTheme={isLightTheme}
          onMinus={() => update({ restMs: Math.max(1_000, settings.restMs - 1_000) })}
          onPlus={() => update({ restMs: settings.restMs + 1_000 })}
        />
        <Stepper
          label="Rounds"
          value={settings.rounds}
          isLightTheme={isLightTheme}
          onMinus={() => update({ rounds: Math.max(1, settings.rounds - 1) })}
          onPlus={() => update({ rounds: settings.rounds + 1 })}
        />
      </div>

      <label className={fieldLabelClassName(isLightTheme)}>
        Preferred max session (minutes)
        <Input
          type="number"
          className={inputClassName(isLightTheme)}
          value={settings.preferredMaxSessionMinutes}
          onChange={(event) => update({ preferredMaxSessionMinutes: Number(event.target.value) })}
        />
      </label>
      <label className={fieldLabelClassName(isLightTheme)}>
        Render FPS
        <Input
          type="number"
          className={inputClassName(isLightTheme)}
          value={settings.renderFps}
          onChange={(event) => update({ renderFps: Number(event.target.value) })}
        />
      </label>
      <label className={cn('flex items-center gap-2 text-sm', isLightTheme ? 'text-light-text' : 'text-foreground')}>
        <Checkbox
          isLightTheme={isLightTheme}
          checked={settings.prerollEnabled}
          onChange={(event) => update({ prerollEnabled: event.target.checked })}
        />
        Pre-roll enabled
      </label>
      <label className={cn('flex items-center gap-2 text-sm', isLightTheme ? 'text-light-text' : 'text-foreground')}>
        <Checkbox
          isLightTheme={isLightTheme}
          checked={settings.vibrationEnabled}
          onChange={(event) => update({ vibrationEnabled: event.target.checked })}
        />
        Vibration enabled
      </label>
    </div>
  );
}
