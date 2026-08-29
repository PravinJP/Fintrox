import api from './axiosConfig';

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  employeeCode: string;
  role: 'COLLECTION_AGENT' | 'FIELD_MANAGER' | 'BRANCH_MANAGER';
  organizationId: number;
  organizationName: string;
  userId: number;
  routeId: number;
  routeName: string;
  loanLimit: number;
  monthlyTarget: number;
  dailyTarget: number;
  isActive: boolean;
  isOnline: boolean;
  todayCollection: number;
  monthlyCollection: number;
  targetAchievementPercentage: number;
  assignedCustomers: number;
  visitedCustomers: number;
  overdueCustomers: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  fullName: string;
  email: string;
  phone: string;
  role: 'COLLECTION_AGENT' | 'FIELD_MANAGER' | 'BRANCH_MANAGER';
  routeId?: number;
  loanLimit?: number;
  monthlyTarget?: number;
  dailyTarget?: number;
}

export interface UpdateEmployeeRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: 'COLLECTION_AGENT' | 'FIELD_MANAGER' | 'BRANCH_MANAGER';
  routeId?: number;
  loanLimit?: number;
  monthlyTarget?: number;
  dailyTarget?: number;
  isActive?: boolean;
}

export interface EmployeeStats {
  total: number;
  active: number;
  onLeave: number;
}

export interface EmployeeFilters {
  search: string;
  role: string;
  status: string;
}

export interface SetTargetRequest {
  monthlyTarget?: number;
  dailyTarget?: number;
}

export const employeeApi = {
  getAll: (params?: { search?: string; role?: string; status?: string }) =>
    api.get<Employee[]>('/employees', { params }),

  getById: (id: number) =>
    api.get<Employee>(`/employees/${id}`),

  create: (data: CreateEmployeeRequest) =>
    api.post<Employee>('/employees', data),

  update: (id: number, data: UpdateEmployeeRequest) =>
    api.put<Employee>(`/employees/${id}`, data),

  delete: (id: number) =>
    api.delete<void>(`/employees/${id}`),

  activate: (id: number) =>
    api.patch<void>(`/employees/${id}/activate`),

  deactivate: (id: number) =>
    api.patch<void>(`/employees/${id}/deactivate`),

  getStats: () =>
    api.get<EmployeeStats>('/employees/stats'),

  assignRoute: (id: number, routeId: number) =>
    api.patch<Employee>(`/employees/${id}/route`, null, { params: { routeId } }),

  setTargets: (id: number, data: SetTargetRequest) =>
    api.patch<Employee>(`/employees/${id}/target`, null, { params: data }),

  getDashboard: () =>
    api.get<Employee>('/employees/dashboard'),

  search: (query: string, organizationId?: number) =>
    api.get<Employee[]>('/employees/search', { params: { query, organizationId } }),
};

export default employeeApi;