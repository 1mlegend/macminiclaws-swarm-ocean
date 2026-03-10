import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function BeachGrass({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const height = useMemo(() => 0.5 + Math.random() * 0.8, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 1.2 + offset) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {[0, 0.15, -0.1, 0.08].map((xOff, i) => (
        <mesh key={i} position={[xOff, height * 0.5 * (i === 0 ? 1 : 0.6 + Math.random() * 0.3), i * 0.05]}>
          <cylinderGeometry args={[0.01, 0.03, height * (i === 0 ? 1 : 0.65), 3]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#7a8a3a' : '#5a6a2a'} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function SeaPlants() {
  const plants = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 80; i++) {
      arr.push([(Math.random() - 0.5) * 55, 0, (Math.random() - 0.5) * 40]);
    }
    return arr;
  }, []);

  return (
    <>
      {plants.map((pos, i) => (
        <BeachGrass key={i} position={pos} />
      ))}
    </>
  );
}
