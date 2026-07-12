import type { VoiceAdapter, VoiceStartHandlers } from '@features/voice-control/adapters/voice-adapter';

function getRecognitionErrorMessage(event: Event): string {
  const maybeError = event as Event & { error?: string };
  return maybeError.error ?? 'unknown';
}

export class WebSpeechAdapter implements VoiceAdapter {
  private recognition: SpeechRecognition | null = null;

  isSupported(): boolean {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  async requestPermission(): Promise<'granted' | 'denied'> {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return 'granted';
    } catch {
      return 'denied';
    }
  }

  startContinuous(handlers: VoiceStartHandlers): void {
    const SpeechCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechCtor) {
      return;
    }

    this.recognition = new SpeechCtor();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.results.length - 1];
      const alt = lastResult[0];
      handlers.onResult({
        transcript: alt.transcript,
        confidence: alt.confidence ?? 0,
        timestampMs: Date.now(),
      });
    };

    this.recognition.onerror = (event: Event) => {
      handlers.onError(getRecognitionErrorMessage(event));
    };

    this.recognition.onend = () => {
      handlers.onEnded();
    };

    try {
      this.recognition.start();
    } catch {
      handlers.onError('start-failed');
    }
  }

  stop(): void {
    this.recognition?.stop();
    this.recognition = null;
  }
}
