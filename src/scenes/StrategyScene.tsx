import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { SkyDome, Clouds, Island, Water, PalmTree, Bush, Meadow, Hotspot, Sign, Rock, Flag, PopConfetti } from '../three/props';
import { IcePop } from '../three/IcePop';
import { Roo } from '../three/Roo';
import { Lights, useShot, CamLimits } from '../three/Stage';
import { std, glossy, FLAVOURS } from '../three/materials';
import { signTexture } from '../three/textures';
import { useScene, useSceneData } from '../game/store';
import { BMC, SWOT, type SwotKey } from '../content/poa';

const BMC_COLORS = ['#e2336c', '#ffa514', '#2163e0', '#f056a8', '#7cc22b', '#4a8bf5', '#ff8a3d', '#9ad94a', '#7a3522'];
export const SWOT_META: Record<SwotKey, { color: string; pos: [number, number, number] }> = {
  S: { color: '#ffa514', pos: [3.2, 0, -2.6] },
  W: { color: '#4a8bf5', pos: [7.6, 0, -2.6] },
  O: { color: '#7cc22b', pos: [3.2, 0, 2.2] },
  T: { color: '#7a3522', pos: [7.6, 0, 2.2] },
};
const BOARD: [number, number, number] = [-4.2, 0, 0];

export default function StrategyScene() {
  const activity = useSceneData<string>('activity', 's3-bmc');
  const placed = useSceneData<string[]>('bmcPlaced', []);
  const swot = useSceneData<Record<SwotKey, number>>('swotPlaced', { S: 0, W: 0, O: 0, T: 0 });
  const wrong = useSceneData<{ id: string; n: number } | null>('wrong', null);
  const setFocus = useScene((s) => s.setFocus);

  const shot = activity === 's3-bmc'
    ? { pos: [-4.2, 7.4, 6.4] as [number, number, number], look: [-4.2, 0.4, 0.2] as [number, number, number] }
    : activity === 's3-swot'
      ? { pos: [5.4, 7.4, 8.2] as [number, number, number], look: [5.4, 0.4, -0.2] as [number, number, number] }
      : { pos: [0.6, 3.2, 6.4] as [number, number, number], look: [0, 1.2, 0] as [number, number, number] };
  useShot(shot.pos, shot.look, activity);

  return (
    <>
      <SkyDome top="#59c2ff" mid="#c4ecff" bottom="#f4ffe0" k="lab" />
      <Lights sun={[6, 15, 8]} intensity={2.5} shadowSize={12} fogColor="#dcf3ff" fogNear={30} fogFar={70} />
      <CamLimits min={4} max={22} maxPolar={1.32} />
      <Clouds count={6} radius={34} y={12} />
      <Water radius={70} color="#56cdf0" />
      <Island radius={10.5} sand="#ffe6b0" top="#a6e06a" depth={2.4}>
        <Meadow radius={10} inner={0} count={240} avoid={[[-4.2, 0, 3.4], [5.4, -0.2, 4.4], [0, 0, 1.2]]} />
        {/* BMC board */}
        <group position={BOARD}>
          <RoundedBox args={[5.6, 0.2, 5.6]} radius={0.08} position={[0, 0.1, 0]} material={glossy('#ffffff', 0.4)} receiveShadow castShadow />
          <Sign title="Business Model Canvas" w={3.4} h={0.55} position={[0, 0.1, -3.1]} bg="#13317a" fg="#ffffff" accent="#7cc22b" post={false} />
          {BMC.elements.map((e, i) => (
            <BmcSlot key={e.id} i={i} id={e.id} name={e.element} filled={placed.includes(e.id)} shaking={wrong?.id === e.id ? wrong.n : 0}
              onClick={activity === 's3-bmc' ? () => setFocus(`slot:${e.id}:${Date.now()}`) : undefined} />
          ))}
        </group>
        {/* SWOT islands */}
        {SWOT.quadrants.map((q) => (
          <SwotIsland key={q.key} k={q.key} title={q.title} count={swot[q.key] ?? 0} active={activity === 's3-swot'}
            onClick={() => setFocus(`swot:${q.key}:${Date.now()}`)} shaking={wrong?.id === q.key ? wrong.n : 0} />
        ))}
        {/* thinking corner */}
        <group position={[0, 0.1, 1.2]} rotation={[0, 0.3, 0]}>
          <Roo pose={activity === 's3-brainstorm' ? 'think' : 'point'} scale={1} />
          {activity === 's3-brainstorm' && <Bulb />}
        </group>
        <PalmTree position={[-9, 0.1, -3]} />
        <PalmTree position={[-8.6, 0.1, 4.4]} scale={0.9} lean={-0.1} />
        <PalmTree position={[9.4, 0.1, 5]} scale={1.05} />
        <Bush position={[0, 0.1, -4.2]} />
        <Bush position={[-0.8, 0.1, 4.8]} berries="#ffa514" />
        <Rock position={[1.2, 0.05, 6.8]} />
      </Island>
    </>
  );
}

