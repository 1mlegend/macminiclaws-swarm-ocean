import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(__dirname, '../../data');
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'macminiclaw.db');
const db: DatabaseType = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    nodeId TEXT UNIQUE,
    walletAddress TEXT,
    hardwareSpec TEXT,
    location TEXT,
    status TEXT DEFAULT 'idle',
    lastHeartbeat INTEGER,
    registeredAt INTEGER,
    cpuUsage REAL DEFAULT 0,
    memoryUsage REAL DEFAULT 0,
    computePower REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS clusters (
    id TEXT PRIMARY KEY,
    name TEXT,
    status TEXT DEFAULT 'active',
    requiredCompute REAL,
    createdAt INTEGER
  );

  CREATE TABLE IF NOT EXISTS cluster_nodes (
    clusterId TEXT,
    nodeId TEXT,
    PRIMARY KEY (clusterId, nodeId),
    FOREIGN KEY (clusterId) REFERENCES clusters(id),
    FOREIGN KEY (nodeId) REFERENCES nodes(id)
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    requiredCompute REAL,
    status TEXT DEFAULT 'pending',
    clusterId TEXT,
    createdAt INTEGER,
    completedAt INTEGER,
    FOREIGN KEY (clusterId) REFERENCES clusters(id)
  );
`);

export default db;
