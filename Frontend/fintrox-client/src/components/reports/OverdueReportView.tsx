import React from 'react';
import type { OverdueLoanReport } from '../../api/reportApi';

interface OverdueReportViewProps {
  data: OverdueLoanReport | null;
}

const OverdueReportView: React.FC<OverdueReportViewProps> = ({ data }) => {
  if (!data) return null;

  const formatCurrency = (val: number) =>
    `₹${(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Overdue Loans</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{data.totalOverdueLoans}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Overdue Amount</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(data.totalOverdueAmount)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Customers</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data.totalCustomers}</p>
        </div>
      </div>

      {data.overdueLoans && data.overdueLoans.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">Overdue Loans</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Loan</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Overdue</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Days</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {data.overdueLoans.map((loan) => (
                  <tr key={loan.loanId} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-emerald-700">{loan.loanNumber}</td>
                    <td className="px-6 py-4 text-slate-900">{loan.customerName}</td>
                    <td className="px-6 py-4 text-slate-600">{loan.customerPhone}</td>
                    <td className="px-6 py-4 text-right font-semibold text-red-600">
                      {formatCurrency(loan.overdueAmount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                        {loan.daysOverdue} days
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{loan.assignedEmployee || '—'}</td>
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

export default OverdueReportView;