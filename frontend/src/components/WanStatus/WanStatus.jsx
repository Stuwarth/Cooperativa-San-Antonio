import { Network, Server, Cpu } from 'lucide-react';

export default function WanStatus({ wanLinks }) {
  const links = wanLinks || [
    { id: 'comteco', provider: 'COMTECO', type: 'Enlace HFC', role: 'Principal', status: 'active' },
    { id: 'entel', provider: 'ENTEL', type: 'Enlace ADSL', role: 'Respaldo', status: 'standby' }
  ];

  return (
    <>
      <div className="panel-header" style={{ padding: '0 0 var(--smat-space-3) 0', backgroundColor: 'transparent', borderBottom: 'none' }}>
        <Network size={16} className="text-teal" />
        <h3 className="panel-title">Enlaces WAN Cobre</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {links.map(l => {
          const isBackup = l.role === 'Respaldo';
          const isActive = l.status === 'active';
          const isFailed = l.status === 'failed';
          
          let statusDot = 'status-normal';
          let badgeClass = 'badge-normal';
          if (isFailed) { statusDot = 'status-danger'; badgeClass = 'badge-danger'; }
          else if (!isActive) { statusDot = 'status-warning'; badgeClass = 'badge-neutral'; }
          
          const label = isFailed ? 'FALLA FÍSICA' : (isActive ? 'ACTIVO' : 'BACKUP LISTO');

          return (
            <div key={l.id} className="data-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--smat-space-3)' }}>
                <div style={{ color: isActive ? 'var(--smat-teal)' : 'var(--smat-text-muted)' }}>
                  {isBackup ? <Cpu size={16} /> : <Server size={16} />}
                </div>
                <div className="data-row-title">
                  {l.provider}
                  <span className="data-row-subtitle">{l.role} • {l.type}</span>
                </div>
              </div>
              <div className={`badge ${badgeClass}`}>
                <span className={`status-dot ${statusDot}`}></span>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
