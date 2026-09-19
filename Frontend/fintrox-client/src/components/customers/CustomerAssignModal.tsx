import React, { useState } from 'react';
import type { Customer } from '../../api/customerApi';
import type { Route } from '../../api/routeApi';
import type { Employee } from '../../api/employeeApi';

interface CustomerAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (id: number) => void;
  customer: Customer | null;
  routes: Route[];
  employees: Employee[];
  type: 'route' | 'employee';
  loading: boolean;
}

const CustomerAssignModal: React.FC<CustomerAssignModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  customer,
  routes,
  employees,
  type,
  loading,
}) => {
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

  const handleSubmit = () => {
    if (selectedId) {
      onAssign(selectedId);
    }
  };

  if (!isOpen || !customer) return null;

  const isRoute = type === 'route';
  const items = isRoute ? routes : employees;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">
            {isRoute ? 'Assign Route' : 'Assign Employee'}
          </h3>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Select {isRoute ? 'a route' : 'an employee'} to assign to{' '}
            <span className="font-semibold text-slate-800">{customer.fullName}</span>:
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {items.map((item: any) => (
              <label
                key={item.id}
                className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedId === item.id
                    ? 'border-emerald-700 bg-emerald-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  className="text-emerald-700 focus:ring-emerald-700"
                  type="radio"
                  name="assign"
                  checked={selectedId === item.id}
                  onChange={() => setSelectedId(item.id)}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {isRoute ? item.name : item.fullName}
                  </p>
                  {isRoute && item.area && (
                    <p className="text-xs text-slate-500">{item.area}</p>
                  )}
                  {!isRoute && (
                    <p className="text-xs text-slate-500">
                      {item.role} • {item.isActive ? 'Active' : 'Inactive'}
                    </p>
                  )}
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
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!selectedId || loading}
          >
            {loading ? 'Assigning...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerAssignModal;