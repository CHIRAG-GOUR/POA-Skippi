import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Check } from 'lucide-react';
import { IcePopIcon } from '../ui/PoaIcons';
import { std, glossy, emissive, FLAVOURS } from './materials';
import { signTexture, speckleTexture, stripeTexture, gradientTexture } from './textures';
import { IcePop } from './IcePop';

type V3 = [number, number, number];

/* ------------------------------------------------------------------ Sky dome */
export function SkyDome({ top = '#5fb8ff', mid = '#bfe6ff', bottom = '#fff3d6', k = 'day' }: { top?: string; mid?: string; bottom?: string; k?: string }) {
  const tex = useMemo(() => gradientTexture([[0, top], [0.55, mid], [1, bottom]], `${k}|${top}|${mid}|${bottom}`), [top, mid, bottom, k]);
  return (
    <mesh scale={[1, 1, 1]} renderOrder={-1}>
      <sphereGeometry args={[90, 32, 16]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} depthWrite={false} fog={false} toneMapped={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ Puffy clouds */
export function Clouds({ count = 7, radius = 40, y = 16 }: { count?: number; radius?: number; y?: number }) {
  const g = useRef<THREE.Group>(null);
  const items = useMemo(
    () => [...Array(count)].map((_, i) => ({ a: (i / count) * Math.PI * 2 + Math.random() * 0.4, r: radius * (0.8 + Math.random() * 0.3), y: y + Math.random() * 6, s: 1.4 + Math.random() * 1.6 })),
    [count, radius, y],
  );
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.006; });
  const m = std('#ffffff', 1, 0, { emissive: '#ffffff', emissiveIntensity: 0.25 });
  return (
    <group ref={g}>
      {items.map((c, i) => (
        <group key={i} position={[Math.cos(c.a) * c.r, c.y, Math.sin(c.a) * c.r]} scale={c.s}>
          {[[0, 0, 0, 1.6], [1.5, -0.2, 0.2, 1.2], [-1.4, -0.3, 0, 1.1], [0.5, 0.6, -0.3, 1.1], [-0.6, 0.4, 0.4, 0.9]].map(([x, yy, z, r], j) => (
            <mesh key={j} position={[x, yy, z]} material={m}>
              <sphereGeometry args={[r, 16, 12]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ Floating diorama island */
export function Island({
  radius = 9, top = '#8fd14f', side = '#c98a52', sand, depth = 2.2, children, position = [0, 0, 0],
}: { radius?: number; top?: string; side?: string; sand?: string; depth?: number; children?: ReactNode; position?: V3 }) {
  const grassTex = useMemo(() => {
    const t = speckleTexture(top, ['#6fb53a', '#a6e06a', '#5d9a2f'], `grass${top}`, 2200);
    t.repeat.set(radius / 2, radius / 2);
    return t;
  }, [top, radius]);
  const sandR = sand ? radius + 1.1 : radius;
  return (
    <group position={position}>
      {sand && (
        <mesh position={[0, -0.12, 0]} receiveShadow>
          <cylinderGeometry args={[sandR, sandR - 0.2, 0.3, 64]} />
          <meshStandardMaterial color={sand} roughness={0.95} />
        </mesh>
      )}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.3, 64]} />
        <meshStandardMaterial map={grassTex} roughness={0.95} />
      </mesh>
      {/* soil layers */}
      <mesh position={[0, -0.2 - depth / 2, 0]}>
        <cylinderGeometry args={[sandR - 0.05, sandR * 0.55, depth, 48]} />
        <meshStandardMaterial color={side} roughness={1} />
      </mesh>
      <mesh position={[0, -0.25 - depth, 0]}>
        <coneGeometry args={[sandR * 0.55, depth * 0.9, 32]} />
        <meshStandardMaterial color="#a86d3c" roughness={1} />
      </mesh>
      {children}
    </group>
  );
}

/* ------------------------------------------------------------------ Water */
export function Water({ radius = 60, color = '#4cc4f0', y = -0.35 }: { radius?: number; color?: string; y?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.CircleGeometry(radius, 96, 0, Math.PI * 2), [radius]);
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array), [geo]);
  useFrame((st) => {
    if (!ref.current) return;
    const t = st.clock.elapsedTime;
    const p = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = base[i * 3], yy = base[i * 3 + 1];
      p.setZ(i, Math.sin(x * 0.35 + t * 1.1) * 0.06 + Math.cos(yy * 0.3 + t * 0.9) * 0.06);
    }
    p.needsUpdate = true;
  });
  return (
    <mesh ref={ref} geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <meshPhysicalMaterial color={color} roughness={0.15} metalness={0} clearcoat={1} transparent opacity={0.92} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ Vegetation */
export function RoundTree({ position = [0, 0, 0] as V3, scale = 1, color = '#5dbb3f' }: { position?: V3; scale?: number; color?: string }) {
  const g = useRef<THREE.Group>(null);
  const ph = useMemo(() => Math.random() * 10, []);
  useFrame((st) => { if (g.current) g.current.rotation.z = Math.sin(st.clock.elapsedTime * 0.9 + ph) * 0.025; });
  const leaf = std(color, 0.85);
  const leaf2 = std(new THREE.Color(color).offsetHSL(0.02, 0, 0.08).getStyle(), 0.85);
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]} castShadow material={std('#8a5a33', 0.9)}>
        <cylinderGeometry args={[0.09, 0.15, 1.2, 10]} />
      </mesh>
      <group ref={g} position={[0, 1.2, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow material={leaf}><icosahedronGeometry args={[0.72, 2]} /></mesh>
        <mesh position={[0.42, 0.25, 0.1]} castShadow material={leaf2}><icosahedronGeometry args={[0.5, 2]} /></mesh>
        <mesh position={[-0.4, 0.3, -0.12]} castShadow material={leaf2}><icosahedronGeometry args={[0.52, 2]} /></mesh>
        <mesh position={[0, 0.95, 0]} castShadow material={leaf2}><icosahedronGeometry args={[0.42, 2]} /></mesh>
      </group>
    </group>
  );
}

export function PalmTree({ position = [0, 0, 0] as V3, scale = 1, lean = 0.15 }: { position?: V3; scale?: number; lean?: number }) {
  const crown = useRef<THREE.Group>(null);
  const ph = useMemo(() => Math.random() * 10, []);
  useFrame((st) => { if (crown.current) crown.current.rotation.y = Math.sin(st.clock.elapsedTime * 0.7 + ph) * 0.08; });
  const trunk = std('#b8864f', 0.9);
  const ring = std('#9a6c3b', 0.9);
  const leaf = std('#3fae49', 0.75, 0, { side: THREE.DoubleSide });
  const leafGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.quadraticCurveTo(0.35, 0.12, 1.35, 0);
    s.quadraticCurveTo(0.35, -0.12, 0, 0);
    const g = new THREE.ShapeGeometry(s, 8);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i); p.setZ(i, -x * x * 0.32); }
    g.computeVertexNormals();
    return g;
  }, []);
  const segs = 7;
  return (
    <group position={position} scale={scale} rotation={[0, 0, lean]}>
      {[...Array(segs)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i * 0.25) * 0.05 * i, i * 0.36 + 0.18, 0]} castShadow material={i % 2 ? ring : trunk}>
          <cylinderGeometry args={[0.11 - i * 0.006, 0.13 - i * 0.006, 0.38, 10]} />
        </mesh>
      ))}
      <group ref={crown} position={[0.32, segs * 0.36 + 0.1, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} geometry={leafGeo} material={leaf} rotation={[0, (i / 8) * Math.PI * 2, -0.25 - (i % 2) * 0.2]} castShadow />
        ))}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos(i * 2.1) * 0.1, -0.1, Math.sin(i * 2.1) * 0.1]} material={std('#6b4a22', 0.7)}>
            <sphereGeometry args={[0.09, 10, 8]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Bush({ position = [0, 0, 0] as V3, scale = 1, color = '#4fae3a', berries = '#e2336c' }: { position?: V3; scale?: number; color?: string; berries?: string | null }) {
  const m = std(color, 0.85);
  return (
    <group position={position} scale={scale}>
      {[[0, 0.28, 0, 0.36], [0.3, 0.22, 0.05, 0.27], [-0.28, 0.2, -0.04, 0.28], [0.05, 0.22, 0.26, 0.25]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow material={m}><icosahedronGeometry args={[r, 1]} /></mesh>
      ))}
      {berries && [[0.2, 0.45, 0.2], [-0.15, 0.4, 0.25], [0.35, 0.3, 0.2], [-0.32, 0.35, 0.1]].map((p, i) => (
        <mesh key={i} position={p as V3} material={glossy(berries)}><sphereGeometry args={[0.045, 8, 6]} /></mesh>
      ))}
    </group>
  );
}

