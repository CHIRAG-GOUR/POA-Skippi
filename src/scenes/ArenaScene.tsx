import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { SkyDome, Clouds, Island, Water, PalmTree, Meadow, Podium, GolaCart, IceCreamCone, SpotCone, Sign, PopConfetti } from '../three/props';
import { Person, LOOKS } from '../three/Person';
import { IcePop } from '../three/IcePop';
import { Lights, useShot, CamLimits } from '../three/Stage';
import { glossy, FLAVOURS } from '../three/materials';
import { signTexture } from '../three/textures';
import { useSceneData } from '../game/store';
import { KMATRIX } from '../content/poa';

const COL = ['#2163e0', '#7cc22b', '#e2336c'];
export default function ArenaScene() {
  const row = useSceneData<number>('row', 0);
  const cells = useSceneData<string[] | null>('rowCells', null);
  const solved = useSceneData<boolean>('solved', false);
  const activity = useSceneData<string>('activity', 's7-matrix');
  useShot(activity === 's7-discuss' ? [3.4, 2.4, 6] : [0, 4.2, 9.5], activity === 's7-discuss' ? [0, 1.3, 1] : [0, 1.5, 0], activity);
  return (
    <>
      <SkyDome top="#4a8bf5" mid="#bcd6ff" bottom="#fff3df" k="arena" />
      <Lights sun={[6, 15, 8]} intensity={2.4} shadowSize={11} fogColor="#e1ecff" fogNear={26} fogFar={70} />
      <CamLimits min={3} max={20} maxPolar={1.35} />
      <Clouds count={6} radius={34} y={12} />
      <Water radius={70} />
      <Island radius={9} sand="#ffe0a3" depth={2.2}>
        <Meadow radius={8.6} inner={5} count={180} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.115, 0]} receiveShadow material={glossy('#eef5ff', 0.5)}><circleGeometry args={[5, 48]} /></mesh>
        <Sign position={[0, 0.1, -3.4]} title={KMATRIX.rows[row]?.feature ?? 'K-Matrix'} w={4.6} h={0.7} bg="#13317a" fg="#ffffff" accent="#ffa514" />
        {KMATRIX.competitors.map((c, i) => (
          <group key={c} position={[(i - 1) * 3, 0.1, 0]}>
            <Podium h={0.6 + (i === 0 ? 0.2 : 0)} r={1} top={COL[i]} />
            <group position={[0, i === 0 ? 0.8 : 0.6, 0]}>
              {i === 0 && FLAVOURS.slice(0, 4).map((f, k) => <IcePop key={f.id} color={f.color} flavour={f.name} length={1.3} position={[-0.45 + k * 0.3, 0, 0]} rotation={[0, 0, (k - 1.5) * 0.08]} />)}
              {i === 1 && <GolaCart position={[0, 0, 0]} rotationY={0.3} />}
              {i === 2 && <IceCreamCone scale={1.2} />}
            </group>
            <Sign position={[0, 0, 1.25]} title={c} w={2.4} h={0.5} post={false} bg={COL[i]} fg="#ffffff" accent="#ffffff" />
            <CellBadge value={cells ? cells[i] : '…'} position={[0, 3.2, 0]} color={COL[i]} />
          </group>
        ))}
        {solved && <PopConfetti position={[0, 0.3, 0]} count={40} spread={8} height={4} />}
        <SpotCone position={[0, 6, 2]} target={[0, 0, 0]} opacity={0.06} />
        <Person look={LOOKS.kid3} pose={activity === 's7-discuss' ? 'think' : solved ? 'cheer' : 'point'} position={[-1.4, 0.1, 2.8]} />
        <Person look={LOOKS.parent} pose={activity === 's7-discuss' ? 'talk' : 'idle'} position={[1.4, 0.1, 2.8]} />
        <PalmTree position={[-7.5, 0.1, -2.5]} />
        <PalmTree position={[7.4, 0.1, -1.5]} lean={-0.12} />
      </Island>
    </>
  );
}

function CellBadge({ value, position, color }: { value: string; position: [number, number, number]; color: string }) {
  const label = value === '' ? '—' : value;
  const tex = useMemo(() => signTexture({ title: label === '✔' ? 'YES' : label === '✘' ? 'NO' : label, bg: '#ffffff', fg: label === '✘' ? '#c01f55' : label === '✔' ? '#5d9a17' : '#13317a', accent: color, w: 512, h: 256, titleSize: 120 }), [label, color]);
  return (
    <group position={position}>
      <RoundedBox args={[1.5, 0.75, 0.1]} radius={0.06} material={glossy(color, 0.3)} />
      <mesh position={[0, 0, 0.055]}><planeGeometry args={[1.4, 0.65]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
    </group>
  );
}
