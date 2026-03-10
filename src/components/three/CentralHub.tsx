import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useHubStore } from '@/stores/hubStore';

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
  const modelRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const { scene, animations } = useGLTF('/models/macminiclaws_walk.glb');
  const { actions } = useAnimations(animations, modelRef);
  const velocity = useRef(new THREE.Vector3());
  const targetRotY = useRef(0);
  const jumpVelocity = useRef(0);
  const isGrounded = useRef(true);
  const wasMoving = useRef(false);
  const walkPhase = useRef(0);
  const setPosition = useHubStore((s) => s.setPosition);

  // Start animation immediately and keep it playing (paused when idle)
  useEffect(() => {
    const actionNames = Object.keys(actions);
    if (actionNames.length > 0) {
      const walkAction = actions[actionNames[0]];
      if (walkAction) {
        walkAction.play();
        walkAction.setLoop(THREE.LoopRepeat, Infinity);
        walkAction.timeScale = 0; // Start paused at first frame
      }
    }
  }, [actions]);

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

  useEffect(() => {
    console.log('Walk model animations:', animations.map(a => a.name));
    console.log('Walk model actions:', Object.keys(actions));
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log('Walk model size:', size.x.toFixed(2), size.y.toFixed(2), size.z.toFixed(2));
  }, [scene, animations, actions]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    const dir = new THREE.Vector3();
    if (keys['w'] || keys['arrowup']) dir.z -= 1;
    if (keys['s'] || keys['arrowdown']) dir.z += 1;
    if (keys['a'] || keys['arrowleft']) dir.x -= 1;
    if (keys['d'] || keys['arrowright']) dir.x += 1;

    const isMoving = dir.length() > 0;

    // Control walk animation speed (always playing, just change timeScale)
    const actionNames = Object.keys(actions);
    if (actionNames.length > 0) {
      const walkAction = actions[actionNames[0]];
      if (walkAction) {
        if (isMoving) {
          walkAction.timeScale = THREE.MathUtils.lerp(walkAction.timeScale, 1.5, 0.1);
        } else {
          walkAction.timeScale = THREE.MathUtils.lerp(walkAction.timeScale, 0, 0.15);
        }
      }
    }

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

    if (keys[' '] && isGrounded.current) {
      jumpVelocity.current = 8;
      isGrounded.current = false;
    }

    const baseY = GROUND_Y + Math.sin(clock.elapsedTime * 0.5) * 0.15;

    if (!isGrounded.current) {
      jumpVelocity.current -= 20 * delta;
      pos.y += jumpVelocity.current * delta;
      if (pos.y <= baseY) {
        pos.y = baseY;
        isGrounded.current = true;
        jumpVelocity.current = 0;
      }
    } else {
      pos.y = baseY;
    }

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY.current,
      0.1
    );

    setPosition([pos.x, pos.y, pos.z]);

    const pulse = Math.sin(clock.elapsedTime * 2.5) * 0.5 + 0.5;
    if (glowRef.current) {
      const s = 3.5 + pulse * 1.0;
      glowRef.current.scale.set(s, s, s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.04 + pulse * 0.06;
    }
    if (haloRef.current) {
      const hs = 2.5 + pulse * 0.8;
      haloRef.current.scale.set(hs, hs, 1);
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + pulse * 0.12;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 4 + pulse * 3;
    }
  });

  return (
    <group ref={groupRef} position={[0, GROUND_Y, 0]}>
      <group ref={modelRef}>
        <primitive object={scene} scale={100} />
      </group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ff4422" transparent opacity={0.06} />
      </mesh>
      <mesh ref={haloRef} position={[0, -0.6, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.5, 3, 32]} />
        <meshBasicMaterial color="#ff3311" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <pointLight ref={lightRef} color="#ff4422" intensity={5} distance={20} decay={2} />
    </group>
  );
}

useGLTF.preload('/models/macminiclaws_walk.glb');