/** Instanced flowers + grass tufts scattered in a ring/disc. Cheap: 2 draw calls. */
export function Meadow({ radius = 8, inner = 0, count = 220, avoid = [] as [number, number, number][], seed = 3 }: { radius?: number; inner?: number; count?: number; avoid?: [number, number, number][]; seed?: number }) {
  const grass = useRef<THREE.InstancedMesh>(null);
  const flowers = useRef<THREE.InstancedMesh>(null);
  const pts = useMemo(() => {
    let s = seed * 9973;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const out: { x: number; z: number; r: number; s: number }[] = [];
    let guard = 0;
    while (out.length < count && guard++ < count * 8) {
      const a = rnd() * Math.PI * 2;
      const d = Math.sqrt(inner * inner + rnd() * (radius * radius - inner * inner));
      const x = Math.cos(a) * d, z = Math.sin(a) * d;
      if (avoid.some(([ax, az, ar]) => (x - ax) ** 2 + (z - az) ** 2 < ar * ar)) continue;
      out.push({ x, z, r: rnd() * Math.PI, s: 0.6 + rnd() * 0.8 });
    }
    return out;
  }, [radius, inner, count, avoid, seed]);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    const cols = ['#ff5fa8', '#ffd23f', '#ffffff', '#ff7a1a', '#b48cff'];
    pts.forEach((p, i) => {
      o.position.set(p.x, 0.1, p.z);
      o.rotation.set(0, p.r, 0);
      o.scale.setScalar(p.s);
      o.updateMatrix();
      grass.current?.setMatrixAt(i, o.matrix);
      o.position.set(p.x + 0.08, 0.2 * p.s, p.z + 0.05);
      o.scale.setScalar(p.s * (i % 3 === 0 ? 1 : 0.0001));
      o.updateMatrix();
      flowers.current?.setMatrixAt(i, o.matrix);
      flowers.current?.setColorAt(i, new THREE.Color(cols[i % cols.length]));
    });
    if (grass.current) grass.current.instanceMatrix.needsUpdate = true;
    if (flowers.current) { flowers.current.instanceMatrix.needsUpdate = true; if (flowers.current.instanceColor) flowers.current.instanceColor.needsUpdate = true; }
  }, [pts]);
  return (
    <group>
      <instancedMesh ref={grass} args={[undefined, undefined, pts.length]} castShadow={false} receiveShadow>
        <coneGeometry args={[0.07, 0.28, 4]} />
        <meshStandardMaterial color="#4f9e2c" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={flowers} args={[undefined, undefined, pts.length]}>
        <icosahedronGeometry args={[0.07, 0]} />
        <meshStandardMaterial roughness={0.6} />
      </instancedMesh>
    </group>
  );
}

