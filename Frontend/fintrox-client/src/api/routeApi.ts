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

export const routeApi = {
  getAll: () =>
    api.get<Route[]>('/routes'),

  getById: (id: number) =>
    api.get<Route>(`/routes/${id}`),

  create: (data: CreateRouteRequest) =>
    api.post<Route>('/routes', data),

  update: (id: number, data: UpdateRouteRequest) =>
    api.put<Route>(`/routes/${id}`, data),

  delete: (id: number) =>
    api.delete<void>(`/routes/${id}`),

  activate: (id: number) =>
    api.patch<void>(`/routes/${id}/activate`),

  deactivate: (id: number) =>
    api.patch<void>(`/routes/${id}/deactivate`),

  assignEmployee: (id: number, employeeId: number) =>
    api.patch<Route>(`/routes/${id}/assign-employee`, null, { params: { employeeId } }),

  unassignEmployee: (id: number) =>
    api.patch<Route>(`/routes/${id}/unassign-employee`),

  getMyRoutes: () =>
    api.get<Route[]>('/routes/my-routes'),



  search: (query: string) =>
    api.get<Route[]>('/routes/search', { params: { query } }),

  getAreas: () =>
    api.get<string[]>('/routes/areas'),

  getActive: () =>
    api.get<Route[]>('/routes/active'),
};

export default routeApi;