import type { SettingId } from "./types";

// Sound made in the browser, so the game needs no audio files. Each place has
// a quiet bed of atmosphere (wind, café murmur, river) under a soft held
// chord, and a few small sounds mark moments in the story.

export type AmbienceId = SettingId | "title";
export type EffectId = "advance" | "choice" | "scripture" | "message" | "ending" | "tempt" | "good" | "bad" | "win" | "woof";

const noiseBuffers = new WeakMap<BaseAudioContext, AudioBuffer>();

/** A few seconds of pink noise: the raw material for wind, water and room tone. */
function noiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  const cached = noiseBuffers.get(ctx);
  if (cached) return cached;

  const buffer = ctx.createBuffer(1, ctx.sampleRate * 6, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99765 * b0 + white * 0.099046;
    b1 = 0.963 * b1 + white * 0.2965164;
    b2 = 0.57 * b2 + white * 1.0526913;
    data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.2;
  }
  noiseBuffers.set(ctx, buffer);
  return buffer;
}

interface Tone {
  frequency: number;
  level: number;
  decay: number;
  delay?: number;
  attack?: number;
  type?: OscillatorType;
}

/** A single note that fades away. */
function tone(ctx: BaseAudioContext, out: AudioNode, { frequency, level, decay, delay = 0, attack = 0.012, type = "sine" }: Tone) {
  const at = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = frequency;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(level, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + attack + decay + 0.05);
}

interface Hush {
  filter: BiquadFilterType;
  frequency: number;
  level: number;
  attack: number;
  decay: number;
  q?: number;
}

/** A short breath of filtered noise: a clock tick, or a car passing far off. */
function hush(ctx: BaseAudioContext, out: AudioNode, { filter, frequency, level, attack, decay, q = 0.7 }: Hush) {
  const at = ctx.currentTime;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  const shape = ctx.createBiquadFilter();
  shape.type = filter;
  shape.frequency.value = frequency;
  shape.Q.value = q;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(level, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  source.connect(shape).connect(gain).connect(out);
  source.start(at, Math.random() * 4);
  source.stop(at + attack + decay + 0.05);
}

export function playEffect(ctx: BaseAudioContext, out: AudioNode, effect: EffectId) {
  switch (effect) {
    case "advance":
      tone(ctx, out, { frequency: 587.33, level: 0.018, decay: 0.09, type: "triangle" });
      break;
    case "choice":
      tone(ctx, out, { frequency: 440, level: 0.05, decay: 0.5 });
      tone(ctx, out, { frequency: 659.25, level: 0.045, decay: 0.7, delay: 0.1 });
      break;
    case "scripture":
      tone(ctx, out, { frequency: 587.33, level: 0.04, decay: 2.4 });
      tone(ctx, out, { frequency: 880, level: 0.03, decay: 2.4, delay: 0.14 });
      tone(ctx, out, { frequency: 1174.66, level: 0.02, decay: 2.6, delay: 0.28 });
      break;
    case "message":
      tone(ctx, out, { frequency: 150, level: 0.03, decay: 0.16, type: "triangle" });
      tone(ctx, out, { frequency: 880, level: 0.035, decay: 0.14, delay: 0.02 });
      tone(ctx, out, { frequency: 1108.73, level: 0.035, decay: 0.22, delay: 0.14 });
      break;
    case "good":
      tone(ctx, out, { frequency: 784, level: 0.045, decay: 0.12 });
      tone(ctx, out, { frequency: 1174.66, level: 0.04, decay: 0.18, delay: 0.06 });
      break;
    case "bad":
      tone(ctx, out, { frequency: 196, level: 0.05, decay: 0.2, type: "triangle" });
      break;
    case "win":
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        tone(ctx, out, { frequency, level: 0.045, decay: 0.5, delay: index * 0.1 });
      });
      break;
    case "woof":
      tone(ctx, out, { frequency: 330, level: 0.06, decay: 0.09, type: "triangle" });
      tone(ctx, out, { frequency: 262, level: 0.06, decay: 0.12, type: "triangle", delay: 0.13 });
      break;
    case "tempt":
      // A bright, glittering run: the sound of something shiny catching your eye.
      [1318.5, 1568, 1975.5, 2637, 2093, 3136].forEach((frequency, index) => {
        tone(ctx, out, { frequency, level: 0.022, decay: 0.5, delay: index * 0.07 });
      });
      break;
    case "ending":
      [293.66, 369.99, 440, 587.33].forEach((frequency, index) => {
        tone(ctx, out, { frequency, level: 0.04, decay: 3.6, delay: index * 0.16, attack: 0.04 });
      });
      break;
  }
}

/**
 * Starts the atmosphere for a place and returns a function that stops it.
 * `live` is false when rendering offline, where timed one-off sounds are skipped.
 */
