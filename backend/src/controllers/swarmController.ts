import { Request, Response } from 'express';
import * as swarmService from '../services/swarmService';

export async function listClusters(_req: Request, res: Response): Promise<void> {
  try {
    const clusters = swarmService.getClusters();
    res.status(200).json({ clusters });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}

export async function submitJob(req: Request, res: Response): Promise<void> {
  try {
    const { requiredCompute } = req.body;

    if (requiredCompute == null || typeof requiredCompute !== 'number') {
      res.status(400).json({ error: 'requiredCompute (number) is required' });
      return;
    }

    const result = swarmService.submitJob(requiredCompute);
    res.status(201).json({ job: result, cluster: result.cluster });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}

export async function dissolveCluster(req: Request, res: Response): Promise<void> {
  try {
    const clusterId = req.params.clusterId as string;
    swarmService.dissolveCluster(clusterId);
    res.status(200).json({ message: `Cluster "${clusterId}" dissolved` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}
