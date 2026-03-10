import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useHubStore } from '@/stores/hubStore';

// Movement input: track pressed keys
const keys: Record<string, boolean> = {};
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
  window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
}

// Boundary clamp: keep shrimp within the seabed area
const BOUNDS = 35;
const GROUND_Y = 0.8;
const SPEED = 6;
const DAMPING = 0.85;

export function CentralHub() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF('/models/macminiclaws.glb');
  const velocity = useRef(new THREE.Vector3());
  const targetRotY = useRef(0);
  const setPosition = useHubStore((s) => s.setPosition);

  // Texture color space fix: ensure base color maps use sRGB
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat?.map) {
          mat.map.colorSpace = 'srgb';
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    // Movement input: WASD / arrow keys
    const dir = new THREE.Vector3();
    if (keys['w'] || keys['arrowup']) dir.z -= 1;
    if (keys['s'] || keys['arrowdown']) dir.z += 1;
    if (keys['a'] || keys['arrowleft']) dir.x -= 1;
    if (keys['d'] || keys['arrowright']) dir.x += 1;

    const isMoving = dir.length() > 0;

    if (isMoving) {
      dir.normalize();
      // Position update: apply velocity with smooth damping
      velocity.current.x += dir.x * SPEED * delta;
      velocity.current.z += dir.z * SPEED * delta;
      // Rotate shrimp toward movement direction
      targetRotY.current = Math.atan2(dir.x, dir.z);
    }

    // Smooth velocity damping
    velocity.current.multiplyScalar(DAMPING);

    const pos = groupRef.current.position;
    pos.x += velocity.current.x * delta * 10;
    pos.z += velocity.current.z * delta * 10;

    // Boundary clamp: constrain to playable zone
    pos.x = THREE.MathUtils.clamp(pos.x, -BOUNDS, BOUNDS);
    pos.z = THREE.MathUtils.clamp(pos.z, -BOUNDS, BOUNDS);

    // Keep slightly above ground + subtle bob
    pos.y = GROUND_Y + Math.sin(clock.elapsedTime * 0.5) * 0.15;

    // Smooth rotation toward movement direction
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY.current,
      0.1
    );

    // Share position with store for camera follow & swarm connections
    setPosition([pos.x, pos.y, pos.z]);

    // Glow pulse
    if (glowRef.current) {
      const s = 3 + Math.sin(clock.elapsedTime) * 0.3;
      glowRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef} position={[0, GROUND_Y, 0]}>
      <primitive object={scene} scale={1.5} />
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#00bfff" transparent opacity={0.06} />
      </mesh>
      <pointLight color="#00bfff" intensity={3} distance={15} decay={2} />
    </group>
  );
}

useGLTF.preload('/models/macminiclaws.glb');
