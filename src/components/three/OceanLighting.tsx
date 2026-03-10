export function OceanLighting() {
  return (
    <>
      <ambientLight intensity={0.5} color="#ffcc88" />
      <directionalLight position={[-10, 8, -5]} intensity={1.0} color="#ff6633" />
      <directionalLight position={[5, 15, 10]} intensity={0.4} color="#ffffff" />
    </>
  );
}
