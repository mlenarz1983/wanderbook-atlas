// Gentle Storybook Web Audio synthesizer & Kid-friendly Read-Aloud helper

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) {
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  startOffset: number,
  duration: number,
  volume = 0.12,
  type: OscillatorType = 'triangle'
) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playClick(enabled: boolean) {
  if (!enabled) return;
  playTone(520, 0, 0.065, 0.08, 'triangle');
}

export function playFly(enabled: boolean) {
  if (!enabled) return;
  const notes = [392, 440, 523.25, 659.25];
  notes.forEach((n, i) => playTone(n, i * 0.08, 0.24, 0.085, 'sine'));
}

export function playGentleNudge(enabled: boolean) {
  if (!enabled) return;
  // Warm encouraging wooden marimba interval — never a harsh buzzer
  playTone(349.23, 0, 0.14, 0.09, 'triangle');
  playTone(392.0, 0.11, 0.2, 0.08, 'triangle');
}

export function playCrewHuddle(enabled: boolean) {
  if (!enabled) return;
  playTone(440, 0, 0.18, 0.09, 'triangle');
  playTone(554.37, 0.09, 0.2, 0.09, 'triangle');
  playTone(659.25, 0.18, 0.28, 0.09, 'sine');
}

export function playDiscoveryFanfare(enabled: boolean) {
  if (!enabled) return;
  const chord = [523.25, 659.25, 783.99, 1046.5];
  chord.forEach((n, i) => playTone(n, i * 0.075, 0.36, 0.1, 'triangle'));
}

export function playCardFlip(enabled: boolean) {
  if (!enabled) return;
  playTone(480, 0, 0.08, 0.06, 'sine');
  playTone(660, 0.06, 0.12, 0.06, 'sine');
}

export function speakText(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.94;
    utter.pitch = 1.04;
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          /natural|samantha|google us english|aria|jenny/i.test(v.name)
      ) || voices.find((v) => v.lang.startsWith('en'));
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.speak(utter);
  } catch {
    // Ignore if speech synthesis is unavailable
  }
}

export function stopSpeaking() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}
