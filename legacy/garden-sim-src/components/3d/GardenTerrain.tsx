import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// -------------------------------------------------------------
// 1. Procedural Grass Blade Clump
// -------------------------------------------------------------
const GrassTuft: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      {/* 3 crossing blades of grass */}
      <mesh position={[-0.04, 0.12, 0]} rotation={[0.1, 0.2, -0.25]} castShadow>
        <coneGeometry args={[0.03, 0.26, 3]} />
        <meshStandardMaterial color="#4ade80" roughness={0.6} />
      </mesh>
      <mesh position={[0.04, 0.14, 0.02]} rotation={[-0.15, -0.3, 0.2]} castShadow>
        <coneGeometry args={[0.035, 0.3, 3]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.16, -0.03]} rotation={[0.2, 0.4, 0.05]} castShadow>
        <coneGeometry args={[0.03, 0.34, 3]} />
        <meshStandardMaterial color="#86efac" roughness={0.6} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 2. High-Quality Stylized Ghibli Tree
// -------------------------------------------------------------
export const StylizedTree: React.FC<{
  position: [number, number, number];
  scale?: number;
  foliageColor?: string;
  highlightColor?: string;
  trunkHeight?: number;
  rotationY?: number;
}> = ({
  position,
  scale = 1,
  foliageColor = '#2d6a4f',
  highlightColor = '#52b788',
  trunkHeight = 2.4,
  rotationY = 0
}) => {
  const foliageRef = useRef<THREE.Group>(null);
  const randomPhase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (foliageRef.current) {
      const t = state.clock.getElapsedTime() * 1.2 + randomPhase;
      foliageRef.current.rotation.z = Math.sin(t) * 0.025;
      foliageRef.current.rotation.x = Math.cos(t * 0.8) * 0.018;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* Trunk with base root flare */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.38, trunkHeight, 8]} />
        <meshStandardMaterial color="#5c3818" roughness={0.9} />
      </mesh>
      {/* Roots spreading into soil */}
      <mesh position={[0.18, 0.1, 0.12]} rotation={[0.4, 0.2, -0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.15, 0.5, 6]} />
        <meshStandardMaterial color="#5c3818" roughness={0.9} />
      </mesh>
      <mesh position={[-0.18, 0.1, -0.1]} rotation={[-0.3, 0.4, 0.4]} castShadow>
        <cylinderGeometry args={[0.08, 0.14, 0.45, 6]} />
        <meshStandardMaterial color="#5c3818" roughness={0.9} />
      </mesh>

      {/* Volumetric Layered Cloud Foliage */}
      <group ref={foliageRef} position={[0, trunkHeight, 0]}>
        {/* Bottom shade layer */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <icosahedronGeometry args={[1.5, 2]} />
          <meshStandardMaterial color={foliageColor} roughness={0.7} flatShading />
        </mesh>
        {/* Left lobe */}
        <mesh position={[-0.9, 0.7, 0.3]} scale={0.82} castShadow>
          <icosahedronGeometry args={[1.3, 2]} />
          <meshStandardMaterial color={foliageColor} roughness={0.7} flatShading />
        </mesh>
        {/* Right lobe */}
        <mesh position={[0.85, 0.85, -0.25]} scale={0.88} castShadow>
          <icosahedronGeometry args={[1.3, 2]} />
          <meshStandardMaterial color={highlightColor} roughness={0.65} flatShading />
        </mesh>
        {/* Front lobe */}
        <mesh position={[0.1, 0.5, 0.8]} scale={0.7} castShadow>
          <icosahedronGeometry args={[1.1, 2]} />
          <meshStandardMaterial color={highlightColor} roughness={0.65} flatShading />
        </mesh>
        {/* Top sunlit peak */}
        <mesh position={[0, 1.9, 0]} scale={0.78} castShadow>
          <icosahedronGeometry args={[1.2, 2]} />
          <meshStandardMaterial color={highlightColor} roughness={0.6} flatShading />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// 3. Cute 5-Petal Flower
// -------------------------------------------------------------
const PetalFlower: React.FC<{
  position: [number, number, number];
  color: string;
  scale?: number;
}> = ({ position, color, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      {/* Green Stem */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.02, 0.3, 4]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      {/* Green Leaves on stem */}
      <mesh position={[0.04, 0.1, 0]} rotation={[0, 0, -0.6]}>
        <coneGeometry args={[0.03, 0.12, 3]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <mesh position={[-0.04, 0.14, 0]} rotation={[0, 0, 0.6]}>
        <coneGeometry args={[0.03, 0.12, 3]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      {/* Center Golden Pistil */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} />
      </mesh>
      {/* 5 Petals */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        const px = Math.cos(angle) * 0.08;
        const pz = Math.sin(angle) * 0.08;
        return (
          <mesh key={i} position={[px, 0.3, pz]} rotation={[-0.2, angle, 0]} castShadow>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
};

// -------------------------------------------------------------
// 4. Detailed Flower Bed with Soil Mound
// -------------------------------------------------------------
export const FlowerBed: React.FC<{
  position: [number, number, number];
  color: string;
  radius?: number;
  count?: number;
}> = ({ position, color, radius = 1.2, count = 10 }) => {
  const flowers = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + (i % 2) * 0.3;
      const r = 0.2 + (i / count) * (radius - 0.25);
      return {
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        scale: 0.8 + (i % 3) * 0.15
      };
    });
  }, [count, radius]);

  return (
    <group position={position}>
      {/* Raised soil bed with stone ring border */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[radius * 1.05, radius * 1.15, 0.1, 16]} />
        <meshStandardMaterial color="#3e2723" roughness={0.95} />
      </mesh>
      {/* Cobble border stones */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((idx) => {
        const a = (idx * Math.PI * 2) / 12;
        const bx = Math.cos(a) * (radius * 1.12);
        const bz = Math.sin(a) * (radius * 1.12);
        return (
          <mesh key={idx} position={[bx, 0.07, bz]} rotation={[0, a, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.22, 0.12, 0.16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.8} />
          </mesh>
        );
      })}

      {flowers.map((f, i) => (
        <PetalFlower key={i} position={[f.x, 0.06, f.z]} color={color} scale={f.scale} />
      ))}
    </group>
  );
};

// -------------------------------------------------------------
// 5. Cute Red & White Toadstool Mushroom
// -------------------------------------------------------------
const ToadstoolMushroom: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      {/* White stalk */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.24, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      {/* Red rounded cap */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.13, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e11d48" roughness={0.3} />
      </mesh>
      {/* White dots on cap */}
      <mesh position={[0, 0.37, 0]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.08, 0.3, 0.05]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.07, 0.3, -0.06]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 6. Smooth Garden Boulder / Rock
// -------------------------------------------------------------
const GardenRock: React.FC<{ position: [number, number, number]; scale?: [number, number, number]; rotationY?: number }> = ({
  position,
  scale = [1, 1, 1],
  rotationY = 0
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh scale={scale} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial color="#64748b" roughness={0.85} flatShading />
      </mesh>
      {/* Moss patch on top */}
      <mesh position={[0, scale[1] * 0.32, 0]} scale={[scale[0] * 0.7, 0.1, scale[2] * 0.7]}>
        <sphereGeometry args={[0.4, 6, 6]} />
        <meshStandardMaterial color="#4ade80" roughness={0.9} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 7. Manicured Boxwood Garden Hedge
// -------------------------------------------------------------
const GardenHedge: React.FC<{
  position: [number, number, number];
  length?: number;
  rotationY?: number;
}> = ({ position, length = 3, rotationY = 0 }) => {
  return (
    <mesh position={position} rotation={[0, rotationY, 0]} castShadow receiveShadow>
      <boxGeometry args={[length, 0.7, 0.6]} />
      <meshStandardMaterial color="#166534" roughness={0.8} />
    </mesh>
  );
};

// -------------------------------------------------------------
// 8. Multi-Tier Grand Water Fountain
// -------------------------------------------------------------
export const GardenFountain: React.FC<{
  position: [number, number, number];
}> = ({ position }) => {
  const waterRef = useRef<THREE.Mesh>(null);
  const ripple1Ref = useRef<THREE.Mesh>(null);
  const ripple2Ref = useRef<THREE.Mesh>(null);
  const sprayRef = useRef<THREE.Points>(null);

  const sprayCount = 120;
  const sprayPositions = useMemo(() => {
    const pos = new Float32Array(sprayCount * 3);
    for (let i = 0; i < sprayCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = 2.0 + Math.random() * 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Water surface pulsation
    if (waterRef.current) {
      waterRef.current.rotation.z = t * 0.2;
    }

    // Expanding ripples
    if (ripple1Ref.current) {
      const s1 = 0.5 + ((t * 0.8) % 1) * 2.1;
      ripple1Ref.current.scale.set(s1, s1, 1);
      const mat = ripple1Ref.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = Math.max(0, 0.6 - ((t * 0.8) % 1) * 0.6);
    }
    if (ripple2Ref.current) {
      const s2 = 0.5 + (((t * 0.8) + 0.5) % 1) * 2.1;
      ripple2Ref.current.scale.set(s2, s2, 1);
      const mat = ripple2Ref.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = Math.max(0, 0.6 - (((t * 0.8) + 0.5) % 1) * 0.6);
    }

    // Animated water droplet physics
    if (sprayRef.current) {
      const geo = sprayRef.current.geometry;
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < sprayCount; i++) {
        pos[i * 3 + 1] -= 0.045; // Gravity
        // Add gentle outward spread
        pos[i * 3] += (Math.sin(i * 13 + t * 4) * 0.005);
        pos[i * 3 + 2] += (Math.cos(i * 17 + t * 4) * 0.005);

        if (pos[i * 3 + 1] < 1.1) {
          pos[i * 3 + 1] = 2.3 + Math.random() * 0.5;
          pos[i * 3] = (Math.random() - 0.5) * 0.25;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Outer Grand Pool Basin Wall */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.2, 3.4, 0.9, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>
      {/* Basin Rim Molding */}
      <mesh position={[0, 0.92, 0]} castShadow>
        <torusGeometry args={[3.3, 0.16, 12, 32]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} />
      </mesh>

      {/* Middle Tier Pedestal */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.5, 0.6, 24]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>
      {/* Middle Tier Basin */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[1.6, 1.1, 0.25, 24]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} />
      </mesh>

      {/* Top Center Spire */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.4, 0.9, 16]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>
      {/* Spire Top Urn */}
      <mesh position={[0, 2.35, 0]} castShadow>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Main Transparent Glistening Water Surface */}
      <mesh ref={waterRef} position={[0, 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.15, 32]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.8}
          roughness={0.08}
          ior={1.33}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Animated Expanding Ripple Rings */}
      <mesh ref={ripple1Ref} position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 1.05, 32]} />
        <meshBasicMaterial color="#bae6fd" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ripple2Ref} position={[0, 0.815, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 1.05, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Sparkling Water Spray Particles */}
      <points ref={sprayRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sprayPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#e0f2fe"
          transparent
          opacity={0.9}
        />
      </points>
    </group>
  );
};

// -------------------------------------------------------------
// 9. Ornate Park Bench
// -------------------------------------------------------------
export const ParkBench: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = ({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Wood slats seat */}
      {[-0.15, -0.05, 0.05, 0.15].map((z, i) => (
        <mesh key={i} position={[0, 0.45, z]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.04, 0.08]} />
          <meshStandardMaterial color="#92400e" roughness={0.7} />
        </mesh>
      ))}

      {/* Wood slats backrest */}
      {[0.6, 0.72, 0.84].map((y, i) => (
        <mesh key={i} position={[0, y, -0.2]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[1.9, 0.09, 0.03]} />
          <meshStandardMaterial color="#92400e" roughness={0.7} />
        </mesh>
      ))}

      {/* Cast Iron Curved Legs & Armrests */}
      {[-0.85, 0.85].map((x, idx) => (
        <group key={idx} position={[x, 0, 0]}>
          {/* Leg front */}
          <mesh position={[0, 0.22, 0.16]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.44, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Leg back */}
          <mesh position={[0, 0.22, -0.16]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.44, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Curved Armrest */}
          <mesh position={[0, 0.58, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// -------------------------------------------------------------
// 10. Victorian Streetlamp with Warm Glow
// -------------------------------------------------------------
export const GardenLamp: React.FC<{
  position: [number, number, number];
}> = ({ position }) => {
  return (
    <group position={position}>
      {/* Stone Pedestal Base */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.3, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      {/* Fluted Cast Iron Pole */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.12, 3.2, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Decorative Capital */}
      <mesh position={[0, 3.35, 0]}>
        <cylinderGeometry args={[0.18, 0.09, 0.2, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Lantern Housing Glass */}
      <mesh position={[0, 3.65, 0]}>
        <cylinderGeometry args={[0.28, 0.18, 0.45, 6]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={0.8}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Lantern Cap Roof */}
      <mesh position={[0, 3.95, 0]} castShadow>
        <coneGeometry args={[0.34, 0.25, 6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>

      {/* Warm Ambient Point Light */}
      <pointLight position={[0, 3.65, 0]} color="#fde047" intensity={0.9} distance={8} />
    </group>
  );
};

// -------------------------------------------------------------
// 11. Complete Assembled Garden Terrain
// -------------------------------------------------------------
export const GardenTerrain: React.FC = () => {
  // Generate random grass tufts for lush texture
  const grassTufts = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3.5 + Math.random() * 16;
      list.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return list;
  }, []);

  return (
    <group>
      {/* 1. Base Soil Earth Disc */}
      <mesh position={[0, -0.22, 0]} receiveShadow>
        <cylinderGeometry args={[26, 27, 0.4, 48]} />
        <meshStandardMaterial color="#3b2615" roughness={0.95} />
      </mesh>

      {/* 2. Main Lush Vibrant Grass Island */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[25, 25.5, 0.2, 48]} />
        <meshStandardMaterial color="#4ade80" roughness={0.7} />
      </mesh>

      {/* Outer Rolling Meadow Rim */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <cylinderGeometry args={[32, 34, 0.3, 36]} />
        <meshStandardMaterial color="#22c55e" roughness={0.85} />
      </mesh>

      {/* 3. Central Cobblestone Plaza (in front of Skippi Stall) */}
      <mesh position={[0, 0.015, 1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0, 6.8, 48]} />
        <meshStandardMaterial color="#e2d9cc" roughness={0.75} />
      </mesh>
      {/* Plaza Stone Rim Curb */}
      <mesh position={[0, 0.03, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.7, 7.0, 48]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>

      {/* 4. Warm Flagstone Pathway connecting Entrance to Stall & Fountain */}
      <mesh position={[0, 0.02, 9.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 13]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
      </mesh>
      {/* East-West Cross Walkway */}
      <mesh position={[0, 0.018, 1]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
        <planeGeometry args={[3.0, 24]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
      </mesh>

      {/* 5. Stepping Stones around the stall perimeter */}
      {[-3.2, -2.0, -0.8, 0.8, 2.0, 3.2].map((x, idx) => (
        <mesh key={idx} position={[x, 0.03, -2.4]} receiveShadow castShadow>
          <cylinderGeometry args={[0.42, 0.46, 0.05, 8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.85} />
        </mesh>
      ))}

      {/* 6. Procedural Grass Tufts scattered across the lawn */}
      {grassTufts.map((pos, idx) => (
        <GrassTuft key={idx} position={pos} scale={0.8 + (idx % 3) * 0.25} />
      ))}

      {/* 7. Central Multi-Tier Grand Fountain */}
      <GardenFountain position={[0, 0, 10.5]} />

      {/* 8. Lush Stylized Ghibli Trees */}
      <StylizedTree position={[-7, 0, 4]} scale={1.35} foliageColor="#15803d" highlightColor="#4ade80" />
      <StylizedTree position={[-9, 0, -3]} scale={1.5} foliageColor="#166534" highlightColor="#22c55e" />
      <StylizedTree position={[-6, 0, -7]} scale={1.2} foliageColor="#15803d" highlightColor="#34d399" />
      <StylizedTree position={[7, 0, 4.5]} scale={1.4} foliageColor="#166534" highlightColor="#4ade80" />
      <StylizedTree position={[9, 0, -2.5]} scale={1.55} foliageColor="#15803d" highlightColor="#22c55e" />
      <StylizedTree position={[6, 0, -7.5]} scale={1.25} foliageColor="#166534" highlightColor="#34d399" />
      {/* Background Framing Trees */}
      <StylizedTree position={[-3.2, 0, -8.5]} scale={1.4} foliageColor="#15803d" highlightColor="#4ade80" />
      <StylizedTree position={[0, 0, -9.8]} scale={1.65} foliageColor="#166534" highlightColor="#22c55e" />
      <StylizedTree position={[3.2, 0, -8.5]} scale={1.45} foliageColor="#15803d" highlightColor="#34d399" />

      {/* 9. Charming Flower Beds */}
      <FlowerBed position={[-3.6, 0, 3.8]} color="#f43f5e" radius={1.2} count={12} />
      <FlowerBed position={[3.6, 0, 3.8]} color="#f59e0b" radius={1.2} count={12} />
      <FlowerBed position={[-5.2, 0, 8.5]} color="#a855f7" radius={1.4} count={14} />
      <FlowerBed position={[5.2, 0, 8.5]} color="#06b6d4" radius={1.4} count={14} />
      <FlowerBed position={[-4.5, 0, -1.2]} color="#ec4899" radius={1.0} count={10} />
      <FlowerBed position={[4.5, 0, -1.2]} color="#eab308" radius={1.0} count={10} />

      {/* 10. Toadstool Mushrooms near tree bases */}
      <ToadstoolMushroom position={[-6.2, 0, 3.2]} scale={1.2} />
      <ToadstoolMushroom position={[-6.5, 0, 3.5]} scale={0.8} />
      <ToadstoolMushroom position={[6.2, 0, 3.8]} scale={1.1} />
      <ToadstoolMushroom position={[6.4, 0, 4.1]} scale={0.7} />

      {/* 11. Garden Boulders & River Rocks */}
      <GardenRock position={[-5.5, 0.15, 1.5]} scale={[1.2, 0.9, 1.1]} rotationY={0.6} />
      <GardenRock position={[-5.8, 0.1, 2.1]} scale={[0.8, 0.6, 0.8]} rotationY={1.2} />
      <GardenRock position={[5.5, 0.15, 1.5]} scale={[1.1, 0.8, 1.0]} rotationY={-0.4} />

      {/* 12. Park Hedges */}
      <GardenHedge position={[-7.5, 0.35, 1]} length={3.5} rotationY={Math.PI / 2} />
      <GardenHedge position={[7.5, 0.35, 1]} length={3.5} rotationY={Math.PI / 2} />

      {/* 13. Ornate Park Benches */}
      <ParkBench position={[-4.6, 0, 6.2]} rotationY={Math.PI / 4} />
      <ParkBench position={[4.6, 0, 6.2]} rotationY={-Math.PI / 4} />
      <ParkBench position={[-4.6, 0, -3.2]} rotationY={Math.PI / 3} />
      <ParkBench position={[4.6, 0, -3.2]} rotationY={-Math.PI / 3} />

      {/* 14. Victorian Streetlamps with Warm Lights */}
      <GardenLamp position={[-2.4, 0, 5]} />
      <GardenLamp position={[2.4, 0, 5]} />
      <GardenLamp position={[-2.4, 0, 14]} />
      <GardenLamp position={[2.4, 0, 14]} />

      {/* 15. Grand Entrance Garden Pergola / Arch */}
      <group position={[0, 0, 17.5]}>
        {/* Wooden Pillars */}
        <mesh position={[-2.2, 1.9, 0]} castShadow>
          <boxGeometry args={[0.3, 3.8, 0.3]} />
          <meshStandardMaterial color="#5c3818" roughness={0.8} />
        </mesh>
        <mesh position={[2.2, 1.9, 0]} castShadow>
          <boxGeometry args={[0.3, 3.8, 0.3]} />
          <meshStandardMaterial color="#5c3818" roughness={0.8} />
        </mesh>
        {/* Top Crossbeams */}
        <mesh position={[0, 3.8, 0]} castShadow>
          <boxGeometry args={[5.2, 0.28, 0.5]} />
          <meshStandardMaterial color="#5c3818" roughness={0.8} />
        </mesh>
        {/* Hanging Ivy Vine Clusters */}
        {[-1.5, -0.5, 0.5, 1.5].map((x, idx) => (
          <mesh key={idx} position={[x, 3.5, 0]}>
            <coneGeometry args={[0.2, 0.5, 4]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
        ))}
      </group>
    </group>
  );
};
