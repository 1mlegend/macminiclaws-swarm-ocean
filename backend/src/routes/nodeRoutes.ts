import { Router } from 'express';
import { verifySignature } from '../middleware/auth';
import * as nodeController from '../controllers/nodeController';

const router = Router();

router.post('/register', verifySignature, nodeController.registerNode);
router.post('/heartbeat', nodeController.heartbeat);
router.get('/', nodeController.listNodes);
router.get('/:nodeId', nodeController.getNode);

export default router;
