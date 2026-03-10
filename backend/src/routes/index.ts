import { Router } from 'express';
import nodeRoutes from './nodeRoutes';
import swarmRoutes from './swarmRoutes';
import * as nodeController from '../controllers/nodeController';
import * as swarmController from '../controllers/swarmController';
import * as statusController from '../controllers/statusController';

const router = Router();

router.use('/node', nodeRoutes);
router.use('/swarm', swarmRoutes);

// Spec aliases
router.get('/nodes', nodeController.listNodes);
router.get('/clusters', swarmController.listClusters);

router.get('/status', statusController.getStatus);

export default router;
