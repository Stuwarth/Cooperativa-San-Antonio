import React, { useEffect, useState } from 'react';
import styles from './TopologyMap.module.css';
import { Server, Router, Building, Activity } from 'lucide-react';

export default function TopologyMap({ wanLinks, ddosActive, linkCutActive }) {
  const [pulse, setPulse] = useState(false);

  // Animar pulsos
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, ddosActive ? 200 : 1000); // Pulsos rápidos si hay DDoS
    return () => clearInterval(interval);
  }, [ddosActive]);

  const comtecoActive = wanLinks?.find(l => l.id === 'comteco')?.status === 'active' && !linkCutActive;
  const entelActive = wanLinks?.find(l => l.id === 'entel')?.status === 'active' && !linkCutActive;
  const comtecoFailed = (wanLinks?.find(l => l.id === 'comteco')?.status === 'failed') || linkCutActive;

  return (
    <div className="panel" style={{ padding: 'var(--smat-space-4)', position: 'relative', overflow: 'hidden' }}>
      <div className="panel-header" style={{ marginBottom: 'var(--smat-space-4)', backgroundColor: 'transparent', border: 'none', padding: 0 }}>
        <Activity size={16} className={linkCutActive ? "text-danger" : "text-teal"} />
        <h3 className="panel-title">{linkCutActive ? "Topología WAN (OFFLINE)" : "Topología WAN Dinámica (OSPF)"}</h3>
      </div>
      
      <div className={styles.mapContainer}>
        <svg className={styles.svgMap} viewBox="0 0 500 300">
          <defs>
            <linearGradient id="activeLink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--smat-teal)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--smat-teal)" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="failedLink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--smat-danger)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--smat-danger)" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="standbyLink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--smat-border)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--smat-border)" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Rutas WAN (COMTECO y ENTEL) */}
          <path d="M 250 150 Q 150 100 100 50" 
                className={`${styles.link} ${comtecoFailed ? styles.linkFailed : (comtecoActive ? styles.linkActive : styles.linkStandby)} ${pulse && comtecoActive ? styles.linkPulse : ''}`} 
                fill="none" />
          <path d="M 250 150 Q 350 100 400 50" 
                className={`${styles.link} ${entelActive ? styles.linkActive : styles.linkStandby} ${pulse && entelActive ? styles.linkPulse : ''}`} 
                fill="none" />

          {/* Ramificaciones LAN/WAN a Agencias */}
          <path d="M 250 150 L 100 250" className={`${styles.link} ${linkCutActive ? styles.linkStandby : styles.linkActive} ${pulse && !linkCutActive ? styles.linkPulse : ''}`} fill="none" />
          <path d="M 250 150 L 250 260" className={`${styles.link} ${linkCutActive ? styles.linkStandby : styles.linkActive} ${pulse && !linkCutActive ? styles.linkPulse : ''}`} fill="none" />
          <path d="M 250 150 L 400 250" className={`${styles.link} ${linkCutActive ? styles.linkStandby : styles.linkActive} ${pulse && !linkCutActive ? styles.linkPulse : ''}`} fill="none" />

          {/* Nodos */}
          {/* Nodo COMTECO */}
          <g transform="translate(100, 50)">
            <circle cx="0" cy="0" r="24" className={`${styles.node} ${comtecoFailed ? styles.nodeDanger : (comtecoActive ? styles.nodeTeal : styles.nodeNeutral)}`} />
            <foreignObject x="-12" y="-12" width="24" height="24">
              <Router size={24} className={comtecoFailed ? 'text-danger' : (comtecoActive ? 'text-teal' : 'text-muted')} />
            </foreignObject>
            <text x="0" y="40" className={styles.nodeLabel}>COMTECO</text>
          </g>

          {/* Nodo ENTEL */}
          <g transform="translate(400, 50)">
            <circle cx="0" cy="0" r="24" className={`${styles.node} ${entelActive ? styles.nodeTeal : styles.nodeNeutral}`} />
            <foreignObject x="-12" y="-12" width="24" height="24">
              <Router size={24} className={entelActive ? 'text-teal' : 'text-muted'} />
            </foreignObject>
            <text x="0" y="40" className={styles.nodeLabel}>ENTEL</text>
          </g>

          {/* Nodo Central */}
          <g transform="translate(250, 150)">
            <circle cx="0" cy="0" r="32" className={`${styles.node} ${linkCutActive ? styles.nodeNeutral : (ddosActive ? styles.nodeDanger : styles.nodeTeal)}`} filter="url(#glow)" />
            <circle cx="0" cy="0" r="45" className={`${styles.radarRing} ${linkCutActive ? '' : (ddosActive ? styles.radarRingDanger : '')}`} />
            <foreignObject x="-16" y="-16" width="32" height="32">
              <Server size={32} className={linkCutActive ? 'text-muted' : (ddosActive ? 'text-danger' : 'text-teal')} />
            </foreignObject>
            <text x="0" y="55" className={styles.nodeLabel}>{linkCutActive ? 'OFFLINE' : 'CENTRAL TARATA'}</text>
          </g>

          {/* Nodos Agencias */}
          <g transform="translate(100, 250)">
            <circle cx="0" cy="0" r="18" className={`${styles.node} ${styles.nodeNeutral}`} />
            <foreignObject x="-9" y="-9" width="18" height="18"><Building size={18} className="text-muted" /></foreignObject>
            <text x="0" y="30" className={styles.nodeLabel}>VILLA TUNARI</text>
          </g>
          
          <g transform="translate(250, 260)">
            <circle cx="0" cy="0" r="18" className={`${styles.node} ${styles.nodeNeutral}`} />
            <foreignObject x="-9" y="-9" width="18" height="18"><Building size={18} className="text-muted" /></foreignObject>
            <text x="0" y="30" className={styles.nodeLabel}>AYACUCHO</text>
          </g>

          <g transform="translate(400, 250)">
            <circle cx="0" cy="0" r="18" className={`${styles.node} ${styles.nodeNeutral}`} />
            <foreignObject x="-9" y="-9" width="18" height="18"><Building size={18} className="text-muted" /></foreignObject>
            <text x="0" y="30" className={styles.nodeLabel}>SACABA</text>
          </g>

        </svg>
      </div>
    </div>
  );
}