export function Rock({ position = [0, 0, 0] as V3, scale = 1, color = '#a7a9b8' }: { position?: V3; scale?: number; color?: string }) {
  return (
    <mesh position={position} scale={[scale, scale * 0.65, scale * 0.9]} castShadow receiveShadow material={std(color, 0.9)}>
      <dodecahedronGeometry args={[0.4, 0]} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ Street furniture */
export function Bench({ position = [0, 0, 0] as V3, rotationY = 0 }: { position?: V3; rotationY?: number }) {
  const wood = std('#d98c45', 0.7);
  const iron = glossy('#2b2f45', 0.4);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[0, 1, 2].map((i) => (
        <RoundedBox key={i} args={[1.4, 0.06, 0.12]} radius={0.02} position={[0, 0.45, -0.15 + i * 0.15]} material={wood} castShadow />
      ))}
      {[0, 1].map((i) => (
        <RoundedBox key={i} args={[1.4, 0.12, 0.05]} radius={0.02} position={[0, 0.7 + i * 0.16, -0.26]} material={wood} castShadow />
      ))}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.42, -0.05]} material={iron}><boxGeometry args={[0.06, 0.84, 0.5]} /></mesh>
      ))}
    </group>
  );
}

export function Lamp({ position = [0, 0, 0] as V3, on = false }: { position?: V3; on?: boolean }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow material={glossy('#13317a', 0.35)}><cylinderGeometry args={[0.04, 0.06, 2.4, 10]} /></mesh>
      <mesh position={[0, 2.5, 0]} material={on ? emissive('#ffe7a0', 2) : std('#fff3d1', 0.3)}><sphereGeometry args={[0.18, 16, 12]} /></mesh>
      <mesh position={[0, 2.66, 0]} material={glossy('#13317a', 0.35)}><coneGeometry args={[0.2, 0.14, 16]} /></mesh>
      {on && <pointLight position={[0, 2.4, 0]} intensity={4} distance={6} color="#ffd98a" />}
    </group>
  );
}

export function Umbrella({ position = [0, 0, 0] as V3, a = '#e2336c', b = '#ffffff' }: { position?: V3; a?: string; b?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.1, 0]} material={std('#ffffff', 0.4)}><cylinderGeometry args={[0.03, 0.03, 2.2, 8]} /></mesh>
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[0, 2.1, 0]} rotation={[0, (i / 8) * Math.PI * 2, 0]} castShadow material={std(i % 2 ? a : b, 0.6, 0, { side: THREE.DoubleSide })}>
          <coneGeometry args={[1.2, 0.5, 2, 1, true, 0, Math.PI / 4]} />
        </mesh>
      ))}
    </group>
  );
}

