import { useEffect, useRef } from 'react';
import { Terminal, AlertTriangle, ShieldAlert, Check } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

export default function AlertsLog({ logs }) {
  const containerRef = useRef(null);
  useEffect(() => { 
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight; 
  }, [logs]);

  return (
    <div className="panel" style={{ height: '300px' }}>
      <div className="panel-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--smat-space-2)' }}>
          <Terminal size={14} className="text-teal" />
          <span className="text-mono text-muted" style={{ fontSize: 'var(--smat-text-xs)', letterSpacing: '0.1em' }}>
            REGISTRO DE AUDITORÍA ASFI
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--smat-space-2)' }}>
          <span className="status-dot status-warning"></span>
          <span className="text-mono text-faint" style={{ fontSize: 'var(--smat-text-xs)' }}>ESCUCHANDO P.3001</span>
        </div>
      </div>
      
      <div ref={containerRef} className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {logs.map((entry, i) => {
          const type = entry.type || 'info';
          let EntryIcon = Check;
          let tagClass = 'tag-info';
          let msgClass = '';
          
          if (type === 'warning') { EntryIcon = AlertTriangle; tagClass = 'tag-warning'; msgClass = 'msg-warning'; }
          if (type === 'danger') { EntryIcon = ShieldAlert; tagClass = 'tag-danger'; msgClass = 'msg-danger'; }
          if (type === 'system') { tagClass = 'tag-system'; }

          return (
            <div key={i} className="log-entry">
              <span className="log-time">[{formatTime(entry.time)}]</span>
              <span className={`log-tag ${tagClass}`}>{type.toUpperCase()}</span>
              <EntryIcon size={14} className={msgClass || 'text-muted'} style={{ marginTop: '1px' }} />
              <span className={`log-msg ${msgClass}`}>{entry.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
