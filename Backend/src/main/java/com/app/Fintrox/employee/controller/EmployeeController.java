
package com.app.Fintrox.employee.controller;

import com.app.Fintrox.Auth.entity.User;
import com.app.Fintrox.common.exceptions.UnauthorizedException;
import com.app.Fintrox.common.responses.ApiResponse;
import com.app.Fintrox.employee.dto.request.EmployeeRequest;
import com.app.Fintrox.employee.dto.response.EmployeeResponse;
import com.app.Fintrox.employee.service.EmployeeService;
import com.app.Fintrox.security.permissions.UserType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasAnyRole('OWNER', 'INDIVIDUAL_LENDER')")
    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(
            @Valid @RequestBody EmployeeRequest request) {

        Long ownerId = getCurrentUserId();

        log.info("Create employee request for owner: {}", ownerId);

        EmployeeResponse response =
                employeeService.createEmployee(request, ownerId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Employee created successfully",
                        response
                ));
    }

    @PreAuthorize("hasAnyRole('OWNER', 'INDIVIDUAL_LENDER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAllEmployees() {

        Long organizationId = getCurrentOrganizationId();

        log.info(
                "Fetching employees for organization: {}",
                organizationId
        );

        List<EmployeeResponse> responses =
                employeeService.getEmployeesByOrganization(organizationId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Employees fetched successfully",
                        responses
                )
        );
    }

    @PreAuthorize("hasAnyRole('OWNER', 'INDIVIDUAL_LENDER')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployee(
            @PathVariable("id") Long id) {

        Long organizationId = getCurrentOrganizationId();

        log.info(
                "Get employee request for id: {} in organization: {}",
                id,
                organizationId
        );

        EmployeeResponse response =
                employeeService.getEmployeeById(id, organizationId);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Employee details fetched",
                        response
                )
        );
    }

    @PreAuthorize("hasAnyRole('OWNER', 'INDIVIDUAL_LENDER')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(
            @PathVariable("id") Long id,
            @Valid @RequestBody EmployeeRequest request) {

        Long ownerId = getCurrentUserId();

        log.info(
                "Update employee request for id: {} by owner: {}",
                id,
                ownerId
        );

        EmployeeResponse response =
                employeeService.updateEmployee(id, request, ownerId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Employee updated successfully",
                        response
                )
        );
    }

    @PreAuthorize("hasAnyRole('OWNER', 'INDIVIDUAL_LENDER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(
            @PathVariable("id") Long id) {

        Long ownerId = getCurrentUserId();

        log.info(
                "Delete employee request for id: {} by owner: {}",
                id,
                ownerId
        );

        employeeService.deleteEmployee(id, ownerId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Employee deleted successfully"
                )
        );
    }

    @PreAuthorize("hasAnyRole('OWNER', 'INDIVIDUAL_LENDER')")
    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateEmployee(
            @PathVariable("id") Long id) {

        Long ownerId = getCurrentUserId();

        log.info(
                "Activate employee request for id: {} by owner: {}",
                id,
                ownerId
        );

        employeeService.activateEmployee(id, ownerId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Employee activated successfully"
                )
        );
    }

    @PreAuthorize("hasAnyRole('OWNER', 'INDIVIDUAL_LENDER')")
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateEmployee(
            @PathVariable("id") Long id) {

        Long ownerId = getCurrentUserId();

        log.info(
                "Deactivate employee request for id: {} by owner: {}",
                id,
                ownerId
        );

        employeeService.deactivateEmployee(id, ownerId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Employee deactivated successfully"
                )
        );
    }

    @PreAuthorize("hasAnyRole('OWNER', 'INDIVIDUAL_LENDER')")
    @PatchMapping("/{id}/route")
    public ResponseEntity<ApiResponse<EmployeeResponse>> assignRoute(
            @PathVariable("id") Long id,
            @RequestParam("routeId") Long routeId) {

        Long ownerId = getCurrentUserId();

        log.info(
                "Assign route {} to employee {} by owner {}",
                routeId,
                id,
                ownerId
        );

        EmployeeResponse response =
                employeeService.assignRoute(id, routeId, ownerId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Route assigned successfully",
                        response
                )
        );
    }

    @PreAuthorize("hasAnyRole('OWNER', 'INDIVIDUAL_LENDER')")
    @PatchMapping("/{id}/target")
    public ResponseEntity<ApiResponse<EmployeeResponse>> setTargets(
            @PathVariable("id") Long id,
            @RequestParam(value = "monthlyTarget", required = false)
            BigDecimal monthlyTarget,
            @RequestParam(value = "dailyTarget", required = false)
            BigDecimal dailyTarget) {

        Long ownerId = getCurrentUserId();

        log.info(
                "Set targets for employee {} by owner {}",
                id,
                ownerId
        );

        EmployeeResponse response =
                employeeService.setTargets(
                        id,
                        monthlyTarget,
                        dailyTarget,
                        ownerId
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Targets updated successfully",
                        response
                )
        );
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getDashboard() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new UnauthorizedException(
                    "User not authenticated"
            );
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User user)) {
            throw new UnauthorizedException(
                    "Invalid authenticated user"
            );
        }

        if (user.getUserType() != UserType.EMPLOYEE) {
            throw new UnauthorizedException(
                    "Only employees can access this dashboard"
            );
        }

        if (user.getEmployeeId() == null) {
            throw new UnauthorizedException(
                    "Employee profile not linked"
            );
        }

        EmployeeResponse response =
                employeeService.getEmployeeDashboard(
                        user.getEmployeeId()
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Dashboard data fetched",
                        response
                )
        );
    }

    @PreAuthorize("hasAnyRole('OWNER', 'INDIVIDUAL_LENDER')")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> searchEmployees(
            @RequestParam("query") String query) {

        Long organizationId = getCurrentOrganizationId();

        log.info(
                "Search employees with query: {} in organization: {}",
                query,
                organizationId
        );

        List<EmployeeResponse> responses =
                employeeService.searchEmployees(
                        query,
                        organizationId
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Search results",
                        responses
                )
        );
    }

    private Long getCurrentOrganizationId() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new UnauthorizedException(
                    "User not authenticated"
            );
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User user) {

            if (user.getOrganizationId() == null) {

                throw new UnauthorizedException(
                        "User is not associated with an organization"
                );
            }

            return user.getOrganizationId();
        }

        throw new UnauthorizedException(
                "User not properly authenticated"
        );
    }

    private Long getCurrentUserId() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new UnauthorizedException(
                    "User not authenticated"
            );
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User user) {
            return user.getId();
        }

        throw new UnauthorizedException(
                "User not properly authenticated"
        );
    }
}

