import { Zap, Radio, Target, RefreshCw, Sliders, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SimulationControls({ onWanFailure, onEmiNoise, onDdosAttack, onLinkCut, onRestore, isRestoring }) {
  return (
    <>
      <div className="panel-header" style={{ padding: '0 0 var(--smat-space-3) 0', backgroundColor: 'transparent', borderBottom: 'none' }}>
        <Sliders size={16} className="text-teal" />
        <h3 className="panel-title">Simulación de Fallos</h3>
      </div>
      <p className="text-muted" style={{ fontSize: 'var(--smat-text-xs)', marginBottom: 'var(--smat-space-4)' }}>
        Valide la redundancia y resiliencia en tiempo real:
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--smat-space-2)' }}>
        <motion.button 
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-danger" 
          onClick={onWanFailure}
          disabled={isRestoring}
        >
          <Zap size={14} />
          <span>Fallo COMTECO</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-warning" 
          onClick={onEmiNoise}
          disabled={isRestoring}
        >
          <Radio size={14} />
          <span>Ruido Feria</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-danger" 
          onClick={onDdosAttack}
          disabled={isRestoring}
        >
          <Target size={14} />
          <span>Ataque DDoS</span>
        </motion.button>

        <motion.button 
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="btn" 
          style={{ backgroundColor: 'var(--smat-bg-lighter)', color: 'var(--smat-danger)', borderColor: 'var(--smat-danger)' }}
          onClick={onLinkCut}
          disabled={isRestoring}
        >
          <Scissors size={14} />
          <span>Corte Físico de Fibra</span>
        </motion.button>
        
        <div style={{ height: '1px', width: '100%', backgroundColor: 'var(--smat-border-subtle)', margin: 'var(--smat-space-2) 0' }}></div>
        
        <motion.button 
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-ghost" 
          style={{ color: 'var(--smat-teal)' }}
          onClick={onRestore}
          disabled={isRestoring}
        >
          <RefreshCw size={14} className={isRestoring ? 'spin' : ''} />
          <span>{isRestoring ? 'Sincronizando...' : 'Restablecer Todo'}</span>
        </motion.button>
      </div>
    </>
  );
}
