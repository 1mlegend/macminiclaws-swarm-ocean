import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function EasterEggs() {
  const giantRef = useRef<THREE.Group>(null);
  const treasureGlowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Giant crab subtle breathing
    if (giantRef.current) {
      const breath = Math.sin(t * 0.3) * 0.02;
      giantRef.current.scale.setScalar(1 + breath);
    }
    // Treasure glow
    if (treasureGlowRef.current) {
      const pulse = Math.sin(t * 1.5) * 0.5 + 0.5;
      (treasureGlowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + pulse * 0.2;
    }
  });

  return (
    <>
      {/* Hidden giant crab - far corner, partially buried */}
      <group ref={giantRef} position={[-30, -0.5, -30]} rotation-y={0.8}>
        {/* Giant shell */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[3, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#6a2a10" roughness={0.85} />
        </mesh>
        {/* Giant eyes */}
        <mesh position={[-1.2, 1.8, 2]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#ff6644" emissive="#ff2200" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[1.2, 1.8, 2]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#ff6644" emissive="#ff2200" emissiveIntensity={0.5} />
        </mesh>
        {/* Giant claws */}
        <mesh position={[-3, 0.5, 1.5]} rotation-z={0.3}>
          <boxGeometry args={[2, 0.6, 0.8]} />
          <meshStandardMaterial color="#8a3a15" roughness={0.7} />
        </mesh>
        <mesh position={[3, 0.5, 1.5]} rotation-z={-0.3}>
          <boxGeometry args={[2, 0.6, 0.8]} />
          <meshStandardMaterial color="#8a3a15" roughness={0.7} />
        </mesh>
      </group>

      {/* Treasure chest half-buried */}
      <group position={[25, -0.2, 25]} rotation-y={-0.5}>
        {/* Chest body */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.5]} />
          <meshStandardMaterial color="#6a4a20" roughness={0.7} />
        </mesh>
        {/* Chest lid */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.85, 0.1, 0.55]} />
          <meshStandardMaterial color="#7a5a28" roughness={0.6} />
        </mesh>
        {/* Gold glow */}
        <mesh ref={treasureGlowRef} position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.15} />
        </mesh>
        {/* Gold coins peeking */}
        {[[-0.2, 0, 0.15], [0.15, 0, -0.1], [0, 0, 0.05]].map((p, i) => (
          <mesh key={i} position={[p[0], 0.48, p[2]]}>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 8]} />
            <meshStandardMaterial color="#ffcc00" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
        <pointLight position={[0, 0.6, 0]} color="#ffaa00" intensity={1.5} distance={4} decay={2} />
      </group>

      {/* Buried Mac Mini */}
      <group position={[28, -0.15, -25]} rotation-y={1.2}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.8, 0.15, 0.8]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Apple-like dot */}
        <mesh position={[0, 0.14, 0]}>
          <circleGeometry args={[0.08, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        {/* Partially covered by sand mound */}
        <mesh position={[0.3, 0.05, 0.3]}>
          <sphereGeometry args={[0.3, 8, 4, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#8a7a5a" roughness={0.95} />
        </mesh>
      </group>
    </>
  );
}
