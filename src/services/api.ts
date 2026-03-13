/**
 * API service layer for MACMINICLAWS backend.
 * Falls back to mock data when the backend is unavailable.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiNode {
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

export interface ApiCluster {
  id: string;
  name: string | null;
  status: string;
  requiredCompute: number;
  createdAt: number;
  nodes: ApiNode[];
}

export interface ApiJob {
  id: string;
  requiredCompute: number;
  status: string;
  clusterId: string | null;
  createdAt: number;
  completedAt: number | null;
  cluster: ApiCluster | null;
}

export interface NetworkMetrics {
  totalNodes: number;
  onlineNodes: number;
  totalCompute: number;
  activeClusters: number;
  activeJobs: number;
  avgLatency: number;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }
  return res.json();
}

export async function fetchNodes(): Promise<ApiNode[]> {
  const data = await apiFetch<{ nodes: ApiNode[] }>('/api/nodes');
  return data.nodes;
}

export async function fetchNode(nodeId: string): Promise<ApiNode> {
  const data = await apiFetch<{ node: ApiNode }>(`/api/nodes/${nodeId}`);
  return data.node;
}

export async function fetchClusters(): Promise<ApiCluster[]> {
  const data = await apiFetch<{ clusters: ApiCluster[] }>('/api/swarm/clusters');
  return data.clusters;
}

export async function submitJob(requiredCompute: number, signature?: string): Promise<ApiJob> {
  const headers: Record<string, string> = {};
  if (signature) {
    headers['x-wallet-address'] = '0x0';
    headers['x-signature'] = signature;
    headers['x-message'] = 'submit-job';
  }
  const data = await apiFetch<{ job: ApiJob }>('/api/swarm/job', {
    method: 'POST',
    headers,
    body: JSON.stringify({ requiredCompute }),
  });
  return data.job;
}

export async function fetchStatus(): Promise<{ status: string; uptime: number }> {
  return apiFetch('/api/status');
}

export async function fetchMetrics(): Promise<NetworkMetrics> {
  try {
    const [nodesData, clustersData, statusData] = await Promise.all([
      fetchNodes(),
      fetchClusters(),
      fetchStatus(),
    ]);

    const onlineNodes = nodesData.filter(n => n.status !== 'offline');
    const totalCompute = nodesData.reduce((s, n) => s + n.computePower, 0);
    const activeClusters = clustersData.filter(c => c.status === 'active');

    return {
      totalNodes: nodesData.length,
      onlineNodes: onlineNodes.length,
      totalCompute: Math.round(totalCompute),
      activeClusters: activeClusters.length,
      activeJobs: 0, // TODO: add jobs endpoint
      avgLatency: Math.round(Math.random() * 20 + 10), // placeholder
    };
  } catch {
    throw new Error('Backend unavailable');
  }
}
