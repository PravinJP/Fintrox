import React from 'react';
import type { Collection } from '../../api/collectionApi';

interface CollectionReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  collection: Collection | null;
  loading: boolean;
}

const CollectionReceiptDialog: React.FC<CollectionReceiptDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  collection,
  loading,
}) => {
  if (!isOpen || !collection) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden text-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 mx-auto flex items-center justify-center">
          <span className="material-symbols-outlined">receipt</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Generate Receipt</h3>
          <p className="text-xs text-slate-500 mt-1">
            Generate receipt for collection{' '}
            <span className="font-semibold text-slate-700">{collection.collectionNumber}</span>?
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
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionReceiptDialog;