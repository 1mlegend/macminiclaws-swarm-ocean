import crypto from 'crypto';
import db from '../db/database';

export interface Node {
  id: string;
  nodeId: string;
  walletAddress: string;
  hardwareSpec: string;
  location: string | null;
  status: string;
  lastHeartbeat: number | null;
  registeredAt: number;
  cpuUsage: number;
  memoryUsage: number;
  computePower: number;
}

export function registerNode(
  walletAddress: string,
  nodeId: string,
  hardwareSpec: string,
  location?: string,
): Node {
  const existing = db
    .prepare('SELECT id FROM nodes WHERE nodeId = ?')
    .get(nodeId);
  if (existing) {
    throw new Error(`Node with nodeId "${nodeId}" already exists`);
  }

  const id = crypto.randomUUID();
  const now = Date.now();

  db.prepare(
    `INSERT INTO nodes (id, nodeId, walletAddress, hardwareSpec, location, status, lastHeartbeat, registeredAt)
     VALUES (?, ?, ?, ?, ?, 'idle', ?, ?)`,
  ).run(id, nodeId, walletAddress, hardwareSpec, location ?? null, now, now);

  return db.prepare('SELECT * FROM nodes WHERE id = ?').get(id) as Node;
}

export function updateHeartbeat(
  nodeId: string,
  cpuUsage: number,
  memoryUsage: number,
  computePower: number,
  status: string,
): Node {
  const now = Date.now();

  const result = db.prepare(
    `UPDATE nodes
     SET lastHeartbeat = ?, cpuUsage = ?, memoryUsage = ?, computePower = ?, status = ?
     WHERE nodeId = ?`,
  ).run(now, cpuUsage, memoryUsage, computePower, status, nodeId);

  if (result.changes === 0) {
    throw new Error(`Node with nodeId "${nodeId}" not found`);
  }

  return db.prepare('SELECT * FROM nodes WHERE nodeId = ?').get(nodeId) as Node;
}

export function getActiveNodes(): Node[] {
  const cutoff = Date.now() - 120_000;
  return db
    .prepare(
      `SELECT * FROM nodes
       WHERE lastHeartbeat > ? OR status != 'offline'`,
    )
    .all(cutoff) as Node[];
}

export function getAllNodes(): Node[] {
  return db.prepare('SELECT * FROM nodes').all() as Node[];
}

export function getNodeById(nodeId: string): Node | null {
  return (
    (db.prepare('SELECT * FROM nodes WHERE nodeId = ?').get(nodeId) as Node | undefined) ?? null
  );
}

export function markStaleNodes(): void {
  const cutoff = Date.now() - 120_000;
  db.prepare(
    `UPDATE nodes SET status = 'offline'
     WHERE lastHeartbeat < ? AND status != 'offline'`,
  ).run(cutoff);
}
