export interface CrabNode {
  id: string;
  position: [number, number, number];
  status: 'online' | 'offline';
  cores: number;
  reputation: number;
  clusterId: number | null;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateNodes(count: number): CrabNode[] {
  const nodes: CrabNode[] = [];
  for (let i = 0; i < count; i++) {
    const angle = seededRandom(i * 13.37) * Math.PI * 2;
    const radius = 3 + seededRandom(i * 7.77) * 25;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    nodes.push({
      id: `CLAW-${String(i + 1).padStart(3, '0')}`,
      position: [x, 0.15, z],
      status: seededRandom(i * 3.14) > 0.15 ? 'online' : 'offline',
      cores: Math.pow(2, Math.floor(seededRandom(i * 2.71) * 4) + 2),
      reputation: Math.floor(70 + seededRandom(i * 1.41) * 30),
      clusterId: seededRandom(i * 5.55) > 0.6 ? Math.floor(seededRandom(i * 9.99) * 4) : null,
    });
  }
  return nodes;
}

export const swarmNodes = generateNodes(32);

export function getSwarmStats() {
  const online = swarmNodes.filter(n => n.status === 'online').length;
  const clusters = new Set(swarmNodes.filter(n => n.clusterId !== null).map(n => n.clusterId)).size;
  const totalCores = swarmNodes.reduce((sum, n) => sum + n.cores, 0);
  return { online, clusters, totalCores };
}
