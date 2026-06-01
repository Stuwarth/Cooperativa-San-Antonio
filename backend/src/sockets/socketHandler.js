// ============================================================================
// SOCKET HANDLER: Emisión de datos en tiempo real vía WebSocket
// Envía métricas de señal al frontend cada segundo
// ============================================================================

import { getBranchById } from '../models/branches.js';
import { getSignalMetrics } from '../services/signalService.js';
import { getEmiState } from '../services/emiService.js';
import { getSecurityState } from '../services/securityService.js';
import { getWanLinks } from '../models/wanLinks.js';

export const setupSocketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Cliente conectado: ${socket.id}`);

    let selectedBranchId = 0; // Por defecto: Oficina Central
    let latencyHistory = [];

    // Escuchar cambio de agencia seleccionada
    socket.on('select-branch', (branchId) => {
      selectedBranchId = parseInt(branchId);
      latencyHistory = [];
      console.log(`[Socket.io] Agencia seleccionada: ${selectedBranchId}`);
    });

    // Emitir métricas de señal cada segundo
    const interval = setInterval(() => {
      const branch = getBranchById(selectedBranchId);
      if (!branch) return;

      const emi = getEmiState();
      const sec = getSecurityState();
      const metrics = getSignalMetrics(branch, {
        emiActive: emi.active,
        emiNoiseLevel: emi.noiseLevel,
        emiAttenuation: emi.attenuationIncrease,
        ddosActive: sec.ddosActive
      });

      // Mantener historial de latencia (últimos 30 puntos)
      latencyHistory.push(metrics.latencia);
      if (latencyHistory.length > 30) latencyHistory.shift();

      socket.emit('signal-update', {
        ...metrics,
        latencyHistory: [...latencyHistory],
        wanLinks: getWanLinks(),
        security: sec,
        emi: emi,
        trafficDistribution: {
          vlan10: 35 + Math.random() * 10,
          vlan20: 20 + Math.random() * 5,
          vlan30: 10 + Math.random() * 3,
          vlan40: 15 + Math.random() * 4,
          vlan50: 8 + Math.random() * 2,
          vlan90: 12 + Math.random() * 5
        }
      });
    }, 1000);

    socket.on('disconnect', () => {
      clearInterval(interval);
      console.log(`[Socket.io] Cliente desconectado: ${socket.id}`);
    });
  });
};
