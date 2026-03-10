import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { swarmNodes } from '@/data/nodes';

export function SwarmConnections() {
  const linesRef = useRef<THREE.Group>(null);

  const connections = useMemo(() => {
    const conns: { from: THREE.Vector3; to: THREE.Vector3 }[] = [];
    const clusteredNodes = swarmNodes.filter(n => n.clusterId !== null && n.status === 'online');

    // Connect nodes in same cluster
    for (let i = 0; i < clusteredNodes.length; i++) {
      for (let j = i + 1; j < clusteredNodes.length; j++) {
        if (clusteredNodes[i].clusterId === clusteredNodes[j].clusterId) {
          const from = new THREE.Vector3(...clusteredNodes[i].position);
          const to = new THREE.Vector3(...clusteredNodes[j].position);
          if (from.distanceTo(to) < 20) {
            conns.push({ from, to });
          }
        }
      }
    }

    // Connect some to hub
    const hubPos = new THREE.Vector3(0, 2, 0);
    clusteredNodes.slice(0, 12).forEach(node => {
      conns.push({ from: new THREE.Vector3(...node.position), to: hubPos });
    });

    return conns;
  }, []);

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          mat.opacity = 0.15 + Math.sin(clock.elapsedTime * 1.5 + i * 0.5) * 0.1;
        }
      });
    }
  });

  return (
    <group ref={linesRef}>
      {connections.map((conn, i) => {
        const points = [conn.from, conn.to];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="#00bfff" transparent opacity={0.2} />
          </line>
        );
      })}
    </group>
  );
}
