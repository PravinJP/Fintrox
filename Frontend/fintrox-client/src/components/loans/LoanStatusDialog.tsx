import React, { useState } from 'react';
import type { Loan } from '../../api/loanApi';

interface LoanStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string) => void;
  loan: Loan | null;
  loading: boolean;
}

const LoanStatusDialog: React.FC<LoanStatusDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loan,
  loading,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('ACTIVE');

  React.useEffect(() => {
    if (loan) setSelectedStatus(loan.status);
  }, [loan]);

  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 space-y-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined">sync</span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg mt-3">Change Loan Status</h3>
          <p className="text-xs text-slate-500 mt-1">
            Update status for <span className="font-semibold">{loan.loanNumber}</span>
          </p>
        </div>

        <div className="space-y-2">
          {['ACTIVE', 'OVERDUE', 'CLOSED', 'DEFAULTED'].map((status) => (
            <label
              key={status}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                selectedStatus === status
                  ? 'border-emerald-700 bg-emerald-50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="status"
                className="text-emerald-700 focus:ring-emerald-700"
                checked={selectedStatus === status}
                onChange={() => setSelectedStatus(status)}
              />
              <span className="text-sm font-medium text-slate-800">{status}</span>
            </label>
          ))}
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            onClick={() => onConfirm(selectedStatus)}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanStatusDialog;