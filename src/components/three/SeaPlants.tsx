import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SeaPlant({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const height = useMemo(() => 0.8 + Math.random() * 1.2, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.8 + offset) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {[0, 0.3, -0.2].map((xOff, i) => (
        <mesh key={i} position={[xOff, height * 0.5 * (i === 0 ? 1 : 0.7), i * 0.1]}>
          <cylinderGeometry args={[0.02, 0.05, height * (i === 0 ? 1 : 0.7), 4]} />
          <meshStandardMaterial color={i === 0 ? '#1a6b3a' : '#0d4a2a'} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

export function SeaPlants() {
  const plants = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 60; i++) {
      arr.push([(Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 50]);
    }
    return arr;
  }, []);

  return (
    <>
      {plants.map((pos, i) => (
        <SeaPlant key={i} position={pos} />
      ))}
    </>
  );
}
