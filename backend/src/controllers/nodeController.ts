import { Request, Response } from 'express';
import * as nodeService from '../services/nodeService';
import { registerNodeOnChain } from '../blockchain/nodeRegistry';

export async function registerNode(req: Request, res: Response): Promise<void> {
  try {
    const walletAddress = req.walletAddress!;
    const { nodeId, hardwareSpec, location } = req.body;

    if (!nodeId || !hardwareSpec) {
      res.status(400).json({ error: 'nodeId and hardwareSpec are required' });
      return;
    }

    const node = nodeService.registerNode(walletAddress, nodeId, hardwareSpec, location);

    // Attempt on-chain registration; don't fail if it errors
    try {
      await registerNodeOnChain(nodeId, hardwareSpec);
    } catch (chainErr) {
      console.warn(
        `[nodeController] On-chain registration failed for node "${nodeId}":`,
        chainErr,
      );
    }

    res.status(201).json({ node });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}

export async function heartbeat(req: Request, res: Response): Promise<void> {
  try {
    const { nodeId, cpuUsage, memoryUsage, computePower, status } = req.body;

    if (!nodeId) {
      res.status(400).json({ error: 'nodeId is required' });
      return;
    }

    const node = nodeService.updateHeartbeat(
      nodeId,
      cpuUsage ?? 0,
      memoryUsage ?? 0,
      computePower ?? 0,
      status ?? 'idle',
    );

    res.status(200).json({ node });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}

export async function listNodes(_req: Request, res: Response): Promise<void> {
  try {
    const nodes = nodeService.getActiveNodes();
    res.status(200).json({ nodes });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}

export async function getNode(req: Request, res: Response): Promise<void> {
  try {
    const nodeId = req.params.nodeId as string;
    const node = nodeService.getNodeById(nodeId);

    if (!node) {
      res.status(404).json({ error: `Node "${nodeId}" not found` });
      return;
    }

    res.status(200).json({ node });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}
