import { useState } from 'react';
import { useTranslations } from '@/lib/i18n';
import { partnerSales, formatRupiah } from '@/data/partnerDemo'; // Assuming partnerSales is in partnerDemo.ts

// A simple SVG area chart for sales trend
function SalesAreaChart({ data, width, height, color }: { data: { value: number }[]; width: number; height: number; color: string; }) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (d.value / maxValue) * height;
    return `${x},${y}`;
  }).join(' ');

  // Add points to close the path at the bottom
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
      <path
        d={`M${areaPoints}Z`}
        fill="url(#salesGradient)"
      />
    </svg>
  );
}

export default function PartnerSalesChart() {
  const t = useTranslations();
  const [period, setPeriod] = useState<'7days' | '30days' | '3months' | '1year'>('7days');

  // Dummy data for different periods - in a real app, this would be dynamic from API
  const getSalesData = () => {
    switch (period) {
      case '7days': return partnerSales.slice(-7);
      case '30days': return [...partnerSales, ...partnerSales, ...partnerSales, ...partnerSales.slice(0,9)]; // Dummy 30 days
      case '3months': return [...partnerSales, ...partnerSales, ...partnerSales, ...partnerSales.slice(0,10)]; // Dummy 3 months
      case '1year': return [...partnerSales, ...partnerSales, ...partnerSales, ...partnerSales, ...partnerSales, ...partnerSales, ...partnerSales, ...partnerSales, ...partnerSales, ...partnerSales, ...partnerSales, ...partnerSales.slice(0,11)]; // Dummy 1 year
      default: return partnerSales.slice(-7);
    }
  };

  const currentSalesData = getSalesData();
  const totalPeriodSales = currentSalesData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold">{t.partnerDashboard.salesOverview}</h3>
        <div className="inline-flex rounded-full bg-gray-100 p-1 text-xs dark:bg-gray-800">
          <button
            onClick={() => setPeriod('7days')}
            className={`rounded-full px-3 py-1 font-medium ${period === '7days' ? 'bg-white shadow dark:bg-gray-700' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {t.partnerDashboard.salesChart7Days}
          </button>
          <button
            onClick={() => setPeriod('30days')}
            className={`rounded-full px-3 py-1 font-medium ${period === '30days' ? 'bg-white shadow dark:bg-gray-700' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {t.partnerDashboard.salesChart30Days}
          </button>
          <button
            onClick={() => setPeriod('3months')}
            className={`rounded-full px-3 py-1 font-medium ${period === '3months' ? 'bg-white shadow dark:bg-gray-700' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {t.partnerDashboard.salesChart3Months}
          </button>
          <button
            onClick={() => setPeriod('1year')}
            className={`rounded-full px-3 py-1 font-medium ${period === '1year' ? 'bg-white shadow dark:bg-gray-700' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {t.partnerDashboard.salesChart1Year}
          </button>
        </div>
      </div>
      <div className="mt-4 text-3xl font-bold">{formatRupiah(totalPeriodSales)}</div>
      <div className="h-48 mt-4">
        {currentSalesData.length > 1 ? (
          <SalesAreaChart data={currentSalesData} width={600} height={192} color="var(--color-emerald-500)" />
        ) : (
          <div className="grid h-full place-items-center text-gray-500 dark:text-gray-400">No data available for this period.</div>
        )}
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1 mt-2">
        {currentSalesData.map((d, i) => (
          <span key={i}>{d.day}</span>
        ))}
      </div>
    </div>
  );
}