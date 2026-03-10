import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CentralHub() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.2;
      groupRef.current.position.y = 2 + Math.sin(clock.elapsedTime * 0.5) * 0.3;
    }
    if (glowRef.current) {
      const s = 1.8 + Math.sin(clock.elapsedTime) * 0.2;
      glowRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {/* Main hub body */}
      <mesh>
        <boxGeometry args={[1.2, 0.4, 1.2]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Top detail */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Bottom ports */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, -0.25, 0.61]}>
          <boxGeometry args={[0.15, 0.08, 0.02]} />
          <meshStandardMaterial color="#00bfff" emissive="#00bfff" emissiveIntensity={2} />
        </mesh>
      ))}
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#00bfff" transparent opacity={0.08} />
      </mesh>
      {/* Point light */}
      <pointLight color="#00bfff" intensity={3} distance={15} decay={2} />
    </group>
  );
}
