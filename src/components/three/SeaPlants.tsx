import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GRASS_COUNT = 120;
const SHRUB_COUNT = 20;
const dummy = new THREE.Object3D();

export function SeaPlants() {
  const grassRef = useRef<THREE.InstancedMesh>(null);
  const shrubRef = useRef<THREE.InstancedMesh>(null);

  // Pre-compute grass transforms
  const grassData = useMemo(() => {
    const data: { x: number; z: number; scale: number; offset: number }[] = [];
    for (let i = 0; i < GRASS_COUNT; i++) {
      data.push({
        x: (Math.random() - 0.5) * 55,
        z: (Math.random() - 0.5) * 40,
        scale: 0.5 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, []);

  const shrubData = useMemo(() => {
    const data: { x: number; z: number; scale: number }[] = [];
    for (let i = 0; i < SHRUB_COUNT; i++) {
      data.push({
        x: (Math.random() - 0.5) * 50,
        z: (Math.random() - 0.5) * 35,
        scale: 0.8 + Math.random() * 0.5,
      });
    }
    return data;
  }, []);

  // Set initial shrub transforms (static)
  useEffect(() => {
    if (!shrubRef.current) return;
    shrubData.forEach((s, i) => {
      dummy.position.set(s.x, 0.15 * s.scale, s.z);
      dummy.scale.setScalar(s.scale);
      dummy.rotation.set(0, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      shrubRef.current!.setMatrixAt(i, dummy.matrix);
    });
    shrubRef.current.instanceMatrix.needsUpdate = true;
  }, [shrubData]);

  // Animate grass sway in a single useFrame
  useFrame(({ clock }) => {
    if (!grassRef.current) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < GRASS_COUNT; i++) {
      const g = grassData[i];
      dummy.position.set(g.x, g.scale * 0.4, g.z);
      dummy.scale.set(0.3, g.scale, 0.3);
      dummy.rotation.set(0, 0, Math.sin(t * 1.0 + g.offset) * 0.06);
      dummy.updateMatrix();
      grassRef.current.setMatrixAt(i, dummy.matrix);
    }
    grassRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Instanced grass blades */}
      <instancedMesh ref={grassRef} args={[undefined, undefined, GRASS_COUNT]}>
        <cylinderGeometry args={[0.01, 0.03, 1, 3]} />
        <meshStandardMaterial color="#7a7a30" roughness={0.85} />
      </instancedMesh>
      {/* Instanced shrubs (static) */}
      <instancedMesh ref={shrubRef} args={[undefined, undefined, SHRUB_COUNT]}>
        <sphereGeometry args={[0.15, 5, 4]} />
        <meshStandardMaterial color="#5a6830" roughness={0.9} />
      </instancedMesh>
    </>
  );
}
