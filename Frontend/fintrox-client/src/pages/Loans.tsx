import React, { useState, useEffect } from 'react';
import loanApi, { Loan, CustomerLoanSummary, CreateLoanRequest } from '../../api/loanApi';
import customerApi, { Customer } from '../../api/customerApi';
import LoanFilters from '../../components/loans/LoanFilters';
import LoanList from '../../components/loans/LoanList';
import LoanModal from '../../components/loans/LoanModal';
import LoanStatusDialog from '../../components/loans/LoanStatusDialog';
import LoanCloseDialog from '../../components/loans/LoanCloseDialog';
import LoanDrawer from '../../components/loans/LoanDrawer';

type LoanStatsType = {
  total: number;
  active: number;
  overdue: number;
  closed: number;
  totalOutstanding: number;
};

const Loans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<LoanStatsType>({
    total: 0,
    active: 0,
    overdue: 0,
    closed: 0,
    totalOutstanding: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [viewingLoan, setViewingLoan] = useState<Loan | null>(null);
  const [statusLoan, setStatusLoan] = useState<Loan | null>(null);
  const [closingLoan, setClosingLoan] = useState<Loan | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
    fetchCustomers();
  }, []);

  const calculateStats = (data: Loan[]): LoanStatsType => {
    const total = data.length;
    const active = data.filter((l) => l.status === 'ACTIVE').length;
    const overdue = data.filter((l) => l.status === 'OVERDUE').length;
    const closed = data.filter((l) => l.status === 'CLOSED').length;
    const totalOutstanding = data.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0);
    return { total, active, overdue, closed, totalOutstanding };
  };

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await loanApi.getAll();
      const data = response.data.data;
      if (Array.isArray(data)) {
        setLoans(data);
        setTotalItems(data.length);
        setTotalPages(Math.ceil(data.length / 10) || 1);
        setStats(calculateStats(data));
      } else {
        setLoans([]);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerApi.getAll();
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleCreate = async (data: CreateLoanRequest) => {
    setModalLoading(true);
    try {
      const response = await loanApi.create(data);
      const updated = [...loans, response.data.data];
      setLoans(updated);
      setStats(calculateStats(updated));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating loan:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (id: number, data: CreateLoanRequest) => {
    setModalLoading(true);
    try {
      const response = await loanApi.update(id, data);
      const updated = loans.map((l) => (l.id === id ? response.data.data : l));
      setLoans(updated);
      setStats(calculateStats(updated));
      setIsModalOpen(false);
      setEditingLoan(null);
    } catch (error) {
      console.error('Error updating loan:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this loan?')) return;
    try {
      await loanApi.delete(id);
      const updated = loans.filter((l) => l.id !== id);
      setLoans(updated);
      setStats(calculateStats(updated));
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  const handleCloseLoan = async () => {
    if (!closingLoan) return;
    setModalLoading(true);
    try {
      const response = await loanApi.close(closingLoan.id);
      const updated = loans.map((l) => (l.id === closingLoan.id ? response.data.data : l));
      setLoans(updated);
      setStats(calculateStats(updated));
      setIsCloseDialogOpen(false);
      setClosingLoan(null);
    } catch (error) {
      console.error('Error closing loan:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!statusLoan) return;
    setModalLoading(true);
    try {
      const response = await loanApi.updateStatus(statusLoan.id, status);
      const updated = loans.map((l) => (l.id === statusLoan.id ? response.data.data : l));
      setLoans(updated);
      setStats(calculateStats(updated));
      setIsStatusDialogOpen(false);
      setStatusLoan(null);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.customerPhone?.includes(searchTerm);
    const matchesStatus = !filterStatus || loan.status === filterStatus;
    const matchesType = !filterType || loan.loanType === filterType;
    const matchesCustomer = !filterCustomer || loan.customerId === Number(filterCustomer);
    return matchesSearch && matchesStatus && matchesType && matchesCustomer;
  });

  const handleModalSave = (data: CreateLoanRequest) => {
    if (editingLoan) {
      handleUpdate(editingLoan.id, data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Loans</h1>
          <p className="text-sm text-slate-500 mt-1">Manage loan accounts and track repayments.</p>
        </div>
        <button
          className="bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-emerald-800 transition-colors shadow-sm text-sm font-semibold"
          onClick={() => {
            setEditingLoan(null);
            setIsModalOpen(true);
          }}
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Loan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Loans</span>
            <span className="material-symbols-outlined text-slate-400">request_quote</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Loans</span>
            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.active}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Overdue Loans</span>
            <span className="material-symbols-outlined text-red-600">warning</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Outstanding</span>
            <span className="material-symbols-outlined text-slate-400">account_balance_wallet</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ₹{stats.totalOutstanding.toLocaleString()}
          </div>
        </div>
      </div>

      <LoanFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterType={filterType}
        onTypeChange={setFilterType}
        filterCustomer={filterCustomer}
        onCustomerChange={setFilterCustomer}
        customers={customers}
      />

      <LoanList
        loans={filteredLoans}
        loading={loading}
        onView={(loan) => {
          setViewingLoan(loan);
          setIsDrawerOpen(true);
        }}
        onEdit={(loan) => {
          setEditingLoan(loan);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
        onClose={(loan) => {
          setClosingLoan(loan);
          setIsCloseDialogOpen(true);
        }}
        onStatusChange={(loan) => {
          setStatusLoan(loan);
          setIsStatusDialogOpen(true);
        }}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
      />

      <LoanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLoan(null);
        }}
        onSave={handleModalSave}
        loan={editingLoan}
        customers={customers}
        loading={modalLoading}
      />

      <LoanStatusDialog
        isOpen={isStatusDialogOpen}
        onClose={() => {
          setIsStatusDialogOpen(false);
          setStatusLoan(null);
        }}
        onConfirm={handleStatusChange}
        loan={statusLoan}
        loading={modalLoading}
      />

      <LoanCloseDialog
        isOpen={isCloseDialogOpen}
        onClose={() => {
          setIsCloseDialogOpen(false);
          setClosingLoan(null);
        }}
        onConfirm={handleCloseLoan}
        loanNumber={closingLoan?.loanNumber || ''}
        loading={modalLoading}
      />

      <LoanDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setViewingLoan(null);
        }}
        loan={viewingLoan}
      />
    </div>
  );
};

export default Loans;