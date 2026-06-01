import { Router } from 'express';
import { getSignals } from '../controllers/signalController.js';
const router = Router();
router.get('/:branchId', getSignals);
export default router;
