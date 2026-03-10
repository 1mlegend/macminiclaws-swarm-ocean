import { useFrame, useThree } from '@react-three/fiber';
import { useHubStore } from '@/stores/hubStore';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';

// Camera follow logic: smoothly track the main shrimp while keeping orbit controls
export function CameraFollow() {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useFrame(() => {
    const [x, y, z] = useHubStore.getState().position;
    if (controlsRef.current) {
      // Smoothly move orbit target toward hub position
      controlsRef.current.target.lerp(new THREE.Vector3(x, y, z), 0.05);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      enableRotate
      maxPolarAngle={Math.PI / 2.2}
      minDistance={5}
      maxDistance={50}
      enableDamping
      dampingFactor={0.05}
      zoomSpeed={0.8}
      rotateSpeed={0.5}
    />
  );
}
