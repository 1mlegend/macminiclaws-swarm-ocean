import { Request, Response, NextFunction } from 'express';
import { verifyMessage } from 'ethers';

declare global {
  namespace Express {
    interface Request {
      walletAddress?: string;
    }
  }
}

const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

export function verifySignature(req: Request, res: Response, next: NextFunction): void {
  const walletAddress = req.headers['x-wallet-address'] as string | undefined;
  const signature = req.headers['x-signature'] as string | undefined;
  const message = req.headers['x-message'] as string | undefined;
  const timestamp = req.headers['x-timestamp'] as string | undefined;

  if (!walletAddress || !signature) {
    res.status(401).json({ error: 'Missing x-wallet-address or x-signature header' });
    return;
  }

  // Build the message to verify
  const msgToVerify = message ?? `macminiclaw-auth:${timestamp}`;

  if (!message && !timestamp) {
    res.status(401).json({ error: 'Missing x-message or x-timestamp header' });
    return;
  }

  // Replay protection: check timestamp freshness
  if (timestamp) {
    const ts = Number(timestamp);
    if (Number.isNaN(ts) || Math.abs(Date.now() - ts) > MAX_AGE_MS) {
      res.status(401).json({ error: 'Timestamp expired or invalid' });
      return;
    }
  }

  try {
    const recovered = verifyMessage(msgToVerify, signature);

    if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
      res.status(401).json({ error: 'Signature does not match wallet address' });
      return;
    }

    req.walletAddress = recovered;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid signature' });
  }
}
