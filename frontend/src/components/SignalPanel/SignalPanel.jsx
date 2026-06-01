import { formatNumber } from '../../utils/formatters';

export default function SignalPanel({ signalData, branch }) {
  if (!signalData || !branch) return null;
  const emiActive = signalData.emi?.active;
  const ddosActive = signalData.security?.ddosActive;

  const cards = [
    { 
      label: 'Frecuencia Operación', 
      value: signalData.frecuencia || 250, 
      unit: 'MHz', 
      desc: 'Codificación PAM-5', 
      state: 'normal' 
    },
    { 
      label: 'Atenuación', 
      value: formatNumber(signalData.atenuacion), 
      unit: 'dB', 
      desc: emiActive ? 'Pérdida por acoplamiento' : `${branch.cableLongitud}m coaxial`, 
      state: emiActive ? 'warning' : (branch.status === 'warning' ? 'warning' : 'normal') 
    },
    { 
      label: 'Señal/Ruido (SNR)', 
      value: formatNumber(signalData.snr), 
      unit: 'dB', 
      desc: emiActive ? 'Ruido Feria' : (ddosActive ? 'Jitter TCP SYN' : 'Margen seguro'), 
      state: emiActive ? 'danger' : (ddosActive ? 'warning' : 'normal') 
    },
    { 
      label: 'Velocidad', 
      value: signalData.nvp || 0.68, 
      unit: 'c', 
      desc: '68% veloc. luz', 
      state: 'normal' 
    },
    { 
      label: 'Diafonía (NEXT)', 
      value: formatNumber(signalData.next || 45.00), 
      unit: 'dB', 
      desc: emiActive ? 'Acoplamiento Crítico' : 'Aislamiento UTP 6', 
      state: emiActive ? 'danger' : 'normal' 
    },
    { 
      label: 'Tráfico en Vivo', 
      value: formatNumber(signalData.bandwidth || 0), 
      unit: 'Mbps', 
      desc: ddosActive ? 'Saturación Gigabit' : 'Flujo transaccional', 
      state: ddosActive ? 'danger' : 'normal' 
    },
  ];

  return (
    <div style={{ marginBottom: 'var(--smat-space-5)' }}>
      <div style={{ marginBottom: 'var(--smat-space-4)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--smat-text-lg)', color: 'var(--smat-text-primary)' }}>{branch.nombre}</h3>
        <p className="text-muted" style={{ margin: 0, fontSize: 'var(--smat-text-sm)' }}>{branch.direccion} • {branch.zona}</p>
      </div>
      <div className="metric-grid">
        {cards.map((c, i) => (
          <div key={i} className={`metric-card ${c.state !== 'normal' ? 'state-' + c.state : ''}`}>
            <span className="metric-label">{c.label}</span>
            <div className="metric-value-wrap">
              <span className="metric-value">{c.value}</span>
              <span className="metric-unit">{c.unit}</span>
            </div>
            <span className="metric-desc">{c.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
