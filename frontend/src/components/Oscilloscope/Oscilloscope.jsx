import { useRef, useEffect } from 'react';
import { Radio } from 'lucide-react';

export default function Oscilloscope({ signalData }) {
  const canvasRef = useRef(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => { 
      const r = canvas.parentElement.getBoundingClientRect(); 
      canvas.width = r.width; 
      canvas.height = r.height; 
    };
    resize();
    window.addEventListener('resize', resize);

    const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Hardware-like Grid lines (using ks-rule)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; 
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 4]);
      
      for (let x = 0; x < canvas.width; x += 30) { 
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); 
      }
      for (let y = 0; y < canvas.height; y += 30) { 
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); 
      }
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'; 
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath(); 
      ctx.moveTo(0, canvas.height / 2); 
      ctx.lineTo(canvas.width, canvas.height / 2); 
      ctx.stroke();

      const emi = signalData?.emi?.active;
      const emiNoiseLevel = signalData?.emi?.noiseLevel || 0;
      const ddos = signalData?.security?.ddosActive;
      const amplitude = canvas.height * (emi ? 0.16 : 0.22);
      const freq = emi ? 0.024 : 0.018;
      
      const noise = emi ? (emiNoiseLevel * 0.7) : (ddos ? 9 : 0);
      
      // Semantic colors
      // Normal: Teal #00a8a8 approx
      // EMI: Amber #d19a30 approx
      // DDoS: Coral #cf5c42 approx
      let color = '#00a8a8'; 
      if (ddos) color = '#cf5c42';
      if (emi) color = '#d19a30';

      ctx.beginPath(); 
      ctx.lineWidth = 1.5; 
      ctx.strokeStyle = color; 
      ctx.shadowBlur = 8; 
      ctx.shadowColor = color;
      
      for (let x = 0; x < canvas.width; x++) {
        const raw = Math.sin(x * freq + phaseRef.current);
        const pam = Math.round(raw * 2) / 2; // PAM-5 digital signaling levels
        
        let n = 0;
        if (noise > 0) {
          const u1 = Math.random(), u2 = Math.random();
          const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          n = z0 * (noise * 0.45); 
        }

        const y = (canvas.height / 2) + (pam * amplitude) + n;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      
      ctx.stroke(); 
      ctx.shadowBlur = 0;
      phaseRef.current -= 0.06;
      animId = requestAnimationFrame(draw);
    };
    
    draw();
    return () => { 
      cancelAnimationFrame(animId); 
      window.removeEventListener('resize', resize); 
    };
  }, [signalData?.emi?.active, signalData?.emi?.noiseLevel, signalData?.security?.ddosActive]);

  return (
    <div className="panel">
      <div className="panel-header" style={{ justifyContent: 'space-between' }}>
        <div className="text-mono text-muted" style={{ fontSize: 'var(--smat-text-xs)' }}>
          OSCILOSCOPIO VECTORIAL PAM-5
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--smat-teal)', fontSize: 'var(--smat-text-xs)', fontFamily: 'var(--smat-font-mono)' }}>
          <Radio size={12} />
          <span>EN VIVO</span>
        </div>
      </div>
      <div style={{ height: '240px', position: 'relative', backgroundColor: 'var(--smat-surface-base)' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
    </div>
  );
}
