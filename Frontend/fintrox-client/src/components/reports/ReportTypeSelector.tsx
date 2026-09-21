import React from 'react';

export type ReportType = 'daily' | 'weekly' | 'monthly' | 'employee-performance' | 'overdue' | 'customer-loans';

interface ReportTypeSelectorProps {
  selectedType: ReportType;
  onTypeChange: (type: ReportType) => void;
}

const reportTypes: { value: ReportType; label: string; icon: string }[] = [
  { value: 'daily', label: 'Daily', icon: 'today' },
  { value: 'weekly', label: 'Weekly', icon: 'date_range' },
  { value: 'monthly', label: 'Monthly', icon: 'calendar_month' },
  { value: 'employee-performance', label: 'Employee Performance', icon: 'badge' },
  { value: 'overdue', label: 'Overdue Loans', icon: 'warning' },
  { value: 'customer-loans', label: 'Customer Loans', icon: 'groups' },
];

const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {reportTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => onTypeChange(type.value)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            selectedType === type.value
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">{type.icon}</span>
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default ReportTypeSelector;