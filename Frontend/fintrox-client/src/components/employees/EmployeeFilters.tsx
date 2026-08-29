import React from 'react';
import { EmployeeFilters as EmployeeFiltersType } from '../../api/employeeApi';

interface EmployeeFiltersProps {
  filters: EmployeeFiltersType;
  onFilterChange: (key: keyof EmployeeFiltersType, value: string) => void;
  onSearch: () => void;
}

const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-variant p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
          search
        </span>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-on-surface"
          placeholder="Search employees..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        <select
          className="flex-1 md:w-40 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface font-body-md"
          value={filters.role}
          onChange={(e) => onFilterChange('role', e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="COLLECTION_AGENT">Collection Agent</option>
          <option value="FIELD_MANAGER">Field Manager</option>
          <option value="BRANCH_MANAGER">Branch Manager</option>
        </select>

        <select
          className="flex-1 md:w-40 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface font-body-md"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default EmployeeFilters;