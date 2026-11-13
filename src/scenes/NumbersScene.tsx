import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { SkyDome, Clouds, Island, Water, PalmTree, Bush, Meadow, Sign, CoinStack, Crate, PhotoFrame, PopConfetti, Hotspot } from '../three/props';
import { Person, LOOKS } from '../three/Person';
import { Roo } from '../three/Roo';
import { Lights, useShot, CamLimits } from '../three/Stage';
import { std, glossy } from '../three/materials';
import { useScene, useSceneData } from '../game/store';
import { NUMBERS } from '../content/poa';

const SHOTS: Record<string, [[number, number, number], [number, number, number]]> = {
  's5-deal': [[-5, 3.6, 6.5], [-5, 1.4, 0]],
  's5-revenue': [[2.2, 4.6, 9.5], [2.2, 2, 0]],
  's5-profit': [[-1.5, 3, 7.5], [-1.5, 1, 2.5]],
  's5-funding': [[6.5, 3.6, 6], [6.5, 1.2, -1.5]],
};

export default function NumbersScene() {
  const activity = useSceneData<string>('activity', 's5-deal');
  const tilt = useSceneData<number>('scaleTilt', 0);
  const revealed = useSceneData<number>('revealed', 1);
  const funding = useSceneData<number>('funding', 0);
  const profit = useSceneData<{ kind: 'profit' | 'loss' | 'even'; n: number } | null>('profit', null);
  const setFocus = useScene((s) => s.setFocus);
  const s = SHOTS[activity] ?? SHOTS['s5-deal'];
  useShot(s[0], s[1], activity);
  return (
    <>
      <SkyDome top="#ff9a4a" mid="#ffd2a8" bottom="#fff4dc" k="numbers" />
      <Lights sun={[6, 15, 8]} intensity={2.5} shadowSize={12} fogColor="#ffe8d0" fogNear={28} fogFar={70} />
      <CamLimits min={3.5} max={22} maxPolar={1.35} />
      <Clouds count={6} radius={34} y={12} />
      <Water radius={70} />
      <Island radius={10.5} sand="#ffe0a3" depth={2.4}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.115, 0]} receiveShadow material={std('#fff3df', 0.85)}><circleGeometry args={[8.6, 56]} /></mesh>
        <Meadow radius={10.3} inner={8.7} count={160} />
        {/* A. deal scale */}
        <DealScale tilt={tilt} />
        {/* B. revenue towers (crates) */}
        <group position={[2.2, 0.12, 0]}>
          {NUMBERS.growth.rows.map((r, i) => {
            const shown = i < revealed;
            const crates = Math.round(r.crore / 1.25);
            return (
              <group key={r.fy} position={[(i - 1.5) * 1.15, 0, 0]}>
                {shown && [...Array(Math.max(1, crates))].map((_, k) => (
                  <Crate key={k} position={[0, k * 0.42 * 0.62, 0]} scale={0.62 * 1.1} color={i === 3 ? '#e2336c' : '#f56d14'} rotationY={(k % 3) * 0.05} />
                ))}
                <Sign position={[0, 0, 0.75]} title={r.fy} body={shown ? `≈ ₹${r.crore} cr` : '?'} w={0.95} h={0.5} post={false} bg={shown ? (i === 3 ? '#e2336c' : '#f56d14') : '#ffffff'} fg={shown ? '#ffffff' : '#13317a'} accent="#ffffff" />
              </group>
            );
          })}
          <Sign position={[0, 0, -1.2]} title="Reported Revenue" body="Approximately, in ₹ crore" w={2.6} h={0.75} />
        </group>
        {/* C. revenue ≠ profit stall */}
        <group position={[-1.5, 0.12, 3.2]}>
          <RoundedBox args={[1.8, 0.9, 0.7]} radius={0.06} position={[0, 0.45, 0]} material={std('#ffffff', 0.5)} castShadow />
          <Sign position={[0, 0.9, 0]} title="Practice Stall" body="Revenue − Expenses = Profit" w={1.8} h={0.6} post={false} bg="#2163e0" fg="#ffffff" />
          <CoinStack position={[-0.5, 0.9, 0.1]} n={profit?.kind === 'profit' ? 7 : 3} />
          <Person look={LOOKS.seller} pose={profit ? (profit.kind === 'loss' ? 'sad' : profit.kind === 'even' ? 'think' : 'cheer') : 'idle'} mood={profit?.kind === 'loss' ? 'sad' : 'happy'} position={[0.5, 0, -0.75]} />
          {profit?.kind === 'profit' && <PopConfetti position={[0, 0.4, 0]} count={14} spread={2} height={2.6} />}
        </group>
        {/* D. funding journey pads */}
        <group position={[6.5, 0.12, -1.5]}>
          {NUMBERS.funding.steps.map((st, i) => (
            <group key={st} position={[(i - 0.5) * 2.2, 0, 0]}>
              <mesh position={[0, 0.1, 0]} receiveShadow castShadow material={glossy(i < funding ? '#7cc22b' : '#d9e8ff', 0.3)}><cylinderGeometry args={[0.8, 0.85, 0.2, 32]} /></mesh>
              <Sign position={[0, 0.2, -0.3]} title={i === 0 ? 'Shark Tank India' : '2024'} body={i < funding ? st : 'Tap to unlock'} w={1.6} h={0.9} bg={i < funding ? '#7cc22b' : '#ffffff'} fg={i < funding ? '#ffffff' : '#13317a'} />
              {activity === 's5-funding' && i === funding && <Hotspot position={[0, 2.4, 0]} label="Unlock" color="#7cc22b" onClick={() => setFocus(`fund:${i}:${Date.now()}`)} small />}
            </group>
          ))}
          <PhotoFrame src={NUMBERS.funding.image.src} w={2} aspect={942 / 535} position={[0, 0, -1.6]} />
          <group position={[-2.4, 0, 0.6]}><Roo pose={funding >= 2 ? 'cheer' : 'point'} scale={0.85} /></group>
        </group>
        <PalmTree position={[-9.5, 0.1, -2]} />
        <PalmTree position={[9.6, 0.1, 3.6]} lean={-0.1} />
        <Bush position={[-8.5, 0.1, 4]} />
      </Island>
    </>
  );
}

