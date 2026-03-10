import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { swarmNodes } from '@/data/nodes';
import { Line } from '@react-three/drei';
import { useHubStore } from '@/stores/hubStore';
import { useRef } from 'react';

export function SwarmConnections() {
  const groupRef = useRef<THREE.Group>(null);

  // Static node-to-node connections
  const nodeConnections = useMemo(() => {
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
    return conns;
  }, []);

  // Hub-connected nodes (update dynamically with hub position)
  const hubNodes = useMemo(() => {
    const clusteredNodes = swarmNodes.filter(n => n.clusterId !== null && n.status === 'online');
    return clusteredNodes.slice(0, 12);
  }, []);

  const hubPosition = useHubStore((s) => s.position);

  return (
    <group ref={groupRef}>
      {nodeConnections.map((conn, i) => (
        <Line key={`n-${i}`} points={[conn.from, conn.to]} color="#00bfff" lineWidth={1} transparent opacity={0.2} />
      ))}
      {hubNodes.map((node, i) => (
        <Line key={`h-${i}`} points={[node.position, hubPosition]} color="#00bfff" lineWidth={1} transparent opacity={0.2} />
      ))}
    </group>
  );
}
