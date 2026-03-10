import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSwarmStore } from '@/stores/swarmStore';

export function ComputeVolcano() {
  const glowRef = useRef<THREE.Mesh>(null);
  const smokeRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const swarmActive = useSwarmStore((s) => s.swarmActive);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const baseIntensity = swarmActive ? 1.8 : 1.0;
    const pulse = Math.sin(t * 1.2) * 0.5 + 0.5;

    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + pulse * 0.2 * baseIntensity;
      const s = 3 + pulse * baseIntensity;
      glowRef.current.scale.set(s, s, s);
    }

    if (smokeRef.current) {
      smokeRef.current.position.y = 10 + Math.sin(t * 0.5) * 0.5;
      const ss = 2 + pulse * 1.5;
      smokeRef.current.scale.set(ss, ss, ss);
      (smokeRef.current.material as THREE.MeshBasicMaterial).opacity = 0.06 + pulse * 0.08;
    }

    if (lightRef.current) {
      lightRef.current.intensity = 3 + pulse * 5 * baseIntensity;
    }
  });

  return (
    <group position={[0, 0, -45]}>
      {/* Volcano cone */}
      <mesh position={[0, 4, 0]}>
        <coneGeometry args={[8, 10, 12]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
      </mesh>
      {/* Lava rim */}
      <mesh position={[0, 8.5, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1, 3, 12]} />
        <meshStandardMaterial color="#ff3300" emissive="#ff2200" emissiveIntensity={1.5} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner crater glow */}
      <mesh position={[0, 8.8, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[1.2, 12]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.6} />
      </mesh>
      {/* Pulsing glow sphere */}
      <mesh ref={glowRef} position={[0, 9, 0]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color="#ff3300" transparent opacity={0.2} />
      </mesh>
      {/* Smoke plume */}
      <mesh ref={smokeRef} position={[0, 10, 0]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#331100" transparent opacity={0.08} />
      </mesh>
      {/* Lava streams down the side */}
      {[0, 2, 4].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 3, 3, Math.sin(a) * 3]} rotation-z={0.3 * (i % 2 === 0 ? 1 : -1)}>
          <boxGeometry args={[0.3, 6, 0.15]} />
          <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Light source */}
      <pointLight ref={lightRef} position={[0, 9, 0]} color="#ff3300" intensity={5} distance={40} decay={2} />
    </group>
  );
}
