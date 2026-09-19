import React from 'react';
import type { Route } from '../../api/routeApi';

interface CustomerFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRoute: string;
  onRouteChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  routes: Route[];
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterRoute,
  onRouteChange,
  filterStatus,
  onStatusChange,
  routes,
}) => {
  return (
    <div className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-96">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input
          className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-all"
          placeholder="Search customers..."
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-4 w-full md:w-auto">
        <select
          className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none text-slate-800 flex-1 md:flex-none"
          value={filterRoute}
          onChange={(e) => onRouteChange(e.target.value)}
        >
          <option value="">All Routes</option>
          {routes.map((route) => (
            <option key={route.id} value={route.id}>{route.name}</option>
          ))}
        </select>
        <select
          className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none text-slate-800 flex-1 md:flex-none"
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default CustomerFilters;