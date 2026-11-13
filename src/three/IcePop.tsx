import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { jelly, film, std } from './materials';
import { popLabelTexture } from './textures';

/* A Skippi-style ice pop: a slim translucent sleeve filled with coloured
   liquid, crimped seals at both ends and a vertical wordmark label. */

let crimpGeo: THREE.ExtrudeGeometry | null = null;
function getCrimp() {
  if (crimpGeo) return crimpGeo;
  const s = new THREE.Shape();
  const w = 0.13, h = 0.05, teeth = 9;
  s.moveTo(-w / 2, 0);
  for (let i = 0; i <= teeth; i++) {
    const x = -w / 2 + (i / teeth) * w;
    s.lineTo(x, h + (i % 2 ? 0.012 : 0));
  }
  s.lineTo(w / 2, 0);
  s.lineTo(-w / 2, 0);
  crimpGeo = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false });
  crimpGeo.translate(0, 0, -0.006);
  return crimpGeo;
}

export function IcePop({
  color, flavour = '', length = 1, position = [0, 0, 0], rotation = [0, 0, 0], frozen = true, spin = false, bob = false, onClick, scale = 1, highlight = false,
}: {
  color: string; flavour?: string; length?: number; position?: [number, number, number]; rotation?: [number, number, number]; frozen?: boolean; spin?: boolean; bob?: boolean; onClick?: () => void; scale?: number; highlight?: boolean;
}) {
  const g = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * 10, []);
  const label = useMemo(() => (flavour ? popLabelTexture(flavour, color) : null), [flavour, color]);
  const L = 0.62 * length;
  useFrame((st, dt) => {
    if (!g.current) return;
    const t = st.clock.elapsedTime;
    if (spin) g.current.rotation.y += dt * 0.9;
    if (bob) g.current.position.y = position[1] + Math.sin(t * 1.6 + seed) * 0.05;
    const target = highlight ? 1.12 : 1;
    const s = THREE.MathUtils.lerp(g.current.scale.x / scale, target, 0.15) * scale;
    g.current.scale.setScalar(s);
  });
  return (
    <group
      ref={g}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
      onPointerOver={onClick ? () => (document.body.style.cursor = 'pointer') : undefined}
      onPointerOut={onClick ? () => (document.body.style.cursor = '') : undefined}
    >
      {/* coloured liquid core */}
      <RoundedBox args={[0.1, L, 0.05]} radius={0.024} smoothness={4} position={[0, L / 2 + 0.05, 0]} material={jelly(color, frozen)} castShadow />
      {/* clear sleeve */}
      <RoundedBox args={[0.118, L + 0.03, 0.064]} radius={0.028} smoothness={3} position={[0, L / 2 + 0.05, 0]} material={film()} />
      {/* label */}
      {label && (
        <mesh position={[0, L / 2 + 0.05, 0.0335]}>
          <planeGeometry args={[0.1, L * 0.92]} />
          <meshStandardMaterial map={label} transparent roughness={0.4} depthWrite={false} />
        </mesh>
      )}
      {/* crimped seals */}
      <mesh geometry={getCrimp()} position={[0, L + 0.06, 0]} material={std('#ffffff', 0.35, 0, { transparent: true, opacity: 0.85 })} />
      <mesh geometry={getCrimp()} position={[0, 0.045, 0]} rotation={[0, 0, Math.PI]} material={std('#ffffff', 0.35, 0, { transparent: true, opacity: 0.85 })} />
    </group>
  );
}
