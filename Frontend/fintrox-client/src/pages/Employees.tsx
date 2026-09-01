import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  employeeApi,
  type CreateEmployeeRequest,
  type Employee,
} from "../api/employeeApi";
import EmployeeFilters from "../components/employees/EmployeeFilters";
import EmployeeStats from "../components/employees/EmployeeStats";
import EmployeeList from "../components/employees/EmployeeList";
import EmployeeModal from "../components/employees/EmployeeModal";

type EmployeeStatsType = {
  total: number;
  active: number;
  onLeave: number;
};

type EmployeeFiltersType = {
  search: string;
  role: string;
  status: string;
};

const notify = {
  success: (message: string) => {
    console.log("Success:", message);
    if (typeof window !== "undefined") {
      window.alert(message);
    }
  },
  error: (message: string) => {
    console.error("Error:", message);
    if (typeof window !== "undefined") {
      window.alert(message);
    }
  },
};

const Employees: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<EmployeeStatsType>({
    total: 0,
    active: 0,
    onLeave: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<EmployeeFiltersType>({
    search: "",
    role: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [filters, currentPage]);

  const calculateStats = (employeeData: Employee[]): EmployeeStatsType => {
    const total = employeeData.length;
    const active = employeeData.filter((e) => e.isActive).length;
    const onLeave = total - active;
    return { total, active, onLeave };
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeApi.getAll({
        search: filters.search || undefined,
        role: filters.role || undefined,
        status: filters.status || undefined,
      });
      const employeeData = response.data;
      if (Array.isArray(employeeData)) {
        setEmployees(employeeData);
        setTotalItems(employeeData.length);
        setTotalPages(Math.ceil(employeeData.length / 10) || 1);
        setStats(calculateStats(employeeData));
      } else {
        setEmployees([]);
        setTotalItems(0);
        setTotalPages(1);
        setStats({ total: 0, active: 0, onLeave: 0 });
      }
    } catch (error) {
      notify.error("Failed to fetch employees");
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    key: keyof EmployeeFiltersType,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    fetchEmployees();
  };

  const handleCreate = async (data: CreateEmployeeRequest) => {
    setModalLoading(true);
    try {
      const response = await employeeApi.create(data);
      notify.success("Employee created successfully");
      setIsModalOpen(false);
      const updatedEmployees = [...employees, response.data];
      setEmployees(updatedEmployees);
      setStats(calculateStats(updatedEmployees));
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Failed to create employee";
      notify.error(errorMsg);
      console.error("Error creating employee:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (data: CreateEmployeeRequest) => {
    if (!editingEmployee) return;
    setModalLoading(true);
    try {
      const response = await employeeApi.update(editingEmployee.id, data);
      notify.success("Employee updated successfully");
      setIsModalOpen(false);
      const updatedEmployees = employees.map((e) =>
        e.id === editingEmployee.id ? response.data : e
      );
      setEmployees(updatedEmployees);
      setStats(calculateStats(updatedEmployees));
      setEditingEmployee(null);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Failed to update employee";
      notify.error(errorMsg);
      console.error("Error updating employee:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      await employeeApi.delete(id);
      notify.success("Employee deleted successfully");
      const updatedEmployees = employees.filter((e) => e.id !== id);
      setEmployees(updatedEmployees);
      setStats(calculateStats(updatedEmployees));
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Failed to delete employee";
      notify.error(errorMsg);
      console.error("Error deleting employee:", error);
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await employeeApi.activate(id);
      notify.success("Employee activated successfully");
      const updatedEmployees = employees.map((e) =>
        e.id === id ? { ...e, isActive: true } : e
      );
      setEmployees(updatedEmployees);
      setStats(calculateStats(updatedEmployees));
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Failed to activate employee";
      notify.error(errorMsg);
      console.error("Error activating employee:", error);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await employeeApi.deactivate(id);
      notify.success("Employee deactivated successfully");
      const updatedEmployees = employees.map((e) =>
        e.id === id ? { ...e, isActive: false } : e
      );
      setEmployees(updatedEmployees);
      setStats(calculateStats(updatedEmployees));
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Failed to deactivate employee";
      notify.error(errorMsg);
      console.error("Error deactivating employee:", error);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleAssignRoute = (employee: Employee) => {
    navigate(`/employees/${employee.id}/assign-route`);
  };

  const handleSetTarget = (employee: Employee) => {
    navigate(`/employees/${employee.id}/set-target`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleModalSave = (data: CreateEmployeeRequest) => {
    if (editingEmployee) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <div className="flex-1 p-gutter max-w-max-width mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-1">
            Employees
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Manage your workforce, roles, and access.
          </p>
        </div>
        <button
          className="bg-[#2D6A4F] text-white px-4 py-2 rounded-lg font-label-md flex items-center gap-2 hover:bg-primary transition-colors shadow-sm"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Employee
        </button>
      </div>

      <EmployeeFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      <EmployeeStats stats={stats} loading={loading} />

      <EmployeeList
        employees={employees}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onAssignRoute={handleAssignRoute}
        onSetTarget={handleSetTarget}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
      />

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        employee={editingEmployee}
        loading={modalLoading}
      />
    </div>
  );
};

export default Employees;