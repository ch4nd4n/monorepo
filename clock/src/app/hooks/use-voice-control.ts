import { useEffect, useMemo, useRef, useState } from 'react';

import type { CapabilityProfile } from '@features/capability/capability-service';
import type { VoiceAdapter } from '@features/voice-control/adapters/voice-adapter';
import { parseVoicePhrase } from '@features/voice-control/application/phrase-parser';
import type { CommandType } from '@features/workout-session/commands/command-types';

const VOICE_RETRY_MAX = 3;
const VOICE_RETRY_DELAY_MS = 800;

type VoiceMode = 'continuous' | 'tapToTalkFallback' | 'micOff';

interface UseVoiceControlInput {
  capabilities: CapabilityProfile;
  voiceAdapter: VoiceAdapter;
  onCommand: (type: CommandType, confidence?: number) => void;
  pushEvent: (message: string) => void;
}

interface UseVoiceControlResult {
  voiceMode: VoiceMode;
  voiceEnabled: boolean;
  voiceStatusMessage: string | null;
  lastHeard: string;
  enableVoice: () => Promise<void>;
  stopVoice: () => void;
}

export function useVoiceControl({
  capabilities,
  voiceAdapter,
  onCommand,
  pushEvent,
}: UseVoiceControlInput): UseVoiceControlResult {
  const keepVoiceAliveRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceStatusMessage, setVoiceStatusMessage] = useState<string | null>(null);
  const [lastHeard, setLastHeard] = useState('');

  const initialVoiceMode = useMemo<VoiceMode>(
    () => (capabilities.isIOS ? 'tapToTalkFallback' : 'micOff'),
    [capabilities.isIOS],
  );
  const [voiceMode, setVoiceMode] = useState<VoiceMode>(initialVoiceMode);

  function clearReconnectTimeout(): void {
    if (reconnectTimeoutRef.current !== null) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }

  function startVoice(): void {
    if (!keepVoiceAliveRef.current) {
      return;
    }

    const mode: VoiceMode = capabilities.continuousSupported ? 'continuous' : 'tapToTalkFallback';
    setVoiceMode(mode);

    voiceAdapter.startContinuous({
      onResult: (result) => {
        reconnectAttemptsRef.current = 0;
        setVoiceStatusMessage(null);

        const rawHeard = `${result.transcript} (${result.confidence.toFixed(2)})`;
        setLastHeard(rawHeard);
        pushEvent(`RAW heard: ${rawHeard}`);

        const parsed = parseVoicePhrase(result.transcript);
        if (!parsed.ok) {
          pushEvent(`PARSE rejected: ${parsed.error}`);
          return;
        }

        pushEvent(
          `PARSE command: ${parsed.value.type} (normalized="${parsed.value.normalizedPhrase}")`,
        );

        onCommand(parsed.value.type, result.confidence);
      },
      onError: (message) => {
        scheduleReconnect(`error:${message}`);
      },
      onEnded: () => {
        scheduleReconnect('ended');
      },
    });
  }

  function scheduleReconnect(reason: string): void {
    if (!keepVoiceAliveRef.current) {
      return;
    }

    const nextAttempt = reconnectAttemptsRef.current + 1;
    if (nextAttempt > VOICE_RETRY_MAX) {
      keepVoiceAliveRef.current = false;
      setVoiceEnabled(false);
      setVoiceMode('micOff');
      setVoiceStatusMessage('Voice disconnected. Tap Enable Voice to reconnect.');
      pushEvent(`VOICE fallback micOff: ${reason}`);
      clearReconnectTimeout();
      return;
    }

    reconnectAttemptsRef.current = nextAttempt;
    setVoiceStatusMessage(`Reconnecting voice… (${nextAttempt}/${VOICE_RETRY_MAX})`);
    pushEvent(`VOICE reconnect attempt ${nextAttempt}: ${reason}`);

    clearReconnectTimeout();
    reconnectTimeoutRef.current = window.setTimeout(() => {
      startVoice();
    }, VOICE_RETRY_DELAY_MS);
  }

  async function enableVoice(): Promise<void> {
    if (!voiceAdapter.isSupported() || !capabilities.speechSupported) {
      pushEvent('Voice not supported on this browser');
      return;
    }

    const permission = await voiceAdapter.requestPermission();
    if (permission !== 'granted') {
      setVoiceEnabled(false);
      setVoiceMode('micOff');
      setVoiceStatusMessage('Microphone permission denied. Manual controls are available.');
      pushEvent('Microphone permission denied');
      return;
    }

    keepVoiceAliveRef.current = true;
    reconnectAttemptsRef.current = 0;
    setVoiceEnabled(true);
    setVoiceStatusMessage(null);
    startVoice();
  }

  function stopVoice(): void {
    keepVoiceAliveRef.current = false;
    reconnectAttemptsRef.current = 0;
    clearReconnectTimeout();
    voiceAdapter.stop();
    setVoiceMode('micOff');
    setVoiceEnabled(false);
    setVoiceStatusMessage(null);
  }

  useEffect(() => {
    return () => {
      clearReconnectTimeout();
    };
  }, []);

  return {
    voiceMode,
    voiceEnabled,
    voiceStatusMessage,
    lastHeard,
    enableVoice,
    stopVoice,
  };
}
