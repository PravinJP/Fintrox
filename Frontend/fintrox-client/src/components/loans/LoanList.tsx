import React from 'react';
import type { Loan } from '../../api/loanApi';

interface LoanListProps {
  loans: Loan[];
  loading: boolean;
  onView: (loan: Loan) => void;
  onEdit: (loan: Loan) => void;
  onDelete: (id: number) => void;
  onClose: (loan: Loan) => void;
  onStatusChange: (loan: Loan) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const LoanList: React.FC<LoanListProps> = ({
  loans,
  loading,
  onView,
  onEdit,
  onDelete,
  onClose,
  onStatusChange,
  onPageChange,
  currentPage,
  totalPages,
  totalItems,
}) => {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-emerald-100 text-emerald-800',
      CLOSED: 'bg-slate-200 text-slate-700',
      OVERDUE: 'bg-red-100 text-red-800',
      DEFAULTED: 'bg-red-200 text-red-900',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-slate-200 text-slate-700'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading loans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Loan Number</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Principal</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Interest</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Payable</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-200">
            {loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <button
                    onClick={() => onView(loan)}
                    className="text-emerald-700 font-medium hover:underline"
                  >
                    {loan.loanNumber}
                  </button>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-slate-900">{loan.customerName}</p>
                    <p className="text-xs text-slate-500">{loan.customerPhone}</p>
                  </div>
                </td>
                <td className="py-4 px-6 font-semibold text-slate-900">
                  ₹{loan.principalAmount?.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-slate-700">{loan.interestRate}%</td>
                <td className="py-4 px-6 text-slate-700 capitalize">{loan.loanType}</td>
                <td className="py-4 px-6 font-semibold text-slate-900">
                  ₹{loan.totalPayable?.toLocaleString()}
                </td>
                <td className="py-4 px-6 font-semibold">
                  <span className={loan.outstandingBalance > 0 ? 'text-red-600' : 'text-slate-500'}>
                    ₹{loan.outstandingBalance?.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-6">{getStatusBadge(loan.status)}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2 text-slate-500">
                    <button
                      onClick={() => onView(loan)}
                      className="p-1 hover:text-emerald-700 transition-colors"
                      title="View"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button
                      onClick={() => onEdit(loan)}
                      className="p-1 hover:text-emerald-700 transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    {loan.status !== 'CLOSED' && (
                      <button
                        onClick={() => onClose(loan)}
                        className="p-1 hover:text-amber-600 transition-colors"
                        title="Close Loan"
                      >
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                      </button>
                    )}
                    <button
                      onClick={() => onStatusChange(loan)}
                      className="p-1 hover:text-blue-600 transition-colors"
                      title="Change Status"
                    >
                      <span className="material-symbols-outlined text-[20px]">sync</span>
                    </button>
                    <button
                      onClick={() => onDelete(loan.id)}
                      className="p-1 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {loans.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  No loans found. Create your first loan!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Showing 1 to {loans.length} of {totalItems} entries
          </span>
          <div className="flex gap-1">
            <button
              className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanList;