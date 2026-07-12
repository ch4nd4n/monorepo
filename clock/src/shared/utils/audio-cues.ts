let sharedContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!sharedContext) {
    sharedContext = new AudioContext();
  }

  if (sharedContext.state === 'suspended') {
    void sharedContext.resume();
  }

  return sharedContext;
}

interface Tone {
  freq: number;
  startOffsetMs: number;
  durationMs: number;
  gain?: number;
}

function playTones(tones: Tone[]): void {
  const context = getContext();
  const now = context.currentTime;

  for (const tone of tones) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = tone.freq;
    gainNode.gain.value = tone.gain ?? 0.02;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    const startAt = now + tone.startOffsetMs / 1000;
    oscillator.start(startAt);
    oscillator.stop(startAt + tone.durationMs / 1000);
  }
}

/** Double blip — signals the workout is about to begin (preroll). */
export function playWorkoutStartCue(): void {
  playTones([
    { freq: 880, startOffsetMs: 0, durationMs: 80 },
    { freq: 880, startOffsetMs: 140, durationMs: 80 },
  ]);
}

/** Single blip — signals a work/rest interval transition or manual control action. */
export function playIntervalTransitionCue(): void {
  playTones([{ freq: 880, startOffsetMs: 0, durationMs: 80 }]);
}

/** Ascending triad — signals the full workout is complete. */
export function playWorkoutCompleteCue(): void {
  playTones([
    { freq: 523.25, startOffsetMs: 0, durationMs: 120 },
    { freq: 659.25, startOffsetMs: 130, durationMs: 120 },
    { freq: 783.99, startOffsetMs: 260, durationMs: 220 },
  ]);
}

/**
 * Beep, beep, beeeeep — 3-2-1 countdown into the next phase (rest, next work
 * round, or the workout itself). Scheduled on the AudioContext's own clock so
 * the beeps land exactly 2s/1s/0s before the transition regardless of React
 * render-tick jitter.
 */
export function playCountdownCue(): void {
  playTones([
    { freq: 660, startOffsetMs: 0, durationMs: 100 },
    { freq: 660, startOffsetMs: 1000, durationMs: 100 },
    { freq: 660, startOffsetMs: 2000, durationMs: 700 },
  ]);
}
