import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CustomerLifecycle } from '../../types/game';

interface SalespersonProps {
  position: [number, number, number];
  customerLifecycle: CustomerLifecycle;
  selectedPopColor?: string | null;
}

export const SalespersonRavi: React.FC<SalespersonProps> = ({
  position,
  customerLifecycle,
  selectedPopColor
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Natural breathing bob
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.88 + Math.sin(t * 2.2) * 0.015;
    }

    // Dynamic animation states
    if (customerLifecycle === 'walking_to_stall' || customerLifecycle === 'greeting') {
      // Friendly waving arm
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = Math.PI / 3 + Math.sin(t * 8) * 0.35;
        rightArmRef.current.rotation.x = -0.4;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = -0.2;
        leftArmRef.current.rotation.x = 0;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 1.8) * 0.12;
      }
    } else if (customerLifecycle === 'dialogue') {
      // Conversational gesturing
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = 0.35 + Math.sin(t * 3.5) * 0.15;
        rightArmRef.current.rotation.x = -0.3 + Math.cos(t * 3) * 0.2;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = -0.3 + Math.sin(t * 2.8) * 0.12;
        leftArmRef.current.rotation.x = -0.25;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 2) * 0.08;
      }
    } else if (customerLifecycle === 'selecting_product') {
      // Reaching down into freezer
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.85;
        rightArmRef.current.rotation.z = 0.2;
      }
      if (headRef.current) {
        headRef.current.rotation.x = 0.35; // Looking down
      }
    } else if (customerLifecycle === 'handover') {
      // Handing pop forward over counter
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.35;
        rightArmRef.current.rotation.z = 0.08;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.4;
        leftArmRef.current.rotation.z = -0.2;
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.1;
      }
    } else {
      // Idle proud stance
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.z = 0.2;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0;
        leftArmRef.current.rotation.z = -0.2;
      }
      if (headRef.current) {
        headRef.current.rotation.set(0, 0, 0);
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={1.05}>
      {/* Body & Clothes */}
      <group ref={bodyRef} position={[0, 0.88, 0]}>
        {/* Red Skippi Polo Torso */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.38, 8, 12]} />
          <meshStandardMaterial color="#e11d48" roughness={0.6} />
        </mesh>

        {/* Yellow Skippi Apron with Blue Front Pocket */}
        <mesh position={[0, 0.06, 0.12]} castShadow>
          <boxGeometry args={[0.3, 0.36, 0.04]} />
          <meshStandardMaterial color="#facc15" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.02, 0.14]}>
          <boxGeometry args={[0.2, 0.12, 0.02]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* Name Badge */}
        <mesh position={[0.08, 0.2, 0.14]}>
          <boxGeometry args={[0.07, 0.04, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Head & Expressive Friendly Face */}
        <group ref={headRef} position={[0, 0.52, 0]}>
          {/* Round Face */}
          <mesh castShadow>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.5} />
          </mesh>

          {/* Neat Brown Hair */}
          <mesh position={[0, 0.08, -0.04]}>
            <sphereGeometry args={[0.21, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>

          {/* Skippi Red Visor / Cap */}
          <mesh position={[0, 0.14, 0.02]}>
            <cylinderGeometry args={[0.22, 0.23, 0.08, 16]} />
            <meshStandardMaterial color="#e11d48" />
          </mesh>
          <mesh position={[0, 0.14, 0.2]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.28, 0.03, 0.18]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>

          {/* Big Friendly Cartoon Eyes */}
          {/* Left Eye */}
          <group position={[-0.07, 0.02, 0.17]}>
            <mesh>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0.008, 0.01, 0.035]}>
              <sphereGeometry args={[0.008, 6, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.07, 0.02, 0.17]}>
            <mesh>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0.008, 0.01, 0.035]}>
              <sphereGeometry args={[0.008, 6, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Rosy Cheeks */}
          <mesh position={[-0.12, -0.04, 0.14]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#f472b6" transparent opacity={0.65} />
          </mesh>
          <mesh position={[0.12, -0.04, 0.14]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#f472b6" transparent opacity={0.65} />
          </mesh>

          {/* Warm Smiling Mouth */}
          <mesh position={[0, -0.07, 0.18]} rotation={[Math.PI, 0, 0]}>
            <torusGeometry args={[0.04, 0.012, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#991b1b" />
          </mesh>
        </group>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.28, 0.22, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <capsuleGeometry args={[0.055, 0.24, 6, 8]} />
            <meshStandardMaterial color="#e11d48" roughness={0.6} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.32, 0]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
        </group>

        {/* Right Arm (Delivering pop or waving) */}
        <group ref={rightArmRef} position={[0.28, 0.22, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <capsuleGeometry args={[0.055, 0.24, 6, 8]} />
            <meshStandardMaterial color="#e11d48" roughness={0.6} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.32, 0]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>

          {/* Ice pop in hand during handover animation */}
          {customerLifecycle === 'handover' && selectedPopColor && (
            <group position={[0, -0.38, 0.18]} rotation={[0.4, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.15, 0.38, 0.05]} />
                <meshPhysicalMaterial
                  color={selectedPopColor}
                  transmission={0.4}
                  roughness={0.2}
                  transparent
                  opacity={0.9}
                />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* Legs & Shoes */}
      <group position={[0, 0.38, 0]}>
        {/* Left Leg */}
        <mesh position={[-0.1, 0, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.65, 8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Right Leg */}
        <mesh position={[0.1, 0, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.65, 8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* Clean White Sneakers */}
        <mesh position={[-0.1, -0.34, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.09, 0.22]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[0.1, -0.34, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.09, 0.22]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};