export function buildAmbience(ctx: BaseAudioContext, out: AudioNode, id: AmbienceId, live = true): () => void {
  const sources: AudioScheduledSourceNode[] = [];
  const timers = new Set<number>();
  let stopped = false;

  const begin = <T extends AudioScheduledSourceNode>(node: T): T => {
    node.start();
    sources.push(node);
    return node;
  };

  /** Slowly moves a setting up and down, so nothing sounds frozen. */
  const wobble = (param: AudioParam, rate: number, depth: number) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = rate;
    const amount = ctx.createGain();
    amount.gain.value = depth;
    osc.connect(amount).connect(param);
    begin(osc);
  };

  const noise = (filter: BiquadFilterType, frequency: number, q: number, level: number, drift?: [rate: number, depth: number]) => {
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer(ctx);
    source.loop = true;
    const shape = ctx.createBiquadFilter();
    shape.type = filter;
    shape.frequency.value = frequency;
    shape.Q.value = q;
    const gain = ctx.createGain();
    gain.gain.value = level;
    source.connect(shape).connect(gain).connect(out);
    source.start(0, Math.random() * 4);
    sources.push(source);
    if (drift) wobble(gain.gain, drift[0], drift[1]);
  };

  /** A soft held chord. */
  const pad = (notes: number[], level: number) => {
    const shape = ctx.createBiquadFilter();
    shape.type = "lowpass";
    shape.frequency.value = 760;
    const gain = ctx.createGain();
    gain.gain.value = level;
    shape.connect(gain).connect(out);
    wobble(gain.gain, 0.06, level * 0.35);
    wobble(shape.frequency, 0.04, 180);
    for (const note of notes) {
      const pure = ctx.createOscillator();
      pure.frequency.value = note;
      const warm = ctx.createOscillator();
      warm.type = "triangle";
      warm.frequency.value = note * 1.003;
      const half = ctx.createGain();
      half.gain.value = 0.5;
      pure.connect(shape);
      warm.connect(half).connect(shape);
      begin(pure);
      begin(warm);
    }
  };

  const crickets = (frequency: number, pulse: number, phrase: number, level: number) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = frequency;
    const chirp = ctx.createGain();
    chirp.gain.value = 0.5;
    wobble(chirp.gain, pulse, 0.5);
    const breath = ctx.createGain();
    breath.gain.value = 0.5;
    wobble(breath.gain, phrase, 0.5);
    const gain = ctx.createGain();
    gain.gain.value = level;
    osc.connect(chirp).connect(breath).connect(gain).connect(out);
    begin(osc);
  };

  /** Repeats something at uneven intervals, like cups in a café. */
  const sometimes = (minSeconds: number, maxSeconds: number, play: () => void) => {
    if (!live) return;
    const schedule = () => {
      const wait = (minSeconds + Math.random() * (maxSeconds - minSeconds)) * 1000;
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        if (stopped) return;
        play();
        schedule();
      }, wait);
      timers.add(timer);
    };
    schedule();
  };

  switch (id) {
    case "title":
      pad([146.83, 220, 293.66, 329.63, 440], 0.022);
      noise("lowpass", 420, 0.5, 0.03, [0.07, 0.015]);
      break;

    case "garden":
      pad([146.83, 220, 329.63, 369.99], 0.016);
      noise("lowpass", 520, 0.5, 0.05, [0.08, 0.025]);
      crickets(4300, 27, 0.37, 0.005);
      crickets(3850, 23, 0.29, 0.004);
      break;

    case "cafe":
      pad([174.61, 261.63, 329.63, 440], 0.013);
      noise("bandpass", 430, 0.7, 0.075, [0.13, 0.025]);
      noise("bandpass", 1150, 1, 0.02, [0.21, 0.01]);
      sometimes(4, 11, () => {
        const pitch = 2100 + Math.random() * 1100;
        tone(ctx, out, { frequency: pitch, level: 0.014, decay: 0.28 });
        tone(ctx, out, { frequency: pitch * 1.5, level: 0.006, decay: 0.2 });
      });
      break;

    case "kitchen": {
      pad([196, 246.94, 293.66, 440], 0.015);
      noise("lowpass", 220, 0.5, 0.035, [0.05, 0.01]);
      let tock = false;
      sometimes(1, 1, () => {
        tock = !tock;
        hush(ctx, out, { filter: "highpass", frequency: tock ? 2300 : 2900, level: 0.02, attack: 0.002, decay: 0.03 });
      });
      break;
    }

    case "room":
      pad([110, 164.81, 246.94, 261.63], 0.015);
      noise("lowpass", 150, 0.5, 0.09, [0.06, 0.03]);
      sometimes(12, 26, () => {
        hush(ctx, out, { filter: "bandpass", frequency: 320, level: 0.04, attack: 2.4, decay: 3.2 });
      });
      break;

    case "hall":
      pad([130.81, 196, 261.63, 329.63, 392], 0.02);
      noise("lowpass", 300, 0.5, 0.03, [0.05, 0.01]);
      break;

    case "office":
      // Air conditioning, and somebody typing two desks away.
      pad([123.47, 185, 246.94, 329.63], 0.011);
      noise("lowpass", 260, 0.5, 0.07, [0.04, 0.012]);
      noise("bandpass", 2400, 1.2, 0.006, [0.3, 0.003]);
      sometimes(0.5, 2.2, () => {
        hush(ctx, out, { filter: "highpass", frequency: 3400 + Math.random() * 900, level: 0.012, attack: 0.002, decay: 0.025 });
      });
      break;

    case "lecture":
      // A big room full of people being quiet.
      pad([130.81, 196, 293.66, 392], 0.014);
      noise("bandpass", 380, 0.6, 0.05, [0.09, 0.02]);
      sometimes(6, 15, () => {
        hush(ctx, out, { filter: "bandpass", frequency: 900 + Math.random() * 500, level: 0.02, attack: 0.01, decay: 0.12 });
      });
      break;

    case "library":
      pad([146.83, 220, 277.18, 369.99], 0.016);
      noise("lowpass", 200, 0.5, 0.03, [0.05, 0.01]);
      sometimes(7, 18, () => {
        hush(ctx, out, { filter: "highpass", frequency: 2600, level: 0.012, attack: 0.03, decay: 0.3 });
      });
      break;

    case "river":
      pad([164.81, 246.94, 293.66, 369.99], 0.015);
      noise("bandpass", 780, 0.5, 0.06, [0.19, 0.022]);
      noise("highpass", 3200, 0.5, 0.012, [0.47, 0.006]);
      crickets(4100, 25, 0.23, 0.0028);
      break;
  }

  return () => {
    stopped = true;
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.clear();
    for (const source of sources) {
      try {
        source.stop();
      } catch {
        // Already stopped.
      }
    }
  };
}

