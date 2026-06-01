import { Search, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BranchList({ branches, selectedId, onSelect, filter, onFilterChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--smat-space-4)' }}>
      <div className="panel-header" style={{ padding: '0 0 var(--smat-space-3) 0', backgroundColor: 'transparent', borderBottom: 'none' }}>
        <MapPin size={16} className="text-teal" />
        <h3 className="panel-title">Sucursales ({branches.length})</h3>
      </div>
      
      <div style={{ position: 'relative', marginBottom: 'var(--smat-space-4)' }}>
        <Search size={14} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Buscar agencia..." 
          value={filter} 
          onChange={e => onFilterChange(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '32px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
        {branches.map(b => {
          const isSelected = b.id === selectedId;
          const isWarning = b.status === 'warning';
          
          return (
            <motion.button 
              key={b.id} 
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(b.id)}
              className={`sidebar-item ${isSelected ? 'is-selected' : ''}`}
            >
              <div style={{ textAlign: 'left' }}>
                <span className="sidebar-item-title">{b.nombre}</span>
                <span className="sidebar-item-subtitle">{b.zona}</span>
              </div>
              <div className={`status-dot ${isWarning ? 'status-warning' : 'status-normal'}`}></div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
