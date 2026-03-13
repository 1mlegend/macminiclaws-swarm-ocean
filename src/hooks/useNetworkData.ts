import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNodes, fetchClusters, fetchMetrics, submitJob, type ApiNode, type ApiCluster, type NetworkMetrics } from '@/services/api';
import { swarmNodes, getSwarmStats, type CrabNode } from '@/data/nodes';

/**
 * Converts backend API nodes to the CrabNode format used by the 3D scene.
 */
function apiNodeToCrabNode(node: ApiNode, index: number): CrabNode {
  const angle = (index / 32) * Math.PI * 2;
  const radius = 5 + (index % 7) * 3;
  return {
    id: node.nodeId,
    position: [Math.cos(angle) * radius, 0.15, Math.sin(angle) * radius],
    status: node.status === 'offline' ? 'offline' : 'online',
    cores: parseInt(node.hardwareSpec) || 8,
    reputation: Math.min(100, Math.floor(70 + (node.computePower / 100) * 30)),
    clusterId: null,
  };
}

/**
 * Fetches live nodes from backend with 30s polling.
 * Falls back to mock data if backend is unavailable.
 */
export function useNodes() {
  return useQuery<CrabNode[]>({
    queryKey: ['nodes'],
    queryFn: async () => {
      try {
        const apiNodes = await fetchNodes();
        if (apiNodes.length === 0) return swarmNodes;
        return apiNodes.map(apiNodeToCrabNode);
      } catch {
        return swarmNodes;
      }
    },
    refetchInterval: 30_000,
    staleTime: 25_000,
    initialData: swarmNodes,
  });
}

/**
 * Fetches live clusters from backend with 30s polling.
 */
export function useClusters() {
  return useQuery<ApiCluster[]>({
    queryKey: ['clusters'],
    queryFn: async () => {
      try {
        return await fetchClusters();
      } catch {
        return [];
      }
    },
    refetchInterval: 30_000,
    staleTime: 25_000,
    initialData: [],
  });
}

/**
 * Fetches live network metrics with 10s polling.
 * Falls back to mock stats.
 */
export function useNetworkMetrics() {
  const mockStats = getSwarmStats();
  return useQuery<NetworkMetrics>({
    queryKey: ['metrics'],
    queryFn: async () => {
      try {
        return await fetchMetrics();
      } catch {
        return {
          totalNodes: swarmNodes.length,
          onlineNodes: mockStats.online,
          totalCompute: mockStats.totalCores,
          activeClusters: mockStats.clusters,
          activeJobs: Math.floor(Math.random() * 5),
          avgLatency: Math.floor(Math.random() * 20 + 12),
        };
      }
    },
    refetchInterval: 10_000,
    staleTime: 8_000,
  });
}

/**
 * Mutation to submit a compute job.
 */
export function useSubmitJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requiredCompute: number) => submitJob(requiredCompute),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clusters'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
    },
  });
}

/**
 * Whether the backend is reachable.
 */
export function useBackendStatus() {
  return useQuery({
    queryKey: ['backend-status'],
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/status`);
        return res.ok;
      } catch {
        return false;
      }
    },
    refetchInterval: 60_000,
    staleTime: 55_000,
    initialData: false,
  });
}
