import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function OceanLighting() {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      // Subtle sun flicker
      const t = clock.elapsedTime;
      sunRef.current.intensity = 1.4 + Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <>
      {/* Ambient — very low, warm sand tone */}
      <ambientLight intensity={0.25} color="#ffe8c0" />

      {/* Main sun — directional, low angle sunset, warm orange */}
      <directionalLight
        ref={sunRef}
        position={[-20, 6, -10]}
        intensity={1.4}
        color="#ff8844"
        castShadow
      />

      {/* Fill light — subtle cool bounce from opposite side */}
      <directionalLight position={[10, 12, 8]} intensity={0.2} color="#ffeedd" />

      {/* Rim light — edge highlight from behind */}
      <directionalLight position={[0, 4, -20]} intensity={0.3} color="#ff6633" />

      {/* Point lights on key structures */}
      <pointLight position={[0, 2, 0]} color="#ff5533" intensity={1.5} distance={15} decay={2} />
      <pointLight position={[-15, 1.5, -10]} color="#ff7744" intensity={0.8} distance={12} decay={2} />
      <pointLight position={[12, 1.5, -8]} color="#ff6622" intensity={0.8} distance={12} decay={2} />
      <pointLight position={[-8, 1, 15]} color="#ff5533" intensity={0.6} distance={10} decay={2} />

      {/* Hemisphere light for subtle sky/ground color bleed */}
      <hemisphereLight args={['#ff9966', '#8a6a40', 0.15]} />
    </>
  );
}
