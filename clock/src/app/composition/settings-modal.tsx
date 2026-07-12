import { X } from 'lucide-react';

import { SettingsEditor } from '@app/composition/settings-editor';

import type { UserSettings } from '@features/settings/domain/settings-types';

import { Button } from '@shared/ui/button';
import { IconButton } from '@shared/ui/icon-button';
import { cn } from '@shared/utils/cn';

interface SettingsModalProps {
  isLightTheme: boolean;
  settings: UserSettings;
  locked: boolean;
  onClose: () => void;
  onChangeTheme: (theme: 'dark' | 'light') => void;
  onChangeSettings: (settings: UserSettings) => void;
}

export function SettingsModal({
  isLightTheme,
  settings,
  locked,
  onClose,
  onChangeTheme,
  onChangeSettings,
}: SettingsModalProps): JSX.Element {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
      <section
        className={cn(
          'w-full max-w-xl rounded-lg border p-5 shadow-2xl',
          isLightTheme ? 'border-light-border bg-light-surface text-light-text' : 'border-border bg-card text-foreground',
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Settings</h2>
          <IconButton icon={X} label="Close" mode={settings.iconDisplayMode} variant="ghost" size="sm" onClick={onClose} />
        </div>

        <div className="mb-4">
          <p className={cn('mb-2 text-xs font-semibold uppercase tracking-[0.2em]', isLightTheme ? 'text-light-muted' : 'text-muted-foreground')}>
            Theme
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(['light', 'dark'] as const).map((option) => {
              const selected = isLightTheme ? option === 'light' : option === 'dark';
              return (
                <Button
                  key={option}
                  type="button"
                  variant="ghost"
                  className={cn(
                    'border text-xs capitalize',
                    isLightTheme ? 'border-light-border' : 'border-border',
                    selected && (isLightTheme ? 'bg-light-text text-light-bg' : 'bg-foreground text-background'),
                  )}
                  onClick={() => onChangeTheme(option)}
                >
                  {option}
                </Button>
              );
            })}
          </div>
        </div>

        <SettingsEditor settings={settings} isLightTheme={isLightTheme} onChange={onChangeSettings} locked={locked} />
      </section>
    </div>
  );
}
