"use client";

/**
 * Humanized Speech Synthesis and Recognition Utilities
 */

const PREFERRED_VOICES = [
  "Google US English",
  "Microsoft Zira Desktop",
  "Microsoft David Desktop",
  "Alex",
  "Samantha",
];

const pickVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  for (const name of PREFERRED_VOICES) {
    const v = voices.find((v) => v.name === name);
    if (v) return v;
  }
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith("en-us")) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
    null
  );
};

export const speak = (text: string, onEnd?: () => void) => {
  if (typeof window === "undefined") return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.88;   // Slightly slower — warm, clear
  utterance.pitch = 1.05;  // Slightly warmer pitch
  utterance.volume = 1;
  utterance.lang = "en-US";

  const doSpeak = () => {
    const voices = synth.getVoices();
    const chosen = pickVoice(voices);
    if (chosen) utterance.voice = chosen;

    if (onEnd) {
      // Estimated fallback timeout (100ms per char + 2s buffer)
      const timeoutMs = Math.max(text.length * 75 + 2000, 3000);
      let fired = false;

      const fire = () => {
        if (fired) return;
        fired = true;
        clearTimeout(tid);
        utterance.onend = null;
        onEnd();
      };

      const tid = setTimeout(fire, timeoutMs);
      utterance.onend = fire;
    }

    setTimeout(() => synth.speak(utterance), 80);
  };

  if (synth.getVoices().length > 0) {
    doSpeak();
  } else {
    synth.onvoiceschanged = () => {
      synth.onvoiceschanged = null;
      doSpeak();
    };
  }
};

/** Prime the speech engine on first user interaction (browser autoplay policy) */
export const tryUnlockAudio = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    const utterance = new SpeechSynthesisUtterance("");
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
    setTimeout(resolve, 300);
  });
};

/** Create a fresh SpeechRecognition instance */
export const getSpeechRecognition = (): any | null => {
  if (typeof window === "undefined") return null;

  const SR =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SR) return null;

  const recognition = new SR();
  recognition.continuous = true;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  return recognition;
};
