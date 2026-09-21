import React from 'react';
import type { MonthlyCollectionReport } from '../../api/reportApi';

interface MonthlyReportViewProps {
  data: MonthlyCollectionReport | null;
}

const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({ data }) => {
  if (!data) return null;

  const formatCurrency = (val: number) =>
    `₹${(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const isPositive = (data.growthPercentage || 0) >= 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Collection</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(data.totalCollection)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Previous Month</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(data.previousMonthCollection)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Growth</p>
          <p className={`text-2xl font-bold mt-1 ${isPositive ? 'text-emerald-700' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{data.growthPercentage?.toFixed(1) || 0}%
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Target Achievement</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data.targetAchievement?.toFixed(1) || 0}%</p>
        </div>
      </div>

      {data.weeklyBreakdown && data.weeklyBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">Weekly Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Week</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Collection</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Transactions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {data.weeklyBreakdown.map((week) => (
                  <tr key={week.week} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{week.week}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatCurrency(week.collectionAmount)}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{week.transactionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReportView;