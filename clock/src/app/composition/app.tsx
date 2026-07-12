import { useEffect, useMemo, useState } from 'react';

import { ControlGrid } from '@app/composition/control-grid';
import { DebugCard } from '@app/composition/debug-card';
import { Panel } from '@app/composition/panel';
import { SettingsEditor } from '@app/composition/settings-editor';
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
import { Card, CardContent } from '@shared/ui/card';
import { formatDuration } from '@shared/utils/format-duration';

const repository = new LocalSettingsRepository();

type PanelType = 'settings' | 'commands' | 'summary' | null;

export function App(): JSX.Element {
  const capabilities = useMemo(() => detectCapabilities(), []);
  const voiceAdapter = useMemo(() => new WebSpeechAdapter(), []);

  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [panel, setPanel] = useState<PanelType>(readPanelFromUrl());
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);

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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 md:px-8">
      <header className="mb-1 flex items-center justify-between">
        <h1 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground md:text-base">Kairos</h1>
        <Badge className="border-border/50 bg-transparent text-muted-foreground">Voice: {voiceMode}</Badge>
      </header>

      <div className="flex flex-1 flex-col">
        <TimerCard
          timerText={formatDuration(view.remainingMs)}
          phase={view.phase}
          round={view.round}
          totalRounds={settings.rounds}
          lastMessage={view.lastMessage}
        />

        {!isLocked && (
          <ControlGrid
            primaryLabel={getPrimaryControlLabel(view.workoutState)}
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
        onEnableVoice={() => {
          void enableVoice();
        }}
        onStopVoice={stopVoice}
        onOpenCommands={() => setPanel('commands')}
        onOpenSettings={() => setPanel('settings')}
        onOpenSummary={() => setPanel('summary')}
        onToggleLock={() => setIsLocked((value) => !value)}
        onToggleDebug={() => setDebugEnabled((value) => !value)}
      />

      {voiceStatusMessage && (
        <Card className="mt-3 border-red-400/40 bg-red-950/20">
          <CardContent className="p-2.5 text-xs text-red-100 md:text-sm">{voiceStatusMessage}</CardContent>
        </Card>
      )}

      {overPreferredDuration && (
        <Card className="mt-3 border-yellow-400/40 bg-yellow-950/20">
          <CardContent className="p-2.5 text-xs text-yellow-100 md:text-sm">
            Warning: estimated workout ({formatDuration(estimatedMs)}) exceeds preferred max (
            {settings.preferredMaxSessionMinutes} min). You can continue.
          </CardContent>
        </Card>
      )}

      {panel === 'commands' && (
        <Panel title="Voice Commands" onClose={() => setPanel(null)}>
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
        <Panel title="Settings" onClose={() => setPanel(null)}>
          <SettingsEditor
            settings={settings}
            onChange={setSettings}
            locked={view.workoutState === 'running'}
          />
        </Panel>
      )}

      {panel === 'summary' && (
        <Panel title="Session Summary" onClose={() => setPanel(null)}>
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
