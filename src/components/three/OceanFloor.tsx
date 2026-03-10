import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
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

  // Rocks
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
      <mesh ref={meshRef} geometry={geometry} rotation-x={-Math.PI / 2} receiveShadow>
        <meshStandardMaterial color="#8a7a5a" roughness={0.9} metalness={0.1} />
      </mesh>
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.pos} scale={rock.scale} rotation-y={rock.rot}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}
    </>
  );
}
