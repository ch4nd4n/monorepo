import { useEffect, useMemo, useState } from 'react';

import { ControlGrid } from '@app/composition/control-grid';
import { DebugCard } from '@app/composition/debug-card';
import { IntervalSetupCard } from '@app/composition/interval-setup-card';
import { Panel } from '@app/composition/panel';
import { SettingsModal } from '@app/composition/settings-modal';
import { TimerCard } from '@app/composition/timer-card';
import { UtilityActions } from '@app/composition/utility-actions';
import { useVoiceControl } from '@app/hooks/use-voice-control';
import { useWorkoutController } from '@app/hooks/use-workout-controller';

import { detectCapabilities } from '@features/capability/capability-service';
import { LocalSettingsRepository } from '@features/settings/adapters/local-settings-repository';
import { estimateSessionDurationMs, isOverPreferredDuration } from '@features/settings/domain/session-estimate';
import { DEFAULT_SETTINGS, type UserSettings } from '@features/settings/domain/settings-types';
import { WebSpeechAdapter } from '@features/voice-control/adapters/web-speech-adapter';
import type { CommandType, WorkoutState } from '@features/workout-session/commands/command-types';
import type { SessionSummary } from '@features/workout-session/workout-controller';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';
import { cn } from '@shared/utils/cn';
import { formatDuration } from '@shared/utils/format-duration';

const repository = new LocalSettingsRepository();

type PanelType = 'settings' | 'commands' | 'summary' | null;
type TimerMode = 'A' | 'B' | 'C';

