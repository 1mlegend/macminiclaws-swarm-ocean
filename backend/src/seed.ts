import 'dotenv/config';
import db from './db/database';
import crypto from 'crypto';

const nodes = [
  { nodeId: 'claw-001', hardwareSpec: 'Mac Mini M2 Pro 16GB', location: 'Paris, FR', cpuUsage: 12.3, memoryUsage: 34.5, computePower: 920 },
  { nodeId: 'claw-002', hardwareSpec: 'Mac Mini M2 Pro 16GB', location: 'Lyon, FR', cpuUsage: 8.7, memoryUsage: 28.1, computePower: 940 },
  { nodeId: 'claw-003', hardwareSpec: 'Mac Mini M4 24GB', location: 'Berlin, DE', cpuUsage: 15.1, memoryUsage: 41.2, computePower: 1100 },
  { nodeId: 'claw-004', hardwareSpec: 'Mac Mini M2 8GB', location: 'London, UK', cpuUsage: 22.4, memoryUsage: 55.3, computePower: 680 },
  { nodeId: 'claw-005', hardwareSpec: 'Mac Mini M4 Pro 48GB', location: 'Amsterdam, NL', cpuUsage: 5.2, memoryUsage: 18.7, computePower: 1450 },
  { nodeId: 'claw-006', hardwareSpec: 'Mac Mini M2 Pro 16GB', location: 'Tokyo, JP', cpuUsage: 18.9, memoryUsage: 47.6, computePower: 910 },
  { nodeId: 'claw-007', hardwareSpec: 'Mac Mini M4 24GB', location: 'New York, US', cpuUsage: 9.4, memoryUsage: 31.8, computePower: 1080 },
  { nodeId: 'claw-008', hardwareSpec: 'Mac Mini M2 Pro 32GB', location: 'Singapore, SG', cpuUsage: 14.6, memoryUsage: 39.4, computePower: 980 },
  { nodeId: 'claw-009', hardwareSpec: 'Mac Mini M4 Pro 48GB', location: 'Toronto, CA', cpuUsage: 3.8, memoryUsage: 15.2, computePower: 1420 },
  { nodeId: 'claw-010', hardwareSpec: 'Mac Mini M2 16GB', location: 'Dubai, AE', cpuUsage: 11.1, memoryUsage: 36.9, computePower: 850 },
];

// Generate fake wallet addresses
function fakeWallet(): string {
  return '0x' + crypto.randomBytes(20).toString('hex');
}

const insert = db.prepare(`
  INSERT OR REPLACE INTO nodes (id, nodeId, walletAddress, hardwareSpec, location, status, lastHeartbeat, registeredAt, cpuUsage, memoryUsage, computePower)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const now = Date.now();

const tx = db.transaction(() => {
  for (const node of nodes) {
    const wallet = fakeWallet();
    const registeredAt = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // registered within last 7 days
    insert.run(
      wallet.toLowerCase(),
      node.nodeId,
      wallet,
      node.hardwareSpec,
      node.location,
      'idle',
      now, // heartbeat = now (all online)
      registeredAt,
      node.cpuUsage,
      node.memoryUsage,
      node.computePower
    );
    console.log(`  Registered ${node.nodeId} — ${node.hardwareSpec} — ${node.location} — ${node.computePower} compute`);
  }
});

tx();
console.log(`\n10 CLAW nodes seeded. Total compute: ${nodes.reduce((s, n) => s + n.computePower, 0)}`);
