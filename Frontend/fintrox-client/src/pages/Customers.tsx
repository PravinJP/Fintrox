import React, { useState, useEffect } from "react";
import customerApi, {
  type Customer,
  type CreateCustomerRequest,
} from "../api/customerApi";
import employeeApi, { type Employee } from "../api/employeeApi";
import routeApi, { type Route } from "../api/routeApi";
import CustomerBlockDialog from "../components/customers/CustomerBlockDialog";
import CustomerFilters from "../components/customers/CustomerFilters";
import CustomerList from "../components/customers/CustomerList";
import CustomerModal from "../components/customers/CustomerModal";
import CustomerAssignModal from "../components/customers/CustomerAssignModal";

type CustomerStatsType = {
  total: number;
  active: number;
  blocked: number;
};

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<CustomerStatsType>({
    total: 0,
    active: 0,
    blocked: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRoute, setFilterRoute] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [blockingCustomer, setBlockingCustomer] = useState<Customer | null>(null);
  const [assigningCustomer, setAssigningCustomer] = useState<Customer | null>(null);
  const [assignType, setAssignType] = useState<"route" | "employee">("route");
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchRoutes();
    fetchEmployees();
  }, []);

  const calculateStats = (data: Customer[]): CustomerStatsType => {
    const total = data.length;
    const active = data.filter((c) => c.isActive && !c.isBlocked).length;
    const blocked = data.filter((c) => c.isBlocked).length;
    return { total, active, blocked };
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerApi.getAll();
      const data = response.data.data;
      if (Array.isArray(data)) {
        setCustomers(data);
        setTotalItems(data.length);
        setTotalPages(Math.ceil(data.length / 10) || 1);
        setStats(calculateStats(data));
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await routeApi.getAll();
      setRoutes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeApi.getAll();
      setEmployees(response.data.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleCreate = async (data: CreateCustomerRequest) => {
    setModalLoading(true);
    try {
      const response = await customerApi.create(data);
      const updated = [...customers, response.data.data];
      setCustomers(updated);
      setStats(calculateStats(updated));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating customer:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (id: number, data: CreateCustomerRequest) => {
    setModalLoading(true);
    try {
      const response = await customerApi.update(id, data);
      const updated = customers.map((c) =>
        c.id === id ? response.data.data : c
      );
      setCustomers(updated);
      setStats(calculateStats(updated));
      setIsModalOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error("Error updating customer:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;
    try {
      await customerApi.delete(id);
      const updated = customers.filter((c) => c.id !== id);
      setCustomers(updated);
      setStats(calculateStats(updated));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleBlockToggle = async () => {
    if (!blockingCustomer) return;
    setModalLoading(true);
    try {
      if (blockingCustomer.isBlocked) {
        await customerApi.unblock(blockingCustomer.id);
      } else {
        await customerApi.block(blockingCustomer.id);
      }
      const updated = customers.map((c) =>
        c.id === blockingCustomer.id ? { ...c, isBlocked: !c.isBlocked } : c
      );
      setCustomers(updated);
      setStats(calculateStats(updated));
      setIsBlockModalOpen(false);
      setBlockingCustomer(null);
    } catch (error) {
      console.error("Error toggling block:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAssign = async (id: number) => {
    if (!assigningCustomer) return;
    setModalLoading(true);
    try {
      let response;
      if (assignType === "route") {
        response = await customerApi.assignRoute(assigningCustomer.id, id);
      } else {
        response = await customerApi.assignEmployee(assigningCustomer.id, id);
      }
      const updated = customers.map((c) =>
        c.id === assigningCustomer.id ? response.data.data : c
      );
      setCustomers(updated);
      setIsAssignModalOpen(false);
      setAssigningCustomer(null);
    } catch (error) {
      console.error("Error assigning:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoute =
      !filterRoute || customer.routeId === Number(filterRoute);
    const matchesStatus =
      !filterStatus ||
      (filterStatus === "active" && customer.isActive && !customer.isBlocked) ||
      (filterStatus === "blocked" && customer.isBlocked) ||
      (filterStatus === "inactive" && !customer.isActive);
    return matchesSearch && matchesRoute && matchesStatus;
  });

  const handleModalSave = (data: CreateCustomerRequest) => {
    if (editingCustomer) {
      handleUpdate(editingCustomer.id, data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Customers
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage and view your customer base.
          </p>
        </div>
        <button
          className="bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-emerald-800 transition-colors shadow-sm text-sm font-medium"
          onClick={() => {
            setEditingCustomer(null);
            setIsModalOpen(true);
          }}
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
              <span className="material-symbols-outlined">group</span>
            </div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Customers
            </h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Active Customers
            </h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-lg text-red-700">
              <span className="material-symbols-outlined">block</span>
            </div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Blocked Customers
            </h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.blocked}</p>
        </div>
      </div>

      <CustomerFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterRoute={filterRoute}
        onRouteChange={setFilterRoute}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        routes={routes}
      />

      <CustomerList
        customers={filteredCustomers}
        loading={loading}
        onEdit={(c) => {
          setEditingCustomer(c);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
        onBlock={(c) => {
          setBlockingCustomer(c);
          setIsBlockModalOpen(true);
        }}
        onUnblock={(c) => {
          setBlockingCustomer(c);
          setIsBlockModalOpen(true);
        }}
        onAssignRoute={(c) => {
          setAssigningCustomer(c);
          setAssignType("route");
          setIsAssignModalOpen(true);
        }}
        onAssignEmployee={(c) => {
          setAssigningCustomer(c);
          setAssignType("employee");
          setIsAssignModalOpen(true);
        }}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
      />

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
        onSave={handleModalSave}
        customer={editingCustomer}
        routes={routes}
        employees={employees}
        loading={modalLoading}
      />

      <CustomerBlockDialog
        isOpen={isBlockModalOpen}
        onClose={() => {
          setIsBlockModalOpen(false);
          setBlockingCustomer(null);
        }}
        onConfirm={handleBlockToggle}
        customerName={blockingCustomer?.fullName || ""}
        action={blockingCustomer?.isBlocked ? "unblock" : "block"}
        loading={modalLoading}
      />

      <CustomerAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssigningCustomer(null);
        }}
        onAssign={handleAssign}
        customer={assigningCustomer}
        routes={routes}
        employees={employees}
        type={assignType}
        loading={modalLoading}
      />
    </div>
  );
};

export default Customers;