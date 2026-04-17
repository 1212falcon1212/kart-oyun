// Web Audio + Haptics yardımcıları
// Ses dosyasına ihtiyaç yok; WebAudio ile sentetik ton üretilir.
// Mobilde vibrate desteklendiğinde titreşim de verilir.

import { storage, KEYS } from "./storage";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
  } catch {
    return null;
  }
}

export function soundEnabled(): boolean {
  return storage.get<boolean>(KEYS.sound, true);
}

export function setSoundEnabled(v: boolean) {
  storage.set(KEYS.sound, v);
}

function tone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.08) {
  if (!soundEnabled()) return;
  const c = getCtx();
  if (!c) return;
  try {
    if (c.state === "suspended") c.resume();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(c.destination);
    const t0 = c.currentTime;
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  } catch {}
}

export const sfx = {
  flip() {
    tone(520, 0.08, "triangle", 0.1);
    setTimeout(() => tone(780, 0.12, "sine", 0.08), 60);
  },
  tap() {
    tone(440, 0.05, "triangle", 0.06);
  },
  next() {
    tone(660, 0.06, "sine", 0.05);
  },
  finish() {
    [523, 659, 784, 1046].forEach((f, i) =>
      setTimeout(() => tone(f, 0.18, "triangle", 0.09), i * 110)
    );
  },
  tick() {
    tone(880, 0.04, "square", 0.04);
  },
};

export function vibrate(pattern: number | number[]) {
  if (!soundEnabled()) return;
  if (typeof navigator === "undefined") return;
  try {
    navigator.vibrate?.(pattern);
  } catch {}
}
