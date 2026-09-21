import React from 'react';
import type { DailyCollectionReport } from '../../api/reportsApi';

interface DailyReportViewProps {
  data: DailyCollectionReport | null;
}

const DailyReportView: React.FC<DailyReportViewProps> = ({ data }) => {
  if (!data) return null;

  const formatCurrency = (val: number) =>
    `₹${(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Collection</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(data.totalCollection)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Transactions</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data.totalTransactions}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average Transaction</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(data.averageTransaction)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Employees Active</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data.totalEmployees}</p>
        </div>
      </div>

      {data.employeeCollections && data.employeeCollections.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">Employee Collections</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Customers</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Transactions</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Target %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {data.employeeCollections.map((emp) => (
                  <tr key={emp.employeeId} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{emp.employeeName}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatCurrency(emp.collectionAmount)}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{emp.customerCount}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{emp.transactionCount}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-emerald-700">
                        {emp.targetAchievement?.toFixed(1) || 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.paymentMethodBreakdown && data.paymentMethodBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">Payment Method Breakdown</h3>
          </div>
          <div className="p-6 space-y-3">
            {data.paymentMethodBreakdown.map((pm) => (
              <div key={pm.paymentMethod} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700 capitalize">{pm.paymentMethod.toLowerCase().replace('_', ' ')}</span>
                  <span className="text-slate-600">
                    {formatCurrency(pm.amount)} ({pm.count} txns)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-700 h-2 rounded-full"
                    style={{ width: `${pm.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyReportView;