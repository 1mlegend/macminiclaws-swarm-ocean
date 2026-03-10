import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OceanFloor } from './OceanFloor';
import { CrabNodes } from './CrabNodes';
import { CentralHub } from './CentralHub';
import { SwarmConnections } from './SwarmConnections';
import { OceanLighting } from './OceanLighting';
import { SeaPlants } from './SeaPlants';
import { CameraFollow } from './CameraFollow';
import { SunsetSky } from './SunsetSky';
import { AnimatedWater } from './AnimatedWater';
import { KrustyBuilding } from './KrustyBuilding';
import { ContractText } from './ContractText';
import { MoltLobster } from './MoltLobster';
import { CrabNests } from './CrabNests';
import { EnergySources } from './EnergySources';
import { NetworkBeams } from './NetworkBeams';
import { AntennaTowers } from './AntennaTowers';
import { ZoneLabels } from './ZoneLabels';
import { ComputeVolcano } from './ComputeVolcano';
import { EasterEggs } from './EasterEggs';
import { ConstructionSites } from './ConstructionSites';
import { CrabNode } from '@/data/nodes';

interface OceanSceneProps {
  onNodeHover: (node: CrabNode | null, screenPos: { x: number; y: number } | null) => void;
  onNodeClick: (node: CrabNode) => void;
}

export function OceanScene({ onNodeHover, onNodeClick }: OceanSceneProps) {
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
      {/* Warm fog — matches sunset sky */}
      <fog attach="fog" args={['#2a1008', 30, 120]} />
      <Suspense fallback={null}>
        <SunsetSky />
        <OceanLighting />
        <OceanFloor />
        <AnimatedWater />
        <SeaPlants />
        <KrustyBuilding />
        <ContractText />
        <MoltLobster />
        <CrabNests />
        <EnergySources />
        <NetworkBeams />
        <AntennaTowers />
        <ZoneLabels />
        <ComputeVolcano />
        <ConstructionSites />
        <EasterEggs />
        <CentralHub />
        <CrabNodes onNodeHover={onNodeHover} onNodeClick={onNodeClick} />
        <SwarmConnections />
      </Suspense>
      <CameraFollow />
    </Canvas>
  );
}
