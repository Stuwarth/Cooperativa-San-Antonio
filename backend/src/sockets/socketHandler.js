// ============================================================================
// SOCKET HANDLER: Emisión de datos en tiempo real vía WebSocket
// Envía métricas de señal al frontend cada segundo
// ============================================================================

import { getBranchById } from '../models/branches.js';
import { getSignalMetrics } from '../services/signalService.js';
import { getEmiState } from '../services/emiService.js';
import { getSecurityState } from '../services/securityService.js';
import { getLinkCutState } from '../services/linkCutService.js';
import { getWanLinks } from '../models/wanLinks.js';

export const setupSocketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Cliente conectado: ${socket.id}`);

    let selectedBranchId = 0; // Por defecto: Oficina Central
    let latencyHistory = [];
    let bandwidthHistory = [];

    // Escuchar cambio de agencia seleccionada
    socket.on('select-branch', (branchId) => {
      selectedBranchId = parseInt(branchId);
      latencyHistory = [];
      bandwidthHistory = [];
      console.log(`[Socket.io] Agencia seleccionada: ${selectedBranchId}`);
    });

    // Emitir métricas de señal cada segundo
    const interval = setInterval(() => {
      const branch = getBranchById(selectedBranchId);
      if (!branch) return;

      const emi = getEmiState();
      const sec = getSecurityState();
      const { linkCutActive } = getLinkCutState();

      const metrics = getSignalMetrics(branch, {
        emiActive: emi.active,
        emiNoiseLevel: emi.noiseLevel,
        emiAttenuation: emi.attenuationIncrease,
        ddosActive: sec.ddosActive,
        linkCutActive: linkCutActive
      });

      // Mantener historial de latencia (últimos 30 puntos)
      latencyHistory.push(metrics.latencia);
      if (latencyHistory.length > 30) latencyHistory.shift();

      // Mantener historial de ancho de banda (últimos 30 puntos)
      bandwidthHistory.push(metrics.bandwidth);
      if (bandwidthHistory.length > 30) bandwidthHistory.shift();

      // Distribución dinámica de VLANs
      let vlan10 = sec.ddosActive ? 95 : (linkCutActive ? 0 : 35 + Math.random() * 10);
      let vlan20 = linkCutActive ? 0 : 20 + Math.random() * 5;
      let vlan30 = linkCutActive ? 0 : 10 + Math.random() * 3;
      let vlan40 = linkCutActive ? 0 : 15 + Math.random() * 4;
      let vlan50 = linkCutActive ? 0 : 8 + Math.random() * 2;
      let vlan90 = linkCutActive ? 0 : 12 + Math.random() * 5;

      // Si hay DDoS, el resto de VLANs se ahogan (caen a casi 0)
      if (sec.ddosActive) {
        vlan20 = vlan20 * 0.1;
        vlan30 = vlan30 * 0.1;
        vlan40 = vlan40 * 0.1;
        vlan50 = vlan50 * 0.1;
        vlan90 = vlan90 * 0.1;
      }

      socket.emit('signal-update', {
        ...metrics,
        latencyHistory: [...latencyHistory],
        bandwidthHistory: [...bandwidthHistory],
        wanLinks: getWanLinks(),
        security: sec,
        emi: emi,
        linkCutActive: linkCutActive,
        trafficDistribution: {
          vlan10, vlan20, vlan30, vlan40, vlan50, vlan90
        }
      });
    }, 1000);

    socket.on('disconnect', () => {
      clearInterval(interval);
      console.log(`[Socket.io] Cliente desconectado: ${socket.id}`);
    });
  });
};
