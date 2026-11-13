import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { SkyDome, Clouds, Island, Water, PalmTree, Bush, Meadow, Shop, Podium, SpotCone, PopConfetti, Flag, Umbrella } from '../three/props';
import { Person, LOOKS } from '../three/Person';
import { IcePop } from '../three/IcePop';
import { Lights, useShot, CamLimits } from '../three/Stage';
import { std, glossy, emissive, FLAVOURS } from '../three/materials';
import { posterTexture } from '../three/textures';
import { useSceneData } from '../game/store';

export interface CampaignDraft { name: string; tagline: string; target: string; platform: string; promo: string; repeat: string }

export default function CampaignScene() {
  const draft = useSceneData<CampaignDraft>('draft', { name: '', tagline: '', target: '', platform: '', promo: '', repeat: '' });
  const launched = useSceneData<number>('launched', 0);
  const activity = useSceneData<string>('activity', 's6-study');
  const tex = useMemo(() => posterTexture({ headline: draft.name || 'Your campaign', tagline: draft.tagline || 'Your tagline', footer: draft.platform ? `On: ${draft.platform}` : 'Pick a platform', bg: '#e2336c', fg: '#ffffff', accent: '#ffa514' }, launched),
    [draft.name, draft.tagline, draft.platform, launched]);
  const shot = activity === 's6-study' ? { p: [-3.2, 2.6, 6.2], l: [-1.6, 1.2, 0] } : { p: [0.5, 3.2, 8.8], l: [0.5, 2.2, -1] };
  useShot(shot.p as [number, number, number], shot.l as [number, number, number], activity);
  const crowdPose = launched ? 'cheer' : 'idle';
  return (
    <>
      <SkyDome top="#ff6f9f" mid="#ffc2d6" bottom="#fff3df" k="campaign" />
      <Lights sun={[5, 15, 9]} intensity={2.4} shadowSize={11} fogColor="#ffe1ea" fogNear={26} fogFar={70} />
      <CamLimits min={3} max={20} maxPolar={1.35} />
      <Clouds count={6} radius={34} y={12} />
      <Water radius={70} />
      <Island radius={9.5} sand="#ffe0a3" depth={2.2}>
        <Meadow radius={9} count={200} avoid={[[0.5, -1.2, 3.5], [-2, 1.5, 2]]} />
        {/* billboard */}
        <group position={[0.5, 0.1, -1.6]}>
          {[-1.9, 1.9].map((x) => <mesh key={x} position={[x, 1.4, -0.1]} castShadow material={glossy('#13317a', 0.3)}><cylinderGeometry args={[0.09, 0.11, 2.8, 12]} /></mesh>)}
          <RoundedBox args={[4.6, 2.7, 0.16]} radius={0.08} position={[0, 3.1, 0]} material={glossy('#ffa514', 0.3)} castShadow />
          <mesh position={[0, 3.1, 0.085]}><planeGeometry args={[4.4, 2.5]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
          {[-1.6, 0, 1.6].map((x) => (
            <group key={x} position={[x, 4.6, 0.4]}>
              <mesh rotation={[0.9, 0, 0]} material={std('#1d1f2b', 0.4)}><cylinderGeometry args={[0.1, 0.16, 0.3, 12]} /></mesh>
              <mesh position={[0, -0.12, 0.12]} rotation={[0.9, 0, 0]} material={emissive('#fff3d6', 2)}><circleGeometry args={[0.13, 14]} /></mesh>
            </group>
          ))}
          <SpotCone position={[0, 4.5, 0.6]} target={[0, 2.5, 0.2]} opacity={0.06} />
        </group>
        {/* platform props */}
        <PlatformProp platform={draft.platform} />
        {/* studio set for the original campaign */}
        <group position={[-2, 0.1, 1.5]}>
          <Podium h={0.25} r={1.1} top="#e2336c" />
          {FLAVOURS.map((f, i) => (
            <IcePop key={f.id} color={f.color} flavour={f.name} length={1.2} position={[-0.75 + i * 0.3, 0.25, 0]} rotation={[0, 0, (i - 2.5) * 0.08]} />
          ))}
          <mesh position={[0, 0.27, 0.4]} rotation={[-Math.PI / 2, 0, 0]} material={glossy('#4cc4f0', 0.05)}><circleGeometry args={[0.55, 24]} /></mesh>
        </group>
        {/* audience */}
        <Person look={LOOKS.kid1} pose={crowdPose} position={[-0.6, 0.1, 3.2]} say={launched ? 'Wow! I want one!' : undefined} />
        <Person look={LOOKS.parent} pose={launched ? 'clap' : 'idle'} position={[0.4, 0.1, 3.5]} />
        <Person look={LOOKS.kid2} pose={crowdPose} position={[1.3, 0.1, 3.1]} />
        <Person look={LOOKS.seller} pose={activity === 's6-campaign' ? 'present' : 'talk'} position={[2.6, 0.1, 1.4]} say={launched ? undefined : activity === 's6-campaign' ? 'Design your campaign!' : 'Dive into Delight!'} />
        {launched > 0 && <PopConfetti position={[0.5, 0.2, 1]} count={40} spread={6} height={4.5} />}
        <PalmTree position={[-8, 0.1, -2]} />
        <PalmTree position={[7.8, 0.1, 2.5]} lean={-0.12} />
        <Bush position={[-6, 0.1, 4]} />
        <Flag position={[4.8, 0.1, -2.6]} color="#e2336c" />
      </Island>
    </>
  );
}

function PlatformProp({ platform }: { platform: string }) {
  const pos: [number, number, number] = [4.8, 0.1, 0.4];
  if (platform === 'Instagram')
    return (
      <group position={pos} rotation={[0, -0.5, 0]}>
        <RoundedBox args={[1.2, 2.2, 0.12]} radius={0.14} position={[0, 1.3, 0]} material={glossy('#1b2340', 0.2)} castShadow />
        <mesh position={[0, 1.3, 0.065]} material={emissive('#ff7cc0', 0.5)}><planeGeometry args={[1.04, 1.9]} /></mesh>
        <mesh position={[0, 1.55, 0.07]} material={std('#ffffff', 0.5)}><circleGeometry args={[0.28, 24]} /></mesh>
        <mesh position={[0.3, 0.85, 0.07]} material={std('#e2336c', 0.5)}><circleGeometry args={[0.12, 16]} /></mesh>
      </group>
    );
  if (platform === 'school event')
    return (
      <group position={pos}>
        <Podium h={0.4} r={1.2} top="#2163e0" />
        {[...Array(7)].map((_, i) => (
          <mesh key={i} position={[-1 + i * 0.33, 2.2 - Math.sin((i / 6) * Math.PI) * 0.25, 0]} rotation={[0, 0, Math.PI]} material={std(FLAVOURS[i % 6].color, 0.6)}><coneGeometry args={[0.12, 0.24, 3]} /></mesh>
        ))}
        {[-1.1, 1.1].map((x) => <mesh key={x} position={[x, 1.2, 0]} material={glossy('#ffffff', 0.3)}><cylinderGeometry args={[0.04, 0.04, 2.4, 8]} /></mesh>)}
      </group>
    );
  if (platform === 'shop display') return <Shop position={pos} rotationY={-0.6} name="SKIPPI HERE" color="#e2336c" stocked />;
  if (platform === 'outdoor advertising')
    return (
      <group position={pos} rotation={[0, -0.5, 0]}>
        <Umbrella position={[0, 0, 0]} a="#e2336c" />
        <RoundedBox args={[1.4, 0.9, 0.08]} radius={0.04} position={[0, 0.9, 0.6]} material={glossy('#ffa514', 0.3)} />
      </group>
    );
  return null;
}
