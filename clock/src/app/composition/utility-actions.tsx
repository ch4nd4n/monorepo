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
    <section className="mt-4 flex flex-wrap gap-2">
      {!voiceEnabled ? (
        <Button variant="secondary" onClick={onEnableVoice}>
          Enable Voice
        </Button>
      ) : (
        <Button variant="secondary" onClick={onStopVoice}>
          Mic Off
        </Button>
      )}
      <Button variant="ghost" onClick={onOpenCommands}>
        Voice Commands
      </Button>
      <Button variant="ghost" onClick={onOpenSettings}>
        Settings
      </Button>
      <Button variant="ghost" onClick={onOpenSummary}>
        Summary
      </Button>
      <Button variant="ghost" onClick={onToggleLock}>
        {isLocked ? 'Unlock Screen' : 'Lock Screen'}
      </Button>
      <Button variant="ghost" onClick={onToggleDebug}>
        {debugEnabled ? 'Hide Debug' : 'Show Debug'}
      </Button>
    </section>
  );
}