export function Fence({ from, to, color = '#ffffff' }: { from: [number, number]; to: [number, number]; color?: string }) {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const ang = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const n = Math.max(2, Math.round(len / 0.45));
  const m = std(color, 0.6);
  return (
    <group position={[from[0], 0, from[1]]} rotation={[0, -ang, 0]}>
      {[...Array(n + 1)].map((_, i) => (
        <mesh key={i} position={[(i / n) * len, 0.32, 0]} castShadow material={m}><boxGeometry args={[0.07, 0.64, 0.07]} /></mesh>
      ))}
      {[0.2, 0.46].map((y) => (
        <mesh key={y} position={[len / 2, y, 0]} material={m}><boxGeometry args={[len, 0.06, 0.04]} /></mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ Signs and flags */
export function Sign({ position = [0, 0, 0] as V3, rotationY = 0, title, body, w = 1.6, h = 0.8, bg = '#ffffff', fg = '#13317a', accent = '#ffa514', post = true, onClick, glow = false }: {
  position?: V3; rotationY?: number; title: string; body?: string; w?: number; h?: number; bg?: string; fg?: string; accent?: string; post?: boolean; onClick?: () => void; glow?: boolean;
}) {
  const tex = useMemo(() => signTexture({ title, body, bg, fg, accent, w: 1024, h: Math.round((1024 * h) / w), titleSize: body ? 96 : 130, bodySize: 46 }), [title, body, bg, fg, accent, w, h]);
  return (
    <group position={position} rotation={[0, rotationY, 0]} onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
      onPointerOver={onClick ? () => (document.body.style.cursor = 'pointer') : undefined}
      onPointerOut={onClick ? () => (document.body.style.cursor = '') : undefined}>
      {post && (
        <mesh position={[0, (h + 0.9) / 2, -0.04]} castShadow material={std('#c47a3f', 0.8)}>
          <boxGeometry args={[0.1, h + 0.9, 0.08]} />
        </mesh>
      )}
      <RoundedBox args={[w + 0.08, h + 0.08, 0.06]} radius={0.04} position={[0, post ? 0.9 + h / 2 : 0, 0]} material={glow ? emissive(accent, 0.6) : std(accent, 0.5)} castShadow />
      <mesh position={[0, post ? 0.9 + h / 2 : 0, 0.032]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={tex} roughness={0.5} transparent />
      </mesh>
    </group>
  );
}

export function Flag({ position = [0, 0, 0] as V3, color = '#e2336c', height = 2.2 }: { position?: V3; color?: string; height?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(0.7, 0.42, 12, 4), []);
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array), [geo]);
  useFrame((st) => {
    const t = st.clock.elapsedTime;
    const p = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = base[i * 3] + 0.35;
      p.setZ(i, Math.sin(x * 7 - t * 5) * 0.05 * x);
    }
    p.needsUpdate = true;
  });
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} material={glossy('#ffffff', 0.3)}><cylinderGeometry args={[0.025, 0.03, height, 8]} /></mesh>
      <mesh position={[0, height, 0]} material={glossy('#ffa514', 0.3)}><sphereGeometry args={[0.05, 10, 8]} /></mesh>
      <mesh ref={ref} geometry={geo} position={[0.36, height - 0.25, 0]} castShadow material={std(color, 0.6, 0, { side: THREE.DoubleSide })} />
    </group>
  );
}

/* ------------------------------------------------------------------ Skippi stall / kiosk */
export function SkippiStall({ position = [0, 0, 0] as V3, rotationY = 0, scale = 1 }: { position?: V3; rotationY?: number; scale?: number }) {
  const awn = useMemo(() => stripeTexture('#2163e0', '#ffffff', 10, 'awning'), []);
  const sign = useMemo(() => signTexture({ title: 'SKIPPI', body: 'ICE POPS', bg: '#2163e0', fg: '#ffffff', accent: '#ffa514', w: 1024, h: 340, titleSize: 170, bodySize: 64 }), []);
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* counter */}
      <RoundedBox args={[2.4, 1.0, 0.9]} radius={0.08} position={[0, 0.5, 0]} material={std('#ffffff', 0.45)} castShadow receiveShadow />
      <RoundedBox args={[2.5, 0.08, 1.0]} radius={0.03} position={[0, 1.02, 0]} material={glossy('#ffa514', 0.3)} castShadow />
      <mesh position={[0, 0.55, 0.455]}><planeGeometry args={[2.1, 0.7]} /><meshStandardMaterial map={sign} roughness={0.5} /></mesh>
      {/* posts */}
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} position={[x, 1.6, -0.3]} castShadow material={glossy('#2163e0', 0.3)}><cylinderGeometry args={[0.05, 0.05, 1.2, 10]} /></mesh>
      ))}
      {/* awning */}
      <mesh position={[0, 2.3, 0.05]} rotation={[0.35, 0, 0]} castShadow>
        <boxGeometry args={[2.7, 0.06, 1.4]} />
        <meshStandardMaterial map={awn} roughness={0.6} />
      </mesh>
      {[...Array(9)].map((_, i) => (
        <mesh key={i} position={[-1.2 + i * 0.3, 2.04, 0.72]} rotation={[Math.PI / 2, 0, 0]} material={std(i % 2 ? '#ffffff' : '#2163e0', 0.6)}>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16, 1, false, 0, Math.PI]} />
        </mesh>
      ))}
      {/* pops on display */}
      {FLAVOURS.map((f, i) => (
        <IcePop key={f.id} color={f.color} flavour={f.name} length={0.75} position={[-0.75 + i * 0.3, 1.06, -0.1]} rotation={[0, 0, (i - 2.5) * 0.04]} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ Freezer bike (Skippi introduced these in 2022) */
export function FreezerBike({ position = [0, 0, 0] as V3, rotationY = 0, moving = false }: { position?: V3; rotationY?: number; moving?: boolean }) {
  const wheels = useRef<THREE.Group[]>([]);
  useFrame((_, dt) => { if (moving) wheels.current.forEach((w) => w && (w.rotation.x -= dt * 8)); });
  const box = useMemo(() => signTexture({ title: 'SKIPPI', body: 'Freezer Bike', bg: '#ffffff', fg: '#2163e0', accent: '#e2336c', w: 1024, h: 600, titleSize: 200, bodySize: 80 }), []);
  const frame = glossy('#e2336c', 0.3);
  const tire = std('#1d1f2b', 0.8);
  const wheel = (x: number, i: number) => (
    <group key={i} ref={(r) => { if (r) wheels.current[i] = r; }} position={[x, 0.3, 0]} rotation={[0, 0, 0]}>
      <mesh rotation={[0, Math.PI / 2, 0]} material={tire} castShadow><torusGeometry args={[0.27, 0.05, 10, 24]} /></mesh>
      {[0, 1, 2].map((k) => (
        <mesh key={k} rotation={[(k * Math.PI) / 3, 0, 0]} material={std('#c9ced8', 0.3, 0.6)}><boxGeometry args={[0.02, 0.5, 0.02]} /></mesh>
      ))}
    </group>
  );
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {wheel(-0.75, 0)}{wheel(0.55, 1)}{wheel(1.05, 2)}
      <mesh position={[-0.1, 0.62, 0]} rotation={[0, 0, 0.4]} material={frame} castShadow><cylinderGeometry args={[0.035, 0.035, 1.1, 8]} /></mesh>
      <mesh position={[-0.55, 0.85, 0]} material={std('#1d1f2b', 0.6)} castShadow><boxGeometry args={[0.28, 0.06, 0.16]} /></mesh>
      <mesh position={[-0.85, 0.95, 0]} rotation={[0, 0, -0.3]} material={frame}><cylinderGeometry args={[0.03, 0.03, 0.7, 8]} /></mesh>
      <mesh position={[-0.95, 1.28, 0]} rotation={[Math.PI / 2, 0, 0]} material={std('#1d1f2b', 0.6)}><cylinderGeometry args={[0.025, 0.025, 0.5, 8]} /></mesh>
      {/* freezer box */}
      <RoundedBox args={[0.95, 0.75, 0.8]} radius={0.07} position={[0.8, 0.97, 0]} material={std('#ffffff', 0.4)} castShadow />
      <RoundedBox args={[1.0, 0.08, 0.85]} radius={0.03} position={[0.8, 1.38, 0]} material={glossy('#2163e0', 0.3)} castShadow />
      <mesh position={[0.8, 0.97, 0.405]}><planeGeometry args={[0.85, 0.5]} /><meshStandardMaterial map={box} /></mesh>
      <mesh position={[0.8, 0.97, -0.405]} rotation={[0, Math.PI, 0]}><planeGeometry args={[0.85, 0.5]} /><meshStandardMaterial map={box} /></mesh>
      <Umbrella position={[0.8, 1.2, 0]} a="#ffa514" b="#ffffff" />
    </group>
  );
}

/* ------------------------------------------------------------------ Kirana shop */
export function Shop({ position = [0, 0, 0] as V3, rotationY = 0, name = 'KIRANA STORE', color = '#7cc22b', open = true, stocked = false }: { position?: V3; rotationY?: number; name?: string; color?: string; open?: boolean; stocked?: boolean }) {
  const sign = useMemo(() => signTexture({ title: name, bg: color, fg: '#ffffff', accent: '#ffffff', w: 1024, h: 220, titleSize: 120 }), [name, color]);
  const awn = useMemo(() => stripeTexture(color, '#ffffff', 10, 'shop' + color), [color]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <RoundedBox args={[3, 2.4, 2]} radius={0.06} position={[0, 1.2, 0]} material={std('#fff3df', 0.85)} castShadow receiveShadow />
      <RoundedBox args={[3.2, 0.18, 2.2]} radius={0.05} position={[0, 2.48, 0]} material={std('#c96b3a', 0.7)} castShadow />
      <mesh position={[0, 2.15, 1.01]}><planeGeometry args={[2.6, 0.55]} /><meshStandardMaterial map={sign} /></mesh>
      <mesh position={[0, 1.78, 1.25]} rotation={[0.5, 0, 0]} castShadow><boxGeometry args={[3, 0.04, 0.6]} /><meshStandardMaterial map={awn} /></mesh>
      {/* doorway */}
      <mesh position={[0, 0.85, 1.005]} material={std(open ? '#5a3a24' : '#9aa3b5', 0.7)}><planeGeometry args={[2.2, 1.6]} /></mesh>
      {!open && [...Array(10)].map((_, i) => (
        <mesh key={i} position={[0, 0.12 + i * 0.16, 1.02]} material={std('#b7bfce', 0.5, 0.3)}><boxGeometry args={[2.2, 0.03, 0.02]} /></mesh>
      ))}
      {open && (
        <>
          {[0.45, 0.95, 1.4].map((y) => (
            <mesh key={y} position={[0, y, 0.75]} material={std('#e7b27c', 0.7)}><boxGeometry args={[2.1, 0.05, 0.4]} /></mesh>
          ))}
          {[...Array(12)].map((_, i) => (
            <mesh key={i} position={[-0.9 + (i % 6) * 0.36, 0.6 + Math.floor(i / 6) * 0.5, 0.78]} material={std(['#ffa514', '#e2336c', '#4a8bf5', '#7cc22b'][i % 4], 0.6)}>
              <boxGeometry args={[0.22, 0.26, 0.18]} />
            </mesh>
          ))}
          {stocked && FLAVOURS.map((f, i) => (
            <IcePop key={f.id} color={f.color} length={0.55} position={[-0.75 + i * 0.3, 1.43, 0.8]} />
          ))}
        </>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ Delivery van */
export function Van({ position = [0, 0, 0] as V3, rotationY = 0, moving = false }: { position?: V3; rotationY?: number; moving?: boolean }) {
  const side = useMemo(() => signTexture({ title: 'SKIPPI', body: 'Ready-to-freeze ice pops', bg: '#ffffff', fg: '#2163e0', accent: '#ffa514', w: 1024, h: 420, titleSize: 170, bodySize: 54 }), []);
  const wheels = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (moving && wheels.current) wheels.current.children.forEach((c) => (c.rotation.z -= dt * 8)); });
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <RoundedBox args={[2.2, 1.3, 1.25]} radius={0.12} position={[-0.25, 1.0, 0]} material={std('#ffffff', 0.35)} castShadow />
      <RoundedBox args={[0.9, 0.95, 1.2]} radius={0.15} position={[1.2, 0.82, 0]} material={glossy('#2163e0', 0.3)} castShadow />
      <mesh position={[1.5, 1.0, 0]} rotation={[0, Math.PI / 2, 0]} material={glossy('#bfe6ff', 0.05)}><planeGeometry args={[1.0, 0.45]} /></mesh>
      <mesh position={[-0.25, 1.05, 0.63]}><planeGeometry args={[1.9, 0.8]} /><meshStandardMaterial map={side} /></mesh>
      <mesh position={[-0.25, 1.05, -0.63]} rotation={[0, Math.PI, 0]}><planeGeometry args={[1.9, 0.8]} /><meshStandardMaterial map={side} /></mesh>
      <group ref={wheels}>
        {[[-0.9, 0.62], [-0.9, -0.62], [1.15, 0.62], [1.15, -0.62]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.3, z]} rotation={[Math.PI / 2, 0, 0]} material={std('#1d1f2b', 0.8)} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 18]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ Crates */
export function Crate({ position = [0, 0, 0] as V3, color = '#2163e0', scale = 1, rotationY = 0 }: { position?: V3; color?: string; scale?: number; rotationY?: number }) {
  return (
    <group position={position} scale={scale} rotation={[0, rotationY, 0]}>
      <RoundedBox args={[0.6, 0.42, 0.42]} radius={0.04} position={[0, 0.21, 0]} material={std(color, 0.55)} castShadow receiveShadow />
      <mesh position={[0, 0.24, 0.212]} material={std('#ffffff', 0.5)}><planeGeometry args={[0.44, 0.1]} /></mesh>
      <mesh position={[0, 0.24, -0.212]} rotation={[0, Math.PI, 0]} material={std('#ffffff', 0.5)}><planeGeometry args={[0.44, 0.1]} /></mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ Studio pieces */
export function SharkChair({ position = [0, 0, 0] as V3, rotationY = 0, color = '#1b2340' }: { position?: V3; rotationY?: number; color?: string }) {
  const leather = glossy(color, 0.35);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.06, 0]} material={glossy('#c9ced8', 0.2)}><cylinderGeometry args={[0.32, 0.36, 0.06, 20]} /></mesh>
      <mesh position={[0, 0.25, 0]} material={glossy('#c9ced8', 0.2)}><cylinderGeometry args={[0.04, 0.04, 0.38, 10]} /></mesh>
      <RoundedBox args={[0.62, 0.14, 0.58]} radius={0.06} position={[0, 0.48, 0]} material={leather} castShadow />
      <RoundedBox args={[0.62, 0.78, 0.14]} radius={0.06} position={[0, 0.88, -0.24]} rotation={[-0.08, 0, 0]} material={leather} castShadow />
      {[-0.33, 0.33].map((x) => (
        <RoundedBox key={x} args={[0.08, 0.16, 0.48]} radius={0.03} position={[x, 0.62, 0]} material={leather} />
      ))}
    </group>
  );
}

export function Podium({ position = [0, 0, 0] as V3, h = 0.5, r = 1, color = '#ffffff', top = '#ffa514' }: { position?: V3; h?: number; r?: number; color?: string; top?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow material={std(color, 0.45)}><cylinderGeometry args={[r, r * 1.05, h, 40]} /></mesh>
      <mesh position={[0, h + 0.015, 0]} receiveShadow material={glossy(top, 0.3)}><cylinderGeometry args={[r * 0.98, r * 0.98, 0.03, 40]} /></mesh>
    </group>
  );
}

export function SpotCone({ position = [0, 4, 0] as V3, color = '#fff2c4', target = [0, 0, 0] as V3, opacity = 0.12 }: { position?: V3; color?: string; target?: V3; opacity?: number }) {
  const dir = new THREE.Vector3(...target).sub(new THREE.Vector3(...position));
  const len = dir.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.normalize());
  return (
    <mesh position={new THREE.Vector3(...position).add(new THREE.Vector3(...target)).multiplyScalar(0.5)} quaternion={q}>
      <coneGeometry args={[len * 0.32, len, 32, 1, true]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ Competitor props (K-Matrix) */
export function GolaCart({ position = [0, 0, 0] as V3, rotationY = 0 }: { position?: V3; rotationY?: number }) {
  const sign = useMemo(() => signTexture({ title: 'ICE GOLA', bg: '#ffd23f', fg: '#c01f55', accent: '#c01f55', w: 1024, h: 260, titleSize: 150 }), []);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <RoundedBox args={[1.3, 0.7, 0.8]} radius={0.05} position={[0, 0.75, 0]} material={std('#7cc22b', 0.6)} castShadow />
      <mesh position={[0, 0.75, 0.405]}><planeGeometry args={[1.1, 0.3]} /><meshStandardMaterial map={sign} /></mesh>
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.3, 0.42]} rotation={[0, Math.PI / 2, 0]} material={std('#1d1f2b', 0.8)} castShadow><torusGeometry args={[0.24, 0.05, 10, 22]} /></mesh>
      ))}
      {/* ice block + bottles */}
      <RoundedBox args={[0.45, 0.32, 0.4]} radius={0.05} position={[-0.25, 1.26, 0]} material={glossy('#dff4ff', 0.05)} />
      {['#e2336c', '#ffa514', '#4a8bf5', '#7cc22b'].map((c, i) => (
        <mesh key={c} position={[0.18 + i * 0.12, 1.25, 0.1]} material={glossy(c, 0.15)}><cylinderGeometry args={[0.04, 0.045, 0.3, 10]} /></mesh>
      ))}
      {/* gola */}
      <group position={[0.2, 1.1, -0.2]}>
        <mesh position={[0, 0.25, 0]} material={std('#ff5fa8', 0.7)}><icosahedronGeometry args={[0.12, 2]} /></mesh>
        <mesh position={[0, 0.08, 0]} material={std('#e7b27c', 0.7)}><cylinderGeometry args={[0.01, 0.01, 0.25, 6]} /></mesh>
      </group>
    </group>
  );
}

