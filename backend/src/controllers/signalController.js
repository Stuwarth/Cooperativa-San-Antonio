// ============================================================================
// CONTROLADOR: Métricas de Señal Física por Agencia
// ============================================================================

import { getBranchById } from '../models/branches.js';
import { getSignalMetrics } from '../services/signalService.js';
import { getEmiState } from '../services/emiService.js';
import { getSecurityState } from '../services/securityService.js';
import asyncHandler from 'express-async-handler';
import { NotFoundError } from '../utils/errors.js';

export const getSignals = asyncHandler(async (req, res) => {
  const branch = getBranchById(req.params.branchId);
  if (!branch) {
    throw new NotFoundError("Agencia no encontrada");
  }

  const emi = getEmiState();
  const sec = getSecurityState();
  const metrics = getSignalMetrics(branch, { emiActive: emi.active, ddosActive: sec.ddosActive });

  res.json({ success: true, data: metrics });
});
