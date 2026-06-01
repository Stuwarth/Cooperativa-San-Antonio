import { useCallback } from 'react';
import { simulateWanFailure, simulateEmiNoise, simulateDdosAttack, restoreAll } from '../services/api';

export const useSimulation = (addLog) => {
  const triggerWan = useCallback(async () => {
    addLog?.('danger', '[FALLA WAN] Simulando corte físico del enlace COMTECO...');
    await simulateWanFailure();
  }, [addLog]);

  const triggerEmi = useCallback(async () => {
    addLog?.('warning', '[EMI] Inyectando ruido electromagnético de La Cancha...');
    await simulateEmiNoise();
  }, [addLog]);

  const triggerDdos = useCallback(async () => {
    addLog?.('danger', '[DDoS] Simulando ataque TCP SYN contra VLAN 10 Cajas...');
    await simulateDdosAttack();
  }, [addLog]);

  const restore = useCallback(async () => {
    addLog?.('system', '[SISTEMA] Restaurando todos los servicios...');
    await restoreAll();
  }, [addLog]);

  return { triggerWan, triggerEmi, triggerDdos, restore };
};
