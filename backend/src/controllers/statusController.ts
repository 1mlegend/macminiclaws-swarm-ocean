import { Request, Response } from 'express';
import { networkConfig, socialLinks } from '../blockchain/config';

export async function getStatus(_req: Request, res: Response): Promise<void> {
  res.status(200).json({
    status: 'ok',
    network: networkConfig,
    social: socialLinks,
    timestamp: Date.now(),
  });
}
