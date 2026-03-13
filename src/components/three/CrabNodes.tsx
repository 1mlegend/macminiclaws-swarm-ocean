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
  const eyeRef = useRef<THREE.InstancedMesh>(null);
  const clawRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const { camera, size, raycaster, pointer } = useThree();
  const hoveredIdx = useRef<number | null>(null);

  const count = swarmNodes.length;

  // Single useFrame for all instanced parts
  useFrame(({ clock }) => {
    if (!bodyRef.current) return;
    const t = clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const n = swarmNodes[i];
      const isHovered = hoveredIdx.current === i;
      const isSwarm = activeCluster.includes(n.id);
      const baseScale = isHovered ? 1.2 : 1.0;
      const bobY = n.position[1] + Math.sin(t * 0.8 + i * 1.3) * 0.05;
      const rotY = Math.sin(t * 0.3 + i * 0.7) * 0.3;

      // --- Body (flattened sphere = crab shell) ---
      dummy.position.set(n.position[0], bobY, n.position[2]);
      dummy.scale.set(0.3 * baseScale, 0.18 * baseScale, 0.25 * baseScale);
      dummy.rotation.set(0, rotY, 0);
      dummy.updateMatrix();
      bodyRef.current.setMatrixAt(i, dummy.matrix);

      // Body color
      if (isSwarm) _color.set('#ff6622');
      else _color.set(n.status === 'online' ? '#cc3333' : '#664444');
      bodyRef.current.setColorAt!(i, _color);

      // --- Eyes (2 per node, packed into eyeRef with 2*count instances) ---
      for (let e = 0; e < 2; e++) {
        const side = e === 0 ? -0.1 : 0.1;
        // Position eyes relative to body, accounting for rotation
        const ex = n.position[0] + Math.sin(rotY) * 0.18 + Math.cos(rotY) * side;
        const ez = n.position[2] + Math.cos(rotY) * 0.18 - Math.sin(rotY) * side;
        dummy.position.set(ex, bobY + 0.12 * baseScale, ez);
        dummy.scale.setScalar(0.04 * baseScale);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        eyeRef.current!.setMatrixAt(i * 2 + e, dummy.matrix);

        // Eye glow color
        const emissive = isSwarm ? '#ff8844' : isHovered ? '#ff6633' : n.status === 'online' ? '#ff4422' : '#333333';
        _color.set(emissive);
        eyeRef.current!.setColorAt!(i * 2 + e, _color);
      }

      // --- Claws (2 per node) ---
      for (let c = 0; c < 2; c++) {
        const side = c === 0 ? -1 : 1;
        const cx = n.position[0] + Math.cos(rotY) * side * 0.32 * baseScale;
        const cz = n.position[2] - Math.sin(rotY) * side * 0.32 * baseScale;
        dummy.position.set(cx, bobY - 0.02, cz);
        dummy.scale.set(0.12 * baseScale, 0.05 * baseScale, 0.08 * baseScale);
        dummy.rotation.set(0, rotY + side * 0.4, side * -0.5);
        dummy.updateMatrix();
        clawRef.current!.setMatrixAt(i * 2 + c, dummy.matrix);
        // Same color as body
        if (isSwarm) _color.set('#ff6622');
        else _color.set(n.status === 'online' ? '#cc3333' : '#664444');
        clawRef.current!.setColorAt!(i * 2 + c, _color);
      }

      // --- Glow disc (ground halo, only online) ---
      if (n.status === 'online') {
        const glowPulse = 0.5 + Math.sin(t * 2.5 + i) * 0.2;
        dummy.position.set(n.position[0], 0.02, n.position[2]);
        dummy.scale.setScalar(glowPulse * baseScale * (isSwarm ? 2.5 : 1.4));
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        dummy.updateMatrix();
      } else {
        dummy.position.set(0, -100, 0); // hide offline
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
      }
      glowRef.current!.setMatrixAt(i, dummy.matrix);
    }

    bodyRef.current.instanceMatrix.needsUpdate = true;
    if (bodyRef.current.instanceColor) bodyRef.current.instanceColor.needsUpdate = true;
    eyeRef.current!.instanceMatrix.needsUpdate = true;
    if (eyeRef.current!.instanceColor) eyeRef.current!.instanceColor.needsUpdate = true;
    clawRef.current!.instanceMatrix.needsUpdate = true;
    if (clawRef.current!.instanceColor) clawRef.current!.instanceColor.needsUpdate = true;
    glowRef.current!.instanceMatrix.needsUpdate = true;
  });

  // Raycast on body mesh for hover/click
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
        onNodeHover(node, {
          x: (_vec3.x * 0.5 + 0.5) * size.width,
          y: (-_vec3.y * 0.5 + 0.5) * size.height,
        });
      }
    } else if (hoveredIdx.current !== null) {
      hoveredIdx.current = null;
      document.body.style.cursor = 'default';
      onNodeHover(null, null);
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
    <group>
      {/* Crab bodies — flattened spheres */}
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
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial roughness={0.4} metalness={0.3} />
      </instancedMesh>

      {/* Eyes — small bright spheres, 2 per node */}
      <instancedMesh ref={eyeRef} args={[undefined, undefined, count * 2]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial emissive="#ff4422" emissiveIntensity={2} roughness={0.3} />
      </instancedMesh>

      {/* Claws — boxes, 2 per node */}
      <instancedMesh ref={clawRef} args={[undefined, undefined, count * 2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.5} metalness={0.2} />
      </instancedMesh>

      {/* Ground glow discs — 1 per node */}
      <instancedMesh ref={glowRef} args={[undefined, undefined, count]}>
        <circleGeometry args={[1, 16]} />
        <meshBasicMaterial color="#ff4422" transparent opacity={0.15} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  );
}
