import { Router } from 'express';
import { simulateWanFailure, simulateEmiNoise, simulateDdosAttack, restoreAll, getSystemStatus } from '../controllers/simulationController.js';
import { simulationLimiter } from '../middleware/rate-limit.middleware.js';

const router = Router();
router.post('/wan-failure', simulationLimiter, simulateWanFailure);
router.post('/emi-noise', simulationLimiter, simulateEmiNoise);
router.post('/ddos-attack', simulationLimiter, simulateDdosAttack);
router.post('/restore', simulationLimiter, restoreAll);
router.get('/status', getSystemStatus);
export default router;
