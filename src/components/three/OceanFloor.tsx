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

  // Warm sandstone rocks
  const rocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 50; i++) {
      const s = Math.random();
      const colors = ['#a08050', '#8a6a40', '#c4a060', '#7a6040', '#b09060'];
      arr.push({
        pos: [(Math.random() - 0.5) * 60, 0.1 + s * 0.3, (Math.random() - 0.5) * 60] as [number, number, number],
        scale: [0.3 + s, 0.2 + s * 0.5, 0.3 + s] as [number, number, number],
        rot: Math.random() * Math.PI,
        color: colors[Math.floor(Math.random() * colors.length)],
        roughness: 0.75 + Math.random() * 0.2,
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
      {/* Rocks with warm sandstone/terracotta variation */}
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.pos} scale={rock.scale} rotation-y={rock.rot}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={rock.color} roughness={rock.roughness} metalness={0.08} />
        </mesh>
      ))}
    </>
  );
}
