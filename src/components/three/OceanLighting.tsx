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
      {/* Warm sunset ambient */}
      <ambientLight intensity={0.5} color="#ffcc88" />
      {/* Sunset directional light — low angle */}
      <directionalLight position={[-10, 8, -5]} intensity={1.0} color="#ff6633" />
      {/* Warm overhead fill */}
      <pointLight ref={lightRef} position={[0, 12, 0]} intensity={1.0} color="#ffaa55" distance={50} decay={2} />
      {/* Subtle warm fill lights */}
      <pointLight position={[-15, 5, -15]} intensity={0.3} color="#cc4422" distance={30} decay={2} />
      <pointLight position={[15, 5, 15]} intensity={0.3} color="#ff8844" distance={30} decay={2} />
      {/* Neutral white for model accuracy */}
      <directionalLight position={[5, 15, 10]} intensity={0.4} color="#ffffff" />
    </>
  );
}