function DealScale({ tilt }: { tilt: number }) {
  const beam = useRef<THREE.Group>(null);
  const panL = useRef<THREE.Group>(null);
  const panR = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!beam.current) return;
    beam.current.rotation.z = THREE.MathUtils.lerp(beam.current.rotation.z, tilt * 0.22, 0.06);
    const r = beam.current.rotation.z;
    panL.current && (panL.current.rotation.z = -r);
    panR.current && (panR.current.rotation.z = -r);
  });
  return (
    <group position={[-5, 0.12, 0]}>
      <mesh position={[0, 1.2, 0]} castShadow material={glossy('#13317a', 0.3)}><cylinderGeometry args={[0.08, 0.14, 2.4, 14]} /></mesh>
      <mesh position={[0, 0.06, 0]} material={glossy('#13317a', 0.3)}><cylinderGeometry args={[0.6, 0.7, 0.12, 24]} /></mesh>
      <group ref={beam} position={[0, 2.4, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={glossy('#ffc53d', 0.25)}><cylinderGeometry args={[0.06, 0.06, 3.4, 12]} /></mesh>
        {[-1, 1].map((s) => (
          <group key={s} ref={s < 0 ? panL : panR} position={[s * 1.6, 0, 0]}>
            <mesh position={[0, -0.45, 0]} material={std('#9aa3b5', 0.4, 0.6)}><cylinderGeometry args={[0.01, 0.01, 0.9, 6]} /></mesh>
            <mesh position={[0, -0.92, 0]} castShadow material={glossy('#ffc53d', 0.25)}><cylinderGeometry args={[0.55, 0.4, 0.1, 24]} /></mesh>
            <CoinStack position={[0, -0.87, 0]} n={s < 0 ? 3 : 7} />
            <Sign position={[0, -2.15, 0.2]} title={s < 0 ? '₹45 lakh' : '₹1 crore'} body={s < 0 ? 'Original ask · 5%' : 'Final deal · 15%'} w={1.3} h={0.6} post={false} bg={s < 0 ? '#ffffff' : '#ffa514'} fg="#13317a" />
          </group>
        ))}
      </group>
    </group>
  );
}
