import React from 'react';
import type { EmployeePerformanceReport } from '../../api/reportApi';

interface EmployeePerformanceViewProps {
  data: EmployeePerformanceReport | null;
}

const EmployeePerformanceView: React.FC<EmployeePerformanceViewProps> = ({ data }) => {
  if (!data) return null;

  const formatCurrency = (val: number) =>
    `₹${(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const getRatingBadge = (rating: string) => {
    const styles: Record<string, string> = {
      EXCELLENT: 'bg-emerald-100 text-emerald-800',
      GOOD: 'bg-blue-100 text-blue-800',
      AVERAGE: 'bg-amber-100 text-amber-800',
      POOR: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${styles[rating] || 'bg-slate-100 text-slate-700'}`}>
        {rating || 'N/A'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Employees</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data.totalEmployees}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Collection</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(data.totalCollection)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Report Date</p>
          <p className="text-lg font-semibold text-slate-900 mt-1">{data.reportDate}</p>
        </div>
      </div>

      {data.employeePerformances && data.employeePerformances.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">Employee Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Monthly Collection</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Target %</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Visited</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {data.employeePerformances.map((emp) => (
                  <tr key={emp.employeeId} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{emp.employeeName}</td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{emp.role?.toLowerCase().replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {formatCurrency(emp.monthlyCollection)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-emerald-700">
                        {emp.targetAchievement?.toFixed(1) || 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">
                      {emp.customersVisited} / {emp.customersAssigned}
                    </td>
                    <td className="px-6 py-4 text-center">{getRatingBadge(emp.performanceRating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePerformanceView;