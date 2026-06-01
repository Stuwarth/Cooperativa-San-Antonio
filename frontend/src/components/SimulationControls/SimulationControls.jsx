import { Zap, Radio, Target, RefreshCw, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SimulationControls({ onWanFailure, onEmiNoise, onDdosAttack, onRestore }) {
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
        >
          <Zap size={14} />
          <span>Fallo COMTECO</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-warning" 
          onClick={onEmiNoise}
        >
          <Radio size={14} />
          <span>Ruido Feria</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-danger" 
          onClick={onDdosAttack}
        >
          <Target size={14} />
          <span>Ataque DDoS</span>
        </motion.button>
        
        <div style={{ height: '1px', width: '100%', backgroundColor: 'var(--smat-border-subtle)', margin: 'var(--smat-space-2) 0' }}></div>
        
        <motion.button 
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-ghost" 
          style={{ color: 'var(--smat-teal)' }}
          onClick={onRestore}
        >
          <RefreshCw size={14} />
          <span>Restablecer Todo</span>
        </motion.button>
      </div>
    </>
  );
}
