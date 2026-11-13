import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { SkyDome, Clouds, Island, Water, PalmTree, Shop, SkippiStall, Van, Crate, CoinStack, GolaCart, Sign, Lamp, Bush, PopConfetti, Podium } from '../three/props';
import { Person, LOOKS, type Pose } from '../three/Person';
import { IcePop } from '../three/IcePop';
import { Roo } from '../three/Roo';
import { Lights, useShot, CamLimits } from '../three/Stage';
import { std, glossy, FLAVOURS } from '../three/materials';
import { useSceneData } from '../game/store';
import type { Scenario } from '../content/poa';

type Outcome = { ok: boolean; n: number } | null;

export default function StreetScene() {
  const stage = useSceneData<Scenario['stage']>('stage', 'customer');
  const outcome = useSceneData<Outcome>('outcome', null);
  const ok = outcome?.ok;
  const react: Pose | null = outcome ? (ok ? 'cheer' : 'sad') : null;
  const mood = outcome ? (ok ? 'happy' : 'sad') : 'neutral';
  useShot([1.2, 3, 8.2], [0.4, 1.1, 0], stage);
  const winter = stage === 'winter';
  return (
    <>
      <SkyDome top={winter ? '#9fb7d6' : '#ffa85c'} mid={winter ? '#dfe9f5' : '#ffd8b0'} bottom="#fff6e6" k={'street' + winter} />
      <Lights sun={[6, 14, 8]} intensity={winter ? 1.6 : 2.5} shadowSize={11} fogColor={winter ? '#e8eef6' : '#ffe9d6'} fogNear={24} fogFar={65} />
      <CamLimits min={3} max={18} maxPolar={1.35} />
      <Clouds count={winter ? 10 : 5} radius={32} y={11} />
      <Water radius={70} />
      <Island radius={9.5} sand="#ffe0a3" top={winter ? '#e9f2fa' : '#8fd14f'} depth={2.2}>
        {/* street */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.115, 1.4]} receiveShadow material={std('#c9ced8', 0.9)}><planeGeometry args={[18, 2.6]} /></mesh>
        {[-6, -3, 0, 3, 6].map((x) => <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.12, 1.4]} material={std('#ffffff', 0.8)}><planeGeometry args={[1.2, 0.12]} /></mesh>)}
        <SkippiStall position={[0, 0.1, -1.5]} />
        <Person look={LOOKS.seller} pose={react ?? 'talk'} mood={mood} position={[0, 0.1, -2.35]} />
        <Shop position={[-4.6, 0.1, -2.6]} rotationY={0.35} stocked={stage !== 'shopkeeper' && stage !== 'online'} open={stage !== 'online' || !!ok} />
        <Lamp position={[3.2, 0.1, -0.2]} on={winter} />
        <group position={[-2.6, 0.1, 0.4]} rotation={[0, 0.5, 0]}><Roo pose={outcome ? (ok ? 'cheer' : 'think') : 'idle'} scale={0.85} /></group>
        <StageProps stage={stage} react={react} mood={mood} ok={!!ok} />
        {ok && <PopConfetti position={[0, 0.2, 0.6]} count={40} spread={6} height={4} />}
        {outcome && !ok && <RainCloud />}
        {winter && <Snow />}
        <PalmTree position={[-8.2, 0.1, -1]} />
        <PalmTree position={[8.2, 0.1, -2]} lean={-0.12} />
        <Bush position={[5.4, 0.1, -3.6]} />
      </Island>
    </>
  );
}

