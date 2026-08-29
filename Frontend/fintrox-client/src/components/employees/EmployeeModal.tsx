import React, { useState, useEffect } from 'react';
import type { Employee, CreateEmployeeRequest } from '../../api/employeeApi';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateEmployeeRequest) => void;
  employee?: Employee | null;
  loading: boolean;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employee,
  loading,
}) => {
  const [formData, setFormData] = useState<CreateEmployeeRequest>({
    fullName: '',
    email: '',
    phone: '',
    role: 'COLLECTION_AGENT',
    loanLimit: 50000,
    monthlyTarget: 500000,
    dailyTarget: 25000,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        routeId: employee.routeId,
        loanLimit: employee.loanLimit,
        monthlyTarget: employee.monthlyTarget,
        dailyTarget: employee.dailyTarget,
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: 'COLLECTION_AGENT',
        loanLimit: 50000,
        monthlyTarget: 500000,
        dailyTarget: 25000,
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  const handleChange = (field: keyof CreateEmployeeRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline-md text-headline-md text-on-background">
            {employee ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-background transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-label-md text-on-surface-variant mb-1">
              Full Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 bg-surface-container-lowest border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-on-surface ${
                errors.fullName ? 'border-error' : 'border-outline-variant'
              }`}
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
            {errors.fullName && <p className="text-error text-label-md mt-1">{errors.fullName}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-label-md text-on-surface-variant mb-1">
              Email <span className="text-error">*</span>
            </label>
            <input
              type="email"
              className={`w-full px-4 py-2 bg-surface-container-lowest border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-on-surface ${
                errors.email ? 'border-error' : 'border-outline-variant'
              }`}
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && <p className="text-error text-label-md mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-label-md text-on-surface-variant mb-1">
              Phone <span className="text-error">*</span>
            </label>
            <input
              type="tel"
              className={`w-full px-4 py-2 bg-surface-container-lowest border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-on-surface ${
                errors.phone ? 'border-error' : 'border-outline-variant'
              }`}
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            {errors.phone && <p className="text-error text-label-md mt-1">{errors.phone}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-label-md text-on-surface-variant mb-1">
              Role <span className="text-error">*</span>
            </label>
            <select
              className={`w-full px-4 py-2 bg-surface-container-lowest border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-on-surface ${
                errors.role ? 'border-error' : 'border-outline-variant'
              }`}
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
            >
              <option value="COLLECTION_AGENT">Collection Agent</option>
              <option value="FIELD_MANAGER">Field Manager</option>
              <option value="BRANCH_MANAGER">Branch Manager</option>
            </select>
            {errors.role && <p className="text-error text-label-md mt-1">{errors.role}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-label-md text-on-surface-variant mb-1">
              Loan Limit
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-on-surface"
              placeholder="Enter loan limit"
              value={formData.loanLimit || ''}
              onChange={(e) => handleChange('loanLimit', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-label-md text-on-surface-variant mb-1">
              Monthly Target
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-on-surface"
              placeholder="Enter monthly target"
              value={formData.monthlyTarget || ''}
              onChange={(e) => handleChange('monthlyTarget', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="mb-6">
            <label className="block font-label-md text-on-surface-variant mb-1">
              Daily Target
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-on-surface"
              placeholder="Enter daily target"
              value={formData.dailyTarget || ''}
              onChange={(e) => handleChange('dailyTarget', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : employee ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-container text-on-surface-variant px-4 py-2 rounded-lg font-label-md hover:bg-surface-container-highest transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;