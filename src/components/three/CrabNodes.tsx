import { useRef, useMemo, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { swarmNodes, CrabNode } from '@/data/nodes';
import { useSwarmStore } from '@/stores/swarmStore';

interface CrabNodeMeshProps {
  node: CrabNode;
  onHover: (node: CrabNode | null, screenPos: { x: number; y: number } | null) => void;
  onClick: (node: CrabNode) => void;
  isSwarmActive: boolean;
}

function CrabNodeMesh({ node, onHover, onClick, isSwarmActive }: CrabNodeMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const { camera, size } = useThree();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = node.position[1] + Math.sin(clock.elapsedTime * 0.8 + offset) * 0.05;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3 + offset) * 0.3;

    // Hover scale animation
    const targetScale = hovered ? 1.25 : 1.0;
    const s = groupRef.current.scale.x;
    const newS = THREE.MathUtils.lerp(s, targetScale, 0.1);
    groupRef.current.scale.setScalar(newS);
  });

  const handlePointerOver = useCallback((e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHovered(true);
    const vec = new THREE.Vector3(...node.position);
    vec.project(camera);
    const x = (vec.x * 0.5 + 0.5) * size.width;
    const y = (-vec.y * 0.5 + 0.5) * size.height;
    onHover(node, { x, y });
  }, [node, camera, size, onHover]);

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = 'default';
    setHovered(false);
    onHover(null, null);
  }, [onHover]);

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    onClick(node);
  }, [node, onClick]);

  const isOnline = node.status === 'online';
  const bodyColor = isOnline ? '#cc3333' : '#664444';
  const glowColor = isOnline ? '#ff4422' : '#333333';
  // Swarm active intensifies glow
  const emissiveIntensity = isSwarmActive ? 3.0 : hovered ? 2.0 : isOnline ? 1.5 : 0;

  return (
    <group
      ref={groupRef}
      position={node.position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <mesh>
        <sphereGeometry args={[0.25, 8, 6]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.3} />
      </mesh>
      {[-0.1, 0.1].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0.2]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={emissiveIntensity} />
        </mesh>
      ))}
      {[-1, 1].map((side, i) => (
        <mesh key={`claw-${i}`} position={[side * 0.35, -0.05, 0.1]} rotation={[0, side * 0.3, side * -0.5]}>
          <boxGeometry args={[0.2, 0.08, 0.12]} />
          <meshStandardMaterial color={bodyColor} roughness={0.5} />
        </mesh>
      ))}
      {[-1, 1].map((side) =>
        [0, 1, 2].map((leg) => (
          <mesh
            key={`leg-${side}-${leg}`}
            position={[side * 0.22, -0.15, -0.1 + leg * 0.12]}
            rotation={[0, 0, side * 0.8]}
          >
            <cylinderGeometry args={[0.015, 0.015, 0.25, 4]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>
        ))
      )}
      {isOnline && (
        <pointLight color="#ff4422" intensity={isSwarmActive ? 1.5 : hovered ? 1.0 : 0.5} distance={3} decay={2} />
      )}
    </group>
  );
}

interface CrabNodesProps {
  onNodeHover: (node: CrabNode | null, screenPos: { x: number; y: number } | null) => void;
  onNodeClick: (node: CrabNode) => void;
}

export function CrabNodes({ onNodeHover, onNodeClick }: CrabNodesProps) {
  const activeCluster = useSwarmStore((s) => s.activeCluster);

  return (
    <>
      {swarmNodes.map((node) => (
        <CrabNodeMesh
          key={node.id}
          node={node}
          onHover={onNodeHover}
          onClick={onNodeClick}
          isSwarmActive={activeCluster.includes(node.id)}
        />
      ))}
    </>
  );
}
