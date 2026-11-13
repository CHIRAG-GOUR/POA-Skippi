import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SkyDome, Clouds, Island, Water, PalmTree, RoundTree, Bush, Meadow, Flag, Sign, Hotspot, FreezerBike, PopConfetti } from '../three/props';
import { Person, LOOKS } from '../three/Person';
import { Lights, useCam, CamLimits } from '../three/Stage';
import { std } from '../three/materials';
import { useScene, useSceneData } from '../game/store';
import { TIMELINE } from '../content/poa';

const COLORS = ['#f056a8', '#ffa514', '#2163e0', '#7cc22b', '#e2336c', '#4a8bf5', '#ff8a3d', '#9ad94a', '#7a3522', '#f056a8'];
export const trail = new THREE.CatmullRomCurve3(
  [[-9, 0, 5], [-6.5, 0, 1], [-7, 0, -3.5], [-3.5, 0, -6], [0, 0, -3], [-1, 0, 1.5], [2.5, 0, 4.5], [6, 0, 2.5], [5.5, 0, -2], [8, 0, -5.5]].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
);
const STOP_T = TIMELINE.milestones.map((_, i) => 0.03 + (i / (TIMELINE.milestones.length - 1)) * 0.94);

export default function TimelineScene() {
  const current = useSceneData<number>('stop', 0);
  const visited = useSceneData<number[]>('visited', []);
  const activity = useSceneData<string>('activity', 's4-explore');
  const setFocus = useScene((s) => s.setFocus);
  const controls = useCam((s) => s.controls);
  const bike = useRef<THREE.Group>(null);
  const tNow = useRef(STOP_T[0]);
  const road = useMemo(() => new THREE.TubeGeometry(trail, 200, 0.55, 6, false), []);

  useFrame((_, dt) => {
    const target = STOP_T[current] ?? 0;
    const prev = tNow.current;
    tNow.current += (target - tNow.current) * Math.min(1, dt * 1.4);
    const p = trail.getPointAt(tNow.current);
    const tan = trail.getTangentAt(tNow.current);
    if (bike.current) {
      bike.current.position.set(p.x, 0.12, p.z);
      bike.current.rotation.y = Math.atan2(-tan.z, tan.x);
      bike.current.userData.moving = Math.abs(tNow.current - prev) > 0.0002;
    }
    if (controls && activity === 's4-explore') void controls.moveTo(p.x, 0.8, p.z, true);
  });

  return (
    <>
      <SkyDome top="#ff9ec4" mid="#ffd8e8" bottom="#fff3d6" k="trail" />
      <Lights sun={[8, 16, 6]} intensity={2.5} shadowSize={14} fogColor="#ffe6f0" fogNear={30} fogFar={75} />
      <CamLimits min={4} max={26} maxPolar={1.3} />
      <InitShot activity={activity} />
      <Clouds count={7} radius={38} y={13} />
      <Water radius={80} color="#6fd0f0" />
      <Island radius={12} sand="#ffe0a3" top="#9ad94a" depth={2.4}>
        <mesh geometry={road} position={[0, -0.42, 0]} scale={[1, 0.2, 1]} receiveShadow material={std('#f6d9a2', 0.95)} />
        <Meadow radius={11.5} count={320} avoid={[]} seed={9} />
        {TIMELINE.milestones.map((m, i) => {
          const p = trail.getPointAt(STOP_T[i]);
          const n = trail.getTangentAt(STOP_T[i]);
          const side = new THREE.Vector3(-n.z, 0, n.x).multiplyScalar(i % 2 ? 1.3 : -1.3);
          const pos: [number, number, number] = [p.x + side.x, 0.1, p.z + side.z];
          const seen = visited.includes(i);
          return (
            <group key={i}>
              <Flag position={pos} color={seen ? COLORS[i] : '#c9ced8'} height={2.2} />
              <Sign position={[pos[0] + 0.05, 0.1, pos[2] + 0.4]} title={m.year} w={1.1} h={0.42} bg={seen ? COLORS[i] : '#ffffff'} fg={seen ? '#ffffff' : '#13317a'} accent={COLORS[i]} post={false} />
              <Hotspot position={[pos[0], 2.7, pos[2]]} label={m.year} done={seen} active={current === i} color={COLORS[i]} small onClick={() => setFocus(`stop:${i}:${Date.now()}`)} />
              {current === i && seen && <PopConfetti position={[pos[0], 0.2, pos[2]]} count={10} spread={1.2} height={2.4} />}
            </group>
          );
        })}
        <group ref={bike}>
          <BikeRig />
        </group>
        <PalmTree position={[-10.5, 0.1, -1]} />
        <PalmTree position={[10.4, 0.1, 3]} lean={-0.12} />
        <RoundTree position={[2.8, 0.1, -7.5]} scale={0.9} />
        <RoundTree position={[-3, 0.1, 6.8]} scale={0.8} color="#6cc24a" />
        <Bush position={[3.2, 0.1, 0.4]} />
        <Bush position={[-4, 0.1, -1.6]} berries="#ffa514" />
      </Island>
    </>
  );
}

function BikeRig() {
  const g = useRef<THREE.Group>(null);
  const moving = useRef(false);
  useFrame(() => { moving.current = !!g.current?.parent?.userData.moving; });
  return (
    <group ref={g} scale={0.7}>
      <FreezerBike moving />
      <Person look={LOOKS.seller} pose="idle" position={[-0.55, 0.42, 0]} rotationY={Math.PI / 2} scale={0.95} />
    </group>
  );
}

function InitShot({ activity }: { activity: string }) {
  const controls = useCam((s) => s.controls);
  useEffect(() => {
    if (!controls) return;
    if (activity === 's4-order') void controls.setLookAt(0, 20, 14, 0, 0, 0, true);
    else void controls.setLookAt(-6, 7, 13, -8, 0.8, 4, true);
  }, [controls, activity]);
  return null;
}
