type AudioContextLike = {
  currentTime: number;
  destination: unknown;
  createOscillator: () => {
    type: string;
    frequency: { setValueAtTime: (value: number, time: number) => void; exponentialRampToValueAtTime: (value: number, time: number) => void };
    connect: (node: unknown) => void;
    start: () => void;
    stop: (time: number) => void;
  };
  createGain: () => {
    gain: { setValueAtTime: (value: number, time: number) => void; exponentialRampToValueAtTime: (value: number, time: number) => void };
    connect: (node: unknown) => void;
  };
};

export function playReminderTone() {
  if (typeof window === 'undefined') {
    return;
  }

  const AudioCtor = (
    globalThis as typeof globalThis & {
      AudioContext?: new () => AudioContextLike;
      webkitAudioContext?: new () => AudioContextLike;
    }
  ).AudioContext ??
    (globalThis as typeof globalThis & {
      webkitAudioContext?: new () => AudioContextLike;
    }).webkitAudioContext;

  if (!AudioCtor) {
    return;
  }

  const audioContext = new AudioCtor();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.18);

  gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);

  oscillator.connect(gainNode as never);
  gainNode.connect(audioContext.destination as never);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);
}
