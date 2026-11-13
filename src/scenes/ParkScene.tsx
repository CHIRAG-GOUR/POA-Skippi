import { useMemo } from 'react';
import { SkyDome, Clouds, Island, Water, PalmTree, RoundTree, Bush, Meadow, SkippiStall, GolaCart, Umbrella, Bench, Sign, PhotoFrame, Hotspot, Fence, Lamp, PopConfetti } from '../three/props';
import { Person, LOOKS } from '../three/Person';
import { IcePop } from '../three/IcePop';
import { Roo } from '../three/Roo';
import { Lights, useShot, CamLimits } from '../three/Stage';
import { FLAVOURS } from '../three/materials';
import { useScene, useSceneData } from '../game/store';
import { INTRO } from '../content/poa';

export const FACT_SPOTS: [number, number, number][] = [
  [-5.2, 0, -2.2], [-3.6, 0, 3.6], [-0.6, 0, 5.4], [3.4, 0, 4.4], [5.6, 0, 1.0], [4.6, 0, -3.6], [1.2, 0, -5.4], [-3.0, 0, -5.0],
];
export const VMO_SPOTS: [number, number, number][] = [[-6.4, 0, 1.4], [-6.0, 0, 3.6], [-5.0, 0, 5.2]];

const STORY_SHOTS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [2.5, 3.2, 9], look: [1.6, 0.8, 2.6] }, // kids enjoying pops
  { pos: [-1, 2.6, 7.5], look: [-3.4, 0.9, 1.6] }, // gola cart — hygiene question
  { pos: [4.2, 2.4, 3.4], look: [2.6, 1.2, -1.6] }, // founders + photo
  { pos: [0, 3.4, 6.5], look: [0, 1.2, -1.2] }, // stall launch
];

