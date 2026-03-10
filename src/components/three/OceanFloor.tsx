import { useRef, useMemo } from 'react';
import * as THREE from 'three';

export function OceanFloor() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 80, 80);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.3) * 0.3 + Math.cos(z * 0.4) * 0.2 + Math.sin(x * 0.1 + z * 0.15) * 0.5);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Rocks — warm sandstone tones
  const rocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      const s = Math.random();
      arr.push({
        pos: [(Math.random() - 0.5) * 60, 0.1 + s * 0.3, (Math.random() - 0.5) * 60] as [number, number, number],
        scale: [0.3 + s, 0.2 + s * 0.5, 0.3 + s] as [number, number, number],
        rot: Math.random() * Math.PI,
      });
    }
    return arr;
  }, []);

  return (
    <>
      {/* Sandy beach ground */}
      <mesh ref={meshRef} geometry={geometry} rotation-x={-Math.PI / 2} receiveShadow>
        <meshStandardMaterial color="#c4a56e" roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Shallow water zone — one side of the map */}
      <mesh position={[0, 0.05, 35]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 30]} />
        <meshStandardMaterial color="#2288aa" roughness={0.3} metalness={0.1} transparent opacity={0.35} />
      </mesh>
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.pos} scale={rock.scale} rotation-y={rock.rot}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#8a7a5a" roughness={0.85} metalness={0.1} />
        </mesh>
      ))}
    </>
  );
}