function BmcSlot({ i, id, name, filled, onClick, shaking }: { i: number; id: string; name: string; filled: boolean; onClick?: () => void; shaking: number }) {
  const x = -1.75 + (i % 3) * 1.75;
  const z = -1.75 + Math.floor(i / 3) * 1.75;
  const block = useRef<THREE.Group>(null);
  const shake = useRef(0);
  const lastShake = useRef(0);
  const tex = useMemo(() => signTexture({ title: name, bg: filled ? BMC_COLORS[i] : '#eef5ff', fg: filled ? '#ffffff' : '#13317a', accent: filled ? '#ffffff' : BMC_COLORS[i], w: 512, h: 512, titleSize: 78 }), [name, filled, i]);
  useFrame((_, dt) => {
    if (!block.current) return;
    if (shaking && shaking !== lastShake.current) { lastShake.current = shaking; shake.current = 0.5; }
    shake.current = Math.max(0, shake.current - dt);
    const targetY = filled ? 0.55 : 0.12;
    block.current.position.y = THREE.MathUtils.lerp(block.current.position.y, targetY, 0.12);
    block.current.position.x = x + Math.sin(shake.current * 60) * shake.current * 0.15;
  });
  return (
    <group>
      <group ref={block} position={[x, 0.12, z]} onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
        onPointerOver={onClick ? () => (document.body.style.cursor = 'pointer') : undefined} onPointerOut={() => (document.body.style.cursor = '')}>
        <RoundedBox args={[1.5, filled ? 0.7 : 0.18, 1.5]} radius={0.08} position={[0, filled ? -0.2 : 0, 0]} material={std(filled ? BMC_COLORS[i] : '#d9e8ff', 0.45)} castShadow receiveShadow />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, filled ? 0.16 : 0.1, 0]}>
          <planeGeometry args={[1.38, 1.38]} />
          <meshStandardMaterial map={tex} roughness={0.5} />
        </mesh>
        {filled && <IcePop color={FLAVOURS[i % 6].color} length={0.45} position={[0.5, 0.15, -0.5]} rotation={[0, 0.4, 0.2]} />}
      </group>
      {onClick && !filled && <Hotspot position={[x, 0.9, z]} label={name} onClick={onClick} color={BMC_COLORS[i]} small hideLabel />}
    </group>
  );
}