export function App(): JSX.Element {
  const capabilities = useMemo(() => detectCapabilities(), []);
  const voiceAdapter = useMemo(() => new WebSpeechAdapter(), []);

  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [panel, setPanel] = useState<PanelType>(readPanelFromUrl());
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [timerMode, setTimerMode] = useState<TimerMode>('A');
  const [voiceToast, setVoiceToast] = useState<string | null>(null);
  const [showVoiceHints, setShowVoiceHints] = useState(false);

  function pushEvent(message: string): void {
    setEventLog((prev) => [message, ...prev].slice(0, 100));
  }

  function handleCompleted(): void {
    setPanel('summary');
  }

  const { view, dispatchCommand } = useWorkoutController({
    settings,
    hydrated,
    onCompleted: handleCompleted,
  });

  function applyCommand(type: CommandType, source: 'manual' | 'voice', confidence?: number): void {
    const { result } = dispatchCommand(type, source, confidence);

    pushEvent(`${new Date().toISOString()} ${source}:${type} ${result.decision} (${result.reason})`);

    if (result.decision === 'accepted') {
      playBeep();
      if (settings.vibrationEnabled && capabilities.vibrationSupported) {
        navigator.vibrate(80);
      }
      if (type === 'STOP') {
        setPanel('summary');
      }
    }
  }

  const {
    voiceMode,
    voiceEnabled,
    voiceStatusMessage,
    lastHeard,
    enableVoice,
    stopVoice,
  } = useVoiceControl({
    capabilities,
    voiceAdapter,
    onCommand: (type, confidence) => {
      applyCommand(type, 'voice', confidence);
    },
    pushEvent,
  });

  useEffect(() => {
    repository.load().then((saved) => {
      setSettings(saved ?? DEFAULT_SETTINGS);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void repository.save(settings);
  }, [hydrated, settings]);

  useEffect(() => {
    writePanelToUrl(panel);
  }, [panel]);

  const estimatedMs = estimateSessionDurationMs(settings);
  const overPreferredDuration = isOverPreferredDuration(estimatedMs, settings.preferredMaxSessionMinutes);
  const summary: SessionSummary | null = view.summary;
  const isLightTheme = theme === 'light';

  const intervalDurationMs =
    view.phase === 'rest' ? settings.restMs : view.phase === 'preroll' ? 3_000 : settings.workMs;
  const progress = 1 - view.remainingMs / Math.max(1, intervalDurationMs);

  return (
    <div className={isLightTheme ? 'min-h-screen bg-light-bg text-light-text' : 'min-h-screen bg-background'}>
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 md:px-8">
        <header className="mb-1 flex items-center justify-between">
          <h1
            className={
              isLightTheme
                ? 'text-sm font-medium uppercase tracking-[0.18em] text-light-muted md:text-base'
                : 'text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground md:text-base'
            }
          >
            Kairos
          </h1>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className={isLightTheme ? 'border border-light-border-strong text-light-muted' : 'border border-border/60'}
              onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
            >
              {isLightTheme ? 'Dark' : 'Light'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPanel('settings')}>
              Settings
            </Button>
            <Badge
              className={
                isLightTheme
                  ? 'border-light-border bg-transparent text-light-muted'
                  : 'border-border/50 bg-transparent text-muted-foreground'
              }
            >
              Voice: {voiceMode}
            </Badge>
          </div>
        </header>

        <div className="mb-2 flex items-center justify-end gap-2">
          {(['A', 'B', 'C'] as const).map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={timerMode === mode ? 'default' : 'ghost'}
              className={cn(timerMode !== mode && 'border border-border/50')}
              onClick={() => setTimerMode(mode)}
            >
              {mode}
            </Button>
          ))}
        </div>

        <div className="flex flex-1 flex-col">
          {view.workoutState === 'idle' ? (
            <IntervalSetupCard settings={settings} isLightTheme={isLightTheme} onChange={setSettings} />
          ) : (
            <TimerCard
              timerText={formatDuration(view.remainingMs)}
              phase={view.phase}
              round={view.round}
              totalRounds={settings.rounds}
              lastMessage={view.lastMessage}
              isLightTheme={isLightTheme}
              mode={timerMode}
              progress={progress}
            />
          )}

          {!isLocked && (
            <ControlGrid
              primaryLabel={getPrimaryControlLabel(view.workoutState)}
              isLightTheme={isLightTheme}
              onPrimary={() => {
                if (view.workoutState === 'running' || view.workoutState === 'preroll') {
                  applyCommand('PAUSE', 'manual');
                  return;
                }

                if (view.workoutState === 'paused') {
                  applyCommand('RESUME', 'manual');
                  return;
                }

                applyCommand('START', 'manual');
              }}
              onNext={() => applyCommand('NEXT', 'manual')}
              onStop={() => applyCommand('STOP', 'manual')}
              onReset={() => applyCommand('RESET', 'manual')}
            />
          )}
        </div>

        <UtilityActions
          voiceEnabled={voiceEnabled}
          isLocked={isLocked}
          debugEnabled={debugEnabled}
          isLightTheme={isLightTheme}
          showVoiceHints={showVoiceHints}
          onEnableVoice={async () => {
            await enableVoice();
            setVoiceToast('Voice enabled');
            setShowVoiceHints(true);
            window.setTimeout(() => setVoiceToast(null), 1500);
            window.setTimeout(() => setShowVoiceHints(false), 5000);
          }}
          onStopVoice={stopVoice}
          onOpenCommands={() => setPanel('commands')}
          onOpenSummary={() => setPanel('summary')}
          onToggleLock={() => setIsLocked((value) => !value)}
          onToggleDebug={() => setDebugEnabled((value) => !value)}
        />

        {voiceToast && (
          <div
            className={cn(
              'pointer-events-none fixed right-5 top-5 z-50 rounded-md px-3 py-2 text-sm font-medium shadow-lg',
              isLightTheme ? 'bg-light-positive text-light-on-accent' : 'bg-positive text-on-accent',
            )}
          >
            {voiceToast}
          </div>
        )}

        {voiceStatusMessage && (
          <Card className={isLightTheme ? 'mt-3 border-light-danger/40 bg-light-danger/10' : 'mt-3 border-danger/40 bg-danger/10'}>
            <CardContent className={isLightTheme ? 'p-2.5 text-xs text-light-danger md:text-sm' : 'p-2.5 text-xs text-danger md:text-sm'}>
              {voiceStatusMessage}
            </CardContent>
          </Card>
        )}

        {overPreferredDuration && (
          <Card className={isLightTheme ? 'mt-3 border-light-accent/40 bg-light-accent/10' : 'mt-3 border-accent/40 bg-accent/10'}>
            <CardContent className={isLightTheme ? 'p-2.5 text-xs text-light-text md:text-sm' : 'p-2.5 text-xs text-foreground md:text-sm'}>
              Warning: estimated workout ({formatDuration(estimatedMs)}) exceeds preferred max (
              {settings.preferredMaxSessionMinutes} min). You can continue.
            </CardContent>
          </Card>
        )}

        {panel === 'commands' && (
          <Panel title="Voice Commands" isLightTheme={isLightTheme} onClose={() => setPanel(null)}>
            <ul>
              <li>Clock, start</li>
              <li>Clock, pause</li>
              <li>Clock, resume</li>
              <li>Clock, next</li>
              <li>Clock, stop</li>
              <li>Clock, reset</li>
            </ul>
          </Panel>
        )}

        {panel === 'settings' && (
          <SettingsModal
            isLightTheme={isLightTheme}
            settings={settings}
            locked={view.workoutState === 'running'}
            onChangeTheme={setTheme}
            onChangeSettings={setSettings}
            onClose={() => setPanel(null)}
          />
        )}

        {panel === 'summary' && (
          <Panel title="Session Summary" isLightTheme={isLightTheme} onClose={() => setPanel(null)}>
            {summary ? (
              <ul>
                <li>Elapsed: {formatDuration(summary.elapsedMs)}</li>
                <li>Rounds completed: {summary.roundsCompleted}</li>
                <li>Started: {new Date(summary.startedAtMs).toLocaleTimeString()}</li>
                <li>Ended: {new Date(summary.endedAtMs).toLocaleTimeString()}</li>
              </ul>
            ) : (
              <p>No summary yet. Stop or complete a session to view stats.</p>
            )}
          </Panel>
        )}

        {debugEnabled && <DebugCard lastHeard={lastHeard} eventLog={eventLog} />}
      </main>
    </div>
  );
}

function getPrimaryControlLabel(workoutState: WorkoutState): string {
  if (workoutState === 'running' || workoutState === 'preroll') {
    return 'Pause';
  }

  if (workoutState === 'paused') {
    return 'Continue';
  }

  return 'Start';
}

function readPanelFromUrl(): PanelType {
  const url = new URL(window.location.href);
  const panel = url.searchParams.get('panel');
  if (panel === 'settings' || panel === 'commands' || panel === 'summary') {
    return panel;
  }

  return null;
}

function writePanelToUrl(panel: PanelType): void {
  const url = new URL(window.location.href);
  if (!panel) {
    url.searchParams.delete('panel');
  } else {
    url.searchParams.set('panel', panel);
  }
  window.history.replaceState({}, '', url);
}

function playBeep(): void {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  gainNode.gain.value = 0.02;

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.08);
}