function StageProps({ stage, react, mood, ok }: { stage: Scenario['stage']; react: Pose | null; mood: 'happy' | 'sad' | 'neutral'; ok: boolean }) {
  const P = (look: keyof typeof LOOKS, pose: Pose, pos: [number, number, number]) => <Person look={LOOKS[look]} pose={react ?? pose} mood={mood} position={pos} />;
  switch (stage) {
    case 'customer':
      return <>{P('kid1', 'talk', [0.6, 0.1, 1.2])}{P('kid2', 'idle', [-0.4, 0.1, 1.5])}<IcePop color="#ffb000" flavour="Mango" length={2} scale={1.2} position={[2, 0.1, 0.2]} /></>;
    case 'packaging':
      return <>{P('kid3', 'sad', [0.5, 0.1, 1.3])}{P('kid2', 'think', [-0.4, 0.1, 1.4])}{FLAVOURS.map((f, i) => <IcePop key={f.id} color={ok ? f.color : '#c9ced8'} length={1} position={[1.6 + i * 0.25, 0.1, 0.3]} />)}</>;
    case 'winter':
      return <>{P('parent', 'think', [0.6, 0.1, 1.3])}<Sign position={[2.4, 0.1, 0.2]} title="WINTER" body="Sales are slow" w={1.5} h={0.7} bg="#4a8bf5" fg="#ffffff" /></>;
    case 'parent':
      return <>{P('parent', 'think', [0.6, 0.1, 1.2])}{P('kid2', 'idle', [-0.2, 0.1, 1.4])}</>;
    case 'shopkeeper':
      return <>{P('shopkeeper', 'think', [-3.6, 0.1, -0.6])}<Crate position={[-2.4, 0.1, -0.4]} color="#2163e0" /></>;
    case 'competitor':
      return <><GolaCart position={[2.8, 0.1, 0.1]} rotationY={-0.6} /><Sign position={[4, 0.1, 0.6]} title="LOWER PRICE" w={1.5} h={0.5} bg="#c01f55" fg="#ffffff" />{P('kid1', 'think', [1.2, 0.1, 1.4])}</>;
    case 'online':
      return <><group position={[2.6, 0.1, -0.2]}><RoundedBox args={[1, 1.8, 0.1]} radius={0.12} position={[0, 1.1, 0]} material={glossy('#1b2340', 0.2)} /><mesh position={[0, 1.1, 0.06]} material={std('#ff7cc0', 0.5)}><planeGeometry args={[0.86, 1.56]} /></mesh></group>{P('kid3', 'think', [0.8, 0.1, 1.3])}</>;
    case 'repeat':
      return <>{P('kid1', ok ? 'cheer' : 'walk', [1.6, 0.1, 1.6])}{P('parent', 'think', [0.4, 0.1, 1.2])}</>;
    case 'school':
      return <><Sign position={[2.8, 0.1, 0]} title="SCHOOL" body="Summer Event" w={1.8} h={0.8} bg="#ffa514" fg="#13317a" />{P('student2', 'talk', [1.2, 0.1, 1.2])}{P('student4', 'idle', [0.3, 0.1, 1.5])}</>;
    case 'city':
      return <><Van position={[3, 0.1, 1.4]} rotationY={Math.PI} moving={ok} /><Sign position={[5.4, 0.1, -0.6]} title="NEW CITY" body="→" w={1.4} h={0.6} bg="#7cc22b" fg="#ffffff" /></>;
    case 'inventory':
      return <>{[...Array(ok ? 4 : 12)].map((_, i) => <Crate key={i} position={[1.8 + (i % 4) * 0.62, 0.1 + Math.floor(i / 4) * 0.42, 0.3]} color={i % 2 ? '#2163e0' : '#ffa514'} />)}{P('distributor', 'think', [0.6, 0.1, 1.3])}</>;
    case 'losses':
      return <><CoinStack position={[2, 0.1, 0.4]} n={ok ? 8 : 2} /><Sign position={[3, 0.1, -0.2]} title="Revenue ≠ Profit" w={1.8} h={0.5} bg="#e2336c" fg="#ffffff" />{P('ravi', 'think', [0.8, 0.1, 1.2])}</>;
    case 'global':
      return <><Globe /><Sign position={[3.6, 0.1, 0.8]} title="GO GLOBAL?" w={1.5} h={0.5} bg="#2163e0" fg="#ffffff" />{P('anuja', 'think', [0.8, 0.1, 1.2])}</>;
    case 'distributor':
      return <><Van position={[3, 0.1, 1.4]} rotationY={Math.PI} />{[...Array(6)].map((_, i) => <Crate key={i} position={[1.4 + (i % 3) * 0.62, 0.1 + Math.floor(i / 3) * 0.42, 0.2]} />)}{P('distributor', 'sad', [0.4, 0.1, 1.3])}</>;
    case 'billion':
      return <><Podium position={[2.8, 0.1, 0.2]} h={0.4} r={0.9} top="#ffa514" /><mesh position={[2.8, 1.05, 0.2]} material={glossy('#ffc53d', 0.2)}><cylinderGeometry args={[0.35, 0.12, 0.6, 24]} /></mesh>{P('ravi', 'present', [0.8, 0.1, 1.2])}{P('anuja', 'idle', [-0.1, 0.1, 1.4])}</>;
  }
}

function Globe() {
  const g = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.6; });
  return (
    <group position={[2.6, 0.1, 0]}>
      <mesh ref={g} position={[0, 1.2, 0]} castShadow material={glossy('#4a8bf5', 0.3)}><icosahedronGeometry args={[0.7, 2]} /></mesh>
      <mesh position={[0, 0.25, 0]} material={glossy('#13317a', 0.3)}><cylinderGeometry args={[0.08, 0.3, 0.5, 14]} /></mesh>
    </group>
  );
}

function Snow() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const flakes = useMemo(() => [...Array(160)].map(() => ({ x: (Math.random() - 0.5) * 16, y: Math.random() * 8, z: (Math.random() - 0.5) * 10, s: 0.5 + Math.random() })), []);
  useFrame((st, dt) => {
    if (!ref.current) return;
    const o = new THREE.Object3D();
    flakes.forEach((f, i) => {
      f.y -= dt * 0.8 * f.s; if (f.y < 0) f.y = 8;
      o.position.set(f.x + Math.sin(st.clock.elapsedTime + i) * 0.2, f.y, f.z); o.scale.setScalar(f.s); o.updateMatrix(); ref.current!.setMatrixAt(i, o.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={ref} args={[undefined, undefined, flakes.length]}><sphereGeometry args={[0.04, 6, 4]} /><meshBasicMaterial color="#ffffff" /></instancedMesh>;
}

function RainCloud() {
  const g = useRef<THREE.Group>(null);
  useFrame((st) => { if (g.current) g.current.position.x = Math.sin(st.clock.elapsedTime * 0.8) * 0.4; });
  return (
    <group ref={g} position={[0, 4.2, 0.6]}>
      {[[-0.5, 0, 0, 0.55], [0.3, 0.1, 0, 0.65], [0, 0.35, 0, 0.5]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} material={std('#7c8399', 0.9)}><icosahedronGeometry args={[r, 1]} /></mesh>)}
    </group>
  );
}
