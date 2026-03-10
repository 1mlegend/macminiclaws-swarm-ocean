import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function ContractText() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.6 + Math.sin(clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <group ref={ref} position={[0, 0.6, -18]} rotation={[-0.15, 0, 0]}>
      <Text
        fontSize={0.9}
        color="#ff8844"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#1a0800"
      >
        $MMC
      </Text>
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.45}
        color="#cca070"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#1a0800"
        maxWidth={30}
      >
        0x7b86bd98011b9e42708aeca08a433d0003659b07
      </Text>
    </group>
  );
}
