import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { std, glossy } from './materials';

/* ==========================================================================
   "Roo" — an original kangaroo guide inspired by the kangaroo in Skippi's
   logo. Procedural model + blended procedural animation states.
   ========================================================================== */
export type RooPose = 'idle' | 'hop' | 'wave' | 'cheer' | 'think' | 'talk' | 'point';
const POSES: RooPose[] = ['idle', 'hop', 'wave', 'cheer', 'think', 'talk', 'point'];
type Rig = { body: number[]; head: number[]; armL: number[]; armR: number[]; legs: number[]; tail: number[]; ears: number[] };

function lib(t: number, hopPhase: number): Record<RooPose, Rig> {
  const s = Math.sin;
  const hp = hopPhase;
  const air = Math.max(0, s(hp));
  return {
    idle: { body: [0, s(t * 2.2) * 0.012, s(t * 1.1) * 0.02], head: [s(t * 0.8) * 0.06, s(t * 0.5) * 0.2, 0], armL: [-0.3, 0, 0.2], armR: [-0.3, 0, -0.2], legs: [0, 0], tail: [s(t * 1.4) * 0.15, -0.05], ears: [s(t * 3) * 0.05 + (Math.sin(t * 0.7) > 0.95 ? 0.3 : 0), 0] },
    hop: { body: [-0.25 + air * 0.25, air * 0.55, 0], head: [0.15 - air * 0.2, 0, 0], armL: [-0.9, 0, 0.25], armR: [-0.9, 0, -0.25], legs: [air * -0.9, air * 1.1], tail: [0, 0.25 - air * 0.5], ears: [-0.35 * air, 0] },
    wave: { body: [0, s(t * 2) * 0.015, 0], head: [0.05, 0.15, s(t * 3) * 0.1], armL: [-0.3, 0, 0.2], armR: [0, 0, -2.4 + s(t * 9) * 0.35], legs: [0, 0], tail: [s(t * 4) * 0.35, 0], ears: [s(t * 6) * 0.08, 0] },
    cheer: { body: [0, Math.abs(s(t * 5.5)) * 0.4, 0], head: [-0.25, 0, 0], armL: [0, 0, 2.6], armR: [0, 0, -2.6], legs: [-Math.abs(s(t * 5.5)) * 0.6, Math.abs(s(t * 5.5)) * 0.8], tail: [s(t * 8) * 0.4, 0.2], ears: [-0.2, 0] },
    think: { body: [0.04, 0, 0.05], head: [0.15, 0.25, 0.2], armL: [-0.4, 0, 0.3], armR: [-2.2, 0, -0.1], legs: [0, 0], tail: [s(t * 0.9) * 0.2, -0.1], ears: [0.15, 0.2] },
    talk: { body: [s(t * 2.5) * 0.03, s(t * 2) * 0.01, 0], head: [s(t * 5) * 0.06, s(t * 1.6) * 0.18, 0], armL: [-0.9 + s(t * 3) * 0.3, 0, 0.5], armR: [-1 + s(t * 2.7 + 1) * 0.35, 0, -0.5], legs: [0, 0], tail: [s(t * 2) * 0.2, 0], ears: [s(t * 4) * 0.08, 0] },
    point: { body: [0, 0, 0], head: [0, -0.3, 0], armL: [-0.3, 0, 0.2], armR: [-1.5, 0, -0.35], legs: [0, 0], tail: [s(t * 2) * 0.2, 0], ears: [0.05, 0] },
  };
}

