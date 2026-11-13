import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SKIPPI_PRODUCTS } from '../../data/skippiData';

// Helper to create crisp, high-resolution textures without any external font/network suspension
function createSignTexture(
  mainText: string,
  subText?: string,
  opts?: {
    bgColor?: string;
    mainColor?: string;
    subColor?: string;
    mainSize?: number;
    subSize?: number;
    borderColor?: string;
    decorEmoji?: string;
  }
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background
  ctx.fillStyle = opts?.bgColor || '#ffffff';
  ctx.fillRect(0, 0, 1024, 320);

  // Decorative border
  if (opts?.borderColor) {
    ctx.strokeStyle = opts.borderColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(8, 8, 1008, 304);

    // Inner gold pin-stripe
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(22, 22, 980, 276);
  }

  // Main text
  ctx.fillStyle = opts?.mainColor || '#e11d48';
  ctx.font = `900 ${opts?.mainSize || 115}px "Baloo 2", sans-serif, system-ui`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const centerY = subText ? 115 : 160;
  ctx.fillText(mainText, 512, centerY);

  // Subtext
  if (subText) {
    ctx.fillStyle = opts?.subColor || '#0284c7';
    ctx.font = `bold ${opts?.subSize || 46}px "Nunito", sans-serif, system-ui`;
    ctx.fillText(subText, 512, 230);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// -------------------------------------------------------------
// 1. High-Detail 3D Ice Pop Model
// -------------------------------------------------------------
export const IcePop3D: React.FC<{
  position: [number, number, number];
  colorHex: string;
  glowHex: string;
  isHovered?: boolean;
  scale?: number;
}> = ({ position, colorHex, glowHex, isHovered = false, scale = 1 }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (isHovered) {
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 2.8;
      } else {
        meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 1.5 + position[0]) * 0.1;
      }
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Translucent Icy Pop Body */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.24, 0.68, 0.09]} />
        <meshPhysicalMaterial
          color={colorHex}
          emissive={colorHex}
          emissiveIntensity={isHovered ? 0.45 : 0.2}
          roughness={0.15}
          transmission={0.45}
          thickness={0.6}
          transparent
          opacity={0.93}
        />
      </mesh>

      {/* Top Sealed Heat-Notch Header */}
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[0.26, 0.06, 0.03]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Sealed bottom crimp */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.26, 0.04, 0.03]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Frost Sparkle Highlights */}
      <mesh position={[0.07, 0.48, 0.05]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.06, 0.28, 0.05]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 2. Vintage Skippi Freezer Tricycle / Bike
