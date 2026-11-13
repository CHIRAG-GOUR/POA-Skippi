/* Soothing, playful background loop generated with Web Audio (no files, works offline).
   Marimba-style melody + soft pad + gentle bass over I–vi–IV–V in C major, ~88 BPM.
   Master volume is fixed at 40%. */

const BPM = 88;
const STEP = 60 / BPM / 2; // eighth notes
const MASTER = 0.4;

const n = (semi: number) => 261.63 * Math.pow(2, semi / 12); // semitones from middle C
// chord roots: C, Am, F, G (as semitone offsets) with triads
const CHORDS = [
  [0, 4, 7],
  [-3, 0, 4],
  [-7, -3, 0],
  [-5, -1, 2],
];
// 4 bars x 8 eighths of melody (semitones from C5, null = rest), C-major pentatonic
const MELODY: (number | null)[] = [
  12, null, 16, 19, null, 16, 14, null,
  12, null, 9, 12, null, 14, 16, null,
  17, null, 16, 14, null, 12, 9, null,
  14, null, 16, 19, 21, null, 19, null,
];

class Music {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private step = 0;
  private nextTime = 0;
  private wanted = false;

  private ensure() {
    if (this.ctx) return this.ctx;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      // gentle low-pass for a soft, warm tone
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 2600;
      this.master.connect(lp).connect(this.ctx.destination);
      return this.ctx;
    } catch {
      return null;
    }
  }

  private note(freq: number, t: number, dur: number, type: OscillatorType, peak: number, attack = 0.01) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master!);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private schedule = () => {
    const ctx = this.ctx;
    if (!ctx) return;
    while (this.nextTime < ctx.currentTime + 0.25) {
      const t = this.nextTime;
      const s = this.step % 32;
      const bar = Math.floor(s / 8);
      const chord = CHORDS[bar];
      // soft pad at the start of each bar
      if (s % 8 === 0) {
        chord.forEach((c) => this.note(n(c), t, STEP * 8.2, 'sine', 0.035, 0.4));
        this.note(n(chord[0] - 12), t, STEP * 3.5, 'triangle', 0.09, 0.02);
      }
      if (s % 8 === 4) this.note(n(chord[0] - 12 + 7), t, STEP * 3, 'triangle', 0.07, 0.02);
      // marimba melody (sine + soft octave harmonic, quick decay)
      const m = MELODY[s];
      if (m !== null) {
        this.note(n(m), t, 0.55, 'sine', 0.085);
        this.note(n(m) * 2, t, 0.18, 'sine', 0.02);
      }
      // twinkle on off-beats
      if (s % 4 === 3) this.note(n(chord[2] + 24), t, 0.12, 'triangle', 0.012);
      this.nextTime += STEP;
      this.step++;
    }
  };

  /** Call from a user gesture (browsers block audio until then). */
  start() {
    this.wanted = true;
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    if (ctx.state === 'suspended') void ctx.resume();
    if (this.timer !== null) return;
    this.nextTime = ctx.currentTime + 0.1;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setValueAtTime(this.master.gain.value, ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(MASTER, ctx.currentTime + 1.5);
    this.timer = window.setInterval(this.schedule, 60);
    this.schedule();
  }

  stop() {
    this.wanted = false;
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setValueAtTime(this.master.gain.value, ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  get isWanted() { return this.wanted; }
}

export const music = new Music();
