import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function TrafficChart({ trafficData }) {
  const td = trafficData || {};
  const values = [
    td.vlan10 || 35, 
    td.vlan20 || 20, 
    td.vlan30 || 10, 
    td.vlan40 || 15, 
    td.vlan50 || 8, 
    td.vlan90 || 12
  ];
  
  const labels = ['VLAN10', 'VLAN20', 'VLAN30', 'VLAN40', 'VLAN50', 'VLAN90'];

  const data = {
    labels: labels,
    datasets: [{
      label: 'Tráfico (%)',
      data: values,
      backgroundColor: [
        'rgba(0, 168, 168, 0.2)', // Teal
        'rgba(255, 255, 255, 0.1)',
        'rgba(255, 255, 255, 0.1)',
        'rgba(255, 255, 255, 0.1)',
        'rgba(255, 255, 255, 0.1)',
        'rgba(255, 255, 255, 0.05)',
      ],
      borderColor: [
        '#00a8a8',
        '#8c8c8c',
        '#8c8c8c',
        '#8c8c8c',
        '#8c8c8c',
        '#5c5c5c',
      ],
      borderWidth: 1,
      borderRadius: 2,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 250 },
    scales: {
      x: { 
        ticks: { 
          color: '#999999', 
          font: { size: 8, family: 'Roboto Mono' } 
        }, 
        grid: { display: false } 
      },
      y: { 
        ticks: { 
          color: '#999999', 
          font: { size: 9, family: 'Roboto Mono' } 
        }, 
        grid: { color: 'rgba(255,255,255,0.05)' }, 
        max: 60 
      }
    },
    plugins: { 
      tooltip: { 
        enabled: true,
        backgroundColor: '#2e2e2e',
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
    <div className="panel" style={{ padding: 'var(--smat-space-4)', height: '180px', display: 'flex', flexDirection: 'column' }}>
      <span className="text-mono text-muted" style={{ fontSize: 'var(--smat-text-xs)', marginBottom: 'var(--smat-space-3)' }}>DISTRIBUCIÓN POR VLAN (%)</span>
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
