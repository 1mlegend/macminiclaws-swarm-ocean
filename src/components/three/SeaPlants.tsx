import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GRASS_COUNT = 350;
const SHRUB_COUNT = 50;
const CACTUS_COUNT = 15;
const DESERT_PLANT_COUNT = 25;
const dummy = new THREE.Object3D();

function seededRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function SeaPlants() {
  const grassRef = useRef<THREE.InstancedMesh>(null);
  const shrubRef = useRef<THREE.InstancedMesh>(null);
  const cactusRef = useRef<THREE.InstancedMesh>(null);
  const desertRef = useRef<THREE.InstancedMesh>(null);

  // Grass data — 3x more density
  const grassData = useMemo(() => {
    const data: { x: number; z: number; scale: number; offset: number }[] = [];
    for (let i = 0; i < GRASS_COUNT; i++) {
      data.push({
        x: (seededRand(i * 3.7) - 0.5) * 65,
        z: (seededRand(i * 5.3) - 0.5) * 55,
        scale: 0.3 + seededRand(i * 2.1) * 0.9,
        offset: seededRand(i * 1.1) * Math.PI * 2,
      });
    }
    return data;
  }, []);

  // Shrubs — more
  const shrubData = useMemo(() => {
    const data: { x: number; z: number; scale: number }[] = [];
    for (let i = 0; i < SHRUB_COUNT; i++) {
      data.push({
        x: (seededRand(i * 11.7) - 0.5) * 60,
        z: (seededRand(i * 9.3) - 0.5) * 50,
        scale: 0.5 + seededRand(i * 4.4) * 0.6,
      });
    }
    return data;
  }, []);

  // Set static shrubs
  useEffect(() => {
    if (!shrubRef.current) return;
    const color = new THREE.Color();
    const shrubColors = ['#5a6830', '#6a7838', '#4a5828', '#7a8848'];
    shrubData.forEach((s, i) => {
      dummy.position.set(s.x, 0.1 * s.scale, s.z);
      dummy.scale.setScalar(s.scale);
      dummy.rotation.set(0, seededRand(i * 8.8) * Math.PI, 0);
      dummy.updateMatrix();
      shrubRef.current!.setMatrixAt(i, dummy.matrix);
      color.set(shrubColors[Math.floor(seededRand(i * 6.6) * shrubColors.length)]);
      shrubRef.current!.setColorAt!(i, color);
    });
    shrubRef.current.instanceMatrix.needsUpdate = true;
    if (shrubRef.current.instanceColor) shrubRef.current.instanceColor.needsUpdate = true;
  }, [shrubData]);

  // Set static cacti
  useEffect(() => {
    if (!cactusRef.current) return;
    for (let i = 0; i < CACTUS_COUNT; i++) {
      const s = 0.15 + seededRand(i * 7.7) * 0.25;
      dummy.position.set(
        (seededRand(i * 23.1) - 0.5) * 55,
        s * 1.5,
        (seededRand(i * 17.3) - 0.5) * 45
      );
      dummy.scale.set(s * 0.4, s * 2, s * 0.4);
      dummy.rotation.set(0, seededRand(i * 3.3) * Math.PI, 0);
      dummy.updateMatrix();
      cactusRef.current.setMatrixAt(i, dummy.matrix);
    }
    cactusRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  // Desert ground plants (flat, small)
  useEffect(() => {
    if (!desertRef.current) return;
    const color = new THREE.Color();
    const plantColors = ['#8a8a30', '#6a7a28', '#9a9a38'];
    for (let i = 0; i < DESERT_PLANT_COUNT; i++) {
      const s = 0.1 + seededRand(i * 13.1) * 0.15;
      dummy.position.set(
        (seededRand(i * 29.3) - 0.5) * 55,
        0.05,
        (seededRand(i * 31.7) - 0.5) * 45
      );
      dummy.scale.set(s * 2, s * 0.5, s * 2);
      dummy.rotation.set(0, seededRand(i * 5.5) * Math.PI * 2, 0);
      dummy.updateMatrix();
      desertRef.current.setMatrixAt(i, dummy.matrix);
      color.set(plantColors[Math.floor(seededRand(i * 4.4) * plantColors.length)]);
      desertRef.current.setColorAt!(i, color);
    }
    desertRef.current.instanceMatrix.needsUpdate = true;
    if (desertRef.current.instanceColor) desertRef.current.instanceColor.needsUpdate = true;
  }, []);

  // Animate grass sway
  useFrame(({ clock }) => {
    if (!grassRef.current) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < GRASS_COUNT; i++) {
      const g = grassData[i];
      dummy.position.set(g.x, g.scale * 0.35, g.z);
      dummy.scale.set(0.25, g.scale, 0.25);
      dummy.rotation.set(0, 0, Math.sin(t * 0.8 + g.offset) * 0.08);
      dummy.updateMatrix();
      grassRef.current.setMatrixAt(i, dummy.matrix);
    }
    grassRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Instanced grass blades — warm dry colors */}
      <instancedMesh ref={grassRef} args={[undefined, undefined, GRASS_COUNT]}>
        <cylinderGeometry args={[0.008, 0.025, 1, 3]} />
        <meshStandardMaterial color="#8a8a30" roughness={0.85} />
      </instancedMesh>
      {/* Instanced shrubs */}
      <instancedMesh ref={shrubRef} args={[undefined, undefined, SHRUB_COUNT]}>
        <sphereGeometry args={[0.12, 5, 4]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      {/* Small cacti */}
      <instancedMesh ref={cactusRef} args={[undefined, undefined, CACTUS_COUNT]}>
        <cylinderGeometry args={[0.5, 0.6, 1, 5]} />
        <meshStandardMaterial color="#4a6a28" roughness={0.8} />
      </instancedMesh>
      {/* Desert ground plants */}
      <instancedMesh ref={desertRef} args={[undefined, undefined, DESERT_PLANT_COUNT]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
    </>
  );
}
