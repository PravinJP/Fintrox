import React from 'react';

interface CustomerBlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName: string;
  action: 'block' | 'unblock';
  loading: boolean;
}

const CustomerBlockDialog: React.FC<CustomerBlockDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  action,
  loading,
}) => {
  if (!isOpen) return null;

  const isBlocking = action === 'block';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden text-center p-6 space-y-4">
        <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
          isBlocking ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
        }`}>
          <span className="material-symbols-outlined">
            {isBlocking ? 'block' : 'check_circle'}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">
            {isBlocking ? 'Block Customer' : 'Unblock Customer'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Are you sure you want to {isBlocking ? 'block' : 'unblock'}{' '}
            <span className="font-semibold text-slate-700">{customerName}</span>?
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
            className={`flex-1 px-4 py-2.5 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50 ${
              isBlocking ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : isBlocking ? 'Block' : 'Unblock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerBlockDialog;