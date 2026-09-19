import React from 'react';
import type { Customer } from '../../api/customerApi';

interface LoanFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterType: string;
  onTypeChange: (value: string) => void;
  filterCustomer: string;
  onCustomerChange: (value: string) => void;
  customers: Customer[];
}

const LoanFilters: React.FC<LoanFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterType,
  onTypeChange,
  filterCustomer,
  onCustomerChange,
  customers,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <div className="relative flex-1 md:w-64">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          search
        </span>
        <input
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-all text-sm"
          placeholder="Search loans, customers..."
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          className="h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-emerald-700 outline-none cursor-pointer"
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">Status: All</option>
          <option value="ACTIVE">Active</option>
          <option value="OVERDUE">Overdue</option>
          <option value="CLOSED">Closed</option>
          <option value="DEFAULTED">Defaulted</option>
        </select>

        <select
          className="h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-emerald-700 outline-none cursor-pointer"
          value={filterType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="">Type: All</option>
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
        </select>

        <select
          className="h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-emerald-700 outline-none cursor-pointer"
          value={filterCustomer}
          onChange={(e) => onCustomerChange(e.target.value)}
        >
          <option value="">Customer: All</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.fullName}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LoanFilters;