export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  timestampMs: number;
}

export interface VoiceAdapter {
  isSupported(): boolean;
  requestPermission(): Promise<'granted' | 'denied'>;
  startContinuous(onResult: (result: VoiceRecognitionResult) => void): void;
  stop(): void;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null;
    onerror: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
}
