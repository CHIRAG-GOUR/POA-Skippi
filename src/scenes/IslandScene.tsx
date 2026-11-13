import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Billboard, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Roo, type RooPose } from '../three/Roo';
import { IcePop } from '../three/IcePop';
import {
  SkyDome, Clouds, Island, Water, PalmTree, RoundTree, Bush, Meadow, Rock, SkippiStall, Flag, Umbrella, Podium, SharkChair, Lantern, Bench, Sign, Shop, IceCreamCone, CoinStack,
} from '../three/props';
import { Lights, useCam, CamLimits } from '../three/Stage';
import { std, glossy, emissive, FLAVOURS } from '../three/materials';
import { numberBadgeTexture, signTexture } from '../three/textures';
import { SECTIONS, type SectionId } from '../game/sections';
import { useGame, useScene } from '../game/store';
import { sfx } from '../audio/sfx';

const R_ST = 10.2;
export const STATION_POS: Record<SectionId, [number, number]> = Object.fromEntries(
  SECTIONS.map((s, i) => {
    const a = -Math.PI / 2 + (i / SECTIONS.length) * Math.PI * 2;
    return [s.id, [Math.cos(a) * R_ST, Math.sin(a) * R_ST]];
  }),
) as Record<SectionId, [number, number]>;

const NEAR = 2.4;
const ISLAND_R = 15;

