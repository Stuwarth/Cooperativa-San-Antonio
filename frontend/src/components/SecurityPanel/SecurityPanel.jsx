import { Lock, Layers, Shield, ShieldCheck } from 'lucide-react';

export default function SecurityPanel({ security, linkCutActive }) {
  const items = [
    { 
      status: linkCutActive ? 'offline' : (security?.vpn?.status || 'ok'), 
      label: linkCutActive ? 'VPN Detenida - Sin Portadora' : (security?.vpn?.label || 'VPN IPsec Cifrado'), 
      icon: Lock 
    },
    { 
      status: linkCutActive ? 'offline' : (security?.vlan?.status || 'ok'), 
      label: linkCutActive ? 'VLANs Inactivas - Link Down' : (security?.vlan?.label || 'VLAN 10 Aislada'), 
      icon: Layers 
    },
    { 
      status: linkCutActive ? 'offline' : (security?.ids?.status || 'ok'), 
      label: linkCutActive ? 'IDS/IPS Inactivo - Offline' : (security?.ids?.label || 'IDS/IPS Activo'), 
      icon: Shield 
    },
  ];

  return (
    <>
      <div className="panel-header" style={{ padding: '0 0 var(--smat-space-3) 0', backgroundColor: 'transparent', borderBottom: 'none' }}>
        <ShieldCheck size={16} className={linkCutActive ? 'text-muted' : 'text-teal'} />
        <h3 className="panel-title" style={{ color: linkCutActive ? 'var(--smat-text-muted)' : 'var(--smat-text-primary)' }}>Seguridad Perimetral</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => {
          const Icon = item.icon;
          const isWarning = item.status === 'warning';
          const isAlert = item.status === 'danger' || item.status === 'mitigating';
          const isOffline = item.status === 'offline';
          
          let statusClass = 'status-normal';
          if (isWarning) statusClass = 'status-warning';
          if (isAlert) statusClass = 'status-danger';
          if (isOffline) statusClass = 'status-offline';
          
          return (
            <div key={i} className="data-row" style={{ opacity: isOffline ? 0.6 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--smat-space-3)' }}>
                <Icon size={14} className={isOffline ? 'text-muted' : (isAlert ? 'text-coral' : 'text-teal')} />
                <span className={`data-row-title ${isOffline ? 'text-muted' : (isAlert ? 'text-coral' : '')}`} style={{ fontSize: 'var(--smat-text-sm)' }}>
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
