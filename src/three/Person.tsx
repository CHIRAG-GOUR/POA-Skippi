import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Outlines, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/* ==========================================================================
   3D cartoon people — toon-shaded with inked outlines, big rounded heads,
   an illustrated face painted onto the 3D head (eyes with shine, brows,
   toothy grin), sculpted 3D hair and modelled clothing (collars, ties,
   aprons, polos, kurtas, blazers). Joint rig + weighted pose blending.
   ========================================================================== */

export type Pose = 'idle' | 'walk' | 'wave' | 'talk' | 'cheer' | 'sit' | 'clap' | 'think' | 'point' | 'sad' | 'present';
export type Hair = 'short' | 'long' | 'bun' | 'ponytail' | 'spiky' | 'curly' | 'side';
export type Outfit = 'polo' | 'shirtTie' | 'tee' | 'kurta' | 'blazer' | 'dress';

export interface Look {
  skin: string; hair: string; hairStyle: Hair; top: string; topAccent?: string; bottom: string; shoes?: string; height?: number;
  glasses?: boolean; cap?: string; blazer?: string; skirt?: boolean; logo?: boolean; backpack?: string; build?: number;
  outfit?: Outfit; apron?: string; tie?: string; shorts?: boolean; headScale?: number; eyes?: string;
}

const INK = '#3a2a22';
const outfitOf = (l: Look): Outfit => l.outfit ?? (l.blazer ? 'blazer' : l.logo ? 'polo' : l.skirt ? 'dress' : 'tee');

/* ------------------------------------------------------------------ toon materials */
let gradient: THREE.DataTexture | null = null;
function toonGradient() {
  if (gradient) return gradient;
  const d = new Uint8Array([110, 110, 110, 255, 190, 190, 190, 255, 255, 255, 255, 255]);
  gradient = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat);
  gradient.minFilter = gradient.magFilter = THREE.NearestFilter;
  gradient.needsUpdate = true;
  return gradient;
}
const mats = new Map<string, THREE.Material>();
function toon(color: string) {
  let m = mats.get(color);
  if (!m) { m = new THREE.MeshToonMaterial({ color, gradientMap: toonGradient() }); mats.set(color, m); }
  return m;
}
function shade(hex: string, amt: number) {
  const c = new THREE.Color(hex); const h = { h: 0, s: 0, l: 0 }; c.getHSL(h);
  c.setHSL(h.h, h.s, Math.max(0, Math.min(1, h.l + amt))); return '#' + c.getHexString();
}

/* ------------------------------------------------------------------ painted face (canvas → texture on head) */
type Mouth = 'grin' | 'open' | 'closed' | 'sad' | 'wow';
const faceCache = new Map<string, THREE.CanvasTexture>();
function faceTexture(eyes: string, brow: string, mouth: Mouth, blink: boolean) {
  const key = `${eyes}|${brow}|${mouth}|${blink}`;
  const hit = faceCache.get(key);
  if (hit) return hit;
  const S = 512;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d')!;
  g.translate(S / 2, S / 2);
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.strokeStyle = INK;
  const EX = 62, EY = -6;
  // cheeks
  g.fillStyle = 'rgba(255,128,128,0.45)';
  for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * 118, 74, 36, 22, 0, 0, Math.PI * 2); g.fill(); }
  // eyes
  for (const s of [-1, 1]) {
    const x = s * EX;
    if (blink) {
      g.lineWidth = 9; g.beginPath(); g.moveTo(x - 34, EY + 4); g.quadraticCurveTo(x, EY + 30, x + 34, EY + 4); g.stroke();
    } else {
      g.lineWidth = 8; g.fillStyle = '#ffffff';
      g.beginPath(); g.ellipse(x, EY, 36, 44, 0, 0, Math.PI * 2); g.fill(); g.stroke();
      g.fillStyle = eyes; g.beginPath(); g.arc(x + 4, EY + 8, 24, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#120c0a'; g.beginPath(); g.arc(x + 4, EY + 9, 13, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x - 5, EY - 6, 9, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(x + 15, EY + 20, 4.5, 0, Math.PI * 2); g.fill();
    }
    // brows
    g.strokeStyle = brow; g.lineWidth = 15;
    g.beginPath(); g.moveTo(x - 34, EY - 62 + (s < 0 ? 6 : 0)); g.quadraticCurveTo(x, EY - 84, x + 34, EY - 62 + (s > 0 ? 6 : 0)); g.stroke();
    g.strokeStyle = INK;
  }
  // nose
  g.lineWidth = 7; g.beginPath(); g.moveTo(-14, 58); g.quadraticCurveTo(2, 72, 16, 58); g.stroke();
  // mouth
  const MY = 112;
  g.lineWidth = 8;
  if (mouth === 'grin' || mouth === 'open') {
    g.fillStyle = '#7a2233';
    g.beginPath();
    if (mouth === 'grin') { g.moveTo(-64, MY - 18); g.quadraticCurveTo(0, MY - 6, 64, MY - 18); g.quadraticCurveTo(58, MY + 44, 0, MY + 46); g.quadraticCurveTo(-58, MY + 44, -64, MY - 18); }
    else g.ellipse(0, MY + 8, 42, 36, 0, 0, Math.PI * 2);
    g.closePath(); g.fill(); g.stroke();
    g.save(); g.clip();
    g.fillStyle = '#ffffff'; g.fillRect(-70, MY - 30, 140, 26);
    g.fillStyle = '#ff7a8a'; g.beginPath(); g.ellipse(0, MY + 40, 30, 16, 0, 0, Math.PI * 2); g.fill();
    g.restore();
    g.beginPath();
    if (mouth === 'grin') { g.moveTo(-64, MY - 18); g.quadraticCurveTo(0, MY - 6, 64, MY - 18); g.quadraticCurveTo(58, MY + 44, 0, MY + 46); g.quadraticCurveTo(-58, MY + 44, -64, MY - 18); }
    else g.ellipse(0, MY + 8, 42, 36, 0, 0, Math.PI * 2);
    g.stroke();
  } else if (mouth === 'closed') {
    g.lineWidth = 10; g.beginPath(); g.moveTo(-48, MY - 6); g.quadraticCurveTo(0, MY + 34, 48, MY - 6); g.stroke();
  } else if (mouth === 'sad') {
    g.lineWidth = 10; g.beginPath(); g.moveTo(-40, MY + 22); g.quadraticCurveTo(0, MY - 10, 40, MY + 22); g.stroke();
  } else {
    g.fillStyle = '#7a2233'; g.beginPath(); g.ellipse(0, MY + 6, 22, 28, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  faceCache.set(key, t);
  return t;
}

/* badge decal for polos */
let badgeTex: THREE.CanvasTexture | null = null;
function badge() {
  if (badgeTex) return badgeTex;
  const c = document.createElement('canvas'); c.width = 256; c.height = 112;
  const g = c.getContext('2d')!;
  g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(4, 4, 248, 104, 26); g.fill();
  g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
  g.fillStyle = '#1f63d6'; g.font = '900 62px "Baloo 2", Arial Black, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('SKIPPI', 128, 62);
  badgeTex = new THREE.CanvasTexture(c); badgeTex.colorSpace = THREE.SRGBColorSpace;
  return badgeTex;
}

/* ------------------------------------------------------------------ pose library (3D joint rotations) */
type J = Record<string, [number, number, number]>;
const JOINTS = ['root', 'spine', 'head', 'shL', 'shR', 'elL', 'elR', 'hipL', 'hipR', 'knL', 'knR'] as const;
type JointName = (typeof JOINTS)[number];
const POSES: Pose[] = ['idle', 'walk', 'wave', 'talk', 'cheer', 'sit', 'clap', 'think', 'point', 'sad', 'present'];
const Z3: [number, number, number] = [0, 0, 0];

function lib(t: number, ph: number): Record<Pose, J> {
  const s = Math.sin; const w = t * 7.5 + ph;
  const legs = { hipL: Z3, hipR: Z3, knL: Z3, knR: Z3 };
  return {
    idle: { root: [0, s(t * 2 + ph) * 0.008, 0], spine: [s(t * 1.6 + ph) * 0.02, 0, s(t * 1.1 + ph) * 0.015], head: [s(t * 0.9 + ph) * 0.05, s(t * 0.6 + ph) * 0.18, s(t * 0.8 + ph) * 0.05], shL: [0.05, 0, 0.14], shR: [0.05, 0, -0.14], elL: [-0.2, 0, 0], elR: [-0.2, 0, 0], ...legs },
    walk: { root: [0, Math.abs(s(w)) * 0.045, 0], spine: [0.06, s(w) * 0.06, 0], head: [-0.04, -s(w) * 0.05, 0], shL: [s(w) * 0.7, 0, 0.12], shR: [-s(w) * 0.7, 0, -0.12], elL: [-0.45, 0, 0], elR: [-0.45, 0, 0], hipL: [-s(w) * 0.6, 0, 0], hipR: [s(w) * 0.6, 0, 0], knL: [Math.max(0, s(w + 1.4)) * 0.9, 0, 0], knR: [Math.max(0, -s(w + 1.4)) * 0.9, 0, 0] },
    wave: { root: [0, s(t * 2) * 0.01, 0], spine: [0, 0, s(t * 3) * 0.03], head: [0.05, 0.1, 0.12 + s(t * 3) * 0.06], shL: [0.05, 0, 0.14], shR: [0, 0, -2.65], elL: [-0.2, 0, 0], elR: [-0.35 + s(t * 9) * 0.45, 0, 0], ...legs },
    talk: { root: [0, s(t * 2) * 0.01, 0], spine: [s(t * 2.4) * 0.03, s(t * 1.3) * 0.1, 0], head: [s(t * 5) * 0.05, s(t * 1.7) * 0.18, s(t * 1.3) * 0.06], shL: [-0.5 + s(t * 3.1) * 0.25, 0, 0.4], shR: [-0.6 + s(t * 2.6 + 1) * 0.3, 0, -0.35], elL: [-1.2 + s(t * 4) * 0.25, 0, 0], elR: [-1.25 + s(t * 3.6) * 0.3, 0, 0], ...legs },
    cheer: { root: [0, Math.abs(s(t * 6)) * 0.14, 0], spine: [-0.08, 0, 0], head: [-0.2, 0, s(t * 6) * 0.06], shL: [0, 0, 2.7 + s(t * 6) * 0.15], shR: [0, 0, -2.7 - s(t * 6) * 0.15], elL: [-0.3, 0, 0], elR: [-0.3, 0, 0], hipL: [-Math.abs(s(t * 6)) * 0.4, 0, 0], hipR: [-Math.abs(s(t * 6)) * 0.4, 0, 0], knL: [Math.abs(s(t * 6)) * 0.7, 0, 0], knR: [Math.abs(s(t * 6)) * 0.7, 0, 0] },
    sit: { root: [0, -0.37, 0.06], spine: [-0.05 + s(t * 1.5) * 0.015, 0, 0], head: [0.05, s(t * 0.5 + ph) * 0.2, 0], shL: [-0.45, 0, 0.22], shR: [-0.45, 0, -0.22], elL: [-0.95, 0, 0], elR: [-0.95, 0, 0], hipL: [-1.5, 0, 0.1], hipR: [-1.5, 0, -0.1], knL: [1.5, 0, 0], knR: [1.5, 0, 0] },
    clap: { root: [0, Math.abs(s(t * 4)) * 0.02, 0], spine: [0.02, 0, 0], head: [-0.06, 0, s(t * 2) * 0.05], shL: [-1.1, 0, 0.55 + Math.abs(s(t * 11)) * 0.35], shR: [-1.1, 0, -0.55 - Math.abs(s(t * 11)) * 0.35], elL: [-0.9, 0, 0], elR: [-0.9, 0, 0], ...legs },
    think: { root: Z3, spine: [0.05, 0, 0.04], head: [0.12, 0.2, 0.16 + s(t * 1.2) * 0.04], shL: [-0.6, 0, 0.5], shR: [-0.9, 0, -0.35], elL: [-1.5, 0, 0], elR: [-2.3, 0, 0], ...legs },
    point: { root: Z3, spine: [0, -0.2, 0], head: [0, -0.25, 0], shL: [0.05, 0, 0.15], shR: [-1.45 + s(t * 2) * 0.05, 0, -0.15], elL: [-0.2, 0, 0], elR: [-0.1, 0, 0], ...legs },
    sad: { root: [0, -0.01, 0], spine: [0.22, 0, 0], head: [0.4, s(t * 0.8) * 0.1, 0], shL: [0.1, 0, 0.06], shR: [0.1, 0, -0.06], elL: [-0.05, 0, 0], elR: [-0.05, 0, 0], ...legs },
    present: { root: [0, s(t * 2) * 0.008, 0], spine: [-0.03, s(t * 0.9) * 0.15, 0], head: [-0.05, s(t * 0.9) * 0.2, 0], shL: [-0.7, 0, 0.8 + s(t * 1.8) * 0.12], shR: [-0.7, 0, -0.8 - s(t * 1.8 + 1) * 0.12], elL: [-0.6, 0, 0], elR: [-0.6, 0, 0], ...legs },
  };
}

/* ------------------------------------------------------------------ geometry helpers */
const torsoGeo = (() => {
  const prof: [number, number][] = [[0, 0], [0.17, 0], [0.18, 0.08], [0.175, 0.2], [0.19, 0.32], [0.215, 0.41], [0.205, 0.46], [0.15, 0.495], [0.06, 0.5], [0, 0.5]];
  return new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 28);
})();
const tieGeo = (() => {
  const s = new THREE.Shape();
  s.moveTo(-0.022, 0); s.lineTo(0.022, 0); s.lineTo(0.042, -0.24); s.lineTo(0, -0.29); s.lineTo(-0.042, -0.24); s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2 });
})();
const collarGeo = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, 0); s.lineTo(0.11, -0.02); s.lineTo(0.05, -0.08); s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2 });
})();

/* ------------------------------------------------------------------ Person */
export function Person({
  look, pose = 'idle', position = [0, 0, 0], rotationY = 0, scale = 1, onClick, children, mood = 'happy', castShadow = true, say,
}: {
  say?: string; look: Look; pose?: Pose; position?: [number, number, number]; rotationY?: number; scale?: number; onClick?: () => void; children?: ReactNode; mood?: 'happy' | 'neutral' | 'sad' | 'wow'; castShadow?: boolean;
}) {
  const h = look.height ?? 1;
  const hs = look.headScale ?? (h < 0.8 ? 1.2 : 1);
  const build = look.build ?? 1;
  const of = outfitOf(look);
  const refs = useRef<Partial<Record<JointName, THREE.Object3D>>>({});
  const weights = useRef<Record<Pose, number>>(Object.fromEntries(POSES.map((p) => [p, p === pose ? 1 : 0])) as Record<Pose, number>);
  const ph = useMemo(() => Math.random() * 10, []);
  const faceMat = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }), []);

  const skin = toon(look.skin);
  const hairM = toon(look.hair);
  const topC = of === 'blazer' ? look.blazer ?? '#1b2340' : look.top;
  const topM = toon(topC);
  const accM = toon(look.topAccent ?? '#ffffff');
  const botM = toon(look.bottom);
  const shoeM = toon(look.shoes ?? '#2b2f45');
  const sleeveM = of === 'blazer' || of === 'kurta' ? topM : null;
  const cs = castShadow;
  const brow = shade(look.hair, -0.05);

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime;
    const k = 1 - Math.exp(-dt * 7);
    let sum = 0;
    for (const p of POSES) { weights.current[p] += ((p === pose ? 1 : 0) - weights.current[p]) * k; sum += weights.current[p]; }
    const L = lib(t, ph);
    for (const j of JOINTS) {
      const o = refs.current[j]; if (!o) continue;
      let x = 0, y = 0, z = 0;
      for (const p of POSES) {
        const w = weights.current[p] / sum; if (w < 0.001) continue;
        const r = L[p][j]; x += r[0] * w; y += r[1] * w; z += r[2] * w;
      }
      if (j === 'root') o.position.set(0, y, z); else o.rotation.set(x, y, z);
    }
    // face
    const W = weights.current;
    const blink = (t + ph) % 3.7 < 0.12;
    let m: Mouth = 'grin';
    if (mood === 'sad' || W.sad > 0.5) m = 'sad';
    else if (mood === 'wow') m = 'wow';
    else if (W.talk + W.present > 0.5) m = Math.sin(t * 13 + ph) > 0 ? 'open' : 'closed';
    else if (W.cheer > 0.5) m = 'open';
    else if (mood === 'neutral' || W.think > 0.5) m = 'closed';
    const ft = faceTexture(look.eyes ?? '#5a3825', brow, m, blink);
    if (faceMat.map !== ft) { faceMat.map = ft; faceMat.needsUpdate = true; }
  });

  const set = (n: JointName) => (o: THREE.Object3D | null) => { if (o) refs.current[n] = o; };
  const ink = (th = 0.014) => <Outlines thickness={th} color={INK} />;

  const HIP = 0.74, UP = 0.37, LOW = 0.35, TORSO = 0.5;
  const R = 0.255; // head radius

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale * h}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
      onPointerOver={onClick ? () => (document.body.style.cursor = 'pointer') : undefined}
      onPointerOut={onClick ? () => (document.body.style.cursor = '') : undefined}>
      {say && <Bubble text={say} y={2.2 + (hs - 1) * 0.7} />}
      <group ref={set('root')}>
        {/* ---------------- legs ---------------- */}
        {([-1, 1] as const).map((s) => (
          <group key={s} ref={set(s < 0 ? 'hipL' : 'hipR')} position={[s * 0.1 * build, HIP, 0]}>
            <mesh position={[0, -UP / 2, 0]} castShadow={cs} material={of === 'dress' ? skin : botM}>
              <capsuleGeometry args={[of === 'dress' ? 0.062 : 0.088, UP - 0.08, 6, 14]} />{ink()}
            </mesh>
            {look.shorts && <mesh position={[0, -0.09, 0]} material={botM} castShadow={cs}><cylinderGeometry args={[0.1, 0.1, 0.2, 14]} />{ink()}</mesh>}
            <group ref={set(s < 0 ? 'knL' : 'knR')} position={[0, -UP, 0]}>
              <mesh position={[0, -LOW / 2 + 0.02, 0]} castShadow={cs} material={of === 'dress' || look.shorts ? skin : botM}>
                <capsuleGeometry args={[of === 'dress' || look.shorts ? 0.058 : 0.08, LOW - 0.1, 6, 14]} />{ink()}
              </mesh>
              {(of === 'dress' || look.shorts) && <mesh position={[0, -LOW + 0.07, 0]} material={toon('#ffffff')}><cylinderGeometry args={[0.064, 0.064, 0.09, 14]} /></mesh>}
              <mesh position={[0, -LOW + 0.0, 0.055]} castShadow={cs} material={shoeM} scale={[1, 0.62, 1.55]}>
                <sphereGeometry args={[0.095, 18, 12]} />{ink(0.012)}
              </mesh>
              <mesh position={[0, -LOW - 0.03, 0.055]} material={toon('#f6f6f6')} scale={[1.06, 0.2, 1.6]}><sphereGeometry args={[0.095, 16, 8]} /></mesh>
            </group>
          </group>
        ))}

        {/* ---------------- torso ---------------- */}
        <group ref={set('spine')} position={[0, HIP, 0]}>
          <mesh position={[0, 0.02, 0]} castShadow={cs} material={of === 'dress' || of === 'kurta' ? topM : botM} scale={[1.08 * build, 0.72, 0.82]}>
            <sphereGeometry args={[0.18, 22, 14]} />
          </mesh>
          <mesh geometry={torsoGeo} position={[0, 0.03, 0]} castShadow={cs} material={topM} scale={[build, 1, 0.8]}>{ink()}</mesh>
          {of === 'dress' && <mesh position={[0, -0.1, 0]} castShadow={cs} material={botM}><coneGeometry args={[0.32, 0.4, 24, 1, true]} />{ink()}</mesh>}
          {of === 'kurta' && (
            <>
              <mesh position={[0, -0.16, 0]} castShadow={cs} material={topM}><cylinderGeometry args={[0.2, 0.26, 0.36, 24, 1, true]} />{ink()}</mesh>
              <mesh position={[0, 0.3, 0.155]} material={toon('#ffc53d')}><boxGeometry args={[0.02, 0.32, 0.01]} /></mesh>
              <mesh position={[0, TORSO + 0.02, 0]} material={accM}><cylinderGeometry args={[0.085, 0.09, 0.05, 16]} /></mesh>
            </>
          )}
          {(of === 'shirtTie' || of === 'polo') && [-1, 1].map((s) => (
            <mesh key={s} geometry={collarGeo} position={[s * 0.012, TORSO + 0.015, 0.06]} rotation={[0.5, s < 0 ? Math.PI : 0, 0]} material={accM} scale={[s < 0 ? 1 : 1, 1, 1]}>{ink(0.008)}</mesh>
          ))}
          {of === 'shirtTie' && (
            <group position={[0, TORSO - 0.02, 0.145]} rotation={[-0.15, 0, 0]}>
              <mesh position={[0, 0, 0]} material={toon(look.tie ?? '#e2336c')}><boxGeometry args={[0.06, 0.045, 0.03]} />{ink(0.008)}</mesh>
              <mesh geometry={tieGeo} position={[0, -0.02, -0.01]} material={toon(look.tie ?? '#e2336c')}>{ink(0.008)}</mesh>
            </group>
          )}
          {of === 'polo' && (
            <>
              <mesh position={[0, TORSO - 0.08, 0.158]} rotation={[-0.2, 0, 0]} material={accM}><boxGeometry args={[0.025, 0.12, 0.01]} /></mesh>
              <mesh position={[0.095 * build, 0.36, 0.16]} rotation={[-0.05, 0.3, 0]}>
                <planeGeometry args={[0.13, 0.057]} />
                <meshBasicMaterial map={badge()} toneMapped={false} />
              </mesh>
            </>
          )}
          {of === 'tee' && (
            <>
              <mesh position={[0, TORSO - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} material={accM}><torusGeometry args={[0.075, 0.018, 8, 20]} /></mesh>
              <RoundedBox args={[0.07, 0.15, 0.02]} radius={0.03} position={[0, 0.27, 0.16]} material={toon(look.topAccent && look.topAccent !== '#ffffff' ? look.topAccent : '#ffa514')} />
            </>
          )}
          {of === 'blazer' && (
            <>
              <mesh position={[0, 0.36, 0.152]} rotation={[-0.12, 0, Math.PI]} material={toon(look.top)}><coneGeometry args={[0.085, 0.24, 3]} /></mesh>
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.07, 0.38, 0.158]} rotation={[-0.12, 0, s * 0.35]} material={toon(shade(topC, -0.1))}><boxGeometry args={[0.04, 0.2, 0.012]} />{ink(0.006)}</mesh>
              ))}
              <mesh position={[0, 0.17, 0.168]} material={toon('#ffc53d')}><sphereGeometry args={[0.016, 10, 8]} /></mesh>
            </>
          )}
          {look.apron && (
            <group>
              <RoundedBox args={[0.3, 0.46, 0.025]} radius={0.012} position={[0, 0.2, 0.165]} rotation={[-0.05, 0, 0]} material={toon(look.apron!)}>{ink(0.008)}</RoundedBox>
              <RoundedBox args={[0.14, 0.08, 0.012]} radius={0.01} position={[0, 0.1, 0.185]} material={toon(shade(look.apron!, -0.1))} />
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.1, 0.44, 0.135]} rotation={[-0.25, 0, s * -0.35]} material={toon(look.apron!)}><boxGeometry args={[0.03, 0.14, 0.012]} /></mesh>
              ))}
              <mesh position={[0, 0.02, 0]} material={toon(shade(look.apron!, -0.12))} scale={[build, 1, 0.82]}><cylinderGeometry args={[0.178, 0.178, 0.03, 24]} /></mesh>
            </group>
          )}
          {look.backpack && (
            <RoundedBox args={[0.3, 0.32, 0.14]} radius={0.05} position={[0, 0.28, -0.19]} material={toon(look.backpack)} castShadow={cs}>{ink(0.01)}</RoundedBox>
          )}

          {/* ---------------- arms ---------------- */}
          {([-1, 1] as const).map((s) => (
            <group key={s} ref={set(s < 0 ? 'shL' : 'shR')} position={[s * 0.215 * build, TORSO - 0.06, 0]}>
              <mesh castShadow={cs} material={topM}><sphereGeometry args={[0.078, 16, 12]} /></mesh>
              <mesh position={[0, -0.13, 0]} castShadow={cs} material={sleeveM ?? skin}><capsuleGeometry args={[0.058, 0.17, 6, 12]} />{ink(0.01)}</mesh>
              {!sleeveM && <mesh position={[0, -0.07, 0]} castShadow={cs} material={topM}><cylinderGeometry args={[0.078, 0.07, 0.14, 16]} />{ink(0.01)}</mesh>}
              <group ref={set(s < 0 ? 'elL' : 'elR')} position={[0, -0.27, 0]}>
                <mesh position={[0, -0.1, 0]} castShadow={cs} material={sleeveM ?? skin}><capsuleGeometry args={[0.05, 0.15, 6, 12]} />{ink(0.01)}</mesh>
                {sleeveM && <mesh position={[0, -0.18, 0]} material={toon(of === 'blazer' ? look.top : look.topAccent ?? '#ffffff')}><cylinderGeometry args={[0.056, 0.056, 0.04, 14]} /></mesh>}
                <group position={[0, -0.25, 0.005]}>
                  <mesh castShadow={cs} material={skin} scale={[0.9, 1.05, 0.72]}><sphereGeometry args={[0.068, 16, 12]} />{ink(0.01)}</mesh>
                  <mesh position={[-s * 0.05, 0.02, 0.03]} rotation={[0, 0, s * 0.6]} material={skin} scale={[0.6, 1, 0.6]}><capsuleGeometry args={[0.022, 0.04, 4, 8]} /></mesh>
                  {s > 0 && children}
                </group>
              </group>
            </group>
          ))}

          {/* ---------------- head ---------------- */}
          <mesh position={[0, TORSO + 0.04, 0]} material={skin}><cylinderGeometry args={[0.055, 0.062, 0.1, 12]} /></mesh>
          <group ref={set('head')} position={[0, TORSO + 0.07, 0]} scale={hs}>
            <group position={[0, R * 0.95, 0]}>
              <mesh castShadow={cs} material={skin} scale={[1, 1.03, 0.96]}>
                <sphereGeometry args={[R, 36, 28]} />{ink(0.012)}
              </mesh>
              {/* painted face on the front of the head */}
              <mesh material={faceMat} scale={[1, 1.03, 0.96]} renderOrder={2}>
                <sphereGeometry args={[R * 1.004, 32, 24, Math.PI / 2 - 0.95, 1.9, Math.PI / 2 - 0.92, 1.84]} />
              </mesh>
              {/* nose bump */}
              <mesh position={[0, -0.045, R * 0.95]} material={skin} scale={[1.1, 0.85, 0.8]}><sphereGeometry args={[0.03, 12, 10]} /></mesh>
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * R * 0.98, -0.02, 0]} material={skin} scale={[0.5, 1, 0.75]}><sphereGeometry args={[0.062, 14, 10]} />{ink(0.008)}</mesh>
              ))}
              <Hair3D style={look.hairStyle} m={hairM} R={R} />
              {look.cap && (
                <group position={[0, R * 0.52, -0.01]} rotation={[-0.18, 0, 0]}>
                  <mesh material={toon(look.cap)} scale={[1.05, 0.7, 1.05]}><sphereGeometry args={[R, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />{ink(0.01)}</mesh>
                  <mesh position={[0, 0.005, R * 0.95]} rotation={[0.15, 0, 0]} material={toon(shade(look.cap, -0.1))} scale={[1, 0.12, 0.75]}><cylinderGeometry args={[R * 0.8, R * 0.8, 0.12, 22, 1, false, -Math.PI / 2, Math.PI]} />{ink(0.008)}</mesh>
                </group>
              )}
              {look.glasses && (
                <group position={[0, 0.015, R * 0.97]}>
                  {[-1, 1].map((s) => (
                    <mesh key={s} position={[s * 0.072, 0, 0]} material={toon('#262838')}><torusGeometry args={[0.052, 0.009, 8, 22]} /></mesh>
                  ))}
                  <mesh material={toon('#262838')}><boxGeometry args={[0.04, 0.01, 0.01]} /></mesh>
                </group>
              )}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

/* Comic thought bubble above the head */
function Bubble({ text, y }: { text: string; y: number }) {
  return (
    <Html position={[0, y, 0]} center distanceFactor={7} zIndexRange={[15, 0]} style={{ pointerEvents: 'none' }}>
      <div key={text} className="animate-pop-in relative flex flex-col items-center" style={{ width: 'max-content', maxWidth: 230 }}>
        <div className="rounded-[22px] border-[3px] border-[#3a2a22] bg-white px-4 py-2.5 text-center font-display text-[17px] font-bold leading-snug text-[#1b2340] shadow-[0_6px_0_0_rgba(58,42,34,0.18)]">
          {text}
        </div>
        <span className="mt-1 block size-4 -translate-x-2 rounded-full border-[3px] border-[#3a2a22] bg-white" />
        <span className="mt-0.5 block size-2.5 -translate-x-4 rounded-full border-[2.5px] border-[#3a2a22] bg-white" />
      </div>
    </Html>
  );
}

function Hair3D({ style, m, R }: { style: Hair; m: THREE.Material; R: number }) {
  const ink = <Outlines thickness={0.012} color={INK} />;
  const cap = (
    <mesh position={[0, 0.05, -0.012]} material={m} scale={[1.07, 1.03, 1.07]}>
      <sphereGeometry args={[R, 30, 18, 0, Math.PI * 2, 0, Math.PI * 0.4]} />{ink}
    </mesh>
  );
  const back = (
    <mesh position={[0, -0.02, -0.04]} material={m} scale={[1.06, 0.9, 1]}>
      <sphereGeometry args={[R, 26, 16, Math.PI * 0.2, Math.PI * 0.6 + Math.PI, Math.PI * 0.3, Math.PI * 0.45]} />
    </mesh>
  );
  switch (style) {
    case 'side':
      return (
        <group>
          {cap}{back}
          {/* big front swoop, like the reference seller */}
          <mesh position={[0.05, R * 0.95, R * 0.36]} rotation={[0.35, 0.2, -0.35]} material={m} scale={[1.5, 0.55, 0.85]}><sphereGeometry args={[R * 0.5, 22, 16]} />{ink}</mesh>
          <mesh position={[-0.09, R * 0.9, R * 0.2]} rotation={[0.3, 0, 0.3]} material={m} scale={[1.2, 0.7, 1]}><sphereGeometry args={[R * 0.45, 20, 14]} />{ink}</mesh>
          <mesh position={[0.13, R * 0.98, R * 0.05]} material={m}><sphereGeometry args={[R * 0.36, 18, 14]} /></mesh>
        </group>
      );
    case 'short':
      return (
        <group>
          {cap}{back}
          {[-0.09, 0, 0.09].map((x, i) => (
            <mesh key={i} position={[x, R * 0.82, R * 0.5]} rotation={[0.7, 0, x * 2]} material={m} scale={[1, 0.55, 0.6]}><sphereGeometry args={[R * 0.32, 16, 12]} />{ink}</mesh>
          ))}
        </group>
      );
    case 'spiky':
      return (
        <group>
          {cap}
          {[...Array(9)].map((_, i) => {
            const a = (i / 9) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * R * 0.45, R * 0.92, Math.sin(a) * R * 0.45]} rotation={[Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7]} material={m}>
                <coneGeometry args={[R * 0.24, R * 0.6, 8]} />{ink}
              </mesh>
            );
          })}
        </group>
      );
    case 'curly':
      return (
        <group>
          {[...Array(16)].map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * R * 0.82, R * (0.45 + (i % 2) * 0.22), Math.sin(a) * R * 0.82 - 0.02]} material={m}>
                <sphereGeometry args={[R * 0.32, 14, 12]} />{ink}
              </mesh>
            );
          })}
          <mesh position={[0, R * 0.8, -0.01]} material={m}><sphereGeometry args={[R * 0.62, 18, 14]} />{ink}</mesh>
        </group>
      );
    case 'bun':
    case 'ponytail':
    case 'long':
      return (
        <group>
          {cap}{back}
          <mesh position={[0.07, R * 0.86, R * 0.42]} rotation={[0.55, 0, -0.45]} material={m} scale={[1.45, 0.45, 0.65]}><sphereGeometry args={[R * 0.45, 20, 14]} />{ink}</mesh>
          {style === 'bun' && <mesh position={[0, R * 1.05, -R * 0.45]} material={m}><sphereGeometry args={[R * 0.36, 18, 14]} />{ink}</mesh>}
          {style === 'ponytail' && <mesh position={[0, R * 0.2, -R * 1.05]} rotation={[0.5, 0, 0]} material={m}><capsuleGeometry args={[R * 0.2, R * 0.9, 6, 12]} />{ink}</mesh>}
          {style === 'long' && (
            <>
              <mesh position={[0, -R * 0.45, -R * 0.3]} material={m} scale={[1.12, 1, 0.7]}><capsuleGeometry args={[R * 0.75, R * 1.0, 8, 16]} />{ink}</mesh>
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * R * 0.84, -R * 0.4, R * 0.15]} material={m} scale={[0.55, 1, 0.65]}><capsuleGeometry args={[R * 0.3, R * 1.0, 6, 12]} />{ink}</mesh>
              ))}
            </>
          )}
        </group>
      );
  }
}

