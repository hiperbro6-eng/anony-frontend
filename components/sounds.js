"use client";

// 1. Singleton Audio Context
let audioCtx = null;

export const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

// 2. Global Unlocker (Wakes up audio on first click)
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        // Remove listeners once unlocked
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      });
    }
  };
  // Listen for any interaction
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
}

// 3. The Sound Generator
const playTone = (freqStart, freqEnd, duration, type = "sine", vol = 0.1) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  
  // Frequency
  osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);
  
  // Volume Envelope
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

// 4. Exported Sounds (Volumes Increased)
export const playClick = () => {
  playTone(1200, 800, 0.1, "sine", 0.3); // Louder Click
};

export const playHover = () => {
  playTone(600, 500, 0.05, "triangle", 0.15); // Louder Hover (Was 0.02, now 0.15)
};

export const playSwoosh = () => {
  playTone(200, 800, 0.3, "sine", 0.2); // Louder Swoosh
};
