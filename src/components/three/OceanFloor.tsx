import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

const ROCK_COUNT = 60;
const PEBBLE_COUNT = 80;
const dummy = new THREE.Object3D();
const rockColors = ['#a08050', '#8a6a40', '#c4a060', '#7a6040', '#b09060'];
const pebbleColors = ['#b8a070', '#a09060', '#c8b080', '#9a8050'];

function seededRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function OceanFloor() {
  const meshRef = useRef<THREE.Mesh>(null);
  const rocksRef = useRef<THREE.InstancedMesh>(null);
  const pebblesRef = useRef<THREE.InstancedMesh>(null);
  const darkPatchRef = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 80, 80);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      // More pronounced dunes + subtle noise
      const dune = Math.sin(x * 0.15) * 0.6 + Math.cos(z * 0.2) * 0.4;
      const detail = Math.sin(x * 0.8 + z * 0.5) * 0.1 + Math.cos(x * 1.2 - z * 0.7) * 0.08;
      const ripple = Math.sin(x * 2.5) * 0.03 + Math.cos(z * 3.0) * 0.02;
      pos.setZ(i, dune + detail + ripple);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Vertex colors for sand variation
  const coloredGeometry = useMemo(() => {
    const geo = geometry.clone();
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const baseColor = new THREE.Color('#c4a56e');
    const darkColor = new THREE.Color('#a08050');
    const lightColor = new THREE.Color('#ddc090');

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      const noise = seededRand(i * 7.13 + x * 3.7 + z * 2.3);
      const blend = noise * 0.4;
      const c = baseColor.clone();
      if (noise > 0.6) c.lerp(lightColor, blend);
      else if (noise < 0.3) c.lerp(darkColor, blend);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [geometry]);

  // Rocks
  useEffect(() => {
    if (!rocksRef.current) return;
    const color = new THREE.Color();
    for (let i = 0; i < ROCK_COUNT; i++) {
      const s = seededRand(i * 5.5);
      dummy.position.set(
        (seededRand(i * 13.3) - 0.5) * 70,
        0.1 + s * 0.3,
        (seededRand(i * 7.7) - 0.5) * 70
      );
      dummy.scale.set(0.3 + s, 0.2 + s * 0.5, 0.3 + s);
      dummy.rotation.set(0, seededRand(i * 3.1) * Math.PI, 0);
      dummy.updateMatrix();
      rocksRef.current.setMatrixAt(i, dummy.matrix);
      color.set(rockColors[Math.floor(seededRand(i * 9.9) * rockColors.length)]);
      rocksRef.current.setColorAt(i, color);
    }
    rocksRef.current.instanceMatrix.needsUpdate = true;
    rocksRef.current.instanceColor!.needsUpdate = true;
  }, []);

  // Small pebbles / sand detail
  useEffect(() => {
    if (!pebblesRef.current) return;
    const color = new THREE.Color();
    for (let i = 0; i < PEBBLE_COUNT; i++) {
      const s = 0.03 + seededRand(i * 11.1) * 0.08;
      dummy.position.set(
        (seededRand(i * 17.3) - 0.5) * 60,
        0.03,
        (seededRand(i * 23.7) - 0.5) * 60
      );
      dummy.scale.set(s, s * 0.4, s);
      dummy.rotation.set(0, seededRand(i * 4.4) * Math.PI * 2, 0);
      dummy.updateMatrix();
      pebblesRef.current.setMatrixAt(i, dummy.matrix);
      color.set(pebbleColors[Math.floor(seededRand(i * 6.6) * pebbleColors.length)]);
      pebblesRef.current.setColorAt(i, color);
    }
    pebblesRef.current.instanceMatrix.needsUpdate = true;
    pebblesRef.current.instanceColor!.needsUpdate = true;
  }, []);

  // Dark patches on ground
  useEffect(() => {
    if (!darkPatchRef.current) return;
    for (let i = 0; i < 15; i++) {
      dummy.position.set(
        (seededRand(i * 31.3) - 0.5) * 60,
        0.01,
        (seededRand(i * 19.7) - 0.5) * 60
      );
      const s = 1.5 + seededRand(i * 8.8) * 3;
      dummy.scale.set(s, 1, s);
      dummy.rotation.set(-Math.PI / 2, 0, seededRand(i * 2.2) * Math.PI);
      dummy.updateMatrix();
      darkPatchRef.current.setMatrixAt(i, dummy.matrix);
    }
    darkPatchRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <>
      <mesh ref={meshRef} geometry={coloredGeometry} rotation-x={-Math.PI / 2} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Instanced rocks */}
      <instancedMesh ref={rocksRef} args={[undefined, undefined, ROCK_COUNT]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.8} metalness={0.08} />
      </instancedMesh>
      {/* Small pebbles */}
      <instancedMesh ref={pebblesRef} args={[undefined, undefined, PEBBLE_COUNT]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.9} metalness={0.05} />
      </instancedMesh>
      {/* Dark ground patches for variation */}
      <instancedMesh ref={darkPatchRef} args={[undefined, undefined, 15]}>
        <circleGeometry args={[1, 12]} />
        <meshStandardMaterial color="#8a7040" transparent opacity={0.3} roughness={1} />
      </instancedMesh>
    </>
  );
}
