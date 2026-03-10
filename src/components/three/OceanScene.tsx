import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { OceanFloor } from './OceanFloor';
import { CrabNodes } from './CrabNodes';
import { CentralHub } from './CentralHub';
import { SwarmConnections } from './SwarmConnections';
import { OceanLighting } from './OceanLighting';
import { SeaPlants } from './SeaPlants';
import { CrabNode } from '@/data/nodes';

interface OceanSceneProps {
  onNodeHover: (node: CrabNode | null, screenPos: { x: number; y: number } | null) => void;
}

export function OceanScene({ onNodeHover }: OceanSceneProps) {
  return (
    <Canvas
      camera={{ position: [15, 12, 15], fov: 55, near: 0.1, far: 200 }}
      style={{ position: 'fixed', inset: 0 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#0a1628']} />
      <fog attach="fog" args={['#0a1628', 30, 80]} />
      <Suspense fallback={null}>
        <OceanLighting />
        <OceanFloor />
        <SeaPlants />
        <CentralHub />
        <CrabNodes onNodeHover={onNodeHover} />
        <SwarmConnections />
      </Suspense>
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={50}
        enableDamping
        dampingFactor={0.05}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
      />
    </Canvas>
  );
}
