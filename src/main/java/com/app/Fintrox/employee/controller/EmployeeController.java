package com.app.Fintrox.employee.controller;



import com.app.Fintrox.employee.dto.request.EmployeeRequest;
import com.app.Fintrox.employee.dto.response.EmployeeResponse;
import com.app.Fintrox.employee.service.EmployeeService;
import com.app.Fintrox.common.responses.ApiResponse;
import com.app.Fintrox.common.exceptions.UnauthorizedException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Slf4j
public class EmployeeController {

    private final EmployeeService employeeService;

    // ===== Employee Management =====

    /**
     * Create a new employee (Owner only)
     * POST /api/employees
     */
    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(
            @Valid @RequestBody EmployeeRequest request) {
        Long ownerId = getCurrentUserId();
        log.info("Create employee request for owner: {}", ownerId);
        EmployeeResponse response = employeeService.createEmployee(request, ownerId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employee created successfully", response));
    }

    /**
     * Get all employees in organization
     * GET /api/employees
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAllEmployees() {
        Long userId = getCurrentUserId();
        // Get organization from user
        // For now, use a simple approach - get all for the org
        List<EmployeeResponse> responses = employeeService.getEmployeesByOrganization(1L);
        return ResponseEntity.ok(ApiResponse.success("Employees fetched successfully", responses));
    }

    /**
     * Get employee by ID
     * GET /api/employees/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployee(@PathVariable Long id) {
        log.info("Get employee request for id: {}", id);
        EmployeeResponse response = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(ApiResponse.success("Employee details fetched", response));
    }

    /**
     * Update employee
     * PUT /api/employees/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        Long ownerId = getCurrentUserId();
        log.info("Update employee request for id: {}", id);
        EmployeeResponse response = employeeService.updateEmployee(id, request, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", response));
    }

    /**
     * Delete employee (soft delete)
     * DELETE /api/employees/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        Long ownerId = getCurrentUserId();
        log.info("Delete employee request for id: {}", id);
        employeeService.deleteEmployee(id, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Employee deleted successfully"));
    }

    /**
     * Activate employee
     * PATCH /api/employees/{id}/activate
     */
    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateEmployee(@PathVariable Long id) {
        Long ownerId = getCurrentUserId();
        log.info("Activate employee request for id: {}", id);
        employeeService.activateEmployee(id, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Employee activated successfully"));
    }

    /**
     * Deactivate employee
     * PATCH /api/employees/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateEmployee(@PathVariable Long id) {
        Long ownerId = getCurrentUserId();
        log.info("Deactivate employee request for id: {}", id);
        employeeService.deactivateEmployee(id, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Employee deactivated successfully"));
    }

    // ===== Route and Target Management =====

    /**
     * Assign route to employee
     * PATCH /api/employees/{id}/route
     */
    @PatchMapping("/{id}/route")
    public ResponseEntity<ApiResponse<EmployeeResponse>> assignRoute(
            @PathVariable Long id,
            @RequestParam Long routeId) {
        Long ownerId = getCurrentUserId();
        log.info("Assign route {} to employee: {}", routeId, id);
        EmployeeResponse response = employeeService.assignRoute(id, routeId, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Route assigned successfully", response));
    }

    /**
     * Set employee targets
     * PATCH /api/employees/{id}/target
     */
    @PatchMapping("/{id}/target")
    public ResponseEntity<ApiResponse<EmployeeResponse>> setTargets(
            @PathVariable Long id,
            @RequestParam(required = false) BigDecimal monthlyTarget,
            @RequestParam(required = false) BigDecimal dailyTarget) {
        Long ownerId = getCurrentUserId();
        log.info("Set targets for employee: {}", id);
        EmployeeResponse response = employeeService.setTargets(id, monthlyTarget, dailyTarget, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Targets updated successfully", response));
    }

    // ===== Employee Dashboard =====

    /**
     * Get employee dashboard (Employee's own view)
     * GET /api/employees/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getDashboard() {
        Long userId = getCurrentUserId();
        // Get employee by user ID
        // For now, return with default
        EmployeeResponse response = employeeService.getEmployeeDashboard(1L);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched", response));
    }

    // ===== Search =====

    /**
     * Search employees
     * GET /api/employees/search?query=john&organizationId=1
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> searchEmployees(
            @RequestParam String query,
            @RequestParam(required = false) Long organizationId) {
        log.info("Search employees with query: {}", query);
        List<EmployeeResponse> responses = employeeService.searchEmployees(query, organizationId);
        return ResponseEntity.ok(ApiResponse.success("Search results", responses));
    }

    // ===== Helper Methods =====

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof com.app.Fintrox.Auth.entity.User) {
            return ((com.app.Fintrox.Auth.entity.User) principal).getId();
        }
        throw new UnauthorizedException("User not properly authenticated");
    }
}