function SwotIsland({ k, title, count, active, onClick, shaking }: { k: SwotKey; title: string; count: number; active: boolean; onClick: () => void; shaking: number }) {
  const m = SWOT_META[k];
  const g = useRef<THREE.Group>(null);
  const last = useRef(0);
  const s = useRef(0);
  useFrame((st, dt) => {
    if (!g.current) return;
    if (shaking && shaking !== last.current) { last.current = shaking; s.current = 0.5; }
    s.current = Math.max(0, s.current - dt);
    g.current.position.y = 0.05 + Math.sin(st.clock.elapsedTime * 1.2 + m.pos[0]) * 0.04;
    g.current.rotation.z = Math.sin(s.current * 50) * s.current * 0.12;
  });
  return (
    <group position={m.pos}>
      <group ref={g} onClick={active ? (e) => { e.stopPropagation(); onClick(); } : undefined}
        onPointerOver={active ? () => (document.body.style.cursor = 'pointer') : undefined} onPointerOut={() => (document.body.style.cursor = '')}>
        <mesh position={[0, 0.12, 0]} receiveShadow castShadow material={std(k === 'W' ? '#bfe6ff' : k === 'T' ? '#9aa3b5' : '#c3ec8f', 0.85)}>
          <cylinderGeometry args={[1.9, 1.7, 0.24, 40]} />
        </mesh>
        <mesh position={[0, 0.245, 0]} rotation={[-Math.PI / 2, 0, 0]} material={std(m.color, 0.6)}>
          <ringGeometry args={[1.7, 1.9, 40]} />
        </mesh>
        <Sign title={title} w={1.5} h={0.42} position={[0, 0.2, 1.55]} bg={m.color} fg="#ffffff" accent="#ffffff" post={false} />
        {k === 'S' && (
          <group>
            <mesh position={[0, 2.3, -0.6]} material={std('#ffd23f', 0.3, 0, { emissive: '#ffb000', emissiveIntensity: 0.9 })}><sphereGeometry args={[0.45, 24, 18]} /></mesh>
            <mesh position={[-0.4, 0.55, -0.4]} material={std('#a86d3c', 0.9)} castShadow><coneGeometry args={[0.8, 0.9, 6]} /></mesh>
            <Flag position={[-0.4, 0.95, -0.4]} color="#ffa514" height={1.1} />
          </group>
        )}
        {k === 'W' && (
          <group>
            <mesh position={[0.2, 0.26, -0.3]} rotation={[-Math.PI / 2, 0, 0]} material={glossy('#ff5fa8', 0.1)}><circleGeometry args={[0.6, 24]} /></mesh>
            <IcePop color="#ff5fa8" length={0.8} position={[0.2, 0.3, -0.3]} rotation={[Math.PI / 2 - 0.15, 0, 0.6]} frozen={false} />
            <mesh position={[-0.7, 0.75, -0.6]} material={std('#ffffff', 0.9)}><icosahedronGeometry args={[0.35, 1]} /></mesh>
          </group>
        )}
        {k === 'O' && (
          <group>
            <mesh position={[0.5, 0.3, -0.4]} rotation={[0, 0.5, 0]} material={std('#2163e0', 0.5)} castShadow><boxGeometry args={[0.8, 0.22, 0.36]} /></mesh>
            <mesh position={[0.5, 0.7, -0.4]} material={std('#ffffff', 0.6, 0, { side: THREE.DoubleSide })}><coneGeometry args={[0.32, 0.6, 3, 1, true]} /></mesh>
            <mesh position={[-0.6, 0.3, -0.2]} rotation={[0, 0, -0.5]} material={std('#7cc22b', 0.5)}><coneGeometry args={[0.18, 0.5, 3]} /></mesh>
          </group>
        )}
        {k === 'T' && <Storm />}
        {/* planted pops = points sorted here */}
        {[...Array(count)].map((_, i) => {
          const a = (i / 4) * Math.PI + 0.3;
          return <IcePop key={i} color={FLAVOURS[i % 6].color} length={0.5} position={[Math.cos(a) * 1.15, 0.24, Math.sin(a) * 0.9 + 0.2]} />;
        })}
        {count === 4 && <PopConfetti position={[0, 0.3, 0]} count={14} spread={2.6} height={2} />}
      </group>
      {active && <Hotspot position={[0, 2.2, 0.6]} label={`${title} (${count}/4)`} onClick={onClick} color={m.color} done={count === 4} />}
    </group>
  );
}

function Storm() {
  const rain = useRef<THREE.InstancedMesh>(null);
  const drops = useMemo(() => [...Array(40)].map(() => ({ x: (Math.random() - 0.5) * 1.8, z: (Math.random() - 0.5) * 1.2, y: Math.random() * 1.8 })), []);
  useFrame((_, dt) => {
    if (!rain.current) return;
    const o = new THREE.Object3D();
    drops.forEach((d, i) => {
      d.y -= dt * 3;
      if (d.y < 0.3) d.y = 2.1;
      o.position.set(d.x, d.y, d.z - 0.3);
      o.updateMatrix();
      rain.current!.setMatrixAt(i, o.matrix);
    });
    rain.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group>
      {[[-0.4, 2.3, -0.3, 0.5], [0.3, 2.4, -0.3, 0.6], [0, 2.6, -0.4, 0.5]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} material={std('#6b7287', 0.9)}><icosahedronGeometry args={[r, 1]} /></mesh>
      ))}
      <instancedMesh ref={rain} args={[undefined, undefined, drops.length]}>
        <boxGeometry args={[0.02, 0.14, 0.02]} />
        <meshBasicMaterial color="#9fd7ff" />
      </instancedMesh>
    </group>
  );
}

function Bulb() {
  const g = useRef<THREE.Group>(null);
  useFrame((st) => { if (g.current) { g.current.position.y = 1.75 + Math.sin(st.clock.elapsedTime * 2) * 0.08; g.current.rotation.y += 0.02; } });
  return (
    <group ref={g} position={[0.3, 1.75, 0]}>
      <mesh material={std('#fff3b0', 0.2, 0, { emissive: '#ffd23f', emissiveIntensity: 1.6 })}><sphereGeometry args={[0.17, 20, 16]} /></mesh>
      <mesh position={[0, -0.2, 0]} material={glossy('#9aa3b5', 0.3)}><cylinderGeometry args={[0.08, 0.08, 0.12, 12]} /></mesh>
      <pointLight intensity={3} distance={3} color="#ffd23f" />
    </group>
  );
}
