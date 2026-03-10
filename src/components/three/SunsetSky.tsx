import { useMemo } from 'react';
import * as THREE from 'three';

// Gradient sky dome — warm sunset from deep orange at horizon to dark crimson at top
const vertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vWorldPosition;
  void main() {
    float h = normalize(vWorldPosition).y;
    // horizon (h~0) = warm orange, zenith (h~1) = dark crimson
    vec3 horizon = vec3(0.6, 0.18, 0.05);   // deep orange
    vec3 mid     = vec3(0.35, 0.08, 0.06);   // burnt crimson
    vec3 zenith  = vec3(0.08, 0.02, 0.04);   // near-black red
    vec3 color;
    if (h < 0.0) {
      color = horizon;
    } else if (h < 0.3) {
      color = mix(horizon, mid, h / 0.3);
    } else {
      color = mix(mid, zenith, clamp((h - 0.3) / 0.7, 0.0, 1.0));
    }
    // slight haze near horizon
    float haze = exp(-h * 4.0) * 0.15;
    color += vec3(haze * 0.8, haze * 0.4, haze * 0.1);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function SunsetSky() {
  const material = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader, fragmentShader, side: THREE.BackSide, depthWrite: false }),
    []
  );

  return (
    <mesh material={material}>
      <sphereGeometry args={[150, 32, 16]} />
    </mesh>
  );
}
