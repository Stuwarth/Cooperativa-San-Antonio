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
      const linkCut = signalData?.linkCutActive;
      const wanFailed = signalData?.wanLinks?.find(l => l.id === 'comteco')?.status === 'failed';
      
      // Amplitud base
      let amplitude = canvas.height * 0.22;
      // Frecuencia base (PAM-5 normal)
      let freq = 0.018;
      let noise = 0;
      
      // Colores semánticos
      let color = '#00a8a8'; // Normal (Teal)

      if (linkCut) {
        amplitude = 0; // Flatline 0V
        freq = 0;
        color = '#cf5c42'; // Rojo muerto
      } else if (ddos) {
        // DDoS: Saturación de canal. Frecuencia altísima, señal super comprimida
        freq = 0.065; 
        amplitude = canvas.height * 0.25;
        color = '#cf5c42'; // Rojo peligro
        noise = 3; // Jitter de saturación de búfer
      } else if (emi) {
        // EMI: Atenuación de amplitud y ruido Gaussiano pesado
        amplitude = canvas.height * 0.14; 
        freq = 0.024;
        color = '#d19a30'; // Ámbar advertencia
        noise = emiNoiseLevel * 1.2; // Mucho ruido analógico
      } else if (wanFailed) {
        // Fallo WAN (Respaldo ADSL ENTEL): Señal más ruidosa y atenuada que la principal
        amplitude = canvas.height * 0.18;
        freq = 0.020;
        color = '#8b5cf6'; // Morado para indicar enlace secundario (ENTEL)
        noise = 4; // Ruido base de ADSL vs HFC
      }

      ctx.beginPath(); 
      ctx.lineWidth = 1.5; 
      ctx.strokeStyle = color; 
      ctx.shadowBlur = linkCut ? 2 : 8; 
      ctx.shadowColor = color;
      
      for (let x = 0; x < canvas.width; x++) {
        // Base sine wave
        const raw = Math.sin(x * freq + phaseRef.current);
        
        // PAM-5 digital signaling levels (-2, -1, 0, 1, 2)
        const pam = Math.round(raw * 2) / 2; 
        
        let n = 0;
        if (noise > 0) {
          // Generador de ruido Gaussiano (Box-Muller) para física realista
          const u1 = Math.max(Number.MIN_VALUE, Math.random());
          const u2 = Math.random();
          const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          n = z0 * (noise * 0.6); 
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
  }, [signalData?.emi?.active, signalData?.emi?.noiseLevel, signalData?.security?.ddosActive, signalData?.linkCutActive]);

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