/* ------------------------------------------------------------------ cast */
export const LOOKS = {
  // Founders (illustrated, not likenesses) in Skippi-blue polos, as in the POA photo.
  ravi: { skin: '#d9a07a', hair: '#24170f', hairStyle: 'side', top: '#1f63d6', topAccent: '#ffffff', bottom: '#2a3350', outfit: 'polo', height: 1.04 } as Look,
  anuja: { skin: '#d9a07a', hair: '#1c120c', hairStyle: 'long', top: '#1f63d6', topAccent: '#ffffff', bottom: '#2a3350', outfit: 'polo', height: 0.97 } as Look,
  seller: { skin: '#e8b48c', hair: '#5a3218', hairStyle: 'side', top: '#ffffff', topAccent: '#ffffff', tie: '#e2336c', apron: '#2163e0', bottom: '#2a3350', outfit: 'shirtTie', height: 1.0 } as Look,
  kid1: { skin: '#eab590', hair: '#3a2214', hairStyle: 'spiky', top: '#ff7a1a', topAccent: '#ffd27a', bottom: '#2f4a8a', outfit: 'tee', shorts: true, height: 0.72, cap: '#e2336c' } as Look,
  kid2: { skin: '#c98a62', hair: '#1f140e', hairStyle: 'ponytail', top: '#ff7cc0', topAccent: '#ffffff', bottom: '#ff5fa8', outfit: 'dress', height: 0.7 } as Look,
  kid3: { skin: '#dfa47c', hair: '#2b1d14', hairStyle: 'curly', top: '#7cc22b', topAccent: '#ffffff', bottom: '#33415c', outfit: 'tee', shorts: true, height: 0.75, backpack: '#ffa514' } as Look,
  parent: { skin: '#d49870', hair: '#1a100c', hairStyle: 'bun', top: '#ffa514', topAccent: '#e2336c', bottom: '#fff3df', outfit: 'kurta', height: 0.98, glasses: true } as Look,
  shopkeeper: { skin: '#c88458', hair: '#4a4a4a', hairStyle: 'short', top: '#fff8ec', topAccent: '#7cc22b', bottom: '#6b4a2b', outfit: 'kurta', height: 1.0, build: 1.1 } as Look,
  distributor: { skin: '#b97a50', hair: '#1b1b1b', hairStyle: 'short', top: '#4a8bf5', topAccent: '#13317a', bottom: '#1b2340', outfit: 'polo', height: 1.02, cap: '#ffa514' } as Look,
  sharkA: { skin: '#e0a882', hair: '#1a1a1a', hairStyle: 'short', top: '#ffffff', bottom: '#1b2340', blazer: '#1b2340', outfit: 'blazer', height: 1.02, glasses: true } as Look,
  sharkB: { skin: '#d49a72', hair: '#151515', hairStyle: 'spiky', top: '#d9e8ff', bottom: '#111827', blazer: '#2b2f45', outfit: 'blazer', height: 1.0 } as Look,
  sharkC: { skin: '#e3ae88', hair: '#5a5a5a', hairStyle: 'side', top: '#ffffff', bottom: '#2b2f45', blazer: '#6b2a18', outfit: 'blazer', height: 1.03 } as Look,
  sharkD: { skin: '#d9a07a', hair: '#1a1210', hairStyle: 'long', top: '#ffe0ea', bottom: '#1b2340', blazer: '#c01f55', outfit: 'blazer', height: 0.97 } as Look,
  sharkE: { skin: '#cf9268', hair: '#100b09', hairStyle: 'bun', top: '#ffffff', bottom: '#1b2340', blazer: '#163f99', outfit: 'blazer', height: 0.96 } as Look,
  student1: { skin: '#d9a07a', hair: '#1a1210', hairStyle: 'ponytail', top: '#ffffff', topAccent: '#ffffff', tie: '#2163e0', bottom: '#13317a', outfit: 'shirtTie', height: 0.85 } as Look,
  student2: { skin: '#c98a62', hair: '#14100e', hairStyle: 'short', top: '#ffffff', topAccent: '#ffffff', tie: '#ffa514', bottom: '#13317a', outfit: 'shirtTie', height: 0.88 } as Look,
  student3: { skin: '#eab590', hair: '#2a1a12', hairStyle: 'curly', top: '#ffffff', topAccent: '#ffffff', tie: '#e2336c', bottom: '#13317a', outfit: 'shirtTie', height: 0.86 } as Look,
  student4: { skin: '#cf9268', hair: '#100b09', hairStyle: 'long', top: '#ffffff', topAccent: '#2163e0', bottom: '#13317a', outfit: 'dress', height: 0.84 } as Look,
  student5: { skin: '#e0a882', hair: '#1c1412', hairStyle: 'side', top: '#ffffff', topAccent: '#ffffff', tie: '#7cc22b', bottom: '#13317a', outfit: 'shirtTie', height: 0.9, glasses: true } as Look,
};
