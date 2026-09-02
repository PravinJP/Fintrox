package com.app.Fintrox.employee.controller;

import com.app.Fintrox.Auth.repository.UserRepository;
import com.app.Fintrox.employee.dto.request.EmployeeRequest;
import com.app.Fintrox.employee.dto.response.EmployeeResponse;
import com.app.Fintrox.employee.repository.EmployeeRepository;
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

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;



    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(
            @Valid @RequestBody EmployeeRequest request) {
        Long ownerId = getCurrentUserId();
        log.info("Create employee request for owner: {}", ownerId);
        EmployeeResponse response = employeeService.createEmployee(request, ownerId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employee created successfully", response));
    }




    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAllEmployees() {
        Long organizationId = getCurrentOrganizationId();

        log.info("Fetching employees for organization: {}", organizationId);

        List<EmployeeResponse> responses =
                employeeService.getEmployeesByOrganization(organizationId);

        return ResponseEntity.ok(
                ApiResponse.success("Employees fetched successfully", responses)
        );
    }

    private Long getCurrentOrganizationId() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof com.app.Fintrox.Auth.entity.User user) {

            if (user.getOrganizationId() == null) {
                throw new UnauthorizedException(
                        "User is not associated with an organization"
                );
            }

            return user.getOrganizationId();
        }

        throw new UnauthorizedException("User not properly authenticated");
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployee(
            @PathVariable("id") Long id) {
        log.info("Get employee request for id: {}", id);
        EmployeeResponse response = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(ApiResponse.success("Employee details fetched", response));
    }

    // ✅ FIXED: @PathVariable("id") with parameter name
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(
            @PathVariable("id") Long id,
            @Valid @RequestBody EmployeeRequest request) {
        Long ownerId = getCurrentUserId();
        log.info("Update employee request for id: {}", id);
        EmployeeResponse response = employeeService.updateEmployee(id, request, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", response));
    }

    // ✅ FIXED: @PathVariable("id") with parameter name
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(
            @PathVariable("id") Long id) {
        Long ownerId = getCurrentUserId();
        log.info("Delete employee request for id: {}", id);
        employeeService.deleteEmployee(id, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Employee deleted successfully"));
    }

    // ✅ FIXED: @PathVariable("id") with parameter name
    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateEmployee(
            @PathVariable("id") Long id) {
        Long ownerId = getCurrentUserId();
        log.info("Activate employee request for id: {}", id);
        employeeService.activateEmployee(id, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Employee activated successfully"));
    }

    // ✅ FIXED: @PathVariable("id") with parameter name
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateEmployee(
            @PathVariable("id") Long id) {
        Long ownerId = getCurrentUserId();
        log.info("Deactivate employee request for id: {}", id);
        employeeService.deactivateEmployee(id, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Employee deactivated successfully"));
    }

    // ===== Route and Target Management =====

    // ✅ FIXED: @PathVariable("id") and @RequestParam("routeId")
    @PatchMapping("/{id}/route")
    public ResponseEntity<ApiResponse<EmployeeResponse>> assignRoute(
            @PathVariable("id") Long id,
            @RequestParam("routeId") Long routeId) {
        Long ownerId = getCurrentUserId();
        log.info("Assign route {} to employee: {}", routeId, id);
        EmployeeResponse response = employeeService.assignRoute(id, routeId, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Route assigned successfully", response));
    }

    // ✅ FIXED: @PathVariable("id") with parameter name
    @PatchMapping("/{id}/target")
    public ResponseEntity<ApiResponse<EmployeeResponse>> setTargets(
            @PathVariable("id") Long id,
            @RequestParam(value = "monthlyTarget", required = false) BigDecimal monthlyTarget,
            @RequestParam(value = "dailyTarget", required = false) BigDecimal dailyTarget) {
        Long ownerId = getCurrentUserId();
        log.info("Set targets for employee: {}", id);
        EmployeeResponse response = employeeService.setTargets(id, monthlyTarget, dailyTarget, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Targets updated successfully", response));
    }

    // ===== Employee Dashboard =====

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getDashboard() {
        EmployeeResponse response = employeeService.getEmployeeDashboard(1L);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched", response));
    }

    // ===== Search =====


    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> searchEmployees(
            @RequestParam("query") String query,
            @RequestParam(value = "organizationId", required = false) Long organizationId) {
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