export default function IslandScene({ variant }: { variant?: string }) {
  const title = variant === 'title';
  const controls = useCam((s) => s.controls);
  const rooRef = useRef<THREE.Group>(null);
  const pos = useRef(new THREE.Vector3(0, 0, 3.2));
  const target = useRef<THREE.Vector3 | null>(null);
  const keys = useRef<Record<string, boolean>>({});
  const hop = useRef(0);
  const [pose, setPose] = useState<RooPose>('wave');
  const lastSection = useGame((s) => s.lastSection);
  const put = useScene((s) => s.put);
  const nearRef = useRef<string | null>(null);
  const marker = useRef<THREE.Mesh>(null);

  // start next to the last visited station
  useEffect(() => {
    if (!title && lastSection) {
      const [x, z] = STATION_POS[lastSection];
      const v = new THREE.Vector3(x, 0, z).multiplyScalar(0.78);
      pos.current.copy(v);
    }
    const t = setTimeout(() => setPose('idle'), 1800);
    return () => clearTimeout(t);
  }, [title, lastSection]);

  // camera
  useEffect(() => {
    if (!controls) return;
    if (title) {
      void controls.setLookAt(0, 9, 22, 0, 0.5, 0, false);
    } else {
      const p = pos.current;
      void controls.setLookAt(p.x + 0, 7.5, p.z + 10, p.x, 0.8, p.z, true);
    }
  }, [controls, title]);

  // keyboard
  useEffect(() => {
    if (title) return;
    const down = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [title]);

  // walk-to requests from the DOM HUD
  const walkTo = useScene((s) => s.data.walkTo as SectionId | undefined);
  useEffect(() => {
    if (!walkTo) return;
    const [x, z] = STATION_POS[walkTo];
    target.current = new THREE.Vector3(x, 0, z).multiplyScalar(0.84);
    put('walkTo', undefined);
  }, [walkTo, put]);

  useFrame((st, dt) => {
    const g = rooRef.current;
    if (!g) return;
    const t = st.clock.elapsedTime;
    if (title) {
      if (controls) controls.azimuthAngle += dt * 0.06;
      g.position.set(0, 0.06, 3.2);
      g.rotation.y = Math.sin(t * 0.4) * 0.3;
      return;
    }
    // input direction
    const k = keys.current;
    const dir = new THREE.Vector3();
    if (k['w'] || k['arrowup']) dir.z -= 1;
    if (k['s'] || k['arrowdown']) dir.z += 1;
    if (k['a'] || k['arrowleft']) dir.x -= 1;
    if (k['d'] || k['arrowright']) dir.x += 1;
    if (dir.lengthSq() > 0) {
      target.current = null;
      const az = controls ? controls.azimuthAngle : 0;
      dir.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), az);
    } else if (target.current) {
      dir.subVectors(target.current, pos.current).setY(0);
      if (dir.length() < 0.12) { target.current = null; dir.set(0, 0, 0); }
      else dir.normalize();
    }
    const moving = dir.lengthSq() > 0;
    if (moving) {
      const speed = 3.6;
      const next = pos.current.clone().addScaledVector(dir, speed * dt);
      const r = Math.hypot(next.x, next.z);
      if (r > ISLAND_R - 1.2) next.multiplyScalar((ISLAND_R - 1.2) / r);
      // soft collision with station buildings
      for (const s of SECTIONS) {
        const [sx, sz] = STATION_POS[s.id];
        const d = Math.hypot(next.x - sx, next.z - sz);
        if (d < 1.15) { const push = new THREE.Vector3(next.x - sx, 0, next.z - sz).normalize().multiplyScalar(1.15); next.set(sx + push.x, 0, sz + push.z); }
      }
      pos.current.copy(next);
      const yaw = Math.atan2(dir.x, dir.z);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, shortestAngle(g.rotation.y, yaw), 0.2);
      const prev = hop.current;
      hop.current += dt * 10;
      if (Math.floor(prev / Math.PI) !== Math.floor(hop.current / Math.PI) && Math.sin(hop.current) > 0) sfx.hop();
      if (pose !== 'hop') setPose('hop');
    } else {
      hop.current = 0;
      if (pose === 'hop') setPose('idle');
    }
    const air = moving ? Math.max(0, Math.sin(hop.current)) * 0.35 : 0;
    g.position.set(pos.current.x, 0.06 + air, pos.current.z);
    if (controls) void controls.moveTo(pos.current.x, 0.8, pos.current.z, true);

    // proximity
    let near: string | null = null;
    for (const s of SECTIONS) {
      const [sx, sz] = STATION_POS[s.id];
      if (Math.hypot(pos.current.x - sx, pos.current.z - sz) < NEAR) near = s.id;
    }
    if (near !== nearRef.current) {
      nearRef.current = near;
      put('near', near);
      if (near) { sfx.pop(); setPose('wave'); setTimeout(() => setPose((p) => (p === 'wave' ? 'idle' : p)), 1400); }
    }
    if (marker.current) {
      marker.current.visible = !!target.current;
      if (target.current) marker.current.position.set(target.current.x, 0.13, target.current.z);
      marker.current.scale.setScalar(1 + Math.sin(t * 6) * 0.1);
    }
  });

  const onGround = (e: ThreeEvent<MouseEvent>) => {
    if (title || e.delta > 8) return;
    e.stopPropagation();
    const p = e.point;
    target.current = new THREE.Vector3(p.x, 0, p.z);
  };

  const stationClick = (id: SectionId) => {
    if (title) return;
    const [x, z] = STATION_POS[id];
    target.current = new THREE.Vector3(x, 0, z).multiplyScalar(0.84);
  };

  return (
    <>
      <SkyDome top="#3ea6ff" mid="#a9dcff" bottom="#fff1d6" k="island" />
      <Lights sun={[12, 18, 8]} intensity={2.6} shadowSize={18} fogColor="#cfeaff" fogNear={40} fogFar={95} />
      <CamLimits min={6} max={28} minPolar={0.3} maxPolar={1.25} enabled={!title} />
      <Clouds count={9} radius={42} y={14} />
      <Water radius={90} />
      <Island radius={ISLAND_R} sand="#ffe0a3" top="#8fd14f" depth={2.6}>
        {/* invisible-ish click plane on top */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.11, 0]} onClick={onGround} visible={false}>
          <circleGeometry args={[ISLAND_R, 48]} />
          <meshBasicMaterial />
        </mesh>
        <Paths />
        <Plaza />
        <Meadow radius={ISLAND_R - 0.6} inner={2.6} count={420} avoid={[...SECTIONS.map((s) => [...STATION_POS[s.id], 2.1] as [number, number, number]), [0, 0, 3]]} />
        {/* ring of palms on the beach + trees */}
        {[...Array(14)].map((_, i) => {
          const a = (i / 14) * Math.PI * 2 + 0.2;
          return <PalmTree key={i} position={[Math.cos(a) * 15.4, 0, Math.sin(a) * 15.4]} scale={0.9 + (i % 3) * 0.15} lean={0.12 + (i % 2) * 0.1} />;
        })}
        {[...Array(13)].map((_, i) => {
          const a = -Math.PI / 2 + ((i + 0.5) / 13) * Math.PI * 2;
          return i % 2 ? (
            <RoundTree key={i} position={[Math.cos(a) * 12.8, 0, Math.sin(a) * 12.8]} scale={0.75 + (i % 3) * 0.12} color={i % 4 === 1 ? '#6cc24a' : '#4fae3a'} />
          ) : (
            <Bush key={i} position={[Math.cos(a) * 12.6, 0, Math.sin(a) * 12.6]} scale={1.1} berries={i % 4 === 0 ? '#ffa514' : '#e2336c'} />
          );
        })}
        {[...Array(6)].map((_, i) => {
          const a = (i / 6) * Math.PI * 2 + 0.6;
          return <Rock key={i} position={[Math.cos(a) * 14.2, 0.05, Math.sin(a) * 14.2]} scale={0.8 + (i % 3) * 0.3} />;
        })}
        {SECTIONS.map((s) => (
          <Station key={s.id} id={s.id} onClick={() => stationClick(s.id)} />
        ))}
      </Island>
      {/* target marker */}
      <mesh ref={marker} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.25, 0.4, 32]} />
        <meshBasicMaterial color="#ffa514" transparent opacity={0.85} />
      </mesh>
      <group ref={rooRef} position={[0, 0.06, 3.2]}>
        <Roo pose={pose} scale={1.25} hopPhaseRef={hop} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[0.42, 24]} />
          <meshBasicMaterial color="#000" transparent opacity={0.16} depthWrite={false} />
        </mesh>
      </group>
      <Boats />
    </>
  );
}

function shortestAngle(from: number, to: number) {
  let d = to - from;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return from + d;
}

function Paths() {
  const sand = std('#f6d9a2', 0.95);
  return (
    <group position={[0, 0.115, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={sand} receiveShadow>
        <ringGeometry args={[R_ST - 1.6, R_ST - 0.5, 96]} />
      </mesh>
      {SECTIONS.map((s, i) => {
        if (i % 3) return null;
        const [x, z] = STATION_POS[s.id];
        const a = Math.atan2(z, x);
        return (
          <mesh key={s.id} rotation={[-Math.PI / 2, 0, -a]} position={[x * 0.45, 0.001, z * 0.45]} material={sand} receiveShadow>
            <planeGeometry args={[R_ST * 0.75, 1.1]} />
          </mesh>
        );
      })}
    </group>
  );
}

function Plaza() {
  const welcome = useMemo(() => signTexture({ title: 'SKIPPI ISLAND', body: 'Can You Turn Childhood Nostalgia into a Billion-Rupee Business?', bg: '#2163e0', fg: '#ffffff', accent: '#ffa514', w: 1024, h: 420, titleSize: 120, bodySize: 44 }), []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]} receiveShadow material={std('#fff3df', 0.8)}>
        <circleGeometry args={[3.2, 48]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.125, 0]} material={std('#ffa514', 0.6)}>
        <ringGeometry args={[2.9, 3.2, 48]} />
      </mesh>
      <SkippiStall position={[0, 0.1, -1.2]} scale={0.95} />
      {/* giant pops sculpture */}
      {FLAVOURS.slice(0, 3).map((f, i) => (
        <IcePop key={f.id} color={f.color} flavour={f.name} length={2.6} scale={1.4} position={[-2.6 + i * 0.35, 0.1, 0.4 - i * 0.3]} rotation={[0, 0.5, -0.12 + i * 0.12]} />
      ))}
      {FLAVOURS.slice(3).map((f, i) => (
        <IcePop key={f.id} color={f.color} flavour={f.name} length={2.6} scale={1.4} position={[2.0 + i * 0.35, 0.1, -0.2 + i * 0.3]} rotation={[0, -0.5, -0.12 + i * 0.12]} />
      ))}
      <group position={[0, 0.1, 2.9]} rotation={[0, 0, 0]}>
        <mesh position={[-1.5, 0.9, 0]} material={glossy('#2163e0', 0.3)} castShadow><cylinderGeometry args={[0.08, 0.08, 1.8, 10]} /></mesh>
        <mesh position={[1.5, 0.9, 0]} material={glossy('#2163e0', 0.3)} castShadow><cylinderGeometry args={[0.08, 0.08, 1.8, 10]} /></mesh>
        <RoundedBox args={[3.3, 1.35, 0.1]} radius={0.06} position={[0, 2.1, 0]} material={glossy('#ffa514', 0.3)} castShadow />
        <mesh position={[0, 2.1, 0.055]}><planeGeometry args={[3.1, 1.25]} /><meshStandardMaterial map={welcome} /></mesh>
        <mesh position={[0, 2.1, -0.055]} rotation={[0, Math.PI, 0]}><planeGeometry args={[3.1, 1.25]} /><meshStandardMaterial map={welcome} /></mesh>
      </group>
    </group>
  );
}

function Boats() {
  const g = useRef<THREE.Group>(null);
  useFrame((st) => {
    if (!g.current) return;
    const t = st.clock.elapsedTime;
    g.current.rotation.y = t * 0.03;
    g.current.children.forEach((c, i) => { c.position.y = -0.2 + Math.sin(t * 1.3 + i) * 0.06; c.rotation.z = Math.sin(t + i) * 0.05; });
  });
  return (
    <group ref={g}>
      {[0, 2.2, 4.1].map((a, i) => (
        <group key={i} position={[Math.cos(a) * 22, -0.2, Math.sin(a) * 22]} rotation={[0, -a, 0]}>
          <RoundedBox args={[1.6, 0.4, 0.7]} radius={0.15} material={std(['#e2336c', '#ffa514', '#2163e0'][i], 0.5)} castShadow />
          <mesh position={[0, 0.9, 0]} material={std('#ffffff', 0.6, 0, { side: THREE.DoubleSide })}>
            <coneGeometry args={[0.55, 1.3, 3, 1, true]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ stations */
function Station({ id, onClick }: { id: SectionId; onClick: () => void }) {
  const def = SECTIONS.find((s) => s.id === id)!;
  const [x, z] = STATION_POS[id];
  const face = Math.atan2(-x, -z); // face plaza
  const done = useGame((s) => !!s.grade && def.activities.every((a) => s.done[`${s.grade}:${a.id}`]));
  const near = useScene((s) => s.data.near === id);
  const badge = useMemo(() => numberBadgeTexture(def.n, done ? '#7cc22b' : def.color), [def.n, def.color, done]);
  const bob = useRef<THREE.Group>(null);
  useFrame((st) => { if (bob.current) bob.current.position.y = 3.25 + Math.sin(st.clock.elapsedTime * 2 + def.n) * 0.12; });
  return (
    <group position={[x, 0.1, z]}>
      <group rotation={[0, face, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = '')}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow material={std(def.colorSoft, 0.8)}>
          <circleGeometry args={[1.7, 40]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]} material={near ? emissive(def.color, 0.8) : std(def.color, 0.6)}>
          <ringGeometry args={[1.55, 1.75, 40]} />
        </mesh>
        <Landmark id={id} color={def.color} />
      </group>
      <Billboard position={[0, 3.25, 0]}>
        <group ref={bob}>
          <mesh>
            <circleGeometry args={[0.32, 32]} />
            <meshBasicMaterial map={badge} transparent toneMapped={false} />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}

function Landmark({ id, color }: { id: SectionId; color: string }) {
  switch (id) {
    case 's1':
      return (
        <group>
          <Umbrella position={[-0.5, 0, -0.3]} a="#ffa514" b="#ffffff" />
          <IcePop color="#ffb000" flavour="Mango" length={2.2} scale={1.2} position={[0.55, 0, 0]} rotation={[0, 0.3, -0.08]} />
          <IcePop color="#c2185b" flavour="Raspberry" length={1.8} scale={1.2} position={[0.85, 0, 0.3]} rotation={[0, 0.3, 0.1]} />
        </group>
      );
    case 's2':
    case 's8':
      return (
        <group>
          <RoundedBox args={[2.2, 0.25, 1.5]} radius={0.06} position={[0, 0.12, 0]} material={glossy('#13317a', 0.3)} castShadow />
          <RoundedBox args={[2.2, 1.6, 0.12]} radius={0.05} position={[0, 1.05, -0.65]} material={std(id === 's2' ? '#2163e0' : '#1a4fc0', 0.4)} castShadow />
          <mesh position={[0, 1.05, -0.58]} material={emissive(id === 's2' ? '#7fb0ff' : '#ffd27a', 0.6)}><planeGeometry args={[1.6, 0.9]} /></mesh>
          <SharkChair position={[-0.6, 0.25, 0.3]} rotationY={0.3} />
          <SharkChair position={[0.6, 0.25, 0.3]} rotationY={-0.3} />
        </group>
      );
    case 's3':
      return (
        <group position={[0, 0, 0]}>
          {[...Array(9)].map((_, i) => (
            <RoundedBox key={i} args={[0.5, 0.25 + ((i * 37) % 5) * 0.12, 0.5]} radius={0.05} position={[-0.6 + (i % 3) * 0.6, 0.2 + ((i * 37) % 5) * 0.06, -0.6 + Math.floor(i / 3) * 0.6]}
              material={std(['#7cc22b', '#ffa514', '#2163e0', '#e2336c', '#f056a8', '#4a8bf5', '#9ad94a', '#ff8a3d', '#7a3522'][i], 0.5)} castShadow />
          ))}
        </group>
      );
    case 's4':
      return (
        <group>
          {[-0.8, -0.27, 0.27, 0.8].map((x, i) => (
            <Flag key={x} position={[x, 0, (i % 2) * 0.4 - 0.2]} color={['#f056a8', '#ffa514', '#2163e0', '#7cc22b'][i]} height={1.4 + i * 0.25} />
          ))}
          <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} material={std('#ffffff', 0.6)}><planeGeometry args={[2.4, 0.3]} /></mesh>
        </group>
      );
    case 's5':
      return (
        <group>
          {[0.25, 1.54, 2.0, 0.82].map((h, i) => (
            <RoundedBox key={i} args={[0.38, h, 0.38]} radius={0.05} position={[-0.66 + i * 0.44, h / 2, 0]} material={glossy(i === 3 ? '#e2336c' : '#f56d14', 0.3)} castShadow />
          ))}
          <CoinStack position={[0.9, 0, 0.6]} n={4} />
        </group>
      );
    case 's6':
      return <Sign title="YOUR CAMPAIGN" body="here!" w={2} h={1.1} bg="#e2336c" fg="#ffffff" accent="#ffd27a" position={[0, 0, 0]} />;
    case 's7':
      return (
        <group>
          <Podium position={[-0.75, 0, 0]} h={0.5} r={0.4} top="#2163e0" />
          <Podium position={[0, 0, -0.3]} h={0.75} r={0.4} top="#ffa514" />
          <Podium position={[0.75, 0, 0]} h={0.35} r={0.4} top="#e2336c" />
          <IcePop color="#2163e0" length={1} position={[0, 0.75, -0.3]} />
          <IceCreamCone position={[0.75, 0.35, 0]} scale={0.6} />
          <mesh position={[-0.75, 0.75, 0]} material={std('#ff5fa8', 0.7)}><icosahedronGeometry args={[0.2, 2]} /></mesh>
        </group>
      );
    case 's9':
      return <Shop position={[0, 0, -0.1]} name="MARKET" color="#ff8a3d" stocked />;
    case 's10':
      return (
        <group>
          <Lantern position={[-0.6, 0, 0.1]} lit color="#9ad94a" />
          <Lantern position={[0.6, 0, -0.2]} lit color="#ffa514" />
          <RoundTree position={[0, 0, -0.7]} scale={0.6} color="#9ad94a" />
        </group>
      );
    case 's11':
      return (
        <group>
          <mesh position={[0, 0.4, 0]} castShadow material={std('#c47a3f', 0.7)}><cylinderGeometry args={[0.75, 0.75, 0.08, 32]} /></mesh>
          <mesh position={[0, 0.2, 0]} material={std('#7a3522', 0.7)}><cylinderGeometry args={[0.08, 0.15, 0.4, 12]} /></mesh>
          {[...Array(5)].map((_, i) => {
            const a = (i / 5) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 1.05, 0.25, Math.sin(a) * 1.05]} material={std(['#2163e0', '#e2336c', '#7cc22b', '#ffa514', '#f056a8'][i], 0.5)} castShadow>
                <cylinderGeometry args={[0.22, 0.22, 0.5, 16]} />
              </mesh>
            );
          })}
        </group>
      );
    case 's12':
      return (
        <group>
          <RoundedBox args={[1.8, 1.1, 0.08]} radius={0.04} position={[0, 1.4, -0.3]} material={std('#ffffff', 0.4)} castShadow />
          <mesh position={[0, 1.4, -0.255]} material={emissive('#d9e8ff', 0.4)}><planeGeometry args={[1.6, 0.9]} /></mesh>
          {[-0.6, 0.6].map((x) => <mesh key={x} position={[x, 0.45, -0.35]} material={glossy('#13317a', 0.3)}><cylinderGeometry args={[0.04, 0.04, 0.9, 8]} /></mesh>)}
          <RoundedBox args={[0.6, 1, 0.45]} radius={0.06} position={[0.2, 0.5, 0.6]} material={glossy(color, 0.3)} castShadow />
        </group>
      );
    case 's13':
      return (
        <group>
          <Podium position={[0, 0, 0]} h={0.35} r={1.25} top="#ffa514" color="#13317a" />
          <group position={[0, 0.35, 0]}>
            <mesh position={[0, 0.5, 0]} material={glossy('#ffc53d', 0.2)} castShadow><cylinderGeometry args={[0.36, 0.12, 0.6, 24]} /></mesh>
            <mesh position={[0, 0.12, 0]} material={glossy('#ffc53d', 0.2)}><cylinderGeometry args={[0.07, 0.07, 0.2, 10]} /></mesh>
            <mesh position={[0, 0.02, 0]} material={glossy('#13317a', 0.3)}><boxGeometry args={[0.4, 0.06, 0.4]} /></mesh>
            {[-1, 1].map((s) => <mesh key={s} position={[s * 0.38, 0.55, 0]} rotation={[0, 0, Math.PI / 2]} material={glossy('#ffc53d', 0.2)}><torusGeometry args={[0.13, 0.03, 8, 16, Math.PI]} /></mesh>)}
          </group>
        </group>
      );
    default:
      return <Bench />;
  }
}

