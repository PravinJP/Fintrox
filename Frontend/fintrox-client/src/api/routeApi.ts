import api from './axiosConfig';

export interface Route {
  id: number;
  name: string;
  description: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  organizationId: number;
  organizationName: string;
  assignedEmployeeId: number;
  assignedEmployeeName: string;
  isActive: boolean;
  customerCount: number;
  visitedCount: number;
  pendingCount: number;
  collectionAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRouteRequest {
  name: string;
  description: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  assignedEmployeeId?: number;
}

export interface UpdateRouteRequest {
  name?: string;
  description?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  assignedEmployeeId?: number;
}

export interface RouteStats {
  total: number;
  active: number;
  inactive: number;
  assigned: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const routeApi = {
  getAll: () => api.get<ApiResponse<Route[]>>('/routes'),
  getById: (id: number) => api.get<ApiResponse<Route>>(`/routes/${id}`),
  create: (data: CreateRouteRequest) => api.post<ApiResponse<Route>>('/routes', data),
  update: (id: number, data: UpdateRouteRequest) => api.put<ApiResponse<Route>>(`/routes/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/routes/${id}`),
  activate: (id: number) => api.patch<ApiResponse<void>>(`/routes/${id}/activate`),
  deactivate: (id: number) => api.patch<ApiResponse<void>>(`/routes/${id}/deactivate`),
  assignEmployee: (id: number, employeeId: number) =>
    api.patch<ApiResponse<Route>>(`/routes/${id}/assign-employee`, null, { params: { employeeId } }),
  unassignEmployee: (id: number) => api.patch<ApiResponse<Route>>(`/routes/${id}/unassign-employee`),
  getMyRoutes: () => api.get<ApiResponse<Route[]>>('/routes/my-routes'),
  search: (query: string) => api.get<ApiResponse<Route[]>>('/routes/search', { params: { query } }),
  getAreas: () => api.get<ApiResponse<string[]>>('/routes/areas'),
  getActive: () => api.get<ApiResponse<Route[]>>('/routes/active'),
};

export default routeApi;