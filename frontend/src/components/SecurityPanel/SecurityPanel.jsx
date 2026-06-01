import { Lock, Layers, Shield, ShieldCheck } from 'lucide-react';

export default function SecurityPanel({ security }) {
  const items = [
    { 
      status: security?.vpn?.status || 'ok', 
      label: security?.vpn?.label || 'VPN IPsec Cifrado', 
      icon: Lock 
    },
    { 
      status: security?.vlan?.status || 'ok', 
      label: security?.vlan?.label || 'VLAN 10 Aislada', 
      icon: Layers 
    },
    { 
      status: security?.ids?.status || 'ok', 
      label: security?.ids?.label || 'IDS/IPS Activo', 
      icon: Shield 
    },
  ];

  return (
    <>
      <div className="panel-header" style={{ padding: '0 0 var(--smat-space-3) 0', backgroundColor: 'transparent', borderBottom: 'none' }}>
        <ShieldCheck size={16} className="text-teal" />
        <h3 className="panel-title">Seguridad Perimetral</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => {
          const Icon = item.icon;
          const isWarning = item.status === 'warning';
          const isAlert = item.status === 'danger' || item.status === 'mitigating';
          
          let statusClass = 'status-normal';
          if (isWarning) statusClass = 'status-warning';
          if (isAlert) statusClass = 'status-danger';
          
          return (
            <div key={i} className="data-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--smat-space-3)' }}>
                <Icon size={14} className={isAlert ? 'text-coral' : 'text-teal'} />
                <span className={`data-row-title ${isAlert ? 'text-coral' : ''}`} style={{ fontSize: 'var(--smat-text-sm)' }}>
                  {item.label}
                </span>
              </div>
              <span className={`status-dot ${statusClass}`}></span>
            </div>
          );
        })}
      </div>
    </>
  );
}
