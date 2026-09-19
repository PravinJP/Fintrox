import api from './axiosConfig';

export interface InstallmentSchedule {
  installmentNumber: number;
  dueDate: string;
  amount: number;
  status: string;
}

export interface Loan {
  id: number;
  loanNumber: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  loanType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  installmentAmount: number;
  totalInterest: number;
  totalPayable: number;
  amountPaid: number;
  outstandingBalance: number;
  installmentsPaid: number;
  totalInstallments: number;
  nextDueDate: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'CLOSED' | 'OVERDUE' | 'DEFAULTED';
  installmentSchedule: InstallmentSchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanRequest {
  customerId: number;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  loanType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  startDate?: string;
}

export interface UpdateLoanRequest {
  principalAmount?: number;
  interestRate?: number;
  tenureMonths?: number;
  loanType?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  startDate?: string;
  notes?: string;
}

export interface CustomerLoanSummary {
  customerId: number;
  customerName: string;
  customerPhone: string;
  totalLoans: number;
  activeLoans: number;
  closedLoans: number;
  overdueLoans: number;
  totalPrincipal: number;
  totalPayable: number;
  totalPaid: number;
  totalOutstanding: number;
}

export interface LoanStats {
  total: number;
  active: number;
  overdue: number;
  closed: number;
  totalOutstanding: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const loanApi = {
  getAll: () => api.get<ApiResponse<Loan[]>>('/loans'),
  getById: (id: number) => api.get<ApiResponse<Loan>>(`/loans/${id}`),
  create: (data: CreateLoanRequest) => api.post<ApiResponse<Loan>>('/loans', data),
  update: (id: number, data: UpdateLoanRequest) => api.put<ApiResponse<Loan>>(`/loans/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/loans/${id}`),
  getByStatus: (status: string) => api.get<ApiResponse<Loan[]>>(`/loans/status/${status}`),
  getOverdue: () => api.get<ApiResponse<Loan[]>>('/loans/overdue'),
  getByCustomer: (customerId: number) => api.get<ApiResponse<Loan[]>>(`/loans/customer/${customerId}`),
  getActiveByCustomer: (customerId: number) => api.get<ApiResponse<Loan[]>>(`/loans/customer/${customerId}/active`),
  updateStatus: (id: number, status: string) =>
    api.patch<ApiResponse<Loan>>(`/loans/${id}/status`, null, { params: { status } }),
  close: (id: number) => api.patch<ApiResponse<Loan>>(`/loans/${id}/close`),
  activate: (id: number) => api.patch<ApiResponse<void>>(`/loans/${id}/activate`),
  deactivate: (id: number) => api.patch<ApiResponse<void>>(`/loans/${id}/deactivate`),
  getDashboard: (id: number) => api.get<ApiResponse<Loan>>(`/loans/${id}/dashboard`),
  getCustomerSummary: (customerId: number) =>
    api.get<ApiResponse<CustomerLoanSummary>>(`/loans/customer/${customerId}/summary`),
};

export default loanApi;