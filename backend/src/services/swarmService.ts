import crypto from 'crypto';
import db from '../db/database';
import type { Node } from './nodeService';

export interface Cluster {
  id: string;
  name: string | null;
  status: string;
  requiredCompute: number;
  createdAt: number;
}

export interface ClusterWithNodes extends Cluster {
  nodes: Node[];
}

export interface Job {
  id: string;
  requiredCompute: number;
  status: string;
  clusterId: string | null;
  createdAt: number;
  completedAt: number | null;
}

export interface JobWithCluster extends Job {
  cluster: ClusterWithNodes | null;
}

export function getAvailableNodes(): Node[] {
  const cutoff = Date.now() - 120_000;
  return db
    .prepare(
      `SELECT * FROM nodes
       WHERE status = 'idle' AND lastHeartbeat > ?`,
    )
    .all(cutoff) as Node[];
}

export function createCluster(requiredCompute: number): ClusterWithNodes {
  const available = getAvailableNodes();

  // Greedy selection by computePower descending
  available.sort((a, b) => b.computePower - a.computePower);

  const selected: Node[] = [];
  let totalCompute = 0;

  for (const node of available) {
    selected.push(node);
    totalCompute += node.computePower;
    if (totalCompute >= requiredCompute) break;
  }

  if (totalCompute < requiredCompute) {
    throw new Error(
      `Not enough compute available: need ${requiredCompute}, have ${totalCompute}`,
    );
  }

  const clusterId = crypto.randomUUID();
  const now = Date.now();

  const insertCluster = db.prepare(
    `INSERT INTO clusters (id, status, requiredCompute, createdAt)
     VALUES (?, 'active', ?, ?)`,
  );

  const insertClusterNode = db.prepare(
    `INSERT INTO cluster_nodes (clusterId, nodeId) VALUES (?, ?)`,
  );

  const updateNodeStatus = db.prepare(
    `UPDATE nodes SET status = 'assigned' WHERE id = ?`,
  );

  const assign = db.transaction(() => {
    insertCluster.run(clusterId, requiredCompute, now);
    for (const node of selected) {
      insertClusterNode.run(clusterId, node.id);
      updateNodeStatus.run(node.id);
    }
  });

  assign();

  // Return fresh data
  const cluster = db
    .prepare('SELECT * FROM clusters WHERE id = ?')
    .get(clusterId) as Cluster;

  const nodes = db
    .prepare(
      `SELECT n.* FROM nodes n
       JOIN cluster_nodes cn ON cn.nodeId = n.id
       WHERE cn.clusterId = ?`,
    )
    .all(clusterId) as Node[];

  return { ...cluster, nodes };
}

export function getClusters(): ClusterWithNodes[] {
  const clusters = db.prepare('SELECT * FROM clusters').all() as Cluster[];

  const nodesByCluster = db.prepare(
    `SELECT n.*, cn.clusterId FROM nodes n
     JOIN cluster_nodes cn ON cn.nodeId = n.id
     WHERE cn.clusterId = ?`,
  );

  return clusters.map((cluster) => ({
    ...cluster,
    nodes: nodesByCluster.all(cluster.id) as Node[],
  }));
}

export function dissolveCluster(clusterId: string): void {
  const cluster = db
    .prepare('SELECT * FROM clusters WHERE id = ?')
    .get(clusterId) as Cluster | undefined;

  if (!cluster) {
    throw new Error(`Cluster "${clusterId}" not found`);
  }

  const dissolve = db.transaction(() => {
    db.prepare(`UPDATE clusters SET status = 'dissolved' WHERE id = ?`).run(
      clusterId,
    );
    db.prepare(
      `UPDATE nodes SET status = 'idle'
       WHERE id IN (SELECT nodeId FROM cluster_nodes WHERE clusterId = ?)`,
    ).run(clusterId);
  });

  dissolve();
}

export function submitJob(requiredCompute: number): JobWithCluster {
  const jobId = crypto.randomUUID();
  const now = Date.now();

  let cluster: ClusterWithNodes | null = null;
  let jobStatus = 'pending';
  let clusterId: string | null = null;

  try {
    cluster = createCluster(requiredCompute);
    jobStatus = 'assigned';
    clusterId = cluster.id;
  } catch {
    // Not enough compute -- job stays pending
  }

  db.prepare(
    `INSERT INTO jobs (id, requiredCompute, status, clusterId, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(jobId, requiredCompute, jobStatus, clusterId, now);

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId) as Job;

  return { ...job, cluster };
}
