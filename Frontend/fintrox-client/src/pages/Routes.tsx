import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import routeApi, { type CreateRouteRequest, type Route, type RouteStats } from '../api/routeApi';
import employeeApi, { type Employee } from '../api/employeeApi';


const Routes: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [stats, setStats] = useState<RouteStats>({
    total: 0,
    active: 0,
    inactive: 0,
    assigned: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [deletingRouteId, setDeletingRouteId] = useState<number | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [formData, setFormData] = useState<CreateRouteRequest>({
    name: '',
    description: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    assignedEmployeeId: undefined,
  });

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchRoutes();
    fetchEmployees();
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedRoute && mapRef.current) {
      initializeMap();
    }
  }, [selectedRoute]);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await routeApi.getAll();
      setRoutes(response.data);
      if (response.data.length > 0 && !selectedRoute) {
        setSelectedRoute(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeApi.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await routeApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const calculateStats = (routeData: Route[]): RouteStats => {
    const total = routeData.length;
    const active = routeData.filter((r) => r.isActive).length;
    const inactive = total - active;
    const assigned = routeData.filter((r) => r.assignedEmployeeId).length;
    return { total, active, inactive, assigned };
  };

  const initializeMap = () => {
    if (!mapRef.current) return;
  };

  const handleCreate = async (data: CreateRouteRequest) => {
    setModalLoading(true);
    try {
      const response = await routeApi.create(data);
      const updatedRoutes = [...routes, response.data];
      setRoutes(updatedRoutes);
      setStats(calculateStats(updatedRoutes));
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error creating route:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (id: number, data: CreateRouteRequest) => {
    setModalLoading(true);
    try {
      const response = await routeApi.update(id, data);
      const updatedRoutes = routes.map((r) => (r.id === id ? response.data : r));
      setRoutes(updatedRoutes);
      setStats(calculateStats(updatedRoutes));
      setIsModalOpen(false);
      setEditingRoute(null);
      resetForm();
    } catch (error: any) {
      console.error('Error updating route:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await routeApi.delete(id);
      const updatedRoutes = routes.filter((r) => r.id !== id);
      setRoutes(updatedRoutes);
      setStats(calculateStats(updatedRoutes));
      setIsDeleteModalOpen(false);
      setDeletingRouteId(null);
      if (selectedRoute?.id === id) {
        setSelectedRoute(updatedRoutes[0] || null);
      }
    } catch (error: any) {
      console.error('Error deleting route:', error);
    }
  };

  const handleAssignEmployee = async (routeId: number, employeeId: number) => {
    setModalLoading(true);
    try {
      const response = await routeApi.assignEmployee(routeId, employeeId);
      const updatedRoutes = routes.map((r) => (r.id === routeId ? response.data : r));
      setRoutes(updatedRoutes);
      setStats(calculateStats(updatedRoutes));
      setIsAssignModalOpen(false);
      setSelectedRoute(response.data);
    } catch (error: any) {
      console.error('Error assigning employee:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await routeApi.activate(id);
      const updatedRoutes = routes.map((r) => (r.id === id ? { ...r, isActive: true } : r));
      setRoutes(updatedRoutes);
      setStats(calculateStats(updatedRoutes));
      if (selectedRoute?.id === id) {
        setSelectedRoute({ ...selectedRoute, isActive: true });
      }
    } catch (error: any) {
      console.error('Error activating route:', error);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await routeApi.deactivate(id);
      const updatedRoutes = routes.map((r) => (r.id === id ? { ...r, isActive: false } : r));
      setRoutes(updatedRoutes);
      setStats(calculateStats(updatedRoutes));
      if (selectedRoute?.id === id) {
        setSelectedRoute({ ...selectedRoute, isActive: false });
      }
    } catch (error: any) {
      console.error('Error deactivating route:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      assignedEmployeeId: undefined,
    });
    setEditingRoute(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      description: route.description,
      area: route.area || '',
      city: route.city || '',
      state: route.state || '',
      pincode: route.pincode || '',
      assignedEmployeeId: route.assignedEmployeeId || undefined,
    });
    setIsModalOpen(true);
  };

  const openAssignModal = (route: Route) => {
    setSelectedRoute(route);
    setSelectedEmployeeId(route.assignedEmployeeId || undefined);
    setIsAssignModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setDeletingRouteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoute) {
      handleUpdate(editingRoute.id, formData);
    } else {
      handleCreate(formData);
    }
  };

  const handleAssignSubmit = () => {
    if (selectedRoute && selectedEmployeeId) {
      handleAssignEmployee(selectedRoute.id, selectedEmployeeId);
    }
  };

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && route.isActive) ||
      (filterStatus === 'inactive' && !route.isActive);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
        Active
      </span>
    ) : (
      <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
        Inactive
      </span>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6">
      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[12px] border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Routes</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-surface text-primary flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[12px] border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.active}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[12px] border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Inactive</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.inactive}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[12px] border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Routes w/ Employees</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.assigned}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content: Split View */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-320px)]">
        {/* Left: Routes List */}
        <div className="lg:col-span-2 bg-white rounded-[12px] border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">All Routes</h3>
              <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {filteredRoutes.length} total
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </span>
              <input
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Search routes..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${filterStatus === 'all' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${filterStatus === 'active' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                onClick={() => setFilterStatus('active')}
              >
                Active
              </button>
              <button
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${filterStatus === 'inactive' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                onClick={() => setFilterStatus('inactive')}
              >
                Inactive
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                className={`p-4 rounded-xl border cursor-pointer space-y-2 transition-all ${selectedRoute?.id === route.id
                  ? 'border-primary bg-primary-surface/20'
                  : 'border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setSelectedRoute(route)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{route.name}</span>
                  {getStatusBadge(route.isActive)}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    {route.assignedEmployeeName ? (
                      <>
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-primary font-bold text-[10px] flex items-center justify-center">
                          {getInitials(route.assignedEmployeeName)}
                        </div>
                        <span>{route.assignedEmployeeName}</span>
                      </>
                    ) : (
                      <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Unassigned</span>
                    )}
                  </div>
                  <span>{route.customerCount || 0} customers</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Map */}
        <div className="lg:col-span-3 bg-white rounded-[12px] border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between z-10 bg-white">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="font-bold text-slate-900 text-sm">
                {selectedRoute?.name || 'Select a Route'}
                {selectedRoute && ` (RT-${String(selectedRoute.id).padStart(3, '0')})`}
              </h2>
            </div>
            {selectedRoute && (
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  onClick={() => openAssignModal(selectedRoute)}
                >
                  Assign
                </button>
                <button
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  onClick={() => openEditModal(selectedRoute)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  onClick={() => openDeleteModal(selectedRoute.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 relative bg-slate-100">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <p className="text-sm font-medium">Map View</p>
                <p className="text-xs">Select a route to view its location</p>
                {selectedRoute && (
                  <div className="mt-4 text-left max-w-sm mx-auto">
                    <p className="text-sm font-semibold">{selectedRoute.name}</p>
                    <p className="text-xs text-slate-500">{selectedRoute.area}</p>
                    <p className="text-xs text-slate-500">{selectedRoute.city}, {selectedRoute.state}</p>
                  </div>
                )}
              </div>
            </div>
            <div ref={mapRef} id="leafletMap" className="w-full h-full relative z-0"></div>
          </div>
        </div>
      </section>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[12px] shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingRoute ? 'Edit Route' : 'Create New Route'}
              </h3>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleModalSubmit}>
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
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-sm shadow-primary/30 transition-colors disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : editingRoute ? 'Update Route' : 'Save Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {isAssignModalOpen && selectedRoute && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[12px] shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Assign Route to Employee</h3>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setIsAssignModalOpen(false)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                Select an employee to assign to route{' '}
                <span className="font-semibold text-slate-800">{selectedRoute.name}</span>:
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {employees.map((emp) => (
                  <label
                    key={emp.id}
                    className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedEmployeeId === emp.id ? 'border-primary bg-primary-surface/20' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    <input
                      className="text-primary focus:ring-primary"
                      type="radio"
                      name="employee"
                      checked={selectedEmployeeId === emp.id}
                      onChange={() => setSelectedEmployeeId(emp.id)}
                    />
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-primary font-bold text-xs flex items-center justify-center">
                      {getInitials(emp.fullName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{emp.fullName}</p>
                      <p className="text-xs text-slate-500">{emp.role} • {emp.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                onClick={() => setIsAssignModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-sm shadow-primary/30 transition-colors disabled:opacity-50"
                onClick={handleAssignSubmit}
                disabled={!selectedEmployeeId || modalLoading}
              >
                {modalLoading ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[12px] shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Delete Route</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this route? This action cannot be undone.
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                onClick={() => { setIsDeleteModalOpen(false); setDeletingRouteId(null); }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-red-600/30 transition-colors"
                onClick={() => deletingRouteId && handleDelete(deletingRouteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={() => setIsDrawerOpen(false)}></div>
      )}

      {/* Add Route Button - Floating */}
      <button
        className="fixed bottom-8 right-8 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg shadow-primary/30 transition-colors z-30"
        onClick={openCreateModal}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
};

export default Routes;