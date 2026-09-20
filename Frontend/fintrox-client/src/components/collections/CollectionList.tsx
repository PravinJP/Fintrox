import React from 'react';
import type { Collection } from '../../api/collectionApi';

interface CollectionListProps {
  collections: Collection[];
  loading: boolean;
  onVerify: (collection: Collection) => void;
  onReceipt: (collection: Collection) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  loading,
  onVerify,
  onReceipt,
  onPageChange,
  currentPage,
  totalPages,
  totalItems,
}) => {
  const getMethodBadge = (method: string) => {
    const styles: Record<string, string> = {
      CASH: 'bg-slate-200 text-slate-700',
      UPI: 'bg-purple-100 text-purple-800',
      BANK_TRANSFER: 'bg-emerald-100 text-emerald-800',
      CHEQUE: 'bg-amber-100 text-amber-800',
    };
    const labels: Record<string, string> = {
      CASH: 'Cash',
      UPI: 'UPI',
      BANK_TRANSFER: 'Bank Transfer',
      CHEQUE: 'Cheque',
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${styles[method] || 'bg-slate-200 text-slate-700'}`}>
        {labels[method] || method}
      </span>
    );
  };

  const getStatusBadge = (isVerified: boolean) => {
    return isVerified ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
        Pending
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading collections...</p>
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
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Collection No.</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer / Loan</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Collected By</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-200">
            {collections.map((col) => (
              <tr key={col.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 text-slate-700 font-medium">{col.collectionNumber}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{col.customerName}</div>
                  <div className="text-xs text-slate-500">{col.loanNumber}</div>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">
                  ₹{col.amount?.toLocaleString()}
                </td>
                <td className="px-6 py-4">{getMethodBadge(col.paymentMethod)}</td>
                <td className="px-6 py-4 text-slate-700">
                  {col.employeeName || 'Owner'}
                </td>
                <td className="px-6 py-4 text-slate-600">{formatDate(col.createdAt)}</td>
                <td className="px-6 py-4">{getStatusBadge(col.isVerified)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!col.isVerified && (
                      <button
                        onClick={() => onVerify(col)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Verify"
                      >
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      </button>
                    )}
                    <button
                      onClick={() => onReceipt(col)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Generate Receipt"
                    >
                      <span className="material-symbols-outlined text-[20px]">receipt</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {collections.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                  No collections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Showing 1 to {collections.length} of {totalItems} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50"
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

export default CollectionList;