export function IceCreamCone({ position = [0, 0, 0] as V3, scale = 1 }: { position?: V3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.35, 0]} rotation={[Math.PI, 0, 0]} castShadow material={std('#d9973f', 0.8)}><coneGeometry args={[0.22, 0.7, 20]} /></mesh>
      <mesh position={[0, 0.78, 0]} castShadow material={glossy('#fff0f5', 0.4)}><sphereGeometry args={[0.25, 24, 18]} /></mesh>
      <mesh position={[0, 1.05, 0]} castShadow material={glossy('#ff9ec4', 0.4)}><sphereGeometry args={[0.21, 24, 18]} /></mesh>
      <mesh position={[0, 1.3, 0]} material={glossy('#c01f55', 0.2)}><sphereGeometry args={[0.06, 12, 10]} /></mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ Framed original POA image */
export function PhotoFrame({ src, position = [0, 0, 0] as V3, rotationY = 0, w = 1.6, aspect = 1, onClick, frame = '#ffffff', stand = true }: { src: string; position?: V3; rotationY?: number; w?: number; aspect?: number; onClick?: () => void; frame?: string; stand?: boolean }) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  const h = w / aspect;
  return (
    <group position={position} rotation={[0, rotationY, 0]} onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}>
      {stand && (
        <>
          <mesh position={[-w * 0.3, h / 2 + 0.25, -0.15]} rotation={[0.18, 0, 0]} material={std('#c47a3f', 0.8)} castShadow><boxGeometry args={[0.07, h + 0.6, 0.07]} /></mesh>
          <mesh position={[w * 0.3, h / 2 + 0.25, -0.15]} rotation={[0.18, 0, 0]} material={std('#c47a3f', 0.8)} castShadow><boxGeometry args={[0.07, h + 0.6, 0.07]} /></mesh>
        </>
      )}
      <group position={[0, stand ? h / 2 + 0.55 : 0, 0]} rotation={[stand ? -0.08 : 0, 0, 0]}>
        <RoundedBox args={[w + 0.14, h + 0.14, 0.06]} radius={0.04} material={std(frame, 0.4)} castShadow />
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={tex} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ Interactive hotspot (DOM marker in 3D) */
export function Hotspot({ position, label, done = false, onClick, color = '#2163e0', active = false, small = false, hideLabel = false }: { position: V3; label: string; done?: boolean; onClick: () => void; color?: string; active?: boolean; small?: boolean; hideLabel?: boolean }) {
  return (
    <Html position={position} center zIndexRange={[20, 0]} style={{ pointerEvents: 'auto' }}>
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="group flex flex-col items-center gap-1 outline-none"
        aria-label={label}
      >
        <span
          className={`relative flex items-center justify-center rounded-full border-[3px] border-white shadow-lg transition ${small ? 'size-8' : 'size-11'} ${active ? 'scale-125' : 'group-hover:scale-110'}`}
          style={{ background: done ? '#7cc22b' : color }}
        >
          {!done && <span className="absolute inset-0 animate-ping rounded-full opacity-40" style={{ background: color }} />}
          <span className="relative text-white">{done ? <Check className={small ? 'size-4' : 'size-5'} strokeWidth={3.2} /> : <IcePopIcon className={small ? 'size-4.5' : 'size-6'} strokeWidth={2.4} />}</span>
        </span>
        {!hideLabel && (
          <span className="whitespace-nowrap rounded-full bg-white/95 px-2.5 py-0.5 font-display text-[12px] font-bold text-ink shadow">{label}</span>
        )}
      </button>
    </Html>
  );
}

