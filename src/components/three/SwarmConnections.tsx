import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { swarmNodes } from '@/data/nodes';
import { Line } from '@react-three/drei';
import { useHubStore } from '@/stores/hubStore';
import { useSwarmStore } from '@/stores/swarmStore';

export function SwarmConnections() {
  const groupRef = useRef<THREE.Group>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const lineRefs = useRef<Map<number, THREE.LineBasicMaterial>>(new Map());

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

  const hubNodes = useMemo(() => {
    return swarmNodes.filter(n => n.clusterId !== null && n.status === 'online').slice(0, 8);
  }, []);

  const hubPosition = useHubStore((s) => s.position);
  const { swarmActive, activeCluster, setSwarm } = useSwarmStore();

  // Swarm mode: activate random cluster every 15-20s
  useEffect(() => {
    const trigger = () => {
      const onlineNodes = swarmNodes.filter(n => n.status === 'online');
      const count = 5 + Math.floor(Math.random() * 6);
      const startIdx = Math.floor(Math.random() * Math.max(1, onlineNodes.length - count));
      const selected = onlineNodes.slice(startIdx, startIdx + count).map(n => n.id);
      setSwarm(selected, true);

      // Reset after 5 seconds
      setTimeout(() => setSwarm([], false), 5000);
    };

    const interval = setInterval(trigger, 15000 + Math.random() * 5000);
    const initial = setTimeout(trigger, 3000);
    return () => { clearInterval(interval); clearTimeout(initial); };
  }, [setSwarm]);

  // Shockwave + animated line pulse
  useFrame(({ clock }) => {
    if (shockwaveRef.current) {
      if (swarmActive) {
        const t = (clock.elapsedTime % 5) / 5;
        const s = 1 + t * 15;
        shockwaveRef.current.scale.set(s, s, 1);
        (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - t);
        shockwaveRef.current.visible = true;
      } else {
        shockwaveRef.current.visible = false;
      }
    }
  });

  // Compute swarm cluster center for shockwave
  const clusterCenter = useMemo(() => {
    if (activeCluster.length === 0) return [0, 0.2, 0] as [number, number, number];
    const nodes = swarmNodes.filter(n => activeCluster.includes(n.id));
    const avg = nodes.reduce(
      (acc, n) => [acc[0] + n.position[0], acc[1] + n.position[1], acc[2] + n.position[2]],
      [0, 0, 0]
    );
    return [avg[0] / nodes.length, 0.2, avg[2] / nodes.length] as [number, number, number];
  }, [activeCluster]);

  return (
    <group ref={groupRef}>
      {/* Node-to-node connections — thicker, with glow */}
      {nodeConnections.map((conn, i) => (
        <group key={`n-${i}`}>
          <Line
            points={[conn.from, conn.to]}
            color="#ff5533"
            lineWidth={2.5}
            transparent
            opacity={0.35}
          />
          {/* Glow line underneath */}
          <Line
            points={[
              [conn.from[0], conn.from[1] - 0.01, conn.from[2]],
              [conn.to[0], conn.to[1] - 0.01, conn.to[2]],
            ]}
            color="#ff3311"
            lineWidth={4}
            transparent
            opacity={0.08}
          />
        </group>
      ))}
      {/* Hub connections — thicker */}
      {hubNodes.map((node, i) => (
        <group key={`h-${i}`}>
          <Line
            points={[node.position, hubPosition]}
            color="#ff5533"
            lineWidth={2}
            transparent
            opacity={0.3}
          />
          <Line
            points={[
              [node.position[0], node.position[1] - 0.01, node.position[2]],
              [hubPosition[0], hubPosition[1] - 0.01, hubPosition[2]],
            ]}
            color="#ff3311"
            lineWidth={3.5}
            transparent
            opacity={0.06}
          />
        </group>
      ))}
      {/* Shockwave ring for swarm activation */}
      <mesh ref={shockwaveRef} position={clusterCenter} rotation-x={-Math.PI / 2} visible={false}>
        <ringGeometry args={[0.5, 1.2, 32]} />
        <meshBasicMaterial color="#ff4422" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
