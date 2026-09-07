import React, { useState } from 'react';
import type { Route } from '../../api/routeApi';
import type { Employee } from '../../api/employeeApi';


interface RouteAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (employeeId: number) => void;
  route: Route | null;
  employees: Employee[];
  loading: boolean;
}

const RouteAssignModal: React.FC<RouteAssignModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  route,
  employees,
  loading,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | undefined>(undefined);

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSubmit = () => {
    if (selectedEmployeeId) {
      onAssign(selectedEmployeeId);
    }
  };

  if (!isOpen || !route) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">Assign Route to Employee</h3>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Select an employee to assign to route{' '}
            <span className="font-semibold text-slate-800">{route.name}</span>:
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {employees.map((emp) => (
              <label
                key={emp.id}
                className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedEmployeeId === emp.id ? 'border-primary bg-primary-surface/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}
              >
                <input
                  className="text-primary focus:ring-primary"
                  type="radio"
                  name="employee"
                  checked={selectedEmployeeId === emp.id}
                  onChange={() => setSelectedEmployeeId(emp.id)}
                />
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-primary font-bold text-xs flex items-center justify-center">
                  {getInitials(emp.fullName)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{emp.fullName}</p>
                  <p className="text-xs text-slate-500">{emp.role} • {emp.active ? 'Active' : 'Inactive'}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-sm shadow-primary/30 transition-colors disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!selectedEmployeeId || loading}
          >
            {loading ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteAssignModal;