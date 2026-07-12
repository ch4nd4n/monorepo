export interface CapabilityProfile {
  speechSupported: boolean;
  continuousSupported: boolean;
  vibrationSupported: boolean;
  isIOS: boolean;
}

export function detectCapabilities(): CapabilityProfile {
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);

  return {
    speechSupported: Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
    continuousSupported: !isIOS,
    vibrationSupported: typeof navigator.vibrate === 'function',
    isIOS,
  };
}
