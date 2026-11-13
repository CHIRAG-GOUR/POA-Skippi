import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Person, LOOKS, type Pose, type Look } from '../three/Person';
import { SharkChair, SpotCone, FreezerBike, Podium, PopConfetti } from '../three/props';
import { IcePop } from '../three/IcePop';
import { Roo } from '../three/Roo';
import { Lights, useShot, CamLimits } from '../three/Stage';
import { std, glossy, emissive, FLAVOURS } from '../three/materials';
import { signTexture, stripeTexture } from '../three/textures';
import { useSceneData } from '../game/store';
import { HAPPENED } from '../content/poa';

/* Stage layout: pitch spot at origin, sharks in an arc facing it. */
const SHARK_LOOKS: Look[] = [LOOKS.sharkA, LOOKS.sharkB, LOOKS.sharkC, LOOKS.sharkD, LOOKS.sharkE];
const SHARK_POS = HAPPENED.sharks.map((_, i) => {
  const a = Math.PI + (i - 2) * 0.32;
  return [Math.sin(a) * 5.2, 0, Math.cos(a) * 5.2 + 1.2] as [number, number, number];
});
const TEAM = [LOOKS.student1, LOOKS.student2, LOOKS.student3, LOOKS.student4, LOOKS.student5];

export interface ScreenContent { title: string; body?: string; color?: string }

