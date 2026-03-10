import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BEAM_CONFIGS = [
  { angle: 0, color: '#ff4422' },
  { angle: Math.PI * 0.4, color: '#ff6622' },
  { angle: Math.PI * 0.8, color: '#ff3311' },
  { angle: Math.PI * 1.2, color: '#ff5522' },
  { angle: Math.PI * 1.6, color: '#ff4411' },
];

export function NetworkBeams() {
  const groupRef = useRef<THREE.Group>(null);

  const beamGeometry = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0, 3, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.children.forEach((beam, i) => {
      const pulse = Math.sin(t * 0.8 + i * 1.3) * 0.5 + 0.5;
      if ((beam as THREE.Line).material) {
        ((beam as THREE.Line).material as THREE.LineBasicMaterial).opacity = 0.15 + pulse * 0.35;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {BEAM_CONFIGS.map((cfg, i) => {
        const x = Math.cos(cfg.angle) * 45;
        const z = Math.sin(cfg.angle) * 45;
        return (
          <group key={i} position={[0, 0, 0]}>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, 1, 0, x, 8, z])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color={cfg.color} transparent opacity={0.25} linewidth={1} />
            </line>
            {/* Endpoint glow */}
            <mesh position={[x, 8, z]}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshBasicMaterial color={cfg.color} transparent opacity={0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
