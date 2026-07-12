import { Button } from '@shared/ui/button';

interface UtilityActionsProps {
  voiceEnabled: boolean;
  isLocked: boolean;
  debugEnabled: boolean;
  onEnableVoice: () => void;
  onStopVoice: () => void;
  onOpenCommands: () => void;
  onOpenSettings: () => void;
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
  onOpenSettings,
  onOpenSummary,
  onToggleLock,
  onToggleDebug,
}: UtilityActionsProps): JSX.Element {
  return (
    <section className="mt-3 flex flex-wrap items-center justify-center gap-1.5 border-t border-border/50 pt-3 md:gap-2">
      {!voiceEnabled ? (
        <Button size="sm" variant="secondary" onClick={onEnableVoice}>
          Enable Voice
        </Button>
      ) : (
        <Button size="sm" variant="secondary" onClick={onStopVoice}>
          Mic Off
        </Button>
      )}
      <Button size="sm" variant="ghost" onClick={onOpenCommands}>
        Voice Commands
      </Button>
      <Button size="sm" variant="ghost" onClick={onOpenSettings}>
        Settings
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
    </section>
  );
}
