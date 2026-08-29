import React from 'react';
import type { EmployeeStats as EmployeeStatsType } from '../../api/employeeApi';

interface EmployeeStatsProps {
  stats: EmployeeStatsType;
  loading?: boolean;
}

const EmployeeStats: React.FC<EmployeeStatsProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-surface-variant animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-surface-variant">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-surface-container rounded-lg text-primary">
            <span className="material-symbols-outlined">groups</span>
          </div>
        </div>
        <div className="font-headline-lg text-headline-lg text-on-background mb-1">
          {stats.total}
        </div>
        <div className="font-body-md text-on-surface-variant">Total Employees</div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-surface-variant">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-secondary-container rounded-lg text-primary-container">
            <span className="material-symbols-outlined">how_to_reg</span>
          </div>
        </div>
        <div className="font-headline-lg text-headline-lg text-on-background mb-1">
          {stats.active}
        </div>
        <div className="font-body-md text-on-surface-variant">Active Employees</div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-surface-variant">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-error-container rounded-lg text-error">
            <span className="material-symbols-outlined">person_off</span>
          </div>
        </div>
        <div className="font-headline-lg text-headline-lg text-on-background mb-1">
          {stats.onLeave}
        </div>
        <div className="font-body-md text-on-surface-variant">Employees on Leave</div>
      </div>
    </div>
  );
};

export default EmployeeStats;