export function Roo({ pose = 'idle', scale = 1, hopPhaseRef }: { pose?: RooPose; scale?: number; hopPhaseRef?: React.MutableRefObject<number> }) {
  const fur = std('#d99a5b', 0.8);
  const furDark = std('#b87a3f', 0.8);
  const belly = std('#fbe3c0', 0.85);
  const nose = glossy('#3a2418', 0.2);
  const eyeW = std('#ffffff', 0.2);
  const eyeD = glossy('#1b1530', 0.08);
  const innerEar = std('#f2b8a0', 0.8);
  const scarf = std('#2163e0', 0.6);
  const scarfKnot = std('#ffa514', 0.6);

  const w = useRef<Record<RooPose, number>>(Object.fromEntries(POSES.map((p) => [p, p === pose ? 1 : 0])) as Record<RooPose, number>);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const thighL = useRef<THREE.Group>(null);
  const thighR = useRef<THREE.Group>(null);
  const footL = useRef<THREE.Group>(null);
  const footR = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const tail2 = useRef<THREE.Group>(null);
  const earL = useRef<THREE.Group>(null);
  const earR = useRef<THREE.Group>(null);
  const blink = useRef<THREE.Group>(null);
  const localHop = useRef(0);

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime;
    const k = 1 - Math.exp(-dt * 8);
    let sum = 0;
    for (const p of POSES) { w.current[p] += ((p === pose ? 1 : 0) - w.current[p]) * k; sum += w.current[p]; }
    if (pose === 'hop' && !hopPhaseRef) localHop.current += dt * 9;
    const L = lib(t, hopPhaseRef ? hopPhaseRef.current : localHop.current);
    const acc: Rig = { body: [0, 0, 0], head: [0, 0, 0], armL: [0, 0, 0], armR: [0, 0, 0], legs: [0, 0], tail: [0, 0], ears: [0, 0] };
    for (const p of POSES) {
      const ww = w.current[p] / sum;
      if (ww < 0.001) continue;
      (Object.keys(acc) as (keyof Rig)[]).forEach((key) => {
        const src = L[p][key];
        for (let i = 0; i < src.length; i++) acc[key][i] += src[i] * ww;
      });
    }
    if (body.current) { body.current.rotation.x = acc.body[0]; body.current.position.y = acc.body[1]; body.current.rotation.z = acc.body[2]; }
    head.current?.rotation.set(acc.head[0], acc.head[1], acc.head[2]);
    armL.current?.rotation.set(acc.armL[0], acc.armL[1], acc.armL[2]);
    armR.current?.rotation.set(acc.armR[0], acc.armR[1], acc.armR[2]);
    thighL.current && (thighL.current.rotation.x = acc.legs[0]);
    thighR.current && (thighR.current.rotation.x = acc.legs[0]);
    footL.current && (footL.current.rotation.x = acc.legs[1]);
    footR.current && (footR.current.rotation.x = acc.legs[1]);
    if (tail.current) { tail.current.rotation.y = acc.tail[0]; tail.current.rotation.x = 0.9 + acc.tail[1]; }
    if (tail2.current) tail2.current.rotation.x = -0.5 + acc.tail[1] * 0.6;
    earL.current && (earL.current.rotation.x = -0.15 + acc.ears[0]);
    earR.current && (earR.current.rotation.x = -0.15 + acc.ears[0] + acc.ears[1]);
    if (blink.current) {
      const b = (t % 4.1) < 0.11 ? 0.1 : 1;
      blink.current.scale.y = THREE.MathUtils.lerp(blink.current.scale.y, b, 0.6);
    }
  });

  const bodyGeo = useMemo(() => {
    const pts = [[0, 0], [0.2, 0.02], [0.3, 0.14], [0.32, 0.3], [0.27, 0.5], [0.19, 0.66], [0.12, 0.74], [0, 0.76]].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 28);
  }, []);
  const earGeo = useMemo(() => {
    const pts = [[0, 0], [0.06, 0.04], [0.075, 0.14], [0.06, 0.26], [0.025, 0.34], [0, 0.36]].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 16);
  }, []);

  return (
    <group scale={scale}>
      <group ref={body}>
        {/* legs: big thighs + long feet */}
        {([-1, 1] as const).map((s) => (
          <group key={s} ref={s < 0 ? thighL : thighR} position={[s * 0.19, 0.22, 0.02]}>
            <mesh castShadow material={fur} scale={[0.85, 1, 1.15]}>
              <sphereGeometry args={[0.17, 20, 16]} />
            </mesh>
            <group ref={s < 0 ? footL : footR} position={[0, -0.14, 0.02]}>
              <mesh position={[0, -0.05, 0.12]} castShadow material={furDark} scale={[0.75, 0.42, 2.0]}>
                <sphereGeometry args={[0.09, 16, 12]} />
              </mesh>
            </group>
          </group>
        ))}
        {/* torso */}
        <mesh castShadow geometry={bodyGeo} material={fur} position={[0, 0.08, 0]} scale={[1, 1, 0.92]} />
        <mesh position={[0, 0.36, 0.17]} material={belly} scale={[0.75, 1.1, 0.5]}>
          <sphereGeometry args={[0.24, 22, 18]} />
        </mesh>
        {/* pouch line */}
        <mesh position={[0, 0.24, 0.27]} rotation={[0.2, 0, 0]} material={furDark}>
          <torusGeometry args={[0.11, 0.012, 6, 18, Math.PI]} />
        </mesh>
        {/* scarf (brand accent) */}
        <mesh position={[0, 0.74, 0]} rotation={[Math.PI / 2 + 0.1, 0, 0]} material={scarf}>
          <torusGeometry args={[0.13, 0.045, 10, 24]} />
        </mesh>
        <mesh position={[0.07, 0.7, 0.13]} material={scarfKnot}>
          <sphereGeometry args={[0.045, 12, 10]} />
        </mesh>
        {/* arms */}
        {([-1, 1] as const).map((s) => (
          <group key={s} ref={s < 0 ? armL : armR} position={[s * 0.22, 0.6, 0.08]}>
            <mesh position={[0, -0.11, 0.02]} castShadow material={fur}>
              <capsuleGeometry args={[0.045, 0.16, 6, 10]} />
            </mesh>
            <mesh position={[0, -0.23, 0.03]} material={furDark}>
              <sphereGeometry args={[0.05, 12, 10]} />
            </mesh>
          </group>
        ))}
        {/* tail */}
        <group ref={tail} position={[0, 0.16, -0.22]}>
          <mesh position={[0, 0.2, 0]} castShadow material={fur}>
            <cylinderGeometry args={[0.05, 0.11, 0.42, 14]} />
          </mesh>
          <group ref={tail2} position={[0, 0.41, 0]}>
            <mesh position={[0, 0.16, 0]} castShadow material={fur}>
              <cylinderGeometry args={[0.02, 0.05, 0.34, 12]} />
            </mesh>
          </group>
        </group>
        {/* head */}
        <group ref={head} position={[0, 0.84, 0.02]}>
          <mesh castShadow material={fur} scale={[1, 0.95, 1]}>
            <sphereGeometry args={[0.2, 28, 22]} />
          </mesh>
          {/* snout */}
          <mesh position={[0, -0.06, 0.15]} material={belly} scale={[1, 0.78, 1.15]}>
            <sphereGeometry args={[0.12, 20, 16]} />
          </mesh>
          <mesh position={[0, -0.01, 0.285]} material={nose} scale={[1.3, 0.85, 0.9]}>
            <sphereGeometry args={[0.035, 14, 10]} />
          </mesh>
          <mesh position={[0, -0.1, 0.24]} rotation={[0.3, 0, 0]} material={std('#6b3a24', 0.6)}>
            <torusGeometry args={[0.04, 0.008, 6, 14, Math.PI]} />
          </mesh>
          {/* eyes */}
          <group ref={blink} position={[0, 0.05, 0.155]}>
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.075, 0, 0]}>
                <mesh material={eyeW} scale={[1, 1.2, 0.6]}>
                  <sphereGeometry args={[0.045, 16, 12]} />
                </mesh>
                <mesh position={[0, -0.006, 0.022]} material={eyeD} scale={[1, 1.15, 0.55]}>
                  <sphereGeometry args={[0.03, 14, 10]} />
                </mesh>
                <mesh position={[0.01, 0.014, 0.038]} material={eyeW}>
                  <sphereGeometry args={[0.009, 8, 6]} />
                </mesh>
              </group>
            ))}
          </group>
          {/* ears */}
          {([-1, 1] as const).map((s) => (
            <group key={s} ref={s < 0 ? earL : earR} position={[s * 0.1, 0.14, -0.03]} rotation={[0, 0, s * -0.32]}>
              <mesh geometry={earGeo} material={fur} scale={[1, 1, 0.55]} castShadow />
              <mesh geometry={earGeo} material={innerEar} position={[0, 0.02, 0.025]} scale={[0.6, 0.85, 0.3]} />
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
