import { RoundedBox } from '@react-three/drei';
import { SkyDome, Clouds, Island, Water, PalmTree, Bush, Meadow, Crate, Sign, Hotspot, Shop } from '../three/props';
import { Person, LOOKS, type Look } from '../three/Person';
import { IcePop } from '../three/IcePop';
import { Lights, useShot, CamLimits } from '../three/Stage';
import { std, glossy, emissive, FLAVOURS } from '../three/materials';
import { useScene, useSceneData } from '../game/store';
import { ROLES } from '../content/poa';

const RCOL = ['#e2336c', '#ffa514', '#7cc22b', '#2163e0', '#f056a8'];
const LOOK: Look[] = [LOOKS.student4, LOOKS.student2, LOOKS.student3, LOOKS.student5, LOOKS.student1];
const POS = ROLES.map((_, i) => { const a = Math.PI / 2 + (i / 5) * Math.PI * 2; return [Math.cos(a) * 2.4, Math.sin(a) * 2.4] as [number, number]; });

export default function WorkshopScene() {
  const role = useSceneData<number>('role', -1);
  const activity = useSceneData<string>('activity', 's11-team');
  const setFocus = useScene((s) => s.setFocus);
  const p = role >= 0 ? POS[role] : null;
  useShot(p ? [p[0] * 2.4, 2.6, p[1] * 2.4] : [0, 6.5, 8], p ? [p[0], 1.1, p[1]] : [0, 0.8, 0], `${activity}|${role}`);
  return (
    <>
      <SkyDome top="#c47a3f" mid="#ffd9b8" bottom="#fff6e6" k="workshop" />
      <Lights sun={[6, 15, 8]} intensity={2.3} shadowSize={10} fogColor="#ffeede" fogNear={24} fogFar={60} />
      <CamLimits min={3} max={18} maxPolar={1.35} />
      <Clouds count={5} radius={30} y={11} />
      <Water radius={70} />
      <Island radius={8} sand="#ffe0a3" depth={2.2}>
        <Meadow radius={7.8} inner={4.6} count={160} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.115, 0]} receiveShadow material={std('#e7b27c', 0.6)}><circleGeometry args={[4.4, 48]} /></mesh>
        {/* round table */}
        <mesh position={[0, 0.85, 0]} castShadow receiveShadow material={glossy('#c47a3f', 0.4)}><cylinderGeometry args={[1.5, 1.5, 0.1, 40]} /></mesh>
        <mesh position={[0, 0.42, 0]} material={std('#7a3522', 0.6)}><cylinderGeometry args={[0.18, 0.35, 0.8, 16]} /></mesh>
        <RoundedBox args={[0.9, 0.06, 0.6]} radius={0.02} position={[0, 0.93, 0]} material={std('#ffffff', 0.5)} />
        {FLAVOURS.slice(0, 3).map((f, i) => <IcePop key={f.id} color={f.color} length={0.6} position={[-0.3 + i * 0.3, 0.93, -0.5]} rotation={[0, 0, 0.1]} />)}
        {ROLES.map((r, i) => {
          const [x, z] = POS[i];
          const sel = role === i;
          return (
            <group key={r.id}>
              <mesh position={[x * 1.35, 0.13, z * 1.35]} rotation={[-Math.PI / 2, 0, 0]} material={sel ? emissive(RCOL[i], 0.5) : std(RCOL[i], 0.6)}><ringGeometry args={[0.5, 0.65, 32]} /></mesh>
              <Person look={LOOK[i]} pose={sel ? 'present' : activity === 's11-rebuttal' ? (i % 2 ? 'talk' : 'think') : 'idle'} position={[x * 1.35, 0.1, z * 1.35]}
                say={sel ? `I’m the ${r.role}!` : activity === 's11-rebuttal' && i === 1 ? 'Defend your plan!' : undefined} />
              <Sign position={[x * 1.9, 0.1, z * 1.9]} rotationY={Math.atan2(x, z)} title={r.role} w={1.5} h={0.45} bg={RCOL[i]} fg="#ffffff" accent="#ffffff" />
              <Hotspot position={[x * 1.35, 2.3, z * 1.35]} label={r.role} active={sel} color={RCOL[i]} small hideLabel onClick={() => setFocus(`role:${i}:${Date.now()}`)} />
            </group>
          );
        })}
        <Crate position={[3.8, 0.1, -2.6]} /><Crate position={[3.8, 0.52, -2.6]} color="#ffa514" />
        <Shop position={[-4.2, 0.1, -3.6]} rotationY={0.6} name="RETAILER" color="#2163e0" stocked />
        <PalmTree position={[6.6, 0.1, 2.5]} />
        <Bush position={[-6.4, 0.1, 2]} />
      </Island>
    </>
  );
}
