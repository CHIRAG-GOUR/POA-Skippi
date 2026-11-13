import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Customer, CustomerLifecycle } from '../../types/game';

interface CustomerProps {
  customer: Customer;
  lifecycle: CustomerLifecycle;
  receivedPopColor?: string | null;
  onArrivedAtCounter?: () => void;
  onDeparted?: () => void;
}

export const CustomerCharacter: React.FC<CustomerProps> = ({
  customer,
  lifecycle,
  receivedPopColor,
  onArrivedAtCounter,
  onDeparted
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // Trajectory state
  const currentZ = useRef<number>(16);
  const currentX = useRef<number>(0);
  const arrivedFired = useRef<boolean>(false);
  const departedFired = useRef<boolean>(false);

  const { height, shirtColor, pantsColor, hairColor, hairStyle, skinTone, accessory } = customer.appearance;

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (!rootRef.current) return;

    const isWalking = lifecycle === 'walking_to_stall' || lifecycle === 'walking_away';

    // 1. Position Trajectory
    if (lifecycle === 'walking_to_stall') {
      rootRef.current.rotation.y = Math.PI - 0.15; // Face stall & Ravi
      if (currentZ.current > 2.3) {
        currentZ.current -= delta * 3.6;
        currentX.current = -0.55 * (1 - (currentZ.current - 2.3) / 13.7);
      } else {
        currentZ.current = 2.3;
        currentX.current = -0.55;
        if (!arrivedFired.current) {
          arrivedFired.current = true;
          onArrivedAtCounter?.();
        }
      }
    } else if (lifecycle === 'walking_away') {
      rootRef.current.rotation.y = 0.25; // Face park exit
      if (currentZ.current < 18) {
        currentZ.current += delta * 3.4;
        currentX.current += delta * 0.45;
      } else {
        if (!departedFired.current) {
          departedFired.current = true;
          onDeparted?.();
        }
      }
    } else {
      currentZ.current = 2.3;
      currentX.current = -0.55;
      rootRef.current.rotation.y = Math.PI - 0.3; // Turned naturally towards Ravi
    }

    rootRef.current.position.set(currentX.current, 0, currentZ.current);

    // 2. Smooth Leg & Arm Walking Cycle
    if (isWalking) {
      const walkCycle = Math.sin(t * 10);
      if (leftLegRef.current) leftLegRef.current.rotation.x = walkCycle * 0.6;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -walkCycle * 0.6;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -walkCycle * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = walkCycle * 0.5;

      // Natural vertical body bounce
      if (bodyRef.current) {
        bodyRef.current.position.y = 0.5 + Math.abs(Math.sin(t * 10)) * 0.08;
      }
    } else if (lifecycle === 'celebrating') {
      // Happy victory bounce
      if (bodyRef.current) {
        bodyRef.current.position.y = 0.5 + Math.abs(Math.sin(t * 8)) * 0.22;
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = -1.25;
      if (rightArmRef.current) rightArmRef.current.rotation.z = 1.25;
      if (headRef.current) headRef.current.rotation.y = Math.sin(t * 8) * 0.2;
    } else if (lifecycle === 'handover') {
      // Reaching out hands to receive ice pop
      if (bodyRef.current) bodyRef.current.position.y = 0.5;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.15;
        rightArmRef.current.rotation.z = 0.15;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.95;
        leftArmRef.current.rotation.z = -0.15;
      }
    } else {
      // Standing idle at counter
      if (bodyRef.current) {
        bodyRef.current.position.y = 0.5 + Math.sin(t * 2.5) * 0.02;
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0;
        leftArmRef.current.rotation.z = -0.15;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.sin(t * 3) * 0.15;
        rightArmRef.current.rotation.z = 0.15;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 1.5) * 0.1;
      }
    }
  });

  return (
    <group ref={rootRef} scale={height}>
      {/* Upper Torso & Head */}
      <group ref={bodyRef} position={[0, 0.5, 0]}>
        {/* Colorful Hoodie / Shirt */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <capsuleGeometry args={[0.2, 0.35, 8, 12]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>

        {/* Neck Collar Accent */}
        <mesh position={[0, 0.68, 0]}>
          <torusGeometry args={[0.14, 0.03, 8, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>

        {/* Head & Expressive Kid Face */}
        <group ref={headRef} position={[0, 0.95, 0]}>
          {/* Round Cute Head */}
          <mesh castShadow>
            <sphereGeometry args={[0.21, 16, 16]} />
            <meshStandardMaterial color={skinTone} roughness={0.5} />
          </mesh>

          {/* Styled Hair - sits cleanly on top & back, NEVER over face */}
          <mesh position={[0, 0.09, -0.04]}>
            <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>

          {/* Hair Style Details */}
          {hairStyle === 'spiky' && (
            <group position={[0, 0.22, 0]}>
              {[-0.08, 0, 0.08].map((x, i) => (
                <mesh key={i} position={[x, 0, (i % 2) * 0.05]} rotation={[0.2, 0, x * 2]}>
                  <coneGeometry args={[0.04, 0.12, 4]} />
                  <meshStandardMaterial color={hairColor} />
                </mesh>
              ))}
            </group>
          )}

          {hairStyle === 'bun' && (
            <mesh position={[0, 0.24, -0.1]}>
              <sphereGeometry args={[0.1, 10, 10]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          )}

          {hairStyle === 'pigtails' && (
            <group>
              <mesh position={[-0.24, 0.05, -0.05]} rotation={[0, 0, -0.4]}>
                <capsuleGeometry args={[0.045, 0.15, 6, 8]} />
                <meshStandardMaterial color={hairColor} />
              </mesh>
              <mesh position={[0.24, 0.05, -0.05]} rotation={[0, 0, 0.4]}>
                <capsuleGeometry args={[0.045, 0.15, 6, 8]} />
                <meshStandardMaterial color={hairColor} />
              </mesh>
            </group>
          )}

          {/* Big Cute Cartoon Eyes */}
          {/* Left Eye */}
          <group position={[-0.075, 0.02, 0.18]}>
            <mesh>
              <sphereGeometry args={[0.038, 10, 10]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.028]}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* Sparkle highlight */}
            <mesh position={[0.008, 0.01, 0.04]}>
              <sphereGeometry args={[0.009, 6, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.075, 0.02, 0.18]}>
            <mesh>
              <sphereGeometry args={[0.038, 10, 10]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.028]}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* Sparkle highlight */}
            <mesh position={[0.008, 0.01, 0.04]}>
              <sphereGeometry args={[0.009, 6, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Cute Rosy Cheeks */}
          <mesh position={[-0.12, -0.04, 0.15]}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial color="#f472b6" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.12, -0.04, 0.15]}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial color="#f472b6" transparent opacity={0.6} />
          </mesh>

          {/* Smiling Mouth */}
          <mesh position={[0, -0.08, 0.185]} rotation={[Math.PI, 0, 0]}>
            <torusGeometry args={[0.035, 0.01, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#991b1b" />
          </mesh>

          {/* Optional Accessories */}
          {accessory === 'glasses' && (
            <group position={[0, 0.02, 0.19]}>
              <mesh position={[-0.075, 0, 0]}>
                <torusGeometry args={[0.042, 0.008, 6, 16]} />
                <meshStandardMaterial color="#e11d48" metalness={0.8} />
              </mesh>
              <mesh position={[0.075, 0, 0]}>
                <torusGeometry args={[0.042, 0.008, 6, 16]} />
                <meshStandardMaterial color="#e11d48" metalness={0.8} />
              </mesh>
              {/* Bridge */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.04, 0.008, 0.008]} />
                <meshStandardMaterial color="#e11d48" />
              </mesh>
            </group>
          )}

          {accessory === 'cap' && (
            <group position={[0, 0.15, 0.02]}>
              <cylinderGeometry args={[0.22, 0.23, 0.08, 16]} />
              <meshStandardMaterial color="#2563eb" />
              <mesh position={[0, -0.02, 0.18]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.26, 0.025, 0.16]} />
                <meshStandardMaterial color="#1d4ed8" />
              </mesh>
            </group>
          )}
        </group>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.26, 0.5, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.22, 6, 8]} />
            <meshStandardMaterial color={shirtColor} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={skinTone} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.26, 0.5, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.22, 6, 8]} />
            <meshStandardMaterial color={shirtColor} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={skinTone} />
          </mesh>

          {/* Ice pop in hand after handover */}
          {(lifecycle === 'celebrating' || lifecycle === 'walking_away') && receivedPopColor && (
            <group position={[0, -0.32, 0.12]} rotation={[0.3, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.14, 0.35, 0.05]} />
                <meshPhysicalMaterial
                  color={receivedPopColor}
                  transmission={0.4}
                  roughness={0.2}
                  transparent
                  opacity={0.9}
                />
              </mesh>
            </group>
          )}
        </group>

        {/* Optional Backpack */}
        {accessory === 'backpack' && (
          <mesh position={[0, 0.45, -0.18]} castShadow>
            <boxGeometry args={[0.28, 0.32, 0.16]} />
            <meshStandardMaterial color="#0284c7" roughness={0.7} />
          </mesh>
        )}
      </group>

      {/* Legs & Cute Sneakers */}
      <group position={[0, 0.42, 0]}>
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.1, 0, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.38, 8]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Sneaker */}
          <mesh position={[0, -0.36, 0.04]} castShadow>
            <boxGeometry args={[0.11, 0.08, 0.2]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.38, 0.04]}>
            <boxGeometry args={[0.12, 0.03, 0.21]} />
            <meshStandardMaterial color="#e11d48" />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.1, 0, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.38, 8]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Sneaker */}
          <mesh position={[0, -0.36, 0.04]} castShadow>
            <boxGeometry args={[0.11, 0.08, 0.2]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.38, 0.04]}>
            <boxGeometry args={[0.12, 0.03, 0.21]} />
            <meshStandardMaterial color="#e11d48" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