/* ------------------------------------------------------------------ Lantern (Reflection garden) */
export function Lantern({ position = [0, 0, 0] as V3, lit = false, color = '#ffa514', onClick }: { position?: V3; lit?: boolean; color?: string; onClick?: () => void }) {
  const glow = useRef<THREE.Mesh>(null);
  useFrame((st) => {
    if (glow.current) {
      const m = glow.current.material as THREE.MeshStandardMaterial;
      const target = lit ? 2.4 + Math.sin(st.clock.elapsedTime * 3) * 0.3 : 0.05;
      m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, target, 0.08);
    }
  });
  return (
    <group position={position} onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}>
      <mesh position={[0, 0.9, 0]} material={glossy('#3a2a20', 0.4)} castShadow><cylinderGeometry args={[0.04, 0.06, 1.8, 8]} /></mesh>
      <mesh position={[0, 1.85, 0]} material={glossy('#3a2a20', 0.4)}><torusGeometry args={[0.12, 0.02, 8, 16]} /></mesh>
      <mesh ref={glow} position={[0, 2.15, 0]} castShadow>
        <sphereGeometry args={[0.28, 24, 18]} />
        <meshStandardMaterial color={lit ? color : '#d6d9e6'} emissive={color} emissiveIntensity={0.05} roughness={0.35} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, 2.46, 0]} material={glossy('#3a2a20', 0.4)}><coneGeometry args={[0.18, 0.14, 16]} /></mesh>
      {lit && <pointLight position={[0, 2.15, 0]} intensity={6} distance={5} color={color} />}
    </group>
  );
}

