import { SkyDome, Clouds, Island, Water, RoundTree, Bush, Meadow, Lantern, Bench, Hotspot, PopConfetti } from '../three/props';
import { Person, LOOKS } from '../three/Person';
import { Roo } from '../three/Roo';
import { Lights, useShot, CamLimits } from '../three/Stage';
import { useScene, useSceneData } from '../game/store';
import { REFLECTION } from '../content/poa';

const LCOL = ['#ffa514', '#e2336c', '#2163e0', '#7cc22b'];
const LPOS: [number, number, number][] = [[-3.3, 0.1, -0.8], [-1.1, 0.1, -1.8], [1.1, 0.1, -1.8], [3.3, 0.1, -0.8]];
export default function GardenScene() {
  const lit = useSceneData<number[]>('lit', []);
  const activity = useSceneData<string>('activity', 's10-outcomes');
  const setFocus = useScene((s) => s.setFocus);
  useShot(activity === 's10-reflect' ? [2.6, 2.2, 5] : [0, 3.6, 8], activity === 's10-reflect' ? [0, 1, 1.5] : [0, 1.4, -0.8], activity);
  return (
    <>
      <SkyDome top="#6a4fb3" mid="#ff9a7a" bottom="#ffd27a" k="sunset" />
      <Lights sun={[-10, 6, -6]} intensity={1.9} color="#ffb47a" ambient={0.6} sky="#ffb4a0" ground="#6a4fb3" shadowSize={10} fogColor="#ffc0a0" fogNear={20} fogFar={60} />
      <CamLimits min={3} max={18} maxPolar={1.35} />
      <Clouds count={6} radius={32} y={10} />
      <Water radius={70} color="#7a7fd0" />
      <Island radius={8.5} sand="#ffe0a3" top="#9ad94a" depth={2.2}>
        <Meadow radius={8.2} count={260} avoid={LPOS.map((p) => [p[0], p[2], 0.6] as [number, number, number])} seed={21} />
        {REFLECTION.outcomes.map((o, i) => (
          <group key={o.title}>
            <Lantern position={LPOS[i]} lit={lit.includes(i)} color={LCOL[i]} />
            {activity === 's10-outcomes' && <Hotspot position={[LPOS[i][0], 3, LPOS[i][2]]} label={lit.includes(i) ? o.title : `Lantern ${i + 1}`} done={lit.includes(i)} color={LCOL[i]} small onClick={() => setFocus(`lantern:${i}:${Date.now()}`)} />}
          </group>
        ))}
        {lit.length === 4 && <PopConfetti position={[0, 0.3, -1]} count={30} spread={7} height={3.5} />}
        <Bench position={[0, 0.1, 1.8]} rotationY={Math.PI} />
        <Person look={LOOKS.student3} pose={activity === 's10-reflect' ? 'think' : lit.length === 4 ? 'cheer' : 'idle'} position={[-0.4, 0.1, 2.3]} />
        <Person look={LOOKS.student4} pose={activity === 's10-reflect' ? 'talk' : 'idle'} position={[0.5, 0.1, 2.3]} />
        <group position={[1.8, 0.1, 1.6]} rotation={[0, -0.6, 0]}><Roo pose={activity === 's10-reflect' ? 'think' : 'point'} scale={0.85} /></group>
        <RoundTree position={[-5.5, 0.1, -3]} color="#7cc22b" />
        <RoundTree position={[5.6, 0.1, -2.6]} scale={0.9} color="#9ad94a" />
        <RoundTree position={[-6, 0.1, 2.5]} scale={0.75} />
        <Bush position={[5.4, 0.1, 2.2]} />
      </Island>
    </>
  );
}
