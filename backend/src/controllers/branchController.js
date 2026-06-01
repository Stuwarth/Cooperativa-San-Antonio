// ============================================================================
// CONTROLADOR: Agencias de la Cooperativa San Antonio
// ============================================================================

import asyncHandler from 'express-async-handler';
import { getAllBranches, getBranchById } from '../models/branches.js';
import { NotFoundError } from '../utils/errors.js';

export const listBranches = asyncHandler(async (req, res) => {
  res.json({ success: true, data: getAllBranches() });
});

export const getBranch = asyncHandler(async (req, res) => {
  const branch = getBranchById(req.params.id);
  if (!branch) {
    throw new NotFoundError("Agencia no encontrada");
  }
  res.json({ success: true, data: branch });
});
