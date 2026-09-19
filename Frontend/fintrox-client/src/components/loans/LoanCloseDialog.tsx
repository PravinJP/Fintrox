import React from 'react';

interface LoanCloseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loanNumber: string;
  loading: boolean;
}

const LoanCloseDialog: React.FC<LoanCloseDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loanNumber,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden text-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
          <span className="material-symbols-outlined">lock</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Close Loan</h3>
          <p className="text-xs text-slate-500 mt-1">
            Are you sure you want to close loan <span className="font-semibold">{loanNumber}</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="flex space-x-3 pt-2">
          <button
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Closing...' : 'Close Loan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanCloseDialog;