import React from 'react';

interface RouteFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: 'all' | 'active' | 'inactive';
  onFilterChange: (value: 'all' | 'active' | 'inactive') => void;
}

const RouteFilters: React.FC<RouteFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}) => {
  return (
    <div className="p-4 border-b border-slate-100 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-base">All Routes</h3>
        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          Routes
        </span>
      </div>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </span>
        <input
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Search routes..."
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${filterStatus === 'all' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${filterStatus === 'active' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          onClick={() => onFilterChange('active')}
        >
          Active
        </button>
        <button
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${filterStatus === 'inactive' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          onClick={() => onFilterChange('inactive')}
        >
          Inactive
        </button>
      </div>
    </div>
  );
};

export default RouteFilters;