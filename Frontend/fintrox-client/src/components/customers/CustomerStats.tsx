import React from 'react';
import type { CustomerStats as CustomerStatsType } from '../../api/customerApi';

interface CustomerStatsProps {
  stats: CustomerStatsType;
  loading?: boolean;
}

const CustomerStats: React.FC<CustomerStatsProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
            <span className="material-symbols-outlined">group</span>
          </div>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Customers</h3>
        </div>
        <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Customers</h3>
        </div>
        <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-50 rounded-lg text-red-700">
            <span className="material-symbols-outlined">block</span>
          </div>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Blocked Customers</h3>
        </div>
        <p className="text-2xl font-bold text-slate-900">{stats.blocked}</p>
      </div>
    </div>
  );
};

export default CustomerStats;