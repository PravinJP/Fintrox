package com.app.Fintrox.employee.service;



import com.app.Fintrox.employee.dto.request.EmployeeRequest;
import com.app.Fintrox.employee.dto.response.EmployeeResponse;
import com.app.Fintrox.employee.entity.Employee;

import java.math.BigDecimal;
import java.util.List;

public interface EmployeeService {

    /**
     * Create a new employee (Owner only)
     */
    EmployeeResponse createEmployee(EmployeeRequest request, Long ownerId);

    /**
     * Get all employees in an organization
     */
    List<EmployeeResponse> getEmployeesByOrganization(Long organizationId);

    /**
     * Get active employees in an organization
     */
    List<EmployeeResponse> getActiveEmployeesByOrganization(Long organizationId);

    /**
     * Get employee by ID
     */
    EmployeeResponse getEmployeeById(Long id,Long organizationId);

    /**
     * Get employee by user ID
     */
    Employee getEmployeeByUserId(Long userId);

    /**
     * Get employee by email
     */
    Employee getEmployeeByEmail(String email);

    /**
     * Update employee details
     */
    EmployeeResponse updateEmployee(Long id, EmployeeRequest request, Long ownerId);

    /**
     * Delete employee (soft delete)
     */
    void deleteEmployee(Long id, Long ownerId);

    /**
     * Activate employee
     */
    void activateEmployee(Long id, Long ownerId);

    /**
     * Deactivate employee
     */
    void deactivateEmployee(Long id, Long ownerId);

    /**
     * Assign route to employee
     */
    EmployeeResponse assignRoute(Long employeeId, Long routeId, Long ownerId);

    /**
     * Set employee targets
     */
    EmployeeResponse setTargets(Long employeeId, BigDecimal monthlyTarget, BigDecimal dailyTarget, Long ownerId);

    /**
     * Update employee online status (for tracking)
     */
    void updateOnlineStatus(Long employeeId, boolean isOnline);

    /**
     * Update employee location (GPS)
     */
    void updateLocation(Long employeeId, Double latitude, Double longitude);

    /**
     * Get employee dashboard data
     */
    EmployeeResponse getEmployeeDashboard(Long employeeId);

    /**
     * Search employees
     */
    List<EmployeeResponse> searchEmployees(String searchTerm, Long organizationId);


}
