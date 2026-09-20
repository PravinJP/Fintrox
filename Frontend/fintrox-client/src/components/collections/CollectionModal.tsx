import React, { useState, useEffect } from 'react';
import type { CreateCollectionRequest } from '../../api/collectionApi';
import type { Loan } from '../../api/loanApi';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCollectionRequest) => void;
  loans: Loan[];
  preselectedLoanId?: number;
  loading: boolean;
}

const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loans,
  preselectedLoanId,
  loading,
}) => {
  const [formData, setFormData] = useState<CreateCollectionRequest>({
    loanId: 0,
    customerId: 0,
    amount: 0,
    paymentMethod: 'CASH',
    paymentModeDetails: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (preselectedLoanId) {
      const loan = loans.find((l) => l.id === preselectedLoanId);
      if (loan) {
        setFormData((prev) => ({
          ...prev,
          loanId: loan.id,
          customerId: loan.customerId,
          amount: loan.outstandingBalance || 0,
        }));
      }
    } else {
      setFormData({
        loanId: 0,
        customerId: 0,
        amount: 0,
        paymentMethod: 'CASH',
        paymentModeDetails: '',
        notes: '',
      });
    }
    setErrors({});
  }, [preselectedLoanId, isOpen, loans]);

  const selectedLoan = loans.find((l) => l.id === formData.loanId);

  const handleLoanChange = (loanId: number) => {
    const loan = loans.find((l) => l.id === loanId);
    setFormData((prev) => ({
      ...prev,
      loanId,
      customerId: loan?.customerId || 0,
      amount: loan?.outstandingBalance || 0,
    }));
  };

  const handleChange = (field: keyof CreateCollectionRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.loanId) newErrors.loanId = 'Loan is required';
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (selectedLoan && formData.amount > (selectedLoan.outstandingBalance || 0)) {
      newErrors.amount = `Amount cannot exceed outstanding balance (₹${selectedLoan.outstandingBalance?.toLocaleString()})`;
    }
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">Record Collection</h3>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Loan *
              </label>
              <select
                className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${
                  errors.loanId ? 'border-red-500' : 'border-slate-200'
                }`}
                value={formData.loanId || ''}
                onChange={(e) => handleLoanChange(Number(e.target.value))}
              >
                <option value="">Select loan</option>
                {loans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.loanNumber} - {loan.customerName} (₹{loan.outstandingBalance?.toLocaleString()} due)
                  </option>
                ))}
              </select>
              {errors.loanId && <p className="text-red-500 text-xs mt-1">{errors.loanId}</p>}
            </div>

            {selectedLoan && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-semibold text-slate-800">{selectedLoan.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-medium text-slate-800">{selectedLoan.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Outstanding Balance:</span>
                  <span className="font-semibold text-red-600">
                    ₹{selectedLoan.outstandingBalance?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Next Due:</span>
                  <span className="font-medium text-slate-800">{selectedLoan.nextDueDate || '—'}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Amount *
              </label>
              <input
                className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${
                  errors.amount ? 'border-red-500' : 'border-slate-200'
                }`}
                type="number"
                value={formData.amount || ''}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="1000"
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Payment Method *
              </label>
              <select
                className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${
                  errors.paymentMethod ? 'border-red-500' : 'border-slate-200'
                }`}
                value={formData.paymentMethod}
                onChange={(e) => handleChange('paymentMethod', e.target.value as any)}
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CHEQUE">Cheque</option>
              </select>
              {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Payment Details (Optional)
              </label>
              <input
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                type="text"
                value={formData.paymentModeDetails}
                onChange={(e) => handleChange('paymentModeDetails', e.target.value)}
                placeholder="Transaction ID, Cheque No, etc."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Notes (Optional)
              </label>
              <textarea
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                rows={2}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any additional notes"
              />
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Recording...' : 'Record Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionModal;