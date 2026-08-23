package com.app.Fintrox.dashboard.controller;

import com.app.Fintrox.dashboard.dto.EmployeeDashboardResponse;
import com.app.Fintrox.dashboard.dto.LenderDashboardResponse;
import com.app.Fintrox.dashboard.dto.OwnerDashboardResponse;
import com.app.Fintrox.dashboard.service.DashboardService;
import com.app.Fintrox.common.responses.ApiResponse;
import com.app.Fintrox.common.exceptions.BadRequestException;
import com.app.Fintrox.common.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/owner")
    public ResponseEntity<ApiResponse<OwnerDashboardResponse>> getOwnerDashboard() {
        Long organizationId = getCurrentOrganizationId();
        log.info("Get owner dashboard for organization: {}", organizationId);
        OwnerDashboardResponse response = dashboardService.getOwnerDashboard(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched", response));
    }

    @GetMapping("/employee")
    public ResponseEntity<ApiResponse<EmployeeDashboardResponse>> getEmployeeDashboard() {
        Long organizationId = getCurrentOrganizationId();
        Long employeeId = getCurrentEmployeeId();
        if (employeeId == null) {
            throw new BadRequestException("Employee not found");
        }
        log.info("Get employee dashboard for employee: {}", employeeId);
        EmployeeDashboardResponse response = dashboardService.getEmployeeDashboard(employeeId, organizationId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched", response));
    }

    @GetMapping("/lender")
    public ResponseEntity<ApiResponse<LenderDashboardResponse>> getLenderDashboard() {
        try {
            Long organizationId = getCurrentOrganizationId();
            log.info("Get lender dashboard for organization: {}", organizationId);
            LenderDashboardResponse response = dashboardService.getLenderDashboard(organizationId);
            return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched", response));
        } catch (BadRequestException e) {
            log.warn("Lender dashboard error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    private Long getCurrentOrganizationId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof com.app.Fintrox.Auth.entity.User) {
            Long orgId = ((com.app.Fintrox.Auth.entity.User) principal).getOrganizationId();
            if (orgId == null) {
                throw new BadRequestException("User does not belong to any organization");
            }
            return orgId;
        }
        throw new UnauthorizedException("User not properly authenticated");
    }

    private Long getCurrentEmployeeId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof com.app.Fintrox.Auth.entity.User) {
            return ((com.app.Fintrox.Auth.entity.User) principal).getEmployeeId();
        }
        return null;
    }
}