export default function ParkScene() {
  const activity = useSceneData<string>('activity', 's1-story');
  const chapter = useSceneData<number>('chapter', 0);
  const focus = useScene((s) => s.focus);
  const found = useSceneData<number[]>('found', []);
  const opened = useSceneData<number[]>('opened', []);
  const setFocus = useScene((s) => s.setFocus);

  // camera direction per mission / focus
  const shot = useMemo(() => {
    if (activity === 's1-story') return STORY_SHOTS[chapter] ?? STORY_SHOTS[0];
    if (activity === 's1-overview') {
      if (focus?.startsWith('fact:')) {
        const p = FACT_SPOTS[+focus.slice(5)];
        return { pos: [p[0] * 1.5, 3.4, p[2] * 1.5 + 2] as [number, number, number], look: [p[0], 1, p[2]] as [number, number, number] };
      }
      return { pos: [0, 13, 12] as [number, number, number], look: [0, 0, 0] as [number, number, number] };
    }
    if (activity === 's1-vmo') return { pos: [-1.2, 2.8, 7.4] as [number, number, number], look: [-5.6, 1.4, 3.2] as [number, number, number] };
    return { pos: [3.2, 2.6, 6.2] as [number, number, number], look: [0.6, 1.2, 1.6] as [number, number, number] };
  }, [activity, chapter, focus]);
  useShot(shot.pos, shot.look, `${shot.pos.join()}|${shot.look.join()}`);

  const showFacts = activity === 's1-overview';
  const showVmo = activity === 's1-vmo';

  return (
    <>
      <SkyDome top="#46b0ff" mid="#b5e3ff" bottom="#fff0cc" k="park" />
      <Lights sun={[9, 15, 7]} intensity={2.6} shadowSize={11} fogColor="#d6efff" fogNear={30} fogFar={70} />
      <CamLimits min={3} max={24} maxPolar={1.38} />
      <Clouds count={7} radius={36} y={13} />
      <Water radius={70} />
      <Island radius={8.2} sand="#ffe0a3" depth={2.2}>
        <Meadow radius={7.8} inner={1} count={300} avoid={[[0, -1.2, 2.2], [2.6, -1.6, 1.4], [-3.4, 1.6, 1.4], ...FACT_SPOTS.map((p) => [p[0], p[2], 0.7] as [number, number, number])]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.115, 0.6]} receiveShadow>
          <circleGeometry args={[2.9, 40]} />
          <meshStandardMaterial color="#f6d9a2" roughness={0.95} />
        </mesh>
        <SkippiStall position={[0, 0.1, -1.2]} />
        <Person look={LOOKS.seller} pose={activity === 's1-story' && chapter === 3 ? 'present' : 'wave'} position={[-0.45, 0.1, -2.05]} />
        {/* founders by their photo (original POA image) */}
        <group position={[2.6, 0.1, -1.6]} rotation={[0, -0.5, 0]}>
          <PhotoFrame src={INTRO.image.src} w={1.2} aspect={523 / 632} position={[0, 0, -0.6]} />
          <Person look={LOOKS.ravi} pose={chapter === 2 && activity === 's1-story' ? 'talk' : 'idle'} position={[-0.5, 0, 0.2]} rotationY={0.2} />
          <Person look={LOOKS.anuja} pose={chapter === 2 && activity === 's1-story' ? 'wave' : 'idle'} position={[0.45, 0, 0.25]} rotationY={-0.2} />
        </group>
        {/* the familiar street treat */}
        <GolaCart position={[-3.4, 0.1, 1.6]} rotationY={0.8} />
        <Person look={LOOKS.parent} pose={activity === 's1-story' && chapter === 1 ? 'think' : 'idle'} mood={chapter === 1 ? 'neutral' : 'happy'} position={[-2.4, 0.1, 2.6]} rotationY={-2.2} />
        {/* kids with pops */}
        <Person look={LOOKS.kid1} pose={activity === 's1-story' && chapter === 0 ? 'cheer' : 'idle'} position={[1.3, 0.1, 2.4]} rotationY={-0.6}>
          <IcePop color={FLAVOURS[0].color} length={0.5} position={[0, -0.25, 0.04]} rotation={[0.3, 0, 0]} />
        </Person>
        <Person look={LOOKS.kid2} pose={activity === 's1-story' && chapter === 0 ? 'wave' : 'idle'} position={[2.1, 0.1, 2.9]} rotationY={-1.2}>
          <IcePop color={FLAVOURS[1].color} length={0.5} position={[0, -0.25, 0.04]} rotation={[0.3, 0, 0]} />
        </Person>
        <Person look={LOOKS.kid3} pose="idle" position={[0.6, 0.1, 3.2]} rotationY={0.4} />
        <group position={[-0.9, 0.1, 2.0]} rotation={[0, 0.5, 0]}><Roo pose={activity === 's1-story' ? 'talk' : 'point'} scale={0.9} /></group>
        <Umbrella position={[5.6, 0.1, -1.4]} a="#ffa514" />
        <Bench position={[6.2, 0.1, -0.6]} rotationY={-Math.PI / 2 - 0.3} />
        <Lamp position={[-1.9, 0.1, -3.2]} />
        <Fence from={[-7, -2]} to={[-6.2, -4.6]} />
        <PalmTree position={[-6.6, 0.1, -1]} scale={1} />
        <PalmTree position={[6.6, 0.1, -2.5]} scale={1.1} lean={-0.15} />
        <PalmTree position={[6.0, 0.1, 4.2]} scale={0.95} />
        <RoundTree position={[-4.5, 0.1, -4.2]} scale={0.9} />
        <RoundTree position={[2.8, 0.1, -6.2]} scale={0.8} color="#6cc24a" />
        <Bush position={[-1.8, 0.1, -5.6]} />
        <Bush position={[6.6, 0.1, -0.4]} berries="#ffa514" />

        {/* 8 fact pops */}
        {INTRO.overview.map((row, i) => {
          const p = FACT_SPOTS[i];
          const isFound = found.includes(i);
          const f = FLAVOURS[i % FLAVOURS.length];
          return (
            <group key={row.k}>
              <IcePop color={f.color} flavour={isFound ? row.k : '?'} length={1.6} scale={1.1} position={[p[0], 0.1, p[2]]} rotation={[0, 0, (i % 2 ? 1 : -1) * 0.1]} bob={showFacts && !isFound} highlight={focus === `fact:${i}`}
                onClick={showFacts ? () => setFocus(`fact:${i}`) : undefined} />
              {showFacts && <Hotspot position={[p[0], 2.6, p[2]]} label={isFound ? row.k : `Fact pop ${i + 1}`} done={isFound} color={f.color} onClick={() => setFocus(`fact:${i}`)} small />}
              {isFound && <PopConfetti position={[p[0], 0.3, p[2]]} count={10} spread={1.1} height={2.2} />}
            </group>
          );
        })}

        {/* vision / mission / objective signposts */}
        {(['Vision', 'Mission', 'Objective'] as const).map((t, i) => (
          <group key={t}>
            <Sign position={VMO_SPOTS[i]} rotationY={0.9} title={t} w={1.3} h={0.6} bg={opened.includes(i) ? '#ffffff' : '#2163e0'} fg={opened.includes(i) ? '#13317a' : '#ffffff'} accent={['#ffa514', '#e2336c', '#7cc22b'][i]}
              onClick={showVmo ? () => setFocus(`vmo:${i}`) : undefined} glow={showVmo && !opened.includes(i)} />
            {showVmo && <Hotspot position={[VMO_SPOTS[i][0], 2.25, VMO_SPOTS[i][2]]} label={t} done={opened.includes(i)} color={['#ffa514', '#e2336c', '#7cc22b'][i]} onClick={() => setFocus(`vmo:${i}`)} small hideLabel />}
          </group>
        ))}
      </Island>
    </>
  );
}
