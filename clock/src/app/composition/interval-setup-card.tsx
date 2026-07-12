import type { UserSettings } from '@features/settings/domain/settings-types';

import { Button } from '@shared/ui/button';
import { Stepper } from '@shared/ui/stepper';
import { cn } from '@shared/utils/cn';

interface IntervalSetupCardProps {
  settings: UserSettings;
  isLightTheme: boolean;
  onChange: (next: UserSettings) => void;
}

type Preset = {
  label: string;
  workSec: number;
  restSec: number;
  rounds: number;
};

const presets: Preset[] = [
  { label: 'Tabata', workSec: 20, restSec: 10, rounds: 8 },
  { label: 'EMOM 10', workSec: 40, restSec: 20, rounds: 10 },
  { label: '30/30 ×6', workSec: 30, restSec: 30, rounds: 6 },
  { label: 'Custom', workSec: -1, restSec: -1, rounds: -1 },
];

export function IntervalSetupCard({ settings, isLightTheme, onChange }: IntervalSetupCardProps): JSX.Element {
  const workSec = Math.round(settings.workMs / 1000);
  const restSec = Math.round(settings.restMs / 1000);

  const selectedPreset = presets.find(
    (preset) =>
      preset.workSec === workSec && preset.restSec === restSec && preset.rounds === settings.rounds,
  )?.label;

  function update(delta: Partial<UserSettings>): void {
    onChange({ ...settings, ...delta });
  }

  return (
    <section className="mx-auto mb-6 mt-6 w-full max-w-3xl">
      <h2 className={cn('text-4xl font-semibold md:text-6xl', isLightTheme ? 'text-light-text' : 'text-foreground')}>
        Set your intervals
      </h2>
      <p className={cn('mt-2 text-lg', isLightTheme ? 'text-light-muted' : 'text-muted-foreground')}>
        Hands stay on the bar — once you start, just talk to the clock.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant={selectedPreset === preset.label || (preset.label === 'Custom' && !selectedPreset) ? 'secondary' : 'ghost'}
            className={cn(
              'border',
              isLightTheme ? 'border-light-border' : 'border-border',
              (selectedPreset === preset.label || (preset.label === 'Custom' && !selectedPreset)) &&
                (isLightTheme ? 'bg-light-text text-light-bg' : 'bg-foreground text-background'),
            )}
            onClick={() => {
              if (preset.label === 'Custom') {
                return;
              }
              update({ workMs: preset.workSec * 1000, restMs: preset.restSec * 1000, rounds: preset.rounds });
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Stepper
          label="Work"
          value={workSec}
          isLightTheme={isLightTheme}
          onMinus={() => update({ workMs: Math.max(1_000, settings.workMs - 1_000) })}
          onPlus={() => update({ workMs: settings.workMs + 1_000 })}
        />
        <Stepper
          label="Rest"
          value={restSec}
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

      <p className={cn('mt-6 text-sm uppercase tracking-[0.18em]', isLightTheme ? 'text-light-faint' : 'text-muted-foreground')}>
        Total {Math.round((settings.workMs + settings.restMs) * settings.rounds / 1000 / 60)} min
      </p>
    </section>
  );
}
