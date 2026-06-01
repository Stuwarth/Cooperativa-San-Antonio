// ============================================================================
// CONTROLADOR: Simulaciones Interactivas (Defensa Oral del Proyecto)
// ============================================================================

import asyncHandler from 'express-async-handler';
import { triggerFailover, restoreRouting, getRoutingTable } from '../services/ospfService.js';
import { injectNoise, removeNoise, getEmiState } from '../services/emiService.js';
import { triggerDdos, resetSecurity, getSecurityState } from '../services/securityService.js';

export const simulateWanFailure = asyncHandler(async (req, res) => {
  const result = triggerFailover();
  req.app.get('io')?.emit('wan-status-changed', result);
  req.app.get('io')?.emit('log-event', {
    type: 'danger',
    message: '[FALLA WAN] Enlace principal COMTECO (HFC) cortado. OSPF reconvergiendo...'
  });
  setTimeout(() => {
    req.app.get('io')?.emit('log-event', {
      type: 'success',
      message: `[OSPF] Conmutación exitosa a ENTEL en ${result.convergenceTime}s. Tráfico transaccional activo.`
    });
  }, 1500);
  res.json({ success: true, data: result });
});

export const simulateEmiNoise = asyncHandler(async (req, res) => {
  const result = injectNoise();
  req.app.get('io')?.emit('emi-status-changed', result);
  req.app.get('io')?.emit('log-event', {
    type: 'warning',
    message: '[EMI] Ruido electromagnético detectado en Calle Tarata. SNR descendiendo...'
  });
  res.json({ success: true, data: result });
});

export const simulateDdosAttack = asyncHandler(async (req, res) => {
  const result = triggerDdos();
  req.app.get('io')?.emit('security-alert', result);
  req.app.get('io')?.emit('log-event', {
    type: 'danger',
    message: '[SEGURIDAD] ¡Ráfagas TCP SYN detectadas contra el Core transaccional VLAN 10!'
  });
  setTimeout(() => {
    req.app.get('io')?.emit('log-event', {
      type: 'success',
      message: '[IPS] IP atacante bloqueada mediante Null Routing. VLAN 10 protegida.'
    });
  }, 1800);
  res.json({ success: true, data: result });
});

export const restoreAll = asyncHandler(async (req, res) => {
  const routing = restoreRouting();
  removeNoise();
  const security = resetSecurity();
  req.app.get('io')?.emit('wan-status-changed', routing);
  req.app.get('io')?.emit('emi-status-changed', { active: false });
  req.app.get('io')?.emit('security-alert', security);
  req.app.get('io')?.emit('log-event', {
    type: 'system',
    message: '[SISTEMA] Restauración global completada. Todos los servicios operativos.'
  });
  res.json({ success: true, message: "Sistema restaurado completamente." });
});

export const getSystemStatus = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      routing: getRoutingTable(),
      emi: getEmiState(),
      security: getSecurityState()
    }
  });
});
