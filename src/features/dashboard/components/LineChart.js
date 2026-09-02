import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function LineChart() {
  const labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        align: 'end',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#64748b',
          font: {
            size: 12,
            weight: 600,
          },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
            weight: 600,
          },
        },
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        grid: {
          color: '#e2e8f0',
          drawTicks: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Activity',
        data: [0, 520, 640, 180, 0, 190, 590],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.22)',
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.28,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-base-100 p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-700">Monthly Active Users (in K)</h3>
          <p className="mt-1 text-sm text-slate-400">User engagement trend across the selected range</p>
        </div>
      </div>

      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default LineChart
