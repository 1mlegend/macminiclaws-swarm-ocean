import { useRef, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const DEV_POS: [number, number, number] = [15, 3, 5];

export function DevNode({ onHover, onUnhover }: {
  onHover: (pos: { x: number; y: number }) => void;
  onUnhover: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF('/models/orpi_dev.glb');
  const { camera, size } = useThree();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = DEV_POS[1] + Math.sin(t * 1.2) * 0.06;
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.15;
    }
    if (glowRef.current) {
      const pulse = Math.sin(t * 2.5) * 0.5 + 0.5;
      const s = 0.6 + pulse * 0.15;
      glowRef.current.scale.set(s, s, s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + pulse * 0.06;
    }
    if (haloRef.current) {
      const pulse = Math.sin(t * 1.8) * 0.5 + 0.5;
      const s = 0.9 + pulse * 0.2;
      haloRef.current.scale.set(s, s, s);
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.04 + pulse * 0.03;
    }
  });

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
    const v = new THREE.Vector3(...DEV_POS).project(camera);
    onHover({
      x: (v.x * 0.5 + 0.5) * size.width,
      y: (-v.y * 0.5 + 0.5) * size.height,
    });
  }, [camera, size, onHover]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'default';
    onUnhover();
  }, [onUnhover]);

  const handleClick = useCallback(() => {
    window.open('https://x.com/Orpi_ping', '_blank');
  }, []);

  return (
    <group ref={groupRef} position={DEV_POS}>
      <primitive
        object={scene}
        scale={3}
        rotation={[0, Math.PI / 2, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
      {/* Glow disc */}
      <mesh ref={glowRef} position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 24]} />
        <meshBasicMaterial color="#ff6622" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Halo ring */}
      <mesh ref={haloRef} position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.9, 24]} />
        <meshBasicMaterial color="#ff4422" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
      {/* Slightly stronger point light */}
      <pointLight color="#ff5522" intensity={2.5} distance={8} decay={2} />
    </group>
  );
}

useGLTF.preload('/models/orpi_dev.glb');
