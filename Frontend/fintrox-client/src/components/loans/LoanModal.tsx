import React, { useState, useEffect } from 'react';
import type { Loan, CreateLoanRequest } from '../../api/loanApi';
import type { Customer } from '../../api/customerApi';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateLoanRequest) => void;
  loan?: Loan | null;
  customers: Customer[];
  loading: boolean;
}

const LoanModal: React.FC<LoanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loan,
  customers,
  loading,
}) => {
  const [formData, setFormData] = useState<CreateLoanRequest>({
    customerId: 0,
    principalAmount: 0,
    interestRate: 0,
    tenureMonths: 1,
    loanType: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (loan) {
      setFormData({
        customerId: loan.customerId,
        principalAmount: loan.principalAmount,
        interestRate: loan.interestRate,
        tenureMonths: loan.tenureMonths,
        loanType: loan.loanType,
        startDate: loan.startDate,
      });
    } else {
      setFormData({
        customerId: 0,
        principalAmount: 0,
        interestRate: 0,
        tenureMonths: 1,
        loanType: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
  }, [loan, isOpen]);

  const handleChange = (field: keyof CreateLoanRequest, value: any) => {
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
    if (!formData.customerId) newErrors.customerId = 'Customer is required';
    if (!formData.principalAmount || formData.principalAmount <= 0) {
      newErrors.principalAmount = 'Principal must be greater than 0';
    }
    if (formData.interestRate === undefined || formData.interestRate < 0) {
      newErrors.interestRate = 'Interest rate must be 0 or more';
    }
    if (!formData.tenureMonths || formData.tenureMonths < 1) {
      newErrors.tenureMonths = 'Tenure must be at least 1';
    }
    if (!formData.loanType) newErrors.loanType = 'Loan type is required';
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
          <h3 className="font-bold text-slate-900 text-lg">
            {loan ? 'Edit Loan' : 'Create New Loan'}
          </h3>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Customer *
              </label>
              <select
                className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${
                  errors.customerId ? 'border-red-500' : 'border-slate-200'
                }`}
                value={formData.customerId || ''}
                onChange={(e) => handleChange('customerId', Number(e.target.value))}
                disabled={!!loan}
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.fullName} - {c.phone}</option>
                ))}
              </select>
              {errors.customerId && <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Principal Amount *
                </label>
                <input
                  className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${
                    errors.principalAmount ? 'border-red-500' : 'border-slate-200'
                  }`}
                  type="number"
                  value={formData.principalAmount || ''}
                  onChange={(e) => handleChange('principalAmount', parseFloat(e.target.value) || 0)}
                  placeholder="10000"
                />
                {errors.principalAmount && <p className="text-red-500 text-xs mt-1">{errors.principalAmount}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Interest Rate (% per month) *
                </label>
                <input
                  className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${
                    errors.interestRate ? 'border-red-500' : 'border-slate-200'
                  }`}
                  type="number"
                  step="0.1"
                  value={formData.interestRate || ''}
                  onChange={(e) => handleChange('interestRate', parseFloat(e.target.value) || 0)}
                  placeholder="5"
                />
                {errors.interestRate && <p className="text-red-500 text-xs mt-1">{errors.interestRate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tenure (Months) *
                </label>
                <input
                  className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${
                    errors.tenureMonths ? 'border-red-500' : 'border-slate-200'
                  }`}
                  type="number"
                  value={formData.tenureMonths || ''}
                  onChange={(e) => handleChange('tenureMonths', parseInt(e.target.value) || 0)}
                  placeholder="12"
                />
                {errors.tenureMonths && <p className="text-red-500 text-xs mt-1">{errors.tenureMonths}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Loan Type *
                </label>
                <select
                  className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 ${
                    errors.loanType ? 'border-red-500' : 'border-slate-200'
                  }`}
                  value={formData.loanType}
                  onChange={(e) => handleChange('loanType', e.target.value as any)}
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
                {errors.loanType && <p className="text-red-500 text-xs mt-1">{errors.loanType}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
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
              {loading ? 'Saving...' : loan ? 'Update' : 'Create Loan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanModal;