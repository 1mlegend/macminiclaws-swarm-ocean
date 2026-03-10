import { useRef, useMemo, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { swarmNodes, CrabNode } from '@/data/nodes';
import { useSwarmStore } from '@/stores/swarmStore';

const dummy = new THREE.Object3D();
const _color = new THREE.Color();
const _vec3 = new THREE.Vector3();

interface CrabNodesProps {
  onNodeHover: (node: CrabNode | null, screenPos: { x: number; y: number } | null) => void;
  onNodeClick: (node: CrabNode) => void;
}

export function CrabNodes({ onNodeHover, onNodeClick }: CrabNodesProps) {
  const activeCluster = useSwarmStore((s) => s.activeCluster);
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const { camera, size, raycaster, pointer } = useThree();
  const hoveredIdx = useRef<number | null>(null);

  const count = swarmNodes.length;

  // Set initial transforms
  useEffect(() => {
    if (!bodyRef.current) return;
    for (let i = 0; i < count; i++) {
      const n = swarmNodes[i];
      dummy.position.set(...n.position);
      dummy.scale.setScalar(0.5);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      bodyRef.current.setMatrixAt(i, dummy.matrix);
      _color.set(n.status === 'online' ? '#cc3333' : '#664444');
      bodyRef.current.setColorAt(i, _color);
    }
    bodyRef.current.instanceMatrix.needsUpdate = true;
    if (bodyRef.current.instanceColor) bodyRef.current.instanceColor.needsUpdate = true;
  }, [count]);

  // Animate: gentle bob + hover scale
  useFrame(({ clock }) => {
    if (!bodyRef.current) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const n = swarmNodes[i];
      const isHovered = hoveredIdx.current === i;
      const isSwarm = activeCluster.includes(n.id);
      const s = isHovered ? 0.65 : 0.5;
      dummy.position.set(n.position[0], n.position[1] + Math.sin(t * 0.8 + i) * 0.05, n.position[2]);
      dummy.scale.setScalar(s);
      dummy.rotation.set(0, Math.sin(t * 0.3 + i) * 0.3, 0);
      dummy.updateMatrix();
      bodyRef.current!.setMatrixAt(i, dummy.matrix);

      // Color: swarm=bright, online=red, offline=dark
      if (isSwarm) {
        _color.set('#ff6622');
      } else {
        _color.set(n.status === 'online' ? '#cc3333' : '#664444');
      }
      bodyRef.current!.setColorAt!(i, _color);
    }
    bodyRef.current.instanceMatrix.needsUpdate = true;
    if (bodyRef.current.instanceColor) bodyRef.current.instanceColor.needsUpdate = true;
  });

  // Raycast for hover/click on instanced mesh
  const handlePointerMove = useCallback(() => {
    if (!bodyRef.current) return;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(bodyRef.current);
    if (hits.length > 0 && hits[0].instanceId !== undefined) {
      const idx = hits[0].instanceId;
      if (hoveredIdx.current !== idx) {
        hoveredIdx.current = idx;
        document.body.style.cursor = 'pointer';
        const node = swarmNodes[idx];
        _vec3.set(...node.position).project(camera);
        const x = (_vec3.x * 0.5 + 0.5) * size.width;
        const y = (-_vec3.y * 0.5 + 0.5) * size.height;
        onNodeHover(node, { x, y });
      }
    } else {
      if (hoveredIdx.current !== null) {
        hoveredIdx.current = null;
        document.body.style.cursor = 'default';
        onNodeHover(null, null);
      }
    }
  }, [camera, size, raycaster, pointer, onNodeHover]);

  const handleClick = useCallback(() => {
    if (!bodyRef.current) return;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(bodyRef.current);
    if (hits.length > 0 && hits[0].instanceId !== undefined) {
      onNodeClick(swarmNodes[hits[0].instanceId]);
    }
  }, [camera, raycaster, pointer, onNodeClick]);

  return (
    <instancedMesh
      ref={bodyRef}
      args={[undefined, undefined, count]}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        hoveredIdx.current = null;
        document.body.style.cursor = 'default';
        onNodeHover(null, null);
      }}
      onClick={handleClick}
    >
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial roughness={0.4} metalness={0.3} />
    </instancedMesh>
  );
}
