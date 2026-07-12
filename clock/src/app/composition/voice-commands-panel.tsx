import { Pause, Play, RotateCcw, SkipForward, Square, type LucideIcon } from 'lucide-react';

import { Panel } from '@app/composition/panel';

import type { IconDisplayMode } from '@features/settings/domain/settings-types';

import { cn } from '@shared/utils/cn';

interface VoiceCommandsPanelProps {
  isLightTheme: boolean;
  iconMode: IconDisplayMode;
  onClose: () => void;
}

interface VoiceCommand {
  phrase: string;
  description: string;
  icon: LucideIcon;
}

const VOICE_COMMANDS: VoiceCommand[] = [
  { phrase: 'Clock, start', description: 'Begin the workout', icon: Play },
  { phrase: 'Clock, pause', description: 'Pause the current interval', icon: Pause },
  { phrase: 'Clock, resume', description: 'Continue after pausing', icon: Play },
  { phrase: 'Clock, next', description: 'Skip to the next interval', icon: SkipForward },
  { phrase: 'Clock, stop', description: 'End the workout and view the summary', icon: Square },
  { phrase: 'Clock, reset', description: 'Reset back to the setup screen', icon: RotateCcw },
];

export function VoiceCommandsPanel({ isLightTheme, iconMode, onClose }: VoiceCommandsPanelProps): JSX.Element {
  return (
    <Panel title="Voice Commands" isLightTheme={isLightTheme} iconMode={iconMode} onClose={onClose}>
      <p className={cn('mb-3 text-xs uppercase tracking-[0.12em]', isLightTheme ? 'text-light-faint' : 'text-muted-foreground')}>
        Say “Clock” before every command
      </p>
      <ul className="grid gap-2">
        {VOICE_COMMANDS.map((command) => (
          <li
            key={command.phrase}
            className={cn(
              'flex items-center gap-3 rounded-lg border px-3 py-2.5',
              isLightTheme ? 'border-light-border bg-light-surface-2' : 'border-border bg-muted/40',
            )}
          >
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                isLightTheme ? 'bg-light-surface text-light-accent' : 'bg-card text-accent',
              )}
            >
              <command.icon size={16} aria-hidden focusable="false" />
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className={cn('font-mono text-xs uppercase tracking-[0.08em]', isLightTheme ? 'text-light-text' : 'text-foreground')}>
                {command.phrase}
              </span>
              <span className={cn('text-xs', isLightTheme ? 'text-light-muted' : 'text-muted-foreground')}>{command.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
