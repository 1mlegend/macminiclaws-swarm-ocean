import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { swarmNodes } from '@/data/nodes';
import { Line } from '@react-three/drei';

export function SwarmConnections() {
  const connections = useMemo(() => {
    const conns: { from: [number, number, number]; to: [number, number, number] }[] = [];
    const clusteredNodes = swarmNodes.filter(n => n.clusterId !== null && n.status === 'online');

    for (let i = 0; i < clusteredNodes.length; i++) {
      for (let j = i + 1; j < clusteredNodes.length; j++) {
        if (clusteredNodes[i].clusterId === clusteredNodes[j].clusterId) {
          const from = new THREE.Vector3(...clusteredNodes[i].position);
          const to = new THREE.Vector3(...clusteredNodes[j].position);
          if (from.distanceTo(to) < 20) {
            conns.push({ from: clusteredNodes[i].position, to: clusteredNodes[j].position });
          }
        }
      }
    }

    const clustered = clusteredNodes.slice(0, 12);
    clustered.forEach(node => {
      conns.push({ from: node.position, to: [0, 2, 0] });
    });

    return conns;
  }, []);

  return (
    <group>
      {connections.map((conn, i) => (
        <Line
          key={i}
          points={[conn.from, conn.to]}
          color="#00bfff"
          lineWidth={1}
          transparent
          opacity={0.2}
        />
      ))}
    </group>
  );
}
