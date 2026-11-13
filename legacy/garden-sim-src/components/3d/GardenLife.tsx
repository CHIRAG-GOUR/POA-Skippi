import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// -------------------------------------------------------------
// 1. Fluttering Cartoon Butterfly
// -------------------------------------------------------------
export const Butterfly: React.FC<{
  centerPosition: [number, number, number];
  color: string;
  orbitRadius?: number;
  speed?: number;
}> = ({ centerPosition, color, orbitRadius = 2.0, speed = 1.3 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + randomOffset;
    if (groupRef.current) {
      groupRef.current.position.x = centerPosition[0] + Math.cos(t) * orbitRadius;
      groupRef.current.position.z = centerPosition[2] + Math.sin(t) * orbitRadius;
      groupRef.current.position.y = centerPosition[1] + 0.6 + Math.sin(t * 3.5) * 0.28;
      groupRef.current.rotation.y = -t + Math.PI / 2;
    }

    // Rapid wing fluttering
    const flap = Math.sin(t * 22);
    if (leftWingRef.current) leftWingRef.current.rotation.y = flap * 0.85;
    if (rightWingRef.current) rightWingRef.current.rotation.y = -flap * 0.85;
  });

  return (
    <group ref={groupRef} position={centerPosition}>
      {/* Tiny body */}
      <mesh>
        <capsuleGeometry args={[0.018, 0.09, 4, 4]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      {/* Left Wing */}
      <mesh ref={leftWingRef} position={[-0.05, 0, 0]} rotation={[0, 0, -0.2]}>
        <planeGeometry args={[0.1, 0.11]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Right Wing */}
      <mesh ref={rightWingRef} position={[0.05, 0, 0]} rotation={[0, 0, 0.2]}>
        <planeGeometry args={[0.1, 0.11]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 2. Soaring Birds High in the Sky
// -------------------------------------------------------------
const SoaringBird: React.FC<{
  radius: number;
  height: number;
  speed: number;
  offset: number;
}> = ({ radius, height, speed, offset }) => {
  const birdRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + offset;
    if (birdRef.current) {
      birdRef.current.position.x = Math.cos(t) * radius;
      birdRef.current.position.z = Math.sin(t) * radius;
      birdRef.current.position.y = height + Math.sin(t * 2) * 0.4;
      birdRef.current.rotation.y = -t + Math.PI / 2;
    }

    const flap = Math.sin(t * 8) * 0.4;
    if (leftWingRef.current) leftWingRef.current.rotation.z = flap;
    if (rightWingRef.current) rightWingRef.current.rotation.z = -flap;
  });

  return (
    <group ref={birdRef}>
      {/* Bird Body */}
      <mesh>
        <coneGeometry args={[0.06, 0.25, 4]} />
        <meshBasicMaterial color="#334155" />
      </mesh>
      {/* Left Wing */}
      <mesh ref={leftWingRef} position={[-0.15, 0, 0]}>
        <boxGeometry args={[0.25, 0.015, 0.08]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
      {/* Right Wing */}
      <mesh ref={rightWingRef} position={[0.15, 0, 0]}>
        <boxGeometry args={[0.25, 0.015, 0.08]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 3. Fluffy 3D Cartoon Clouds Floating in Sky
// -------------------------------------------------------------
export const FluffyCloud: React.FC<{
  position: [number, number, number];
  scale?: number;
  speed?: number;
}> = ({ position, scale = 1, speed = 0.25 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += delta * speed;
      if (groupRef.current.position.x > 32) {
        groupRef.current.position.x = -32;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 12, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[-1.2, -0.2, 0.2]} scale={0.78}>
        <sphereGeometry args={[1.4, 10, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[1.2, -0.25, -0.2]} scale={0.82}>
        <sphereGeometry args={[1.4, 10, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 0.65, 0.1]} scale={0.72}>
        <sphereGeometry args={[1.2, 10, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 4. Magical Floating Golden Sunbeam / Pollen Sparkles
// -------------------------------------------------------------
export const SunbeamParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = 0.4 + Math.random() * 6.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 36;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      const pos = geo.attributes.position.array as Float32Array;
      const t = state.clock.getElapsedTime();
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= 0.0035;
        pos[i * 3] += Math.sin(t + pos[i * 3 + 1]) * 0.002;
        if (pos[i * 3 + 1] < 0.2) {
          pos[i * 3 + 1] = 6.5;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.075}
        color="#fef08a"
        transparent
        opacity={0.7}
      />
    </points>
  );
};

// -------------------------------------------------------------
// 4. Background Park Visitors (Picnic / Bench Enjoyers)
// -------------------------------------------------------------
export const BackgroundVisitor: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  shirtColor: string;
  pantsColor: string;
  isSitting?: boolean;
}> = ({ position, rotationY = 0, shirtColor, pantsColor, isSitting = false }) => {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.2;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={0.92}>
      {/* Torso */}
      <mesh position={[0, isSitting ? 0.65 : 0.88, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.34, 6, 8]} />
        <meshStandardMaterial color={shirtColor} roughness={0.6} />
      </mesh>

      {/* Head with Cute Hair */}
      <group ref={headRef} position={[0, isSitting ? 1.08 : 1.3, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.17, 12, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.08, -0.02]}>
          <sphereGeometry args={[0.18, 10, 10, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Sitting or Standing Legs */}
      {isSitting ? (
        <group position={[0, 0.45, 0]}>
          {/* Thighs */}
          <mesh position={[-0.09, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.36, 6]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.09, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.36, 6]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Calves */}
          <mesh position={[-0.09, -0.22, 0.36]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 6]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.09, -0.22, 0.36]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 6]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>
      ) : (
        <group position={[0, 0.42, 0]}>
          <mesh position={[-0.08, -0.06, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.055, 0.68, 6]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0.08, -0.06, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.055, 0.68, 6]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// -------------------------------------------------------------
// 5. Full Garden Living Life Assembly
// -------------------------------------------------------------
export const GardenLivingElements: React.FC = () => {
  return (
    <group>
      {/* 6 Fluttering Colorful Butterflies */}
      <Butterfly centerPosition={[-3.6, 0.4, 3.8]} color="#f43f5e" speed={1.4} />
      <Butterfly centerPosition={[3.6, 0.4, 3.8]} color="#38bdf8" speed={1.2} />
      <Butterfly centerPosition={[-5.2, 0.4, 8.5]} color="#facc15" speed={1.5} />
      <Butterfly centerPosition={[5.2, 0.4, 8.5]} color="#ec4899" speed={1.3} />
      <Butterfly centerPosition={[-4.5, 0.4, -1.2]} color="#a855f7" speed={1.1} />
      <Butterfly centerPosition={[4.5, 0.4, -1.2]} color="#10b981" speed={1.45} />

      {/* Floating Sunbeam Pollen Particles */}
      <SunbeamParticles />

      {/* High Soaring Birds circling over the park */}
      <SoaringBird radius={14} height={9.5} speed={0.4} offset={0} />
      <SoaringBird radius={16} height={10.5} speed={0.35} offset={Math.PI / 1.5} />
      <SoaringBird radius={13} height={9.0} speed={0.45} offset={Math.PI * 1.2} />

      {/* Floating Fluffy Clouds in Sky */}
      <FluffyCloud position={[-16, 12, -10]} scale={1.8} speed={0.2} />
      <FluffyCloud position={[6, 14, -14]} scale={2.2} speed={0.15} />
      <FluffyCloud position={[20, 11, 4]} scale={1.5} speed={0.25} />
      <FluffyCloud position={[-8, 13, 12]} scale={1.6} speed={0.18} />

      {/* Background Park Visitors */}
      {/* Visitor sitting on Left Bench */}
      <BackgroundVisitor
        position={[-4.6, 0, 6.2]}
        rotationY={Math.PI / 4}
        shirtColor="#0284c7"
        pantsColor="#1e293b"
        isSitting={true}
      />
      {/* Visitor sitting on Right Bench */}
      <BackgroundVisitor
        position={[4.6, 0, 6.2]}
        rotationY={-Math.PI / 4}
        shirtColor="#ec4899"
        pantsColor="#334155"
        isSitting={true}
      />
      {/* Friend standing near fountain admiring the water */}
      <BackgroundVisitor
        position={[-2.0, 0, 8.8]}
        rotationY={Math.PI / 2.3}
        shirtColor="#10b981"
        pantsColor="#0f172a"
        isSitting={false}
      />
    </group>
  );
};
