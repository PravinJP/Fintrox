import React from 'react';
import type { ReportType } from './ReportTypeSelector';

interface ReportDateRangeProps {
  reportType: ReportType;
  date: string;
  onDateChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  month: number;
  onMonthChange: (value: number) => void;
  year: number;
  onYearChange: (value: number) => void;
}

const ReportDateRange: React.FC<ReportDateRangeProps> = ({
  reportType,
  date,
  onDateChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  month,
  onMonthChange,
  year,
  onYearChange,
}) => {
  const inputClass =
    'h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none';

  if (reportType === 'daily' || reportType === 'weekly') {
    return (
      <div className="flex flex-wrap gap-3 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {reportType === 'daily' ? 'Date' : 'Week Starting'}
          </label>
          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (reportType === 'monthly') {
    return (
      <div className="flex flex-wrap gap-3 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Month
          </label>
          <select
            className={inputClass}
            value={month}
            onChange={(e) => onMonthChange(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Year
          </label>
          <select
            className={inputClass}
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = new Date().getFullYear() - 2 + i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>
      </div>
    );
  }

  if (reportType === 'employee-performance') {
    return (
      <div className="flex flex-wrap gap-3 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Start Date
          </label>
          <input
            type="date"
            className={inputClass}
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            End Date
          </label>
          <input
            type="date"
            className={inputClass}
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default ReportDateRange;