// -------------------------------------------------------------
export const FreezerBike: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = ({ position, rotationY = 0 }) => {
  const bikeDecalTexture = useMemo(() => {
    return createSignTexture('SKIPPI', 'FREEZER BIKE', {
      bgColor: '#ffffff',
      mainColor: '#e11d48',
      subColor: '#0284c7',
      mainSize: 130,
      subSize: 60,
      borderColor: '#0284c7'
    });
  }, []);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Insulated Front Freezer Chest */}
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.35, 0.95, 1.0]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Chrome Base Trim */}
      <mesh position={[0, 0.32, 0]} receiveShadow>
        <boxGeometry args={[1.38, 0.06, 1.04]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} />
      </mesh>
      {/* Blue Freezer Chest Hinged Lid */}
      <mesh position={[0, 1.28, 0]} castShadow>
        <boxGeometry args={[1.4, 0.09, 1.05]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      {/* Chrome Handle on Lid */}
      <mesh position={[0, 1.34, 0.35]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Skippi Brand Decal Banner on Front */}
      <mesh position={[0, 0.78, 0.51]}>
        <planeGeometry args={[1.05, 0.45]} />
        <meshStandardMaterial map={bikeDecalTexture} roughness={0.3} />
      </mesh>

      {/* Frame Backbone to Bike Saddle */}
      <mesh position={[0, 0.55, -0.9]} rotation={[0.42, 0, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 1.3, 8]} />
        <meshStandardMaterial color="#e11d48" metalness={0.7} />
      </mesh>

      {/* Bicycle Seat */}
      <mesh position={[0, 0.98, -1.25]} castShadow>
        <boxGeometry args={[0.3, 0.09, 0.36]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Handlebars & Chrome Bell */}
      <mesh position={[0, 1.15, -0.42]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.85, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.25, 1.2, -0.42]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Front Wheels (left & right of freezer box) */}
      {[-0.76, 0.76].map((x, i) => (
        <group key={i} position={[x, 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.08, 20]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          {/* Wheel Rim & Spokes */}
          <mesh>
            <cylinderGeometry args={[0.32, 0.32, 0.09, 16]} />
            <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Rear Wheel under Saddle */}
      <group position={[0, 0.38, -1.45]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.08, 20]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.32, 0.32, 0.09, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// 3. Main Skippi Vending Stall
// -------------------------------------------------------------
export const SkippiStall: React.FC<{
  position: [number, number, number];
  onStallClick?: () => void;
  selectedFlavorId?: string | null;
}> = ({ position, onStallClick, selectedFlavorId }) => {
  const vaporRef = useRef<THREE.Points>(null);
  const fairyLightsRef = useRef<THREE.Group>(null);

  // Canvas textures for stall signage
  const counterBannerTexture = useMemo(() => {
    return createSignTexture('SKIPPI ICE POPS', '100% RO Water • Natural Colours • Freeze At Home', {
      bgColor: '#fef08a',
      mainColor: '#e11d48',
      subColor: '#0369a1',
      mainSize: 105,
      subSize: 40,
      borderColor: '#e11d48'
    });
  }, []);

  const partyPackTexture = useMemo(() => {
    return createSignTexture('PARTY PACK', '12 READY-TO-FREEZE', {
      bgColor: '#7c3aed',
      mainColor: '#ffffff',
      subColor: '#fef08a',
      mainSize: 115,
      subSize: 55,
      borderColor: '#facc15'
    });
  }, []);

  const marqueeTexture = useMemo(() => {
    return createSignTexture('SKIPPI', 'ICE POPS', {
      bgColor: '#ffffff',
      mainColor: '#e11d48',
      subColor: '#0284c7',
      mainSize: 135,
      subSize: 65,
      borderColor: '#e11d48'
    });
  }, []);

  // Cold vapor mist particles rising from ice pop display
  const vaporCount = 45;
  const vaporPositions = useMemo(() => {
    const pos = new Float32Array(vaporCount * 3);
    for (let i = 0; i < vaporCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2.3;
      pos[i * 3 + 1] = 1.1 + Math.random() * 0.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.65;
    }
    return pos;
  }, []);

  useFrame((state) => {
    // Vapor mist rising
    if (vaporRef.current) {
      const geo = vaporRef.current.geometry;
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < vaporCount; i++) {
        pos[i * 3 + 1] += 0.009;
        if (pos[i * 3 + 1] > 1.85) {
          pos[i * 3 + 1] = 1.1;
          pos[i * 3] = (Math.random() - 0.5) * 2.3;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }

    // Fairy lights subtle twinkle
    if (fairyLightsRef.current) {
      const t = state.clock.getElapsedTime();
      fairyLightsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 0.6 + Math.sin(t * 3 + i) * 0.35;
        }
      });
    }
  });

  return (
    <group position={position} onClick={onStallClick}>
      {/* 1. Hardwood Platform Floor for Stall */}
      <mesh position={[0, 0.05, -0.6]} receiveShadow>
        <boxGeometry args={[3.8, 0.1, 2.4]} />
        <meshStandardMaterial color="#92400e" roughness={0.85} />
      </mesh>

      {/* 2. Main Counter Base */}
      <mesh position={[0, 0.56, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.3, 1.02, 1.15]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.4} />
      </mesh>
      {/* Cyan Base Trim */}
      <mesh position={[0, 0.1, 0.02]} receiveShadow>
        <boxGeometry args={[3.36, 0.18, 1.2]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>

      {/* 3. Polished Maple Countertop */}
      <mesh position={[0, 1.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.55, 0.08, 1.3]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.25} />
      </mesh>

      {/* 4. Front Brand Banner Sign */}
      <mesh position={[0, 0.56, 0.59]}>
        <planeGeometry args={[2.9, 0.68]} />
        <meshStandardMaterial map={counterBannerTexture} roughness={0.3} />
      </mesh>

      {/* 5. Crushed Ice Well Tray */}
      <mesh position={[0, 1.13, 0.1]} receiveShadow>
        <boxGeometry args={[2.6, 0.05, 0.72]} />
        <meshPhysicalMaterial
          color="#bae6fd"
          roughness={0.08}
          transmission={0.7}
          thickness={0.35}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Little Shimmering Ice Cubes in the tray */}
      {[-0.9, -0.5, -0.1, 0.3, 0.7].map((x, idx) => (
        <mesh key={idx} position={[x, 1.16, (idx % 2 === 0 ? 0.25 : -0.05)]} rotation={[0.2, idx, 0.1]}>
          <boxGeometry args={[0.1, 0.07, 0.1]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.1} transparent opacity={0.8} />
        </mesh>
      ))}

      {/* 6. Rows of 3D Translucent Ice Pops on Display */}
      {SKIPPI_PRODUCTS.filter((p) => !p.isPack).map((product, index) => {
        const xOffset = -1.0 + index * 0.4;
        const isSelected = selectedFlavorId === product.id;
        return (
          <IcePop3D
            key={product.id}
            position={[xOffset, 1.15, 0.1]}
            colorHex={product.colorHex}
            glowHex={product.glowHex}
            isHovered={isSelected}
            scale={isSelected ? 1.25 : 1.0}
          />
        );
      })}

      {/* 7. Ready-to-Freeze 12-Pack Box Display */}
      <group position={[1.25, 1.26, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.36, 0.65]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.33]}>
          <planeGeometry args={[0.52, 0.3]} />
          <meshStandardMaterial map={partyPackTexture} roughness={0.4} />
        </mesh>
      </group>

      {/* 8. Frost Vapor Mist */}
      <points ref={vaporRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[vaporPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          color="#ffffff"
          transparent
          opacity={0.45}
        />
      </points>

      {/* 9. Rear Deep Freezer Chest */}
      <mesh position={[0, 0.56, -0.92]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.92, 0.75]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.04, -0.92]}>
        <boxGeometry args={[2.55, 0.06, 0.8]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>

      {/* 10. Four Red Canopy Support Pillars */}
      {[
        [-1.6, 1.95, 0.5],
        [1.6, 1.95, 0.5],
        [-1.6, 1.95, -1.05],
        [1.6, 1.95, -1.05],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.8, 12]} />
          <meshStandardMaterial color="#e11d48" metalness={0.7} roughness={0.2} />
        </mesh>
      ))}

      {/* 11. Curved Striped Carnival Canopy Roof */}
      <group position={[0, 2.9, -0.28]}>
        {/* Main Canopy Dome */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <coneGeometry args={[2.5, 1.0, 4, 1, false, Math.PI / 4]} />
          <meshStandardMaterial color="#facc15" roughness={0.5} />
        </mesh>
        {/* Red & Yellow Scalloped Trim Border */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[3.5, 0.22, 2.1]} />
          <meshStandardMaterial color="#e11d48" roughness={0.5} />
        </mesh>
      </group>

      {/* 12. Hanging Fairy Festoon Lights under Canopy */}
      <group ref={fairyLightsRef} position={[0, 2.76, 0.72]}>
        {[-1.4, -0.95, -0.5, 0, 0.5, 0.95, 1.4].map((x, idx) => (
          <mesh key={idx} position={[x, -Math.abs(Math.sin((idx / 6) * Math.PI)) * 0.12, 0]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fef08a"
              emissiveIntensity={0.8}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* 13. Main Overhead Illuminated Marquee Brand Sign */}
      <group position={[0, 3.45, -0.28]}>
        <mesh castShadow>
          <boxGeometry args={[2.7, 0.6, 0.14]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[2.8, 0.7, 0.1]} />
          <meshStandardMaterial color="#e11d48" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.075]}>
          <planeGeometry args={[2.6, 0.52]} />
          <meshStandardMaterial map={marqueeTexture} roughness={0.3} />
        </mesh>
      </group>

      {/* 14. Skippi Freezer Bike proudly parked beside stall */}
      <FreezerBike position={[2.85, 0, 0.2]} rotationY={-0.3} />
    </group>
  );
};
