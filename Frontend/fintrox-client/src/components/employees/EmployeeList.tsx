import React from 'react';
import type { Employee } from '../../api/employeeApi';

interface EmployeeListProps {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onAssignRoute: (employee: Employee) => void;
  onSetTarget: (employee: Employee) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  loading,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onAssignRoute,
  onSetTarget,
  onPageChange,
  currentPage,
  totalPages,
  totalItems,
}) => {
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-caps">
        Inactive
      </span>
    );
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      COLLECTION_AGENT: 'Collection Agent',
      FIELD_MANAGER: 'Field Manager',
      BRANCH_MANAGER: 'Branch Manager',
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-surface-variant overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-on-surface-variant">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-surface-variant overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-surface-variant">
              <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-6">Code</th>
              <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-6">Name</th>
              <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-6">Role</th>
              <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-6">Status</th>
              <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-6">Target</th>
              <th className="font-label-caps text-label-caps text-on-surface-variant py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-on-surface">
            {employees.map((employee, index) => (
              <tr
                key={employee.id}
                className={`border-b border-surface-variant hover:bg-surface-container-lowest transition-colors ${
                  index % 2 === 0 ? 'bg-surface-bright/50' : ''
                }`}
              >
                <td className="py-4 px-6 text-on-surface-variant">
                  {employee.employeeCode}
                </td>
                <td className="py-4 px-6 font-medium">{employee.fullName}</td>
                <td className="py-4 px-6 text-on-surface-variant">{getRoleDisplay(employee.role)}</td>
                <td className="py-4 px-6">{getStatusBadge(employee.isActive)}</td>
                <td className="py-4 px-6">
                  <div className="text-sm">
                    <div className="text-on-surface-variant">₹{employee.monthlyTarget?.toLocaleString() || 0}</div>
                    <div className="text-xs text-on-surface-variant/60">
                      {employee.targetAchievementPercentage?.toFixed(1) || 0}% achieved
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(employee)}
                      className="text-outline hover:text-primary transition-colors p-1"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    {employee.isActive ? (
                      <button
                        onClick={() => onDeactivate(employee.id)}
                        className="text-outline hover:text-warning transition-colors p-1"
                        title="Deactivate"
                      >
                        <span className="material-symbols-outlined text-[20px]">pause</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(employee.id)}
                        className="text-outline hover:text-success transition-colors p-1"
                        title="Activate"
                      >
                        <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                      </button>
                    )}
                    <button
                      onClick={() => onAssignRoute(employee)}
                      className="text-outline hover:text-primary transition-colors p-1"
                      title="Assign Route"
                    >
                      <span className="material-symbols-outlined text-[20px]">route</span>
                    </button>
                    <button
                      onClick={() => onSetTarget(employee)}
                      className="text-outline hover:text-primary transition-colors p-1"
                      title="Set Target"
                    >
                      <span className="material-symbols-outlined text-[20px]">payments</span>
                    </button>
                    <button
                      onClick={() => onDelete(employee.id)}
                      className="text-outline hover:text-error transition-colors p-1"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                  No employees found. Add your first employee!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-surface-variant bg-surface-container-lowest">
          <span className="font-body-md text-on-surface-variant">
            Showing 1 to {employees.length} of {totalItems} entries
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container text-on-surface-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + Math.max(1, currentPage - 2))
              .filter((page) => page <= totalPages)
              .map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-white'
                      : 'border border-outline-variant hover:bg-surface-container text-on-surface-variant'
                  }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              ))}
            <button
              className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container text-on-surface-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;