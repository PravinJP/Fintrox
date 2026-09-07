import React, { useState, useEffect } from 'react';
import employeeApi, { type Employee } from '../api/employeeApi';
import routeApi, { type Route, type CreateRouteRequest,type RouteStats as RouteStatsType } from '../api/routeApi';
import RouteAssignModal from '../components/routes/RouteAssignModal';
import RouteDeleteDialog from '../components/routes/RouteDeleteDialog';
import RouteFilters from '../components/routes/RouteFilters';
import RouteList from '../components/routes/RouteList';
import RouteMap from '../components/routes/RouteMap';
import RouteModal from '../components/routes/RouteModal';
import RouteStats from '../components/routes/RouteStats';


const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [stats, setStats] = useState<RouteStatsType>({
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
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [deletingRoute, setDeletingRoute] = useState<Route | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchRoutes();
    fetchEmployees();
    fetchStats();
  }, []);

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

  const calculateStats = (routeData: Route[]): RouteStatsType => {
    const total = routeData.length;
    const active = routeData.filter((r) => r.isActive).length;
    const inactive = total - active;
    const assigned = routeData.filter((r) => r.assignedEmployeeId).length;
    return { total, active, inactive, assigned };
  };

  const handleCreate = async (data: CreateRouteRequest) => {
    setModalLoading(true);
    try {
      const response = await routeApi.create(data);
      const updatedRoutes = [...routes, response.data];
      setRoutes(updatedRoutes);
      setStats(calculateStats(updatedRoutes));
      setIsModalOpen(false);
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
    } catch (error: any) {
      console.error('Error updating route:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingRoute) return;
    setModalLoading(true);
    try {
      await routeApi.delete(deletingRoute.id);
      const updatedRoutes = routes.filter((r) => r.id !== deletingRoute.id);
      setRoutes(updatedRoutes);
      setStats(calculateStats(updatedRoutes));
      setIsDeleteModalOpen(false);
      setDeletingRoute(null);
      if (selectedRoute?.id === deletingRoute.id) {
        setSelectedRoute(updatedRoutes[0] || null);
      }
    } catch (error: any) {
      console.error('Error deleting route:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAssignEmployee = async (employeeId: number) => {
    if (!selectedRoute) return;
    setModalLoading(true);
    try {
      const response = await routeApi.assignEmployee(selectedRoute.id, employeeId);
      const updatedRoutes = routes.map((r) => (r.id === selectedRoute.id ? response.data : r));
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

  const handleModalSave = (data: CreateRouteRequest) => {
    if (editingRoute) {
      handleUpdate(editingRoute.id, data);
    } else {
      handleCreate(data);
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

  const openCreateModal = () => {
    setEditingRoute(null);
    setIsModalOpen(true);
  };




  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Routes</h1>
          <p className="text-sm text-slate-500">Manage collection routes and assign employees</p>
        </div>
        <button
          className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-sm shadow-primary/30 transition-all"
          onClick={openCreateModal}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          Create Route
        </button>
      </div>

      <RouteStats stats={stats} loading={loading} />

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-400px)]">
        <div className="lg:col-span-2 bg-white rounded-[12px] border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <RouteFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
          <RouteList
            routes={filteredRoutes}
            selectedRoute={selectedRoute}
            onSelectRoute={setSelectedRoute}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-3 bg-white rounded-[12px] border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <RouteMap route={selectedRoute} />
        </div>
      </section>

      <RouteModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingRoute(null); }}
        onSave={handleModalSave}
        route={editingRoute}
        employees={employees}
        loading={modalLoading}
      />

      <RouteAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignEmployee}
        route={selectedRoute}
        employees={employees}
        loading={modalLoading}
      />

      <RouteDeleteDialog
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletingRoute(null); }}
        onConfirm={handleDelete}
        routeName={deletingRoute?.name || ''}
        loading={modalLoading}
      />
    </div>
  );
};

export default RoutesPage;