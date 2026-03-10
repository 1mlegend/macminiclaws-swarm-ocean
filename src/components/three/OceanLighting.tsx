import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function OceanLighting() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <>
      {/* Lighting fix: neutral white lights to preserve original GLB colors */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[10, 20, 5]} intensity={0.8} color="#ffffff" />
      <pointLight ref={lightRef} position={[0, 8, 0]} intensity={1.2} color="#ffffff" distance={40} decay={2} />
      {/* Subtle blue fill lights — low intensity so they don't tint the model */}
      <pointLight position={[-15, 5, -15]} intensity={0.2} color="#6699cc" distance={30} decay={2} />
      <pointLight position={[15, 5, 15]} intensity={0.2} color="#6699cc" distance={30} decay={2} />
    </>
  );
}
