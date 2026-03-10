import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSwarmStore } from '@/stores/swarmStore';

const SOLAR_POSITIONS: [number, number, number][] = [
  [18, 0, -12],
  [-18, 0, 8],
  [8, 0, -20],
];

const GENERATOR_POSITIONS: [number, number, number][] = [
  [-20, 0, -15],
  [20, 0, 15],
];

export function EnergySources() {
  const pulseRefs = useRef<THREE.Mesh[]>([]);
  const genRefs = useRef<THREE.Mesh[]>([]);
  const swarmActive = useSwarmStore((s) => s.swarmActive);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const intensity = swarmActive ? 1.5 : 1.0;

    pulseRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const pulse = Math.sin(t * 2 * intensity + i) * 0.5 + 0.5;
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.05 + pulse * 0.15 * intensity;
      }
    });

    genRefs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.y = t * 2 + i;
      }
    });
  });

  return (
    <>
      {/* Solar panels */}
      {SOLAR_POSITIONS.map((pos, i) => (
        <group key={`solar-${i}`} position={pos}>
          {/* Panel pole */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.05, 0.06, 1.2, 6]} />
            <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Panel */}
          <mesh position={[0, 1.2, 0]} rotation-x={-0.5}>
            <boxGeometry args={[1.4, 0.04, 0.9]} />
            <meshStandardMaterial color="#1a2244" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Panel grid lines */}
          <mesh position={[0, 1.22, 0]} rotation-x={-0.5}>
            <planeGeometry args={[1.3, 0.8]} />
            <meshStandardMaterial color="#2244aa" metalness={0.7} roughness={0.3} emissive="#1133aa" emissiveIntensity={0.2} />
          </mesh>
          {/* Energy pulse ground ring */}
          <mesh
            ref={(el) => { if (el) pulseRefs.current[i] = el; }}
            position={[0, 0.05, 0]}
            rotation-x={-Math.PI / 2}
          >
            <ringGeometry args={[0.8, 1.5, 16]} />
            <meshBasicMaterial color="#ff6622" transparent opacity={0.08} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Generators */}
      {GENERATOR_POSITIONS.map((pos, i) => (
        <group key={`gen-${i}`} position={pos}>
          {/* Base */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.6, 0.7, 0.5, 8]} />
            <meshStandardMaterial color="#444444" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Rotating turbine */}
          <mesh
            ref={(el) => { if (el) genRefs.current[i] = el; }}
            position={[0, 0.7, 0]}
          >
            <torusGeometry args={[0.4, 0.06, 8, 16]} />
            <meshStandardMaterial color="#ff4422" metalness={0.5} roughness={0.4} emissive="#ff2200" emissiveIntensity={0.3} />
          </mesh>
          {/* Top cap */}
          <mesh position={[0, 0.55, 0]}>
            <coneGeometry args={[0.35, 0.3, 8]} />
            <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Battery boxes nearby */}
          <mesh position={[1, 0.2, 0.3]}>
            <boxGeometry args={[0.4, 0.4, 0.3]} />
            <meshStandardMaterial color="#2a4a2a" roughness={0.6} />
          </mesh>
          <mesh position={[1, 0.42, 0.3]}>
            <boxGeometry args={[0.3, 0.04, 0.2]} />
            <meshStandardMaterial color="#44ff44" emissive="#22ff22" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </>
  );
}
