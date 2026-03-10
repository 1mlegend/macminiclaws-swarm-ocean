import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function CentralHub() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF('/models/macminiclaws.glb');

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.2;
      groupRef.current.position.y = 2 + Math.sin(clock.elapsedTime * 0.5) * 0.3;
    }
    if (glowRef.current) {
      const s = 3 + Math.sin(clock.elapsedTime) * 0.3;
      glowRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      <primitive object={scene} scale={1.5} />
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#00bfff" transparent opacity={0.06} />
      </mesh>
      <pointLight color="#00bfff" intensity={3} distance={15} decay={2} />
    </group>
  );
}

useGLTF.preload('/models/macminiclaws.glb');
