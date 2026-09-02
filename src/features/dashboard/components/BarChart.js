import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart() {
  const labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        stacked: false,
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
        label: '2025',
        data: [920, 410, 780, 1140, 820, 560, 910],
        backgroundColor: '#fb7185',
        borderRadius: 10,
        maxBarThickness: 18,
      },
      {
        label: '2024',
        data: [1080, 620, 540, 820, 760, 480, 760],
        backgroundColor: '#60a5fa',
        borderRadius: 10,
        maxBarThickness: 18,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-base-100 p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-700">Revenue</h3>
          <p className="mt-1 text-sm text-slate-400">Year-over-year comparison for monthly sales</p>
        </div>
      </div>

      <div className="h-80">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

export default BarChart
