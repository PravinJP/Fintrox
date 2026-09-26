import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CollectionTrendProps {
  data: { date: string; amount: number }[];
}

const CollectionTrend: React.FC<CollectionTrendProps> = ({ data }) => {
  /*
   * Protect the chart from missing/invalid API values.
   * If amount is undefined/null/NaN, use 0.
   */
  const safeData = Array.isArray(data)
    ? data.map((item) => ({
        date: item?.date || '',
        amount:
          typeof item?.amount === 'number' && Number.isFinite(item.amount)
            ? item.amount
            : 0,
      }))
    : [];

  const chartData = {
    labels: safeData.map((d) => d.date),

    datasets: [
      {
        label: 'Collection Amount',
        data: safeData.map((d) => d.amount),
        borderColor: '#40916C',
        backgroundColor: 'rgba(64, 145, 108, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: function (context: any) {
            const amount = Number(context?.parsed?.y ?? 0);

            return `₹${amount.toLocaleString('en-IN')}`;
          },
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          callback: function (value: any) {
            const amount = Number(value ?? 0);

            return '₹' + amount.toLocaleString('en-IN');
          },
        },
      },
    },
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-[#bfc9c1]/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[20px] leading-[28px] font-semibold text-[#161d1f]">
          Collection Trend
        </h3>

        <button className="text-[#404943] hover:text-[#0f5238] transition-colors">
          <span className="material-symbols-outlined">
            more_horiz
          </span>
        </button>
      </div>

      <div className="w-full h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CollectionTrend;