export default function StudioScene({ variant = 's2' }: { variant?: string }) {
  const activity = useSceneData<string>('activity', '');
  const step = useSceneData<number>('step', 0);
  const reaction = useSceneData<{ kind: 'correct' | 'wrong' | 'cheer'; n: number } | null>('reaction', null);
  const screen = useSceneData<ScreenContent | null>('screen', null);
  const presenting = useSceneData<boolean>('presenting', false);
  const highlightShark = useSceneData<number | null>('shark', null);
  const [react, setReact] = useState<'correct' | 'wrong' | 'cheer' | null>(null);

  useEffect(() => {
    if (!reaction) return;
    setReact(reaction.kind);
    const t = setTimeout(() => setReact(null), 2600);
    return () => clearTimeout(t);
  }, [reaction]);

  const isTeam = variant === 's12' || variant === 's13';

  // camera
  const shot = useMemo(() => {
    if (variant === 's8') {
      const shots: [[number, number, number], [number, number, number]][] = [
        [[3.2, 2.2, -3.2], [0, 1.4, 1]], // founders pitch
        [[-1.6, 2.4, 2.6], [0, 1.2, -3.6]], // five sharks
        [[5.6, 3.8, 5.0], [0, 1, -1]], // deal
        [[-4.6, 2.6, 4.2], [0.6, 1.0, 0.6]], // after show (freezer bike)
        [[0, 2.6, 4.6], [0, 2.4, -4.5]], // screen: funding
        [[1.2, 2.2, 3.8], [0, 2.4, -4.5]], // screen: decline
      ];
      const s = shots[Math.min(step, shots.length - 1)];
      return { pos: s[0], look: s[1] };
    }
    if (variant === 's2' && activity === 's2-quiz') return { pos: [1.6, 2.4, 3.6] as [number, number, number], look: [0, 1.1, -3.4] as [number, number, number] };
    if (variant === 's13' && activity === 's13-score') return { pos: [-1.2, 2.3, 3.2] as [number, number, number], look: [0, 1.1, -3.6] as [number, number, number] };
    if (isTeam && activity === 's13-pitch') return { pos: [0, 2.0, -3.4] as [number, number, number], look: [0, 1.2, 0.6] as [number, number, number] };
    return { pos: [6.4, 4.4, 6.6] as [number, number, number], look: [0, 1, -0.8] as [number, number, number] };
  }, [variant, activity, step, isTeam]);
  useShot(shot.pos, shot.look, `${variant}|${shot.pos.join()}|${shot.look.join()}`);

  // shark poses
  const sharkPose = (i: number): Pose => {
    if (react === 'correct' || react === 'cheer') return i % 2 ? 'clap' : 'clap';
    if (react === 'wrong') return 'think';
    if (variant === 's8') {
      if (step === 1) return highlightShark === i ? 'wave' : 'sit';
      if (step === 2) return 'clap';
      if (step === 5) return i % 2 ? 'think' : 'sit';
    }
    if (isTeam && presenting) return i === 2 ? 'think' : 'sit';
    return 'sit';
  };
  const sharkSeated = (i: number) => sharkPose(i) === 'sit';

  // pitchers
  const pitchPose = (i: number): Pose => {
    if (react === 'correct' || react === 'cheer') return 'cheer';
    if (variant === 's8') {
      if (step === 0) return i ? 'present' : 'talk';
      if (step === 2) return 'cheer';
      if (step === 5) return 'think';
      return 'idle';
    }
    if (isTeam) return presenting ? (i === 2 ? 'present' : i % 2 ? 'talk' : 'idle') : i === 2 ? 'talk' : 'idle';
    return i ? 'present' : 'talk';
  };

  const defaultScreen: ScreenContent =
    variant === 's2' ? { title: 'SHARK TANK INDIA', body: 'Skippi Ice Pops – Season 1, Episode 6', color: '#2163e0' }
      : variant === 's8' ? { title: 'WHAT ACTUALLY HAPPENED?', body: HAPPENED.appeared, color: '#1a4fc0' }
        : variant === 's12' ? { title: 'PITCH PREP ROOM', body: 'Build your pitch for the Sharks', color: '#2163e0' }
          : { title: 'FINAL SHARK TANK EVALUATION', body: '3–5 minute pitch + Shark Q&A', color: '#ffa514' };

  return (
    <>
      <color attach="background" args={['#ffe9c7']} />
      <Lights sun={[4, 12, 8]} intensity={1.5} ambient={0.75} sky="#fff1dd" ground="#ffb871" shadowSize={9} fogColor="#ffe9c7" fogNear={18} fogFar={42} />
      <CamLimits min={2.5} max={14} minPolar={0.4} maxPolar={1.45} />
      <StudioSet screen={screen ?? defaultScreen} />
      {/* spotlights */}
      <spotLight position={[0, 7, 3]} angle={0.45} penumbra={0.6} intensity={60} color="#fff3d6" target-position={[0, 0, 0]} castShadow={false} />
      <SpotCone position={[0, 6.6, 2.6]} target={[0, 0, 0]} opacity={0.08} />
      <SpotCone position={[-3, 6.6, -2]} target={[0, 0, -3.6]} opacity={0.05} color="#bfe6ff" />
      <SpotCone position={[3, 6.6, -2]} target={[0, 0, -3.6]} opacity={0.05} color="#ffd0e0" />

      {/* sharks */}
      {HAPPENED.sharks.map((name, i) => {
        const p = SHARK_POS[i];
        const face = Math.atan2(-p[0], -p[2] + 0.2);
        return (
          <group key={name} position={p} rotation={[0, face, 0]}>
            <SharkChair color={['#1b2340', '#2b2f45', '#4e1f12', '#8f1340', '#163f99'][i]} />
            <Person look={SHARK_LOOKS[i]} pose={sharkPose(i)} position={[0, sharkSeated(i) ? 0.12 : 0, sharkSeated(i) ? 0.02 : 0.55]} />
            <NamePlate name={name} lit={highlightShark === i} position={[0, 0.32, 0.75]} />
          </group>
        );
      })}

      {/* pitchers */}
      {isTeam ? (
        TEAM.map((l, i) => (
          <Person key={i} look={l} pose={pitchPose(i)} position={[(i - 2) * 0.75, 0.32, -0.2 + Math.abs(i - 2) * 0.25]} rotationY={Math.PI + (i - 2) * -0.15} />
        ))
      ) : (
        <>
          <Person look={LOOKS.ravi} pose={pitchPose(0)} position={[-0.5, 0.32, 0]} rotationY={Math.PI - 0.1} />
          <Person look={LOOKS.anuja} pose={pitchPose(1)} position={[0.5, 0.32, 0]} rotationY={Math.PI + 0.1} />
        </>
      )}
      {/* product display */}
      <group position={[1.7, 0.32, -0.7]}>
        <RoundedBox args={[0.8, 0.9, 0.5]} radius={0.05} position={[0, 0.45, 0]} material={glossy('#2163e0', 0.3)} castShadow />
        {FLAVOURS.map((f, i) => (
          <IcePop key={f.id} color={f.color} length={0.55} position={[-0.3 + (i % 3) * 0.3, 0.9, -0.08 + Math.floor(i / 3) * 0.16]} rotation={[0, 0, (i - 2.5) * 0.06]} />
        ))}
      </group>
      <group position={[-1.8, 0.32, -0.4]} rotation={[0, 0.6, 0]}>
        <Roo pose={react === 'correct' || react === 'cheer' ? 'cheer' : react === 'wrong' ? 'think' : 'idle'} scale={0.75} />
      </group>
      {variant === 's8' && step >= 3 && <FreezerBike position={[3.8, 0, 1.6]} rotationY={-0.9} />}
      {(react === 'correct' || react === 'cheer' || (variant === 's8' && step === 2)) && (
        <PopConfetti position={[0, 0.4, -1.5]} count={48} spread={7} height={3.6} />
      )}
    </>
  );
}

