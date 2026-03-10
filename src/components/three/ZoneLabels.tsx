import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const ZONES = [
  { name: 'CLAW CORE', pos: [0, 0.3, 0] as [number, number, number] },
  { name: 'EDGE FIELD', pos: [18, 0.3, -10] as [number, number, number] },
  { name: 'CLUSTER ZONE', pos: [-15, 0.3, -12] as [number, number, number] },
  { name: 'COMPUTE VALLEY', pos: [8, 0.3, 18] as [number, number, number] },
  { name: 'DEPLOY BAY', pos: [-18, 0.3, 8] as [number, number, number] },
  { name: 'NEST ALPHA', pos: [-8, 0.3, 5] as [number, number, number] },
  { name: 'RELAY POINT', pos: [22, 0.3, 0] as [number, number, number] },
];

export function ZoneLabels() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.position.y = 0.3 + Math.sin(t * 0.3 + i * 0.7) * 0.05;
    });
  });

  return (
    <group ref={groupRef}>
      {ZONES.map((zone, i) => (
        <Text
          key={i}
          position={zone.pos}
          fontSize={0.35}
          color="#ff6622"
          anchorX="center"
          anchorY="middle"
          rotation-x={-Math.PI / 2}
          outlineWidth={0.01}
          outlineColor="#1a0800"
        >
          {zone.name}
        </Text>
      ))}
    </group>
  );
}