/* ------------------------------------------------------------------ Coins */
export function CoinStack({ position = [0, 0, 0] as V3, n = 5 }: { position?: V3; n?: number }) {
  return (
    <group position={position}>
      {[...Array(n)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i) * 0.015, 0.03 + i * 0.055, 0]} material={glossy('#ffc53d', 0.25)} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.05, 24]} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ Pop confetti (celebration burst of tiny ice pops) */
export function PopConfetti({ position = [0, 0, 0] as V3, count = 24, spread = 2, height = 2 }: { position?: V3; count?: number; spread?: number; height?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const items = useMemo(() => [...Array(count)].map((_, i) => ({
    x: (Math.random() - 0.5) * spread, z: (Math.random() - 0.5) * spread, y: Math.random() * height, s: 0.6 + Math.random() * 0.6, r: Math.random() * 6, v: 0.25 + Math.random() * 0.35, c: FLAVOURS[i % FLAVOURS.length].color,
  })), [count, spread, height]);
  useLayoutEffect(() => {
    items.forEach((it, i) => ref.current?.setColorAt(i, new THREE.Color(it.c)));
    if (ref.current?.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [items]);
  useFrame((st, dt) => {
    if (!ref.current) return;
    const o = new THREE.Object3D();
    const t = st.clock.elapsedTime;
    items.forEach((it, i) => {
      it.y += it.v * dt;
      if (it.y > height) it.y = 0;
      o.position.set(it.x + Math.sin(t + it.r) * 0.1, it.y, it.z);
      o.rotation.set(Math.sin(t * 2 + it.r) * 0.6, t + it.r, Math.cos(t * 1.5 + it.r) * 0.6);
      const fade = Math.sin((it.y / height) * Math.PI);
      o.scale.setScalar(it.s * fade);
      o.updateMatrix();
      ref.current!.setMatrixAt(i, o.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} position={position}>
      <capsuleGeometry args={[0.035, 0.12, 4, 8]} />
      <meshStandardMaterial roughness={0.3} emissive="#ffffff" emissiveIntensity={0.15} />
    </instancedMesh>
  );
}
