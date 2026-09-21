import React from 'react';
import type { CustomerLoanReport } from '../../api/reportsApi';

interface CustomerLoanReportViewProps {
  data: CustomerLoanReport | null;
}

const CustomerLoanReportView: React.FC<CustomerLoanReportViewProps> = ({ data }) => {
  if (!data) return null;

  const formatCurrency = (val: number) =>
    `₹${(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-emerald-100 text-emerald-800',
      CLOSED: 'bg-slate-200 text-slate-700',
      OVERDUE: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Customers</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data.totalCustomers}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Loan Amount</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(data.totalLoanAmount)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Received</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{formatCurrency(data.totalReceived)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Outstanding</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(data.totalOutstanding)}</p>
        </div>
      </div>

      {data.customerLoans && data.customerLoans.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">Customer Loan Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Loans</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total Amount</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Paid</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Outstanding</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {data.customerLoans.map((c) => (
                  <tr key={c.customerId} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{c.customerName}</td>
                    <td className="px-6 py-4 text-slate-600">{c.phone}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{c.totalLoans}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {formatCurrency(c.totalLoanAmount)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-emerald-700">
                      {formatCurrency(c.totalPaid)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-red-600">
                      {formatCurrency(c.outstandingBalance)}
                    </td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(c.loanStatus)}</td>
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

export default CustomerLoanReportView;