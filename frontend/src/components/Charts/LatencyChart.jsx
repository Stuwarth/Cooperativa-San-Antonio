import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function LatencyChart({ latencyHistory = [] }) {
  const data = {
    labels: latencyHistory.map((_, i) => `${i}s`),
    datasets: [{
      label: 'Latencia (ms)',
      data: latencyHistory,
      borderColor: '#00a8a8', // Teal
      backgroundColor: 'rgba(0, 168, 168, 0.05)',
      fill: true,
      tension: 0.35,
      pointRadius: 0,
      borderWidth: 1.5,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 250 },
    scales: {
      x: { display: false },
      y: { 
        ticks: { 
          color: '#999999', 
          font: { size: 9, family: 'Roboto Mono' } 
        }, 
        grid: { color: 'rgba(255,255,255,0.05)' } 
      }
    },
    plugins: { 
      tooltip: { 
        enabled: true,
        backgroundColor: '#2e2e2e', /* elevated surface */
        titleFont: { family: 'Albert Sans', size: 10 },
        bodyFont: { family: 'Roboto Mono', size: 10 },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 8,
        displayColors: false,
      }, 
      legend: { display: false } 
    }
  };

  return (
    <div className="panel" style={{ padding: 'var(--smat-space-4)', height: '160px', display: 'flex', flexDirection: 'column' }}>
      <span className="text-mono text-muted" style={{ fontSize: 'var(--smat-text-xs)', marginBottom: 'var(--smat-space-3)' }}>LATENCIA WAN EN TIEMPO REAL</span>
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
