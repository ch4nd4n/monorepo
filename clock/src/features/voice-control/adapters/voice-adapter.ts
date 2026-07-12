export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  timestampMs: number;
}

export interface VoiceStartHandlers {
  onResult: (result: VoiceRecognitionResult) => void;
  onError: (message: string) => void;
  onEnded: () => void;
}

export interface VoiceAdapter {
  isSupported(): boolean;
  requestPermission(): Promise<'granted' | 'denied'>;
  startContinuous(handlers: VoiceStartHandlers): void;
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
    onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
}
