import React from 'react';
import type { Loan } from '../../api/loanApi';

interface CollectionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterMethod: string;
  onMethodChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterLoan: string;
  onLoanChange: (value: string) => void;
  filterDate: string;
  onDateChange: (value: string) => void;
  loans: Loan[];
}

const CollectionFilters: React.FC<CollectionFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterMethod,
  onMethodChange,
  filterStatus,
  onStatusChange,
  filterLoan,
  onLoanChange,
  filterDate,
  onDateChange,
  loans,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <div className="relative flex-1 md:w-64">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          search
        </span>
        <input
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-all text-sm"
          placeholder="Search collections..."
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          className="h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-emerald-700 outline-none cursor-pointer"
          type="date"
          value={filterDate}
          onChange={(e) => onDateChange(e.target.value)}
        />

        <select
          className="h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-emerald-700 outline-none cursor-pointer"
          value={filterMethod}
          onChange={(e) => onMethodChange(e.target.value)}
        >
          <option value="">Method: All</option>
          <option value="CASH">Cash</option>
          <option value="UPI">UPI</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="CHEQUE">Cheque</option>
        </select>

        <select
          className="h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-emerald-700 outline-none cursor-pointer"
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">Status: All</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
        </select>

        <select
          className="h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-emerald-700 outline-none cursor-pointer max-w-xs"
          value={filterLoan}
          onChange={(e) => onLoanChange(e.target.value)}
        >
          <option value="">Loan: All</option>
          {loans.map((loan) => (
            <option key={loan.id} value={loan.id}>
              {loan.loanNumber} - {loan.customerName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CollectionFilters;