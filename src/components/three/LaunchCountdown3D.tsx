import { useState, useEffect, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const LAUNCH_TIME = new Date("2026-03-18T19:00:00Z").getTime();

export function LaunchCountdown3D() {
  const timeStr = '00 : 00 : 00';
  const isLive = false;

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(clock.elapsedTime * 2) * 0.04;
    }
  });

  return (
    <group position={[0, 3, -12]}>
      {/* Glow backdrop */}
      <mesh ref={glowRef} position={[0, -0.1, -0.1]}>
        <planeGeometry args={[5, 2.2]} />
        <meshBasicMaterial color="#c83c1e" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.35}
        color="#d97706"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
        fontWeight="bold"
      >
        $MMC LAUNCH
      </Text>

      {/* Timer */}
      <Text
        position={[0, -0.3, 0]}
        fontSize={isLive ? 0.5 : 0.6}
        color="#ef4444"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
        fontWeight="bold"
      >
        {timeStr}
      </Text>
    </group>
  );
}
