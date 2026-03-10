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
      <ambientLight intensity={0.15} color="#1a3a5c" />
      <directionalLight position={[10, 20, 5]} intensity={0.4} color="#4a9eff" />
      <pointLight ref={lightRef} position={[0, 8, 0]} intensity={1.5} color="#00bfff" distance={40} decay={2} />
      <pointLight position={[-15, 5, -15]} intensity={0.5} color="#0066cc" distance={30} decay={2} />
      <pointLight position={[15, 5, 15]} intensity={0.5} color="#0088ff" distance={30} decay={2} />
    </>
  );
}
