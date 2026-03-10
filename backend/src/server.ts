import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';
import { rateLimiter } from './middleware/rateLimiter';
import { markStaleNodes } from './services/nodeService';
import { networkConfig, socialLinks } from './blockchain/config';

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api', routes);

// Root info endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'MACMINICLAWS Backend',
    version: '0.1.0',
    network: networkConfig,
    social: socialLinks,
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start (only when run directly, not when imported)
const port = Number(process.env.PORT) || 3001;

if (require.main === module || process.argv[1]?.includes('server')) {
  app.listen(port, () => {
    console.log(`MACMINICLAWS Backend running on port ${port}`);
    console.log(`Network: Base ${networkConfig.chainId === 8453 ? 'Mainnet' : 'Sepolia'} (Chain ID: ${networkConfig.chainId})`);
    console.log(`RPC: ${networkConfig.rpcUrl}`);
  });

  // Clean up stale nodes every 60 seconds
  setInterval(() => {
    markStaleNodes();
  }, 60_000);
}

export default app;
