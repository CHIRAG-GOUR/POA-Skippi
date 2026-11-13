import * as THREE from 'three';

/* Canvas-drawn textures. Fonts are bundled locally (@fontsource) so text renders offline. */

const texCache = new Map<string, THREE.CanvasTexture>();

function make(key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const hit = texCache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  draw(ctx);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  texCache.set(key, t);
  return t;
}

/** Re-draw cached canvas textures once web fonts are ready (first paint may use fallback). */
export function refreshTexturesWhenFontsReady() {
  if (typeof document === 'undefined' || !document.fonts) return;
  void document.fonts.ready.then(() => {
    // Clearing cache lets components re-create on next mount; existing ones keep fallback glyphs.
    texCache.clear();
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Rounded sign/plaque texture with title and optional body. */
export function signTexture(opts: {
  title: string; body?: string; bg?: string; fg?: string; accent?: string; w?: number; h?: number; titleSize?: number; bodySize?: number; border?: string;
}) {
  const { title, body = '', bg = '#ffffff', fg = '#13317a', accent = '#ffa514', w = 1024, h = 512, titleSize = 120, bodySize = 54, border } = opts;
  return make(`sign|${title}|${body}|${bg}|${fg}|${accent}|${w}|${h}|${titleSize}|${bodySize}|${border}`, w, h, (ctx) => {
    ctx.fillStyle = bg;
    roundRect(ctx, 0, 0, w, h, Math.min(w, h) * 0.12);
    ctx.fill();
    if (border) {
      ctx.strokeStyle = border;
      ctx.lineWidth = Math.min(w, h) * 0.04;
      roundRect(ctx, ctx.lineWidth / 2, ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth, Math.min(w, h) * 0.1);
      ctx.stroke();
    }
    ctx.fillStyle = accent;
    ctx.fillRect(w * 0.08, h * (body ? 0.08 : 0.82), w * 0.84, h * 0.025);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = fg;
    ctx.font = `800 ${titleSize}px "Baloo 2", system-ui, sans-serif`;
    const tl = wrapLines(ctx, title, w * 0.86);
    const th = titleSize * 1.02;
    const bodyLinesH = (() => {
      if (!body) return 0;
      ctx.font = `700 ${bodySize}px Nunito, system-ui, sans-serif`;
      return wrapLines(ctx, body, w * 0.84).length * bodySize * 1.22;
    })();
    const totalH = tl.length * th + (body ? bodyLinesH + bodySize * 0.6 : 0);
    let y = h / 2 - totalH / 2 + th / 2;
    ctx.font = `800 ${titleSize}px "Baloo 2", system-ui, sans-serif`;
    for (const l of tl) {
      ctx.fillText(l, w / 2, y);
      y += th;
    }
    if (body) {
      y += bodySize * 0.35;
      ctx.font = `700 ${bodySize}px Nunito, system-ui, sans-serif`;
      ctx.fillStyle = fg + 'cc';
      for (const l of wrapLines(ctx, body, w * 0.84)) {
        ctx.fillText(l, w / 2, y);
        y += bodySize * 1.22;
      }
    }
  });
}

/** Ice-pop sleeve label: vertical SKIPPI wordmark + flavour, like the real sleeves. */
export function popLabelTexture(flavour: string, color: string) {
  return make(`pop|${flavour}|${color}`, 256, 1024, (ctx) => {
    ctx.clearRect(0, 0, 256, 1024);
    // white label band
    ctx.fillStyle = 'rgba(255,255,255,0.0)';
    ctx.fillRect(0, 0, 256, 1024);
    ctx.save();
    ctx.translate(128, 560);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 118px "Baloo 2", system-ui, sans-serif';
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#13317a';
    ctx.strokeText('SKIPPI', 0, -28);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SKIPPI', 0, -28);
    ctx.font = '800 54px Nunito, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 6;
    ctx.strokeText(flavour, 0, 64);
    ctx.fillText(flavour, 0, 64);
    ctx.restore();
    // little sparkle stars
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (const [x, y, r] of [[60, 150, 9], [190, 230, 6], [70, 900, 7], [200, 840, 10]] as const) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    void color;
  });
}

/** Big round number badge for island stations. */
export function numberBadgeTexture(n: number | string, color: string) {
  return make(`num|${n}|${color}`, 256, 256, (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(128, 128, 124, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(128, 128, 104, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${String(n).length > 1 ? 120 : 150}px "Baloo 2", system-ui, sans-serif`;
    ctx.fillText(String(n), 128, 138);
  });
}

/** Vertical gradient (used for sky domes and backdrops). */
export function gradientTexture(stops: [number, string][], key: string) {
  return make(`grad|${key}`, 4, 512, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    for (const [o, c] of stops) g.addColorStop(o, c);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 512);
  });
}

/** Soft speckled ground detail (tileable). */
export function speckleTexture(base: string, dots: string[], key: string, density = 1400) {
  const t = make(`speck|${key}`, 512, 512, (ctx) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 512);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < density; i++) {
      ctx.fillStyle = dots[i % dots.length];
      ctx.globalAlpha = 0.25 + rnd() * 0.35;
      ctx.beginPath();
      ctx.ellipse(rnd() * 512, rnd() * 512, 1 + rnd() * 4, 1 + rnd() * 2.2, rnd() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Candy-stripe texture (awnings, stage skirts). */
export function stripeTexture(a: string, b: string, n = 8, key = '') {
  const t = make(`stripe|${a}|${b}|${n}|${key}`, 512, 64, (ctx) => {
    const w = 512 / n;
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = i % 2 ? b : a;
      ctx.fillRect(i * w, 0, w, 64);
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Billboard / poster texture with headline, tagline and footer — used by the Campaign Studio. */
export function posterTexture(o: { headline: string; tagline: string; footer: string; bg: string; fg: string; accent: string }, version: number) {
  return make(`poster|${o.headline}|${o.tagline}|${o.footer}|${o.bg}|${o.fg}|${o.accent}|${version}`, 1024, 576, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 1024, 576);
    g.addColorStop(0, o.bg);
    g.addColorStop(1, o.accent);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 576);
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#ffffff';
    for (let i = -10; i < 30; i++) ctx.fillRect(i * 60, 0, 26, 576);
    ctx.globalAlpha = 1;
    // pops
    const cols = ['#c2185b', '#b5d63a', '#ff7a1a', '#ff5fa8', '#6b2a18', '#ffb000'];
    cols.forEach((c, i) => {
      ctx.save();
      ctx.translate(800 + i * 30, 330);
      ctx.rotate(-0.25 + i * 0.1);
      ctx.fillStyle = c;
      roundRect(ctx, -14, -170, 28, 300, 12);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(-8, -150, 6, 250);
      ctx.restore();
    });
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = o.fg;
    ctx.font = '900 92px "Baloo 2", system-ui, sans-serif';
    let y = 60;
    for (const l of wrapLines(ctx, o.headline || 'Your campaign name', 640).slice(0, 2)) {
      ctx.lineWidth = 10;
      ctx.strokeStyle = 'rgba(15,36,89,0.35)';
      ctx.strokeText(l, 56, y);
      ctx.fillText(l, 56, y);
      y += 92;
    }
    ctx.font = '800 46px Nunito, system-ui, sans-serif';
    y += 16;
    for (const l of wrapLines(ctx, o.tagline || 'Your tagline goes here', 640).slice(0, 3)) {
      ctx.fillText(l, 58, y);
      y += 54;
    }
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    roundRect(ctx, 50, 486, 620, 62, 30);
    ctx.fill();
    ctx.fillStyle = '#13317a';
    ctx.font = '800 30px Nunito, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText((o.footer || '').slice(0, 44), 76, 518);
  });
}
