import { Router } from 'express';
import { verifySignature } from '../middleware/auth';
import * as swarmController from '../controllers/swarmController';

const router = Router();

router.get('/clusters', swarmController.listClusters);
router.post('/job', verifySignature, swarmController.submitJob);
router.delete('/cluster/:clusterId', verifySignature, swarmController.dissolveCluster);

export default router;
