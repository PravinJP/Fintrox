import React from 'react';
import type { Loan } from '../../api/loanApi';

interface LoanDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
}

const LoanDrawer: React.FC<LoanDrawerProps> = ({ isOpen, onClose, loan }) => {
  if (!isOpen || !loan) return null;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-emerald-100 text-emerald-800',
      CLOSED: 'bg-slate-200 text-slate-700',
      OVERDUE: 'bg-red-100 text-red-800',
      DEFAULTED: 'bg-red-200 text-red-900',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || ''}`}>
        {status}
      </span>
    );
  };

  const getInstallmentBadge = (status: string) => {
    const styles: Record<string, string> = {
      PAID: 'bg-emerald-100 text-emerald-800',
      PENDING: 'bg-slate-100 text-slate-600',
      OVERDUE: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${styles[status] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 flex flex-col">
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">{loan.loanNumber}</h3>
            <p className="text-xs text-slate-500">{loan.customerName}</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Loan Overview</h4>
            <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                {getStatusBadge(loan.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Principal:</span>
                <span className="font-medium text-slate-800">₹{loan.principalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Interest Rate:</span>
                <span className="font-medium text-slate-800">{loan.interestRate}% / month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tenure:</span>
                <span className="font-medium text-slate-800">{loan.tenureMonths} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Loan Type:</span>
                <span className="font-medium text-slate-800 capitalize">{loan.loanType}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Financials</h4>
            <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Interest:</span>
                <span className="font-medium text-slate-800">₹{loan.totalInterest?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Payable:</span>
                <span className="font-medium text-slate-800">₹{loan.totalPayable?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-medium text-emerald-700">₹{loan.amountPaid?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Outstanding:</span>
                <span className="font-semibold text-red-600">₹{loan.outstandingBalance?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Installments Paid:</span>
                <span className="font-medium text-slate-800">{loan.installmentsPaid} / {loan.totalInstallments}</span>
              </div>
            </div>
          </div>

          {loan.installmentSchedule && loan.installmentSchedule.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Installment Schedule ({loan.installmentSchedule.length})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {loan.installmentSchedule.map((inst) => (
                  <div
                    key={inst.installmentNumber}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                        {inst.installmentNumber}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          ₹{inst.amount?.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Due: {inst.dueDate}
                        </p>
                      </div>
                    </div>
                    {getInstallmentBadge(inst.status)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex space-x-3">
          <button
            className="flex-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default LoanDrawer;