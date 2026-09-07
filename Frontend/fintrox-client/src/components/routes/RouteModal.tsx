import React, { useState, useEffect } from 'react';
import type { Route, CreateRouteRequest } from '../../api/routeApi';
import type { Employee } from '../../api/employeeApi';


interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateRouteRequest) => void;
  route?: Route | null;
  employees: Employee[];
  loading: boolean;
}

const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  route,
  employees,
  loading,
}) => {
  const [formData, setFormData] = useState<CreateRouteRequest>({
    name: '',
    description: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    assignedEmployeeId: undefined,
  });

  useEffect(() => {
    if (route) {
      setFormData({
        name: route.name,
        description: route.description,
        area: route.area || '',
        city: route.city || '',
        state: route.state || '',
        pincode: route.pincode || '',
        assignedEmployeeId: route.assignedEmployeeId || undefined,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        assignedEmployeeId: undefined,
      });
    }
  }, [route, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">
            {route ? 'Edit Route' : 'Create New Route'}
          </h3>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Route Name *</label>
              <input
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g. Downtown Express"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Description *</label>
              <textarea
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Route description"
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Area</label>
                <input
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. North District"
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">City</label>
                <input
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. Mumbai"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">State</label>
                <input
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. Maharashtra"
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Pincode</label>
                <input
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. 400001"
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Assign Employee (Optional)</label>
              <select
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={formData.assignedEmployeeId || ''}
                onChange={(e) => setFormData({ ...formData, assignedEmployeeId: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-sm shadow-primary/30 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : route ? 'Update Route' : 'Save Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RouteModal;