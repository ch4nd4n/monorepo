import { Button } from '@shared/ui/button';
import { cn } from '@shared/utils/cn';

interface UtilityActionsProps {
  voiceEnabled: boolean;
  isLocked: boolean;
  debugEnabled: boolean;
  isLightTheme: boolean;
  showVoiceHints: boolean;
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
}: UtilityActionsProps): JSX.Element {
  return (
    <section
      className={
        isLightTheme
          ? 'mt-4 rounded-lg border border-light-border bg-light-surface/70 p-3 pt-4 opacity-95 md:gap-2'
          : 'mt-4 rounded-lg border border-border/40 bg-card/40 p-3 pt-4 opacity-90 md:gap-2'
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
          <Button size="sm" variant="secondary" onClick={onEnableVoice}>
            Enable
          </Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={onStopVoice}>
            Turn off
          </Button>
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
        <Button size="sm" variant="ghost" onClick={onOpenCommands}>
          Voice Commands
        </Button>
        <Button size="sm" variant="ghost" onClick={onOpenSummary}>
          Summary
        </Button>
        <Button size="sm" variant="ghost" onClick={onToggleLock}>
          {isLocked ? 'Unlock Screen' : 'Lock Screen'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onToggleDebug}>
          {debugEnabled ? 'Hide Debug' : 'Show Debug'}
        </Button>
      </div>
    </section>
  );
}
