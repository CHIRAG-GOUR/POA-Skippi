import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraViewMode } from '../../types/game';

interface CameraRigProps {
  mode: CameraViewMode;
  isCustomerAtCounter: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({ mode, isCustomerAtCounter }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Target coordinates for different camera perspectives
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.5, 9));
  const targetLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.3, 1));

  useEffect(() => {
    if (mode === 'stall_counter') {
      // Charming 3/4 cinematic angle showing both customer and salesperson
      targetPos.current.set(1.9, 2.15, 4.6);
      targetLook.current.set(-0.25, 1.2, 1.0);
    } else if (mode === 'isometric') {
      // Polished simulation park overview
      targetPos.current.set(8.5, 8.0, 11.5);
      targetLook.current.set(0, 1.2, 2.5);
    } else if (mode === 'fountain_view') {
      targetPos.current.set(0, 3.0, 15);
      targetLook.current.set(0, 1.5, 6);
    } else {
      // General dynamic view
      if (isCustomerAtCounter) {
        targetPos.current.set(1.8, 2.1, 4.5);
        targetLook.current.set(-0.2, 1.2, 0.9);
      } else {
        targetPos.current.set(4, 5, 11);
        targetLook.current.set(0, 1.2, 3);
      }
    }
  }, [mode, isCustomerAtCounter]);

  useFrame(() => {
    if (controlsRef.current) {
      // Smoothly interpolate camera position towards target
      camera.position.lerp(targetPos.current, 0.045);
      controlsRef.current.target.lerp(targetLook.current, 0.045);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      minDistance={3.5}
      maxDistance={28}
      maxPolarAngle={Math.PI / 2.05} // prevent going underneath ground
      minPolarAngle={0.2}
      dampingFactor={0.05}
    />
  );
};

