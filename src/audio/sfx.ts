// Offline Web Audio synthesiser — no audio files, works without network.
type Note = { f: number; t: number; d: number; type?: OscillatorType; g?: number; slide?: number };

class Sfx {
  private ctx: AudioContext | null = null;
  private muted = false;

  setMuted(m: boolean) { this.muted = m; }

  private ac(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return this.ctx;
    } catch { return null; }
  }

  private play(notes: Note[]) {
    const ctx = this.ac();
    if (!ctx) return;
    const now = ctx.currentTime;
    for (const n of notes) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = n.type ?? 'sine';
      o.frequency.setValueAtTime(n.f, now + n.t);
      if (n.slide) o.frequency.exponentialRampToValueAtTime(n.slide, now + n.t + n.d);
      const peak = n.g ?? 0.16;
      g.gain.setValueAtTime(0.0001, now + n.t);
      g.gain.exponentialRampToValueAtTime(peak, now + n.t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);
      o.connect(g).connect(ctx.destination);
      o.start(now + n.t);
      o.stop(now + n.t + n.d + 0.02);
    }
  }

  click() { this.play([{ f: 880, t: 0, d: 0.07, type: 'triangle', g: 0.08, slide: 1200 }]); }
  pop() { this.play([{ f: 520, t: 0, d: 0.12, type: 'sine', g: 0.18, slide: 980 }]); }
  hop() { this.play([{ f: 300, t: 0, d: 0.14, type: 'sine', g: 0.07, slide: 620 }]); }
  whoosh() { this.play([{ f: 240, t: 0, d: 0.32, type: 'sine', g: 0.07, slide: 900 }]); }
  correct() {
    this.play([
      { f: 659, t: 0, d: 0.14, type: 'triangle' },
      { f: 988, t: 0.09, d: 0.26, type: 'triangle' },
    ]);
  }
  wrong() {
    this.play([
      { f: 330, t: 0, d: 0.16, type: 'square', g: 0.06, slide: 260 },
      { f: 247, t: 0.13, d: 0.24, type: 'square', g: 0.06, slide: 200 },
    ]);
  }
  success() {
    this.play([
      { f: 523, t: 0, d: 0.16, type: 'triangle' },
      { f: 659, t: 0.1, d: 0.16, type: 'triangle' },
      { f: 784, t: 0.2, d: 0.3, type: 'triangle' },
    ]);
  }
  fanfare() {
    this.play([
      { f: 523, t: 0, d: 0.14, type: 'square', g: 0.07 },
      { f: 659, t: 0.12, d: 0.14, type: 'square', g: 0.07 },
      { f: 784, t: 0.24, d: 0.14, type: 'square', g: 0.07 },
      { f: 1047, t: 0.36, d: 0.5, type: 'triangle', g: 0.14 },
    ]);
  }
  coin() {
    this.play([
      { f: 988, t: 0, d: 0.08, type: 'square', g: 0.06 },
      { f: 1319, t: 0.07, d: 0.3, type: 'square', g: 0.06 },
    ]);
  }
  tick() { this.play([{ f: 1500, t: 0, d: 0.03, type: 'square', g: 0.03 }]); }
}

export const sfx = new Sfx();
