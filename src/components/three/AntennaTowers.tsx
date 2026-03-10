import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ANTENNA_POSITIONS: [number, number, number][] = [
  [22, 0, 0],
  [-10, 0, 20],
  [0, 0, -22],
  [-22, 0, -18],
];

export function AntennaTowers() {
  const waveRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    waveRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const pulse = (Math.sin(t * 2 + i * 1.5) + 1) * 0.5;
        const s = 1 + pulse * 2;
        mesh.scale.set(s, s, s);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.2 * (1 - pulse);
      }
    });
  });

  return (
    <>
      {ANTENNA_POSITIONS.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Main pole */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 3, 6]} />
            <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Cross arms */}
          {[1.8, 2.3].map((h, j) => (
            <mesh key={j} position={[0, h, 0]} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.02, 0.02, 0.6, 4]} />
              <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.3} />
            </mesh>
          ))}
          {/* Top beacon */}
          <mesh position={[0, 3.1, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={2} />
          </mesh>
          {/* Radio wave ring */}
          <mesh
            ref={(el) => { if (el) waveRefs.current[i] = el; }}
            position={[0, 2.8, 0]}
            rotation-x={-Math.PI / 2}
          >
            <ringGeometry args={[0.3, 0.35, 16]} />
            <meshBasicMaterial color="#ff4422" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
          {/* Base */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 0.15, 6]} />
            <meshStandardMaterial color="#444444" roughness={0.7} metalness={0.4} />
          </mesh>
        </group>
      ))}
    </>
  );
}
