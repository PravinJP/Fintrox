package com.app.Fintrox.customer.controller;

import com.app.Fintrox.common.exceptions.BadRequestException;
import com.app.Fintrox.customer.dto.request.CustomerRequest;
import com.app.Fintrox.customer.dto.response.CustomerResponse;
import com.app.Fintrox.customer.service.CustomerService;
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

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Slf4j
public class CustomerController {

    private final CustomerService customerService;

    /**
     * Create a new customer
     * POST /api/customers
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(
            @Valid @RequestBody CustomerRequest request) {
        Long userId = getCurrentUserId();
        Long organizationId = getCurrentOrganizationId();
        log.info("Create customer request for user: {}", userId);
        CustomerResponse response = customerService.createCustomer(request, userId, organizationId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer created successfully", response));
    }

    /**
     * Get all customers in organization
     * GET /api/customers
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getAllCustomers() {
        Long organizationId = getCurrentOrganizationId();
        List<CustomerResponse> responses = customerService.getCustomersByOrganization(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Customers fetched successfully", responses));
    }

    /**
     * Get customer by ID
     * GET /api/customers/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomer(
            @PathVariable("id") Long id) {
        log.info("Get customer request for id: {}", id);
        CustomerResponse response = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success("Customer details fetched", response));
    }

    /**
     * Update customer
     * PUT /api/customers/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(
            @PathVariable("id") Long id,
            @Valid @RequestBody CustomerRequest request) {
        log.info("Update customer request for id: {}", id);
        CustomerResponse response = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", response));
    }

    /**
     * Delete customer (soft delete)
     * DELETE /api/customers/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(
            @PathVariable("id") Long id) {
        log.info("Delete customer request for id: {}", id);
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer deleted successfully"));
    }

    /**
     * Activate customer
     * PATCH /api/customers/{id}/activate
     */
    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateCustomer(
            @PathVariable("id") Long id) {
        log.info("Activate customer request for id: {}", id);
        customerService.activateCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer activated successfully"));
    }

    /**
     * Deactivate customer
     * PATCH /api/customers/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateCustomer(
            @PathVariable("id") Long id) {
        log.info("Deactivate customer request for id: {}", id);
        customerService.deactivateCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer deactivated successfully"));
    }

    /**
     * Block customer
     * PATCH /api/customers/{id}/block
     */
    @PatchMapping("/{id}/block")
    public ResponseEntity<ApiResponse<Void>> blockCustomer(
            @PathVariable("id") Long id) {
        log.info("Block customer request for id: {}", id);
        customerService.blockCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer blocked successfully"));
    }

    /**
     * Unblock customer
     * PATCH /api/customers/{id}/unblock
     */
    @PatchMapping("/{id}/unblock")
    public ResponseEntity<ApiResponse<Void>> unblockCustomer(
            @PathVariable("id") Long id) {
        log.info("Unblock customer request for id: {}", id);
        customerService.unblockCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer unblocked successfully"));
    }

    /**
     * Assign customer to route
     * PATCH /api/customers/{id}/route?routeId=1
     */
    @PatchMapping("/{id}/route")
    public ResponseEntity<ApiResponse<CustomerResponse>> assignRoute(
            @PathVariable("id") Long id,
            @RequestParam("routeId") Long routeId) {
        log.info("Assign route {} to customer: {}", routeId, id);
        CustomerResponse response = customerService.assignRoute(id, routeId);
        return ResponseEntity.ok(ApiResponse.success("Route assigned successfully", response));
    }

    /**
     * Assign customer to employee
     * PATCH /api/customers/{id}/employee?employeeId=1
     */
    @PatchMapping("/{id}/employee")
    public ResponseEntity<ApiResponse<CustomerResponse>> assignEmployee(
            @PathVariable("id") Long id,
            @RequestParam("employeeId") Long employeeId) {
        log.info("Assign employee {} to customer: {}", employeeId, id);
        CustomerResponse response = customerService.assignEmployee(id, employeeId);
        return ResponseEntity.ok(ApiResponse.success("Employee assigned successfully", response));
    }

    /**
     * Get customer dashboard
     * GET /api/customers/{id}/dashboard
     */
    @GetMapping("/{id}/dashboard")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerDashboard(
            @PathVariable("id") Long id) {
        log.info("Get customer dashboard for id: {}", id);
        CustomerResponse response = customerService.getCustomerDashboard(id);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched", response));
    }

    /**
     * Search customers
     * GET /api/customers/search?query=rajesh
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> searchCustomers(
            @RequestParam("query") String query) {
        Long organizationId = getCurrentOrganizationId();
        log.info("Search customers with query: {}", query);
        List<CustomerResponse> responses = customerService.searchCustomers(query, organizationId);
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
}
