import React from 'react';
import type { WeeklyCollectionReport } from '../../api/reportApi';

interface WeeklyReportViewProps {
  data: WeeklyCollectionReport | null;
}

const WeeklyReportView: React.FC<WeeklyReportViewProps> = ({ data }) => {
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
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Previous Week</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(data.previousWeekCollection)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Growth</p>
          <p className={`text-2xl font-bold mt-1 ${isPositive ? 'text-emerald-700' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{data.growthPercentage?.toFixed(1) || 0}%
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Transactions</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data.totalTransactions}</p>
        </div>
      </div>

      {data.dailyBreakdown && data.dailyBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">Daily Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Collection</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Transactions</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Customers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {data.dailyBreakdown.map((day) => (
                  <tr key={day.date} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{day.date}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatCurrency(day.collectionAmount)}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{day.transactionCount}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{day.customerCount}</td>
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

export default WeeklyReportView;