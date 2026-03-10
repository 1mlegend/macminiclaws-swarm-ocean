import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function MoltLobster() {
  const { scene } = useGLTF('/models/molt_lobster.glb');
  const ref = useRef<THREE.Group>(null);

  const handleClick = useCallback(() => {
    window.open('https://moltbook.com/', '_blank');
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 1.5 + Math.sin(clock.elapsedTime * 0.6) * 0.15;
      ref.current.rotation.y = clock.elapsedTime * 0.3;
    }
  });

  return (
    <group
      ref={ref}
      position={[12, 0.5, -8]}
      scale={[2, 2, 2]}
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/molt_lobster.glb');
