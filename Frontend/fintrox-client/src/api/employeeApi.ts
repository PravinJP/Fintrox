import api from "./axiosConfig";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  employeeCode: string;
  role:
    | "COLLECTION_AGENT"
    | "FIELD_MANAGER"
    | "BRANCH_MANAGER";
  organizationId: number;
  organizationName: string | null;
  userId: number;
  routeId: number | null;
  routeName: string | null;
  loanLimit: number;
  monthlyTarget: number;
  dailyTarget: number;
  todayCollection: number | null;
  monthlyCollection: number | null;
  targetAchievementPercentage: number | null;
  assignedCustomers: number | null;
  visitedCustomers: number | null;
  overdueCustomers: number | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  online: boolean;
}

export interface CreateEmployeeRequest {
  fullName: string;
  email: string;
  phone: string;
  role:
    | "COLLECTION_AGENT"
    | "FIELD_MANAGER"
    | "BRANCH_MANAGER";
  routeId?: number;
  loanLimit?: number;
  monthlyTarget?: number;
  dailyTarget?: number;
}

export interface UpdateEmployeeRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  role?:
    | "COLLECTION_AGENT"
    | "FIELD_MANAGER"
    | "BRANCH_MANAGER";
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
  getAll: (
    params?: {
      search?: string;
      role?: string;
      status?: string;
    }
  ) =>
    api.get<ApiResponse<Employee[]>>("/employees", {
      params,
    }),

  getById: (id: number) =>
    api.get<ApiResponse<Employee>>(`/employees/${id}`),

  create: (data: CreateEmployeeRequest) =>
    api.post<ApiResponse<Employee>>("/employees", data),

  update: (
    id: number,
    data: UpdateEmployeeRequest
  ) =>
    api.put<ApiResponse<Employee>>(
      `/employees/${id}`,
      data
    ),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(
      `/employees/${id}`
    ),

  activate: (id: number) =>
    api.patch<ApiResponse<void>>(
      `/employees/${id}/activate`
    ),

  deactivate: (id: number) =>
    api.patch<ApiResponse<void>>(
      `/employees/${id}/deactivate`
    ),

  assignRoute: (
    id: number,
    routeId: number
  ) =>
    api.patch<ApiResponse<Employee>>(
      `/employees/${id}/route`,
      null,
      {
        params: {
          routeId,
        },
      }
    ),

  setTargets: (
    id: number,
    data: SetTargetRequest
  ) =>
    api.patch<ApiResponse<Employee>>(
      `/employees/${id}/target`,
      null,
      {
        params: data,
      }
    ),

  getDashboard: () =>
    api.get<ApiResponse<Employee>>(
      "/employees/dashboard"
    ),

  search: (
    query: string,
    organizationId?: number
  ) =>
    api.get<ApiResponse<Employee[]>>(
      "/employees/search",
      {
        params: {
          query,
          organizationId,
        },
      }
    ),
};

export default employeeApi;