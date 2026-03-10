import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NEST_POSITIONS: [number, number, number][] = [
  [-8, 0, 5],
  [10, 0, -5],
  [-5, 0, -12],
  [15, 0, 10],
  [-15, 0, -3],
  [6, 0, 15],
];

export function CrabNests() {
  const glowRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    glowRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const pulse = Math.sin(t * 1.5 + i * 1.8) * 0.5 + 0.5;
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.1 + pulse * 0.2;
        const s = 1.5 + pulse * 0.5;
        mesh.scale.set(s, s, s);
      }
    });
  });

  return (
    <>
      {NEST_POSITIONS.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Base crater */}
          <mesh position={[0, 0.05, 0]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.3, 1.2, 8]} />
            <meshStandardMaterial color="#3a2810" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
          {/* Nest walls */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[1.0, 1.3, 0.35, 8, 1, true]} />
            <meshStandardMaterial color="#4a3018" roughness={0.85} side={THREE.DoubleSide} />
          </mesh>
          {/* Inner glow disc */}
          <mesh
            ref={(el) => { if (el) glowRefs.current[i] = el; }}
            position={[0, 0.08, 0]}
            rotation-x={-Math.PI / 2}
          >
            <circleGeometry args={[0.8, 16]} />
            <meshBasicMaterial color="#ff3311" transparent opacity={0.15} />
          </mesh>
          {/* Tiny support struts */}
          {[0, 1.2, 2.4, 3.6, 4.8].map((a, j) => (
            <mesh key={j} position={[Math.cos(a) * 0.9, 0.25, Math.sin(a) * 0.9]}>
              <boxGeometry args={[0.08, 0.5, 0.08]} />
              <meshStandardMaterial color="#5a4020" roughness={0.7} />
            </mesh>
          ))}
          {/* Red point light */}
          <pointLight position={[0, 0.5, 0]} color="#ff2200" intensity={2} distance={5} decay={2} />
        </group>
      ))}
    </>
  );
}