// Everything above is mixed very quietly; this brings it up to a comfortable level.
const MASTER_LEVEL = 2.2;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bed: GainNode | null = null;
  private effects: GainNode | null = null;
  private on = false;
  private wanted: AmbienceId | null = null;
  private playing: { id: AmbienceId; gain: GainNode; stop: () => void } | null = null;

  get supported() {
    return typeof window !== "undefined" && "AudioContext" in window;
  }

  /** Must be called from a click or key press the first time, or browsers keep it silent. */
  setEnabled(on: boolean) {
    if (!this.supported) return;
    this.on = on;

    if (on && !this.ctx) {
      const ctx = new AudioContext();
      const limiter = ctx.createDynamicsCompressor();
      limiter.connect(ctx.destination);
      this.master = ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(limiter);
      this.bed = ctx.createGain();
      this.bed.connect(this.master);
      this.effects = ctx.createGain();
      this.effects.connect(this.master);
      this.ctx = ctx;
    }
    if (!this.ctx || !this.master) return;

    const now = this.ctx.currentTime;
    if (on) {
      void this.ctx.resume();
      this.master.gain.setTargetAtTime(MASTER_LEVEL, now, 0.25);
      this.sync();
    } else {
      this.master.gain.setTargetAtTime(0, now, 0.12);
      this.change(null);
    }
  }

  setAmbience(id: AmbienceId | null) {
    this.wanted = id;
    if (this.on) this.sync();
  }

  play(effect: EffectId) {
    if (this.on && this.ctx && this.effects) playEffect(this.ctx, this.effects, effect);
  }

  /** Lowers the atmosphere while someone is speaking aloud. */
  duck(lowered: boolean) {
    if (this.ctx && this.bed) this.bed.gain.setTargetAtTime(lowered ? 0.4 : 1, this.ctx.currentTime, 0.3);
  }

  private sync() {
    if (this.playing?.id !== this.wanted) this.change(this.wanted);
  }

  /** Fades the old place out as the new one fades in. */
  private change(id: AmbienceId | null) {
    if (!this.ctx || !this.bed) return;
    const now = this.ctx.currentTime;

    const old = this.playing;
    this.playing = null;
    if (old) {
      old.gain.gain.setTargetAtTime(0, now, 0.5);
      window.setTimeout(() => {
        old.stop();
        old.gain.disconnect();
      }, 2600);
    }

    if (id) {
      const gain = this.ctx.createGain();
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(1, now, 0.9);
      gain.connect(this.bed);
      this.playing = { id, gain, stop: buildAmbience(this.ctx, gain, id) };
    }
  }
}

export const sound = new SoundEngine();
