import { useCallback, useState } from 'react';
import { simulateWanFailure, simulateEmiNoise, simulateDdosAttack, simulateLinkCut, restoreAll } from '../services/api';

export const useSimulation = (addLog) => {
  const [isRestoring, setIsRestoring] = useState(false);

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

  const triggerLinkCut = useCallback(async () => {
    addLog?.('danger', '[CORTE FÍSICO] Falla catastrófica de fibra en Central Tarata. Enlaces caídos.');
    await simulateLinkCut();
  }, [addLog]);

  const restore = useCallback(async () => {
    addLog?.('system', '[SISTEMA] Iniciando sincronización de hardware y restauración...');
    setIsRestoring(true);
    
    // El tribunal pidió realismo: simular 3 segundos de "arranque" del switch
    setTimeout(async () => {
      await restoreAll();
      setIsRestoring(false);
      addLog?.('success', '[SISTEMA] Enlace físico levantado y hardware sincronizado con éxito.');
    }, 3000);
    
  }, [addLog]);

  return { triggerWan, triggerEmi, triggerDdos, triggerLinkCut, restore, isRestoring };
};
