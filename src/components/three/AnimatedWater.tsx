import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Shallow tropical water with animated wave displacement
const waterVertex = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;
  void main() {
    vUv = uv;
    vec3 pos = position;
    // Gentle wave displacement
    float wave = sin(pos.x * 0.8 + uTime * 0.6) * 0.12
               + sin(pos.y * 0.5 + uTime * 0.4) * 0.08
               + sin((pos.x + pos.y) * 0.3 + uTime * 0.8) * 0.06;
    pos.z = wave;
    vWave = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const waterFragment = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;
  void main() {
    // Warm teal / shallow tropical water
    vec3 shallowColor = vec3(0.12, 0.45, 0.42);
    vec3 deepColor = vec3(0.06, 0.25, 0.28);
    // Sunset reflection tint
    vec3 sunsetTint = vec3(0.5, 0.15, 0.05);
    
    float depth = smoothstep(0.0, 1.0, vUv.y);
    vec3 waterColor = mix(shallowColor, deepColor, depth);
    
    // Fake sunset reflection near horizon edge
    float reflection = pow(1.0 - vUv.y, 3.0) * 0.4;
    waterColor += sunsetTint * reflection;
    
    // Subtle wave highlight
    float highlight = smoothstep(0.08, 0.15, vWave) * 0.2;
    waterColor += vec3(highlight);
    
    // Shoreline foam at near edge
    float foam = smoothstep(0.05, 0.0, vUv.y) * 0.3;
    waterColor += vec3(foam);
    
    float alpha = mix(0.25, 0.55, depth);
    gl_FragColor = vec4(waterColor, alpha);
  }
`;

export function AnimatedWater() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0.08, 35]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[100, 30, 60, 30]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={waterVertex}
        fragmentShader={waterFragment}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
