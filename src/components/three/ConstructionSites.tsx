import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SITES: [number, number, number][] = [
  [15, 0, -18],
  [-20, 0, 15],
];

export function ConstructionSites() {
  const craneRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    craneRefs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.y = Math.sin(t * 0.4 + i * 2) * 0.6;
      }
    });
  });

  return (
    <>
      {SITES.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Construction zone perimeter */}
          <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[2, 2.3, 6]} />
            <meshStandardMaterial color="#ff8800" roughness={0.7} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          {/* Crane pole */}
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 4, 6]} />
            <meshStandardMaterial color="#ffaa00" roughness={0.5} metalness={0.4} />
          </mesh>
          {/* Crane arm */}
          <group position={[0, 3.8, 0]}>
            <mesh
              ref={(el) => { if (el) craneRefs.current[i] = el; }}
              rotation-z={Math.PI / 2}
              position={[0.8, 0, 0]}
            >
              <cylinderGeometry args={[0.03, 0.03, 2, 4]} />
              <meshStandardMaterial color="#ffaa00" roughness={0.5} metalness={0.4} />
            </mesh>
          </group>
          {/* Scaffolding blocks */}
          {[[-0.8, 0.3, 0.5], [0.6, 0.2, -0.7], [0, 0.15, 0.8]].map((p, j) => (
            <mesh key={j} position={[p[0], p[1], p[2]]}>
              <boxGeometry args={[0.4, p[1] * 2, 0.4]} />
              <meshStandardMaterial color="#555555" roughness={0.8} transparent opacity={0.7} />
            </mesh>
          ))}
          {/* Warning light */}
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial color="#ff8800" emissive="#ff6600" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}
    </>
  );
}
