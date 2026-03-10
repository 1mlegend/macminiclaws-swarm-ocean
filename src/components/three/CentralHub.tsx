import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useHubStore } from '@/stores/hubStore';

// Movement input: track pressed keys
const keys: Record<string, boolean> = {};
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; if (e.key === ' ') e.preventDefault(); });
  window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
}

const BOUNDS = 35;
const GROUND_Y = 0.8;
const SPEED = 6;
const DAMPING = 0.85;

export function CentralHub() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const { scene } = useGLTF('/models/macminiclaws.glb');
  const velocity = useRef(new THREE.Vector3());
  const targetRotY = useRef(0);
  const jumpVelocity = useRef(0);
  const isGrounded = useRef(true);
  const setPosition = useHubStore((s) => s.setPosition);

  // Texture color space fix
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

    // Movement input
    const dir = new THREE.Vector3();
    if (keys['w'] || keys['arrowup']) dir.z -= 1;
    if (keys['s'] || keys['arrowdown']) dir.z += 1;
    if (keys['a'] || keys['arrowleft']) dir.x -= 1;
    if (keys['d'] || keys['arrowright']) dir.x += 1;

    const isMoving = dir.length() > 0;
    if (isMoving) {
      dir.normalize();
      velocity.current.x = dir.x * SPEED;
      velocity.current.z = dir.z * SPEED;
      targetRotY.current = Math.atan2(dir.x, dir.z);
    } else {
      velocity.current.multiplyScalar(DAMPING);
    }

    const pos = groupRef.current.position;
    pos.x += velocity.current.x * delta;
    pos.z += velocity.current.z * delta;
    pos.x = THREE.MathUtils.clamp(pos.x, -BOUNDS, BOUNDS);
    pos.z = THREE.MathUtils.clamp(pos.z, -BOUNDS, BOUNDS);

    // Jump logic
    if (keys[' '] && isGrounded.current) {
      jumpVelocity.current = 8;
      isGrounded.current = false;
    }

    const baseY = GROUND_Y + Math.sin(clock.elapsedTime * 0.5) * 0.15;

    if (!isGrounded.current) {
      jumpVelocity.current -= 20 * delta; // gravity
      pos.y += jumpVelocity.current * delta;
      if (pos.y <= baseY) {
        pos.y = baseY;
        isGrounded.current = true;
        jumpVelocity.current = 0;
      }
    } else {
      pos.y = baseY;
    }
      groupRef.current.rotation.y,
      targetRotY.current,
      0.1
    );

    setPosition([pos.x, pos.y, pos.z]);

    // Pulsing glow — 2.5s cycle
    const pulse = Math.sin(clock.elapsedTime * 2.5) * 0.5 + 0.5;

    // Outer glow sphere pulse
    if (glowRef.current) {
      const s = 3.5 + pulse * 1.0;
      glowRef.current.scale.set(s, s, s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.04 + pulse * 0.06;
    }

    // Ground halo ring pulse
    if (haloRef.current) {
      const hs = 2.5 + pulse * 0.8;
      haloRef.current.scale.set(hs, hs, 1);
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + pulse * 0.12;
    }

    // Light intensity pulse
    if (lightRef.current) {
      lightRef.current.intensity = 4 + pulse * 3;
    }
  });

  return (
    <group ref={groupRef} position={[0, GROUND_Y, 0]}>
      {/* Main model — scaled 2x to stand out as commander */}
      <primitive object={scene} scale={3.0} />
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ff4422" transparent opacity={0.06} />
      </mesh>
      {/* Ground halo ring */}
      <mesh ref={haloRef} position={[0, -0.6, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.5, 3, 32]} />
        <meshBasicMaterial color="#ff3311" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Strong pulsing point light */}
      <pointLight ref={lightRef} color="#ff4422" intensity={5} distance={20} decay={2} />
    </group>
  );
}

useGLTF.preload('/models/macminiclaws.glb');
