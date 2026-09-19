import api from './axiosConfig';

export interface Customer {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  organizationId: number;
  routeId: number;
  routeName: string;
  assignedEmployeeId: number;
  assignedEmployeeName: string;
  totalLoansTaken: number;
  activeLoansCount: number;
  totalLoanAmountGiven: number;
  totalAmountReceived: number;
  outstandingBalance: number;
  isActive: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  routeId?: number;
  assignedEmployeeId?: number;
}

export interface UpdateCustomerRequest {
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  routeId?: number;
  assignedEmployeeId?: number;
}

export interface CustomerStats {
  total: number;
  active: number;
  blocked: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const customerApi = {
  getAll: () => api.get<ApiResponse<Customer[]>>('/customers'),
  getById: (id: number) => api.get<ApiResponse<Customer>>(`/customers/${id}`),
  create: (data: CreateCustomerRequest) => api.post<ApiResponse<Customer>>('/customers', data),
  update: (id: number, data: UpdateCustomerRequest) => api.put<ApiResponse<Customer>>(`/customers/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/customers/${id}`),
  activate: (id: number) => api.patch<ApiResponse<void>>(`/customers/${id}/activate`),
  deactivate: (id: number) => api.patch<ApiResponse<void>>(`/customers/${id}/deactivate`),
  block: (id: number) => api.patch<ApiResponse<void>>(`/customers/${id}/block`),
  unblock: (id: number) => api.patch<ApiResponse<void>>(`/customers/${id}/unblock`),
  assignRoute: (id: number, routeId: number) =>
    api.patch<ApiResponse<Customer>>(`/customers/${id}/route`, null, { params: { routeId } }),
  assignEmployee: (id: number, employeeId: number) =>
    api.patch<ApiResponse<Customer>>(`/customers/${id}/employee`, null, { params: { employeeId } }),
  getDashboard: (id: number) => api.get<ApiResponse<Customer>>(`/customers/${id}/dashboard`),
  search: (query: string) => api.get<ApiResponse<Customer[]>>('/customers/search', { params: { query } }),
};

export default customerApi;
