import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { CameraControls, Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { create } from 'zustand';
import { useGame } from '../game/store';

/* ------------------------------------------------------------------ camera director */
interface CamStore {
  controls: CameraControls | null;
  follow: boolean;
  set: (c: CameraControls | null) => void;
  setFollow: (f: boolean) => void;
}
export const useCam = create<CamStore>()((set) => ({
  controls: null,
  follow: false,
  set: (c) => set({ controls: c }),
  setFollow: (f) => set({ follow: f }),
}));

/** Move the camera smoothly to a shot whenever `key` changes. */
export function useShot(pos: [number, number, number], target: [number, number, number], key: unknown, smooth = true) {
  const controls = useCam((s) => s.controls);
  useEffect(() => {
    if (!controls) return;
    void controls.setLookAt(pos[0], pos[1], pos[2], target[0], target[1], target[2], smooth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, key]);
}

export function CamLimits({ min = 3, max = 22, minPolar = 0.35, maxPolar = 1.42, azimuth = Infinity, enabled = true }: { min?: number; max?: number; minPolar?: number; maxPolar?: number; azimuth?: number; enabled?: boolean }) {
  const controls = useCam((s) => s.controls);
  useEffect(() => {
    if (!controls) return;
    controls.minDistance = min;
    controls.maxDistance = max;
    controls.minPolarAngle = minPolar;
    controls.maxPolarAngle = maxPolar;
    controls.minAzimuthAngle = -azimuth;
    controls.maxAzimuthAngle = azimuth;
    controls.enabled = enabled;
    controls.smoothTime = 0.45;
    controls.dollySpeed = 0.6;
    controls.truckSpeed = 0;
  }, [controls, min, max, minPolar, maxPolar, azimuth, enabled]);
  return null;
}

/* ------------------------------------------------------------------ lights */
export function Lights({
  sun = [8, 14, 6], intensity = 2.4, color = '#fff4dc', ambient = 0.55, sky = '#bfe6ff', ground = '#ffe2b0', shadowSize = 14, fogColor, fogNear = 30, fogFar = 80,
}: { sun?: [number, number, number]; intensity?: number; color?: string; ambient?: number; sky?: string; ground?: string; shadowSize?: number; fogColor?: string; fogNear?: number; fogFar?: number }) {
  const quality = useGame((s) => s.quality);
  const map = quality === 'high' ? 2048 : 1024;
  return (
    <>
      <hemisphereLight args={[sky, ground, ambient]} />
      <directionalLight
        position={sun}
        intensity={intensity}
        color={color}
        castShadow={quality === 'high'}
        shadow-mapSize={[map, map]}
        shadow-camera-left={-shadowSize}
        shadow-camera-right={shadowSize}
        shadow-camera-top={shadowSize}
        shadow-camera-bottom={-shadowSize}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-sun[0], sun[1] * 0.5, -sun[2]]} intensity={0.35} color="#bcd6ff" />
      {fogColor && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}
    </>
  );
}

/** Procedural studio environment for reflections — no HDR download, works offline. */
function StudioEnv() {
  return (
    <Environment resolution={64} frames={1}>
      <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#ffe2b0" position={[6, 2, 4]} scale={[6, 3, 1]} />
      <Lightformer form="rect" intensity={1.0} color="#bfe6ff" position={[-6, 2, -4]} scale={[6, 3, 1]} />
      <Lightformer form="ring" intensity={0.8} color="#ffa514" position={[0, 1, -8]} scale={4} />
    </Environment>
  );
}

/* ------------------------------------------------------------------ scenes (lazy) */
const scenes = {
  island: lazy(() => import('../scenes/IslandScene')),
  s1: lazy(() => import('../scenes/ParkScene')),
  s2: lazy(() => import('../scenes/StudioScene')),
  s3: lazy(() => import('../scenes/StrategyScene')),
  s4: lazy(() => import('../scenes/TimelineScene')),
  s5: lazy(() => import('../scenes/NumbersScene')),
  s6: lazy(() => import('../scenes/CampaignScene')),
  s7: lazy(() => import('../scenes/ArenaScene')),
  s8: lazy(() => import('../scenes/StudioScene')),
  s9: lazy(() => import('../scenes/StreetScene')),
  s10: lazy(() => import('../scenes/GardenScene')),
  s11: lazy(() => import('../scenes/WorkshopScene')),
  s12: lazy(() => import('../scenes/StudioScene')),
  s13: lazy(() => import('../scenes/StudioScene')),
};
export type SceneKey = keyof typeof scenes;

function ResetCursor({ k }: { k: string }) {
  useEffect(() => () => { document.body.style.cursor = ''; }, [k]);
  return null;
}

function ControlsBinder() {
  const ref = useRef<CameraControls>(null);
  const setC = useCam((s) => s.set);
  const follow = useCam((s) => s.follow);
  useEffect(() => { setC(ref.current); return () => setC(null); }, [setC]);
  return <CameraControls ref={ref} makeDefault enabled={!follow} />;
}

function DprManager({ onDecline }: { onDecline: () => void }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => { gl.shadowMap.type = THREE.PCFSoftShadowMap; }, [gl]);
  return <PerformanceMonitor onDecline={onDecline} flipflops={2} />;
}

export function Stage({ sceneKey, variant, overlay }: { sceneKey: SceneKey; variant?: string; overlay?: ReactNode }) {
  const quality = useGame((s) => s.quality);
  const [dprMax, setDprMax] = useState(quality === 'high' ? 1.75 : 1);
  useEffect(() => setDprMax(quality === 'high' ? 1.75 : 1), [quality]);
  const Scene = scenes[sceneKey];
  return (
    <Canvas
      shadows
      dpr={[1, dprMax]}
      camera={{ position: [10, 8, 12], fov: 42, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onPointerMissed={() => { document.body.style.cursor = ''; }}
    >
      <DprManager onDecline={() => setDprMax(1)} />
      <ControlsBinder />
      <StudioEnv />
      <ResetCursor k={sceneKey + (variant ?? '')} />
      <Suspense fallback={null}>
        <Scene key={sceneKey + (variant ?? '')} variant={variant} />
      </Suspense>
      {overlay}
    </Canvas>
  );
}