function NamePlate({ name, lit, position }: { name: string; lit: boolean; position: [number, number, number] }) {
  const tex = useMemo(() => signTexture({ title: name, bg: lit ? '#ffa514' : '#13317a', fg: '#ffffff', accent: lit ? '#ffffff' : '#ffa514', w: 1024, h: 220, titleSize: 110 }), [name, lit]);
  return (
    <group position={position}>
      <RoundedBox args={[0.98, 0.24, 0.05]} radius={0.03} material={std('#ffffff', 0.4)} />
      <mesh position={[0, 0, 0.027]}><planeGeometry args={[0.92, 0.2]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
    </group>
  );
}

function StudioSet({ screen }: { screen: ScreenContent }) {
  const tex = useMemo(() => signTexture({ title: screen.title, body: screen.body, bg: screen.color ?? '#2163e0', fg: '#ffffff', accent: '#ffa514', w: 1536, h: 768, titleSize: 128, bodySize: 64 }), [screen.title, screen.body, screen.color]);
  const skirt = useMemo(() => { const t = stripeTexture('#2163e0', '#ffffff', 24, 'skirt'); t.repeat.set(3, 1); return t; }, []);
  const lights = useRef<THREE.Group>(null);
  useFrame((st) => {
    lights.current?.children.forEach((c, i) => {
      const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.2 + Math.sin(st.clock.elapsedTime * 3 + i * 0.7) * 0.8;
    });
  });
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[14, 64]} />
        <meshStandardMaterial color="#e7b27c" roughness={0.45} />
      </mesh>
      {[...Array(12)].map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-7 + i * 1.25, 0.002, 0]} material={std('#d9a066', 0.5)}>
          <planeGeometry args={[0.04, 28]} />
        </mesh>
      ))}
      {/* pitch stage */}
      <mesh position={[0, 0.16, 0]} receiveShadow castShadow material={glossy('#13317a', 0.25)}>
        <cylinderGeometry args={[2.6, 2.7, 0.32, 64]} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[2.71, 2.71, 0.3, 64, 1, true]} />
        <meshStandardMaterial map={skirt} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.325, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={glossy('#2163e0', 0.2)}>
        <ringGeometry args={[2.1, 2.55, 64]} />
      </mesh>
      <mesh position={[0, 0.326, 0]} rotation={[-Math.PI / 2, 0, 0]} material={emissive('#ffa514', 0.4)}>
        <ringGeometry args={[2.05, 2.1, 64]} />
      </mesh>
      {/* sharks' dais */}
      <mesh position={[0, 0.08, -4.1]} receiveShadow castShadow material={std('#4e1f12', 0.5)}>
        <boxGeometry args={[11, 0.16, 3.2]} />
      </mesh>
      {/* back wall + screen (behind the pitchers, facing sharks? no: behind sharks facing camera) */}
      <group position={[0, 0, -6.4]}>
        <mesh position={[0, 3.2, -0.15]} receiveShadow material={std('#2163e0', 0.7)}><boxGeometry args={[16, 6.4, 0.2]} /></mesh>
        {[...Array(9)].map((_, i) => (
          <mesh key={i} position={[-7 + i * 1.75, 3.2, -0.04]} material={std(i % 2 ? '#1a4fc0' : '#2163e0', 0.7)}><boxGeometry args={[0.9, 6.4, 0.04]} /></mesh>
        ))}
        <RoundedBox args={[5.4, 2.9, 0.16]} radius={0.08} position={[0, 4.1, 0.1]} material={glossy('#13317a', 0.3)} />
        <mesh position={[0, 4.1, 0.19]}>
          <planeGeometry args={[5.1, 2.6]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
        {/* marquee bulbs */}
        <group ref={lights}>
          {[...Array(22)].map((_, i) => {
            const t = i / 22;
            const x = t < 0.5 ? -2.85 + t * 2 * 5.7 : -2.85 + (t - 0.5) * 2 * 5.7;
            const y = t < 0.5 ? 5.65 : 2.55;
            return (
              <mesh key={i} position={[x, y, 0.2]}>
                <sphereGeometry args={[0.07, 10, 8]} />
                <meshStandardMaterial color="#fff2c4" emissive="#ffd27a" emissiveIntensity={1.5} />
              </mesh>
            );
          })}
        </group>
      </group>
      {/* side walls */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 8, 0, -1]} rotation={[0, -s * Math.PI / 2, 0]}>
          <mesh position={[0, 3.2, 0]} material={std('#ffb871', 0.8)}><boxGeometry args={[12, 6.4, 0.2]} /></mesh>
          {[...Array(4)].map((_, i) => (
            <IcePop key={i} color={FLAVOURS[(i + (s > 0 ? 2 : 0)) % 6].color} flavour={FLAVOURS[(i + (s > 0 ? 2 : 0)) % 6].name} length={4.2} scale={1.1} position={[-4 + i * 2.6, 0.6, 0.25]} rotation={[0, 0, 0.1 * (i % 2 ? 1 : -1)]} />
          ))}
        </group>
      ))}
      {/* truss with lamps */}
      <mesh position={[0, 6.4, 0]} material={std('#3a3f55', 0.4, 0.6)}><boxGeometry args={[14, 0.18, 0.18]} /></mesh>
      {[-5, -2.5, 0, 2.5, 5].map((x) => (
        <group key={x} position={[x, 6.15, 0]}>
          <mesh rotation={[0.6, 0, 0]} material={std('#1d1f2b', 0.4, 0.5)}><cylinderGeometry args={[0.16, 0.22, 0.4, 14]} /></mesh>
          <mesh position={[0, -0.12, 0.13]} rotation={[0.6, 0, 0]} material={emissive('#fff3d6', 2)}><circleGeometry args={[0.15, 16]} /></mesh>
        </group>
      ))}
      <Podium position={[-3.6, 0, 1.8]} h={0.9} r={0.35} color="#ffffff" top="#ffa514" />
    </group>
  );
}
