import { useEffect, useMemo, useRef, useState } from 'react';

import { detectCapabilities } from '@features/capability/capability-service';
import { LocalSettingsRepository } from '@features/settings/adapters/local-settings-repository';
import { estimateSessionDurationMs, isOverPreferredDuration } from '@features/settings/domain/session-estimate';
import {
  DEFAULT_SETTINGS,
  type UserSettings,
} from '@features/settings/domain/settings-types';
import { WebSpeechAdapter } from '@features/voice-control/adapters/web-speech-adapter';
import { parseVoicePhrase } from '@features/voice-control/application/phrase-parser';
import type {
  CommandType,
  WorkoutState,
} from '@features/workout-session/commands/command-types';
import {
  createWorkoutController,
  type SessionSummary,
} from '@features/workout-session/workout-controller';

import { formatDuration } from '@shared/utils/format-duration';
import { nowMs } from '@shared/utils/time';

const repository = new LocalSettingsRepository();

type Panel = 'settings' | 'commands' | 'summary' | null;
type VoiceMode = 'continuous' | 'tapToTalkFallback' | 'micOff';

export function App(): JSX.Element {
  const capabilities = useMemo(() => detectCapabilities(), []);
  const voiceAdapterRef = useRef(new WebSpeechAdapter());

  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [panel, setPanel] = useState<Panel>(readPanelFromUrl());
  const [voiceMode, setVoiceMode] = useState<VoiceMode>(capabilities.isIOS ? 'tapToTalkFallback' : 'micOff');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const controllerRef = useRef(
    createWorkoutController({
      workMs: settings.workMs,
      restMs: settings.restMs,
      rounds: settings.rounds,
      prerollEnabled: settings.prerollEnabled,
      prerollSeconds: settings.prerollSeconds,
      minCommandConfidence: settings.minCommandConfidence,
    }),
  );

  const [view, setView] = useState(controllerRef.current.getState());

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
    controllerRef.current = createWorkoutController({
      workMs: settings.workMs,
      restMs: settings.restMs,
      rounds: settings.rounds,
      prerollEnabled: settings.prerollEnabled,
      prerollSeconds: settings.prerollSeconds,
      minCommandConfidence: settings.minCommandConfidence,
    });
    setView(controllerRef.current.getState());
  }, [hydrated, settings]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      controllerRef.current.tick(nowMs());
      const next = controllerRef.current.getState();
      if (next.workoutState === 'completed' && panel !== 'summary') {
        setPanel('summary');
      }
      setView(next);
    }, Math.max(50, Math.floor(1000 / settings.renderFps)));

    return () => window.clearInterval(interval);
  }, [panel, settings.renderFps]);

  useEffect(() => {
    writePanelToUrl(panel);
  }, [panel]);

  const estimatedMs = estimateSessionDurationMs(settings);
  const overPreferredDuration = isOverPreferredDuration(
    estimatedMs,
    settings.preferredMaxSessionMinutes,
  );

  function applyCommand(type: CommandType, source: 'manual' | 'voice', confidence?: number): void {
    const result = controllerRef.current.dispatch({
      type,
      source,
      timestampMs: nowMs(),
      confidence,
    });

    setView(controllerRef.current.getState());
    setEventLog((prev) => [
      `${new Date().toISOString()} ${source}:${type} ${result.decision} (${result.reason})`,
      ...prev,
    ].slice(0, 100));

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

  async function enableVoice(): Promise<void> {
    if (!voiceAdapterRef.current.isSupported() || !capabilities.speechSupported) {
      setEventLog((prev) => ['Voice not supported on this browser', ...prev]);
      return;
    }

    const permission = await voiceAdapterRef.current.requestPermission();
    if (permission !== 'granted') {
      setVoiceEnabled(false);
      setVoiceMode('micOff');
      setEventLog((prev) => ['Microphone permission denied', ...prev]);
      return;
    }

    setVoiceEnabled(true);
    startVoice();
  }

  function startVoice(): void {
    const mode: VoiceMode = capabilities.continuousSupported ? 'continuous' : 'tapToTalkFallback';
    setVoiceMode(mode);
    voiceAdapterRef.current.startContinuous((result) => {
      const rawHeard = `${result.transcript} (${result.confidence.toFixed(2)})`;
      setLastHeard(rawHeard);
      setEventLog((prev) => [`RAW heard: ${rawHeard}`, ...prev].slice(0, 100));

      const parsed = parseVoicePhrase(result.transcript);
      if (!parsed.ok) {
        setEventLog((prev) => [`PARSE rejected: ${parsed.error}`, ...prev].slice(0, 100));
        return;
      }

      setEventLog((prev) => [
        `PARSE command: ${parsed.value.type} (normalized="${parsed.value.normalizedPhrase}")`,
        ...prev,
      ].slice(0, 100));

      applyCommand(parsed.value.type, 'voice', result.confidence);
    });
  }

  function stopVoice(): void {
    voiceAdapterRef.current.stop();
    setVoiceMode('micOff');
    setVoiceEnabled(false);
  }

  function handlePrimaryControl(): void {
    if (view.workoutState === 'running' || view.workoutState === 'preroll') {
      applyCommand('PAUSE', 'manual');
      return;
    }

    if (view.workoutState === 'paused') {
      applyCommand('RESUME', 'manual');
      return;
    }

    applyCommand('START', 'manual');
  }

  const summary: SessionSummary | null = view.summary;

  return (
    <main style={{ fontFamily: 'Inter, sans-serif', maxWidth: 760, margin: '0 auto', padding: '1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Voice Workout Clock</h1>
        <span style={{ padding: '0.25rem 0.5rem', border: '1px solid #ccc', borderRadius: 6 }}>
          Voice: {voiceMode}
        </span>
      </header>

      <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: 56, fontWeight: 700, textAlign: 'center' }}>{formatDuration(view.remainingMs)}</div>
        <p style={{ textAlign: 'center', marginTop: 4 }}>
          Phase: <strong>{view.phase}</strong> · Round {view.round}/{settings.rounds}
        </p>
        <p style={{ textAlign: 'center', color: '#555' }}>{view.lastMessage}</p>
      </section>

      {!isLocked && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          <button type="button" onClick={handlePrimaryControl}>
            {getPrimaryControlLabel(view.workoutState)}
          </button>
          <button type="button" onClick={() => applyCommand('NEXT', 'manual')}>Next</button>
          <button type="button" onClick={() => applyCommand('STOP', 'manual')}>Stop</button>
          <button type="button" onClick={() => applyCommand('RESET', 'manual')}>Reset</button>
        </section>
      )}

      <section style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {!voiceEnabled ? (
          <button type="button" onClick={() => void enableVoice()}>
            Enable Voice
          </button>
        ) : (
          <button type="button" onClick={stopVoice}>Mic Off</button>
        )}
        <button type="button" onClick={() => setPanel('commands')}>Voice Commands</button>
        <button type="button" onClick={() => setPanel('settings')}>Settings</button>
        <button type="button" onClick={() => setPanel('summary')}>Summary</button>
        <button type="button" onClick={() => setIsLocked((v) => !v)}>
          {isLocked ? 'Unlock Screen' : 'Lock Screen'}
        </button>
        <button type="button" onClick={() => setDebugEnabled((v) => !v)}>
          {debugEnabled ? 'Hide Debug' : 'Show Debug'}
        </button>
      </section>

      {overPreferredDuration && (
        <p style={{ marginTop: 12, padding: 8, background: '#fff3cd', borderRadius: 6 }}>
          Warning: estimated workout ({formatDuration(estimatedMs)}) exceeds preferred max (
          {settings.preferredMaxSessionMinutes} min). You can continue.
        </p>
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
          <SettingsEditor settings={settings} onChange={setSettings} locked={view.workoutState === 'running'} />
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

      {debugEnabled && (
        <section style={{ marginTop: 16, borderTop: '1px solid #ddd', paddingTop: 8 }}>
          <h3>Debug</h3>
          <p>Last heard: {lastHeard || '—'}</p>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{eventLog.join('\n')}</pre>
        </section>
      )}
    </main>
  );
}

interface PanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Panel(props: PanelProps): JSX.Element {
  return (
    <section style={{ marginTop: 12, border: '1px solid #ddd', borderRadius: 8, padding: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{props.title}</h2>
        <button type="button" onClick={props.onClose}>Close</button>
      </div>
      <div style={{ marginTop: 8 }}>{props.children}</div>
    </section>
  );
}

interface SettingsEditorProps {
  settings: UserSettings;
  onChange: (settings: UserSettings) => void;
  locked: boolean;
}

function SettingsEditor(props: SettingsEditorProps): JSX.Element {
  if (props.locked) {
    return <p>Settings are editable only when idle or paused.</p>;
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <label>
        Work (seconds)
        <input
          type="number"
          value={Math.floor(props.settings.workMs / 1000)}
          onChange={(event) =>
            props.onChange({ ...props.settings, workMs: Number(event.target.value) * 1000 })
          }
        />
      </label>
      <label>
        Rest (seconds)
        <input
          type="number"
          value={Math.floor(props.settings.restMs / 1000)}
          onChange={(event) =>
            props.onChange({ ...props.settings, restMs: Number(event.target.value) * 1000 })
          }
        />
      </label>
      <label>
        Rounds
        <input
          type="number"
          value={props.settings.rounds}
          onChange={(event) => props.onChange({ ...props.settings, rounds: Number(event.target.value) })}
        />
      </label>
      <label>
        Preferred max session (minutes)
        <input
          type="number"
          value={props.settings.preferredMaxSessionMinutes}
          onChange={(event) =>
            props.onChange({
              ...props.settings,
              preferredMaxSessionMinutes: Number(event.target.value),
            })
          }
        />
      </label>
      <label>
        Render FPS
        <input
          type="number"
          value={props.settings.renderFps}
          onChange={(event) => props.onChange({ ...props.settings, renderFps: Number(event.target.value) })}
        />
      </label>
      <label>
        Pre-roll enabled
        <input
          type="checkbox"
          checked={props.settings.prerollEnabled}
          onChange={(event) =>
            props.onChange({ ...props.settings, prerollEnabled: event.target.checked })
          }
        />
      </label>
      <label>
        Vibration enabled
        <input
          type="checkbox"
          checked={props.settings.vibrationEnabled}
          onChange={(event) =>
            props.onChange({ ...props.settings, vibrationEnabled: event.target.checked })
          }
        />
      </label>
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

function readPanelFromUrl(): Panel {
  const url = new URL(window.location.href);
  const panel = url.searchParams.get('panel');
  if (panel === 'settings' || panel === 'commands' || panel === 'summary') {
    return panel;
  }

  return null;
}

function writePanelToUrl(panel: Panel): void {
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
