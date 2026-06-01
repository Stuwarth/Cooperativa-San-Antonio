import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Activity } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

export default function Header({ connected, signalData }) {
  const [clock, setClock] = useState(formatTime());
  useEffect(() => { 
    const t = setInterval(() => setClock(formatTime()), 1000); 
    return () => clearInterval(t); 
  }, []);

  const emiActive = signalData?.emi?.active;
  const ddosActive = signalData?.security?.ddosActive;
  const isAlert = emiActive || ddosActive;
  
  const asfiLabel = isAlert 
    ? (ddosActive ? 'ATAQUE MITIGADO (VLAN 10)' : 'FALLOVER DE COBRE ACTIVO') 
    : 'NORMATIVA ASFI COMPLIANT';

  return (
    <header className="app-header">
      <div className="brand-lockup">
        <div className="brand-mark"><Activity size={18} color="var(--smat-surface-base)" /></div>
        <div>
          <h1 className="brand-title">CAC SAN ANTONIO</h1>
          <p className="brand-subtitle">
            Sistema SMAT-SR | Monitoreo Físico de Redes de Cobre y Ciberseguridad
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--smat-space-4)' }}>
        <div className={`badge ${connected ? 'badge-normal' : 'badge-danger'}`}>
          <span className={`status-dot ${connected ? 'status-normal' : 'status-danger'}`}></span>
          {connected ? 'SISTEMA ONLINE' : 'DESCONECTADO'}
        </div>
        
        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--smat-border)' }}></div>
        
        <div className="text-mono text-muted" style={{ fontSize: 'var(--smat-text-sm)' }}>
          {clock}
        </div>
        
        <div className={`badge ${isAlert ? 'badge-danger' : 'badge-normal'}`}>
          {isAlert ? <ShieldAlert size={14} /> : <Shield size={14} />}
          <span>{asfiLabel}</span>
        </div>
      </div>
    </header>
  );
}
