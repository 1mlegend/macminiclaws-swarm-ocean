import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function KrustyBuilding() {
  const signRef = useRef<THREE.Group>(null);
  const flagsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Sign sway
    if (signRef.current) {
      signRef.current.rotation.z = Math.sin(t * 0.8) * 0.03;
    }
    // Flags flutter
    if (flagsRef.current) {
      flagsRef.current.children.forEach((flag, i) => {
        flag.rotation.z = Math.sin(t * 2 + i * 1.2) * 0.15;
      });
    }
  });

  return (
    <group position={[-12, 0, -10]}>
      {/* Main barrel body — horizontal cylinder */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh position={[0.8, 0, 0]}>
          <cylinderGeometry args={[2.2, 2.5, 5, 16]} />
          <meshStandardMaterial color="#8B6914" roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Barrel rings */}
        {[-1.5, -0.5, 0.5, 1.5, 2.5].map((y, i) => (
          <mesh key={i} position={[0.8, y, 0]}>
            <torusGeometry args={[2.3 + (y === -1.5 || y === 2.5 ? 0.15 : 0), 0.06, 8, 24]} />
            <meshStandardMaterial color="#5a4510" roughness={0.6} metalness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Front face / entrance wall */}
      <mesh position={[0, 0.8, 2.35]}>
        <planeGeometry args={[3.5, 2.8]} />
        <meshStandardMaterial color="#7a5a12" roughness={0.7} />
      </mesh>

      {/* Window - left */}
      <mesh position={[-0.7, 1.2, 2.4]}>
        <planeGeometry args={[0.6, 0.8]} />
        <meshStandardMaterial color="#88ccee" roughness={0.2} metalness={0.1} emissive="#446688" emissiveIntensity={0.3} />
      </mesh>
      {/* Window frame left */}
      <mesh position={[-0.7, 1.2, 2.42]}>
        <ringGeometry args={[0.3, 0.38, 4]} />
        <meshStandardMaterial color="#5a4510" roughness={0.5} />
      </mesh>

      {/* Window - right */}
      <mesh position={[0.7, 1.2, 2.4]}>
        <planeGeometry args={[0.6, 0.8]} />
        <meshStandardMaterial color="#88ccee" roughness={0.2} metalness={0.1} emissive="#446688" emissiveIntensity={0.3} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.45, 2.45]}>
        <planeGeometry args={[0.7, 1.1]} />
        <meshStandardMaterial color="#5a3a08" roughness={0.6} />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.2, 0.45, 2.5]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ccaa44" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Sign pole */}
      <group ref={signRef}>
        <mesh position={[-2.8, 2, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 4, 6]} />
          <meshStandardMaterial color="#c4a050" roughness={0.6} metalness={0.2} />
        </mesh>
        {/* Sign board */}
        <group position={[-2.8, 4.2, 0]}>
          <mesh>
            <boxGeometry args={[1.6, 1.0, 0.1]} />
            <meshStandardMaterial color="#e8c8e0" roughness={0.5} />
          </mesh>
          {/* Sign text placeholder — small colored rectangles */}
          <mesh position={[0, 0.15, 0.06]}>
            <planeGeometry args={[1.1, 0.25]} />
            <meshStandardMaterial color="#cc2222" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.15, 0.06]}>
            <planeGeometry args={[0.9, 0.25]} />
            <meshStandardMaterial color="#cc2222" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* Flag bunting line */}
      <group ref={flagsRef} position={[0, 2.2, 2.5]}>
        {[
          { x: -1.2, color: '#cc2222' },
          { x: -0.7, color: '#2266cc' },
          { x: -0.2, color: '#eecc44' },
          { x: 0.3, color: '#22aa44' },
          { x: 0.8, color: '#cc2222' },
          { x: 1.3, color: '#2266cc' },
        ].map((f, i) => (
          <mesh key={i} position={[f.x, 0, 0]}>
            <planeGeometry args={[0.25, 0.35]} />
            <meshStandardMaterial color={f.color} side={THREE.DoubleSide} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Bunting string */}
      <mesh position={[0, 2.35, 2.48]}>
        <boxGeometry args={[3.2, 0.02, 0.02]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Ground platform */}
      <mesh position={[0, -0.05, 0.5]}>
        <cylinderGeometry args={[4, 4.2, 0.15, 16]} />
        <meshStandardMaterial color="#889999" roughness={0.9} />
      </mesh>

      {/* Enter sign */}
      <group position={[2.2, 0.3, 2.8]} rotation={[0, -0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.35, 0.05]} />
          <meshStandardMaterial color="#ddcc88" roughness={0.5} />
        </mesh>
      </group>

      {/* Warm light from inside */}
      <pointLight position={[0, 1, 2]} color="#ffaa44" intensity={3} distance={8} decay={2} />
    </group>
  );
}
