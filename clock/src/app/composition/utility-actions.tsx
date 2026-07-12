import { Bug, ClipboardList, Lock, Mic, MicOff, MessageSquare, Unlock } from 'lucide-react';

import type { IconDisplayMode } from '@features/settings/domain/settings-types';

import { IconButton } from '@shared/ui/icon-button';
import { cn } from '@shared/utils/cn';

interface UtilityActionsProps {
  voiceEnabled: boolean;
  isLocked: boolean;
  debugEnabled: boolean;
  isLightTheme: boolean;
  showVoiceHints: boolean;
  iconMode: IconDisplayMode;
  onEnableVoice: () => void;
  onStopVoice: () => void;
  onOpenCommands: () => void;
  onOpenSummary: () => void;
  onToggleLock: () => void;
  onToggleDebug: () => void;
}

export function UtilityActions({
  voiceEnabled,
  isLocked,
  debugEnabled,
  onEnableVoice,
  onStopVoice,
  onOpenCommands,
  onOpenSummary,
  onToggleLock,
  onToggleDebug,
  isLightTheme,
  showVoiceHints,
  iconMode,
}: UtilityActionsProps): JSX.Element {
  return (
    <section
      className={
        isLightTheme
          ? 'mt-4 rounded-lg border border-light-border bg-light-surface/70 p-3 opacity-95'
          : 'mt-4 rounded-lg border border-border/40 bg-card/40 p-3 opacity-90'
      }
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              'inline-block h-2.5 w-2.5 rounded-full',
              voiceEnabled ? 'animate-pulse bg-positive' : isLightTheme ? 'bg-light-faint' : 'bg-muted-foreground',
            )}
          />
          <span className={isLightTheme ? 'text-light-text' : 'text-foreground'}>
            {voiceEnabled ? 'Voice listening for "Clock"' : 'Voice off'}
          </span>
        </div>
        {!voiceEnabled ? (
          <IconButton icon={Mic} label="Enable" mode={iconMode} size="sm" variant="secondary" onClick={onEnableVoice} />
        ) : (
          <IconButton icon={MicOff} label="Turn off" mode={iconMode} size="sm" variant="secondary" onClick={onStopVoice} />
        )}
      </div>

      {voiceEnabled && showVoiceHints && (
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          {['"Clock, start"', '"Clock, pause"', '"Clock, next"', '"Clock, stop"'].map((hint) => (
            <span key={hint} className={isLightTheme ? 'rounded border border-light-border bg-light-surface-2 px-2 py-1 text-light-text' : 'rounded border border-border bg-muted px-2 py-1 text-foreground/90'}>
              {hint}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
        <IconButton icon={MessageSquare} label="Voice Commands" mode={iconMode} size="sm" variant="ghost" onClick={onOpenCommands} />
        <IconButton icon={ClipboardList} label="Summary" mode={iconMode} size="sm" variant="ghost" onClick={onOpenSummary} />
        <IconButton
          icon={isLocked ? Unlock : Lock}
          label={isLocked ? 'Unlock Screen' : 'Lock Screen'}
          mode={iconMode}
          size="sm"
          variant="ghost"
          onClick={onToggleLock}
        />
        <IconButton
          icon={Bug}
          label={debugEnabled ? 'Hide Debug' : 'Show Debug'}
          mode={iconMode}
          size="sm"
          variant="ghost"
          onClick={onToggleDebug}
        />
      </div>
    </section>
  );
}
