import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Individual beach grass blade cluster
function BeachGrass({ position, variant }: { position: [number, number, number]; variant: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const height = useMemo(() => 0.4 + Math.random() * 0.9, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 1.0 + offset) * 0.06;
    }
  });

  // Warm olive / dry grass palette
  const colors = [
    ['#7a7a30', '#6a6a28'], // olive
    ['#8a7a40', '#6a5a28'], // dry golden
    ['#5a6a30', '#4a5a20'], // dark olive
    ['#9a8a50', '#7a6a38'], // sand grass
  ];
  const palette = colors[variant % colors.length];

  return (
    <group ref={groupRef} position={position}>
      {[0, 0.12, -0.08, 0.06, -0.05].map((xOff, i) => (
        <mesh key={i} position={[xOff, height * 0.5 * (i === 0 ? 1 : 0.5 + Math.random() * 0.4), i * 0.04]}>
          <cylinderGeometry args={[0.008, 0.025, height * (i === 0 ? 1 : 0.55 + Math.random() * 0.3), 3]} />
          <meshStandardMaterial color={palette[i % 2]} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

// Small coastal shrub
function CoastalShrub({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.4 + offset) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {[0, 0.15, -0.12].map((x, i) => (
        <mesh key={i} position={[x, 0.15 + i * 0.05, i * 0.08]}>
          <sphereGeometry args={[0.12 + Math.random() * 0.08, 5, 4]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#5a6830' : '#6a7838'} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.15, 4]} />
        <meshStandardMaterial color="#5a4a2a" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function SeaPlants() {
  const plants = useMemo(() => {
    const arr: { pos: [number, number, number]; variant: number; type: 'grass' | 'shrub' }[] = [];
    // Beach grass — 160 instances (2x density)
    for (let i = 0; i < 160; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 60, 0, (Math.random() - 0.5) * 45],
        variant: i,
        type: 'grass',
      });
    }
    // Coastal shrubs — scattered
    for (let i = 0; i < 25; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 35],
        variant: i,
        type: 'shrub',
      });
    }
    return arr;
  }, []);

  return (
    <>
      {plants.map((p, i) =>
        p.type === 'grass' ? (
          <BeachGrass key={i} position={p.pos} variant={p.variant} />
        ) : (
          <CoastalShrub key={i} position={p.pos} />
        )
      )}
    </>
  );
}
