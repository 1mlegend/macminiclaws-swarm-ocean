import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OceanFloor } from './OceanFloor';
import { CrabNodes } from './CrabNodes';
import { CentralHub } from './CentralHub';
import { SwarmConnections } from './SwarmConnections';
import { OceanLighting } from './OceanLighting';
import { SeaPlants } from './SeaPlants';
import { CameraFollow } from './CameraFollow';
import { CrabNode } from '@/data/nodes';

interface OceanSceneProps {
  onNodeHover: (node: CrabNode | null, screenPos: { x: number; y: number } | null) => void;
}

export function OceanScene({ onNodeHover }: OceanSceneProps) {
  return (
    <Canvas
      camera={{ position: [15, 12, 15], fov: 55, near: 0.1, far: 200 }}
      style={{ position: 'fixed', inset: 0 }}
      gl={{ antialias: true, alpha: false, toneMapping: 0 }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        gl.outputColorSpace = 'srgb';
        gl.toneMapping = 0;
        gl.toneMappingExposure = 1;
      }}
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
      <CameraFollow />
    </Canvas>
  );
}
