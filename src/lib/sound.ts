let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noise(audio: AudioContext, seconds: number, gainValue: number, frequency: number) {
  const count = Math.floor(audio.sampleRate * seconds);
  const buffer = audio.createBuffer(1, count, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < count; i += 1) data[i] = Math.random() * 2 - 1;
  const source = audio.createBufferSource();
  source.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = frequency;
  filter.Q.value = 0.7;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(gainValue, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + seconds);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);
  source.start();
}

export function cue(enabled: boolean | undefined, kind: "deal" | "seat" | "major") {
  if (!enabled) return;
  const audio = context();
  if (!audio) return;
  if (kind === "major") {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = 110;
    gain.gain.setValueAtTime(0.03, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + 0.72);
    return;
  }
  noise(audio, kind === "deal" ? 0.09 : 0.045, 0.035, kind === "deal" ? 900 : 1400);
}
