import React from 'react';
import type { Customer } from '../../api/customerApi';

interface CustomerListProps {
  customers: Customer[];
  loading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
  onBlock: (customer: Customer) => void;
  onUnblock: (customer: Customer) => void;
  onAssignRoute: (customer: Customer) => void;
  onAssignEmployee: (customer: Customer) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  loading,
  onEdit,
  onDelete,
  onBlock,
  onUnblock,
  onAssignRoute,
  onAssignEmployee,
  onPageChange,
  currentPage,
  totalPages,
  totalItems,
}) => {
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusBadge = (customer: Customer) => {
    if (customer.isBlocked) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
          Blocked
        </span>
      );
    }
    if (customer.isActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-b-xl overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Route</th>
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned To</th>
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Balance</th>
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-slate-200">
          {customers.map((customer, index) => (
            <tr
              key={customer.id}
              className={`hover:bg-slate-50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/30' : ''}`}
            >
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {getInitials(customer.fullName)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{customer.fullName}</p>
                    <p className="text-xs text-slate-500">ID: CUS-{String(customer.id).padStart(4, '0')}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-slate-600">
                <p>{customer.phone}</p>
                {customer.email && <p className="text-xs">{customer.email}</p>}
              </td>
              <td className="py-4 px-6 text-slate-600">{customer.routeName || '—'}</td>
              <td className="py-4 px-6 text-slate-600">{customer.assignedEmployeeName || '—'}</td>
              <td className="py-4 px-6 text-right">
                <span className={`font-semibold ${customer.outstandingBalance > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  ₹{(customer.outstandingBalance || 0).toLocaleString()}
                </span>
              </td>
              <td className="py-4 px-6 text-center">{getStatusBadge(customer)}</td>
              <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2 text-slate-500">
                  <button
                    onClick={() => onEdit(customer)}
                    className="p-1 hover:text-emerald-700 transition-colors"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button
                    onClick={() => onAssignRoute(customer)}
                    className="p-1 hover:text-emerald-700 transition-colors"
                    title="Assign Route"
                  >
                    <span className="material-symbols-outlined text-[20px]">map</span>
                  </button>
                  <button
                    onClick={() => onAssignEmployee(customer)}
                    className="p-1 hover:text-emerald-700 transition-colors"
                    title="Assign Employee"
                  >
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                  </button>
                  {customer.isBlocked ? (
                    <button
                      onClick={() => onUnblock(customer)}
                      className="p-1 hover:text-emerald-700 transition-colors"
                      title="Unblock"
                    >
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onBlock(customer)}
                      className="p-1 hover:text-red-600 transition-colors"
                      title="Block"
                    >
                      <span className="material-symbols-outlined text-[20px]">block</span>
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(customer.id)}
                    className="p-1 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <td colSpan={7} className="py-8 text-center text-slate-500">
                No customers found. Add your first customer!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 0 && (
        <div className="p-4 border-t border-slate-200 flex justify-between items-center text-slate-500 text-sm">
          <span>Showing 1 to {customers.length} of {totalItems}</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-100 transition-colors disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-100 transition-colors disabled:opacity-50"
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

export default CustomerList;