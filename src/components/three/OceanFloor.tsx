import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

const ROCK_COUNT = 40;
const dummy = new THREE.Object3D();
const rockColors = ['#a08050', '#8a6a40', '#c4a060', '#7a6040', '#b09060'];

export function OceanFloor() {
  const meshRef = useRef<THREE.Mesh>(null);
  const rocksRef = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 60, 60);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.3) * 0.3 + Math.cos(z * 0.4) * 0.2 + Math.sin(x * 0.1 + z * 0.15) * 0.5);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Set rock instance transforms and colors once
  useEffect(() => {
    if (!rocksRef.current) return;
    const color = new THREE.Color();
    for (let i = 0; i < ROCK_COUNT; i++) {
      const s = Math.random();
      dummy.position.set((Math.random() - 0.5) * 60, 0.1 + s * 0.3, (Math.random() - 0.5) * 60);
      dummy.scale.set(0.3 + s, 0.2 + s * 0.5, 0.3 + s);
      dummy.rotation.set(0, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      rocksRef.current.setMatrixAt(i, dummy.matrix);
      color.set(rockColors[Math.floor(Math.random() * rockColors.length)]);
      rocksRef.current.setColorAt(i, color);
    }
    rocksRef.current.instanceMatrix.needsUpdate = true;
    rocksRef.current.instanceColor!.needsUpdate = true;
  }, []);

  return (
    <>
      <mesh ref={meshRef} geometry={geometry} rotation-x={-Math.PI / 2} receiveShadow>
        <meshStandardMaterial color="#c4a56e" roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Instanced rocks with per-instance color */}
      <instancedMesh ref={rocksRef} args={[undefined, undefined, ROCK_COUNT]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.8} metalness={0.08} />
      </instancedMesh>
    </>
  );
}
