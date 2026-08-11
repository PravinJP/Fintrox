package com.app.Fintrox.loan.controller;



import com.app.Fintrox.loan.dto.request.LoanRequest;
import com.app.Fintrox.loan.dto.request.LoanUpdateRequest;
import com.app.Fintrox.loan.dto.response.CustomerLoanSummary;
import com.app.Fintrox.loan.dto.response.LoanResponse;
import com.app.Fintrox.loan.service.LoanService;
import com.app.Fintrox.common.responses.ApiResponse;
import com.app.Fintrox.common.exceptions.BadRequestException;
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
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@Slf4j
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public ResponseEntity<ApiResponse<LoanResponse>> createLoan(
            @Valid @RequestBody LoanRequest request) {
        Long userId = getCurrentUserId();
        Long organizationId = getCurrentOrganizationId();
        log.info("Create loan request for customer: {}", request.getCustomerId());
        LoanResponse response = loanService.createLoan(request, userId, organizationId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Loan created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanResponse>> updateLoan(
            @PathVariable("id") Long id,
            @Valid @RequestBody LoanUpdateRequest request) {
        log.info("Update loan request for id: {}", id);
        LoanResponse response = loanService.updateLoan(id, request);
        return ResponseEntity.ok(ApiResponse.success("Loan updated successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanResponse>> getLoan(
            @PathVariable("id") Long id) {
        log.info("Get loan request for id: {}", id);
        LoanResponse response = loanService.getLoanById(id);
        return ResponseEntity.ok(ApiResponse.success("Loan details fetched", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LoanResponse>>> getAllLoans() {
        Long organizationId = getCurrentOrganizationId();
        List<LoanResponse> responses = loanService.getLoansByOrganization(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Loans fetched successfully", responses));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<LoanResponse>>> getLoansByStatus(
            @PathVariable("status") String status) {
        Long organizationId = getCurrentOrganizationId();
        List<LoanResponse> responses = loanService.getLoansByStatus(status, organizationId);
        return ResponseEntity.ok(ApiResponse.success("Loans fetched successfully", responses));
    }

    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<LoanResponse>>> getOverdueLoans() {
        Long organizationId = getCurrentOrganizationId();
        List<LoanResponse> responses = loanService.getOverdueLoans(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Overdue loans fetched", responses));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<LoanResponse>>> getLoansByCustomer(
            @PathVariable("customerId") Long customerId) {
        List<LoanResponse> responses = loanService.getLoansByCustomer(customerId);
        return ResponseEntity.ok(ApiResponse.success("Customer loans fetched", responses));
    }

    @GetMapping("/customer/{customerId}/active")
    public ResponseEntity<ApiResponse<List<LoanResponse>>> getActiveLoansByCustomer(
            @PathVariable("customerId") Long customerId) {
        List<LoanResponse> responses = loanService.getActiveLoansByCustomer(customerId);
        return ResponseEntity.ok(ApiResponse.success("Active loans fetched", responses));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<LoanResponse>> updateLoanStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") String status) {
        log.info("Update loan status request for id: {} to {}", id, status);
        LoanResponse response = loanService.updateLoanStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Loan status updated", response));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<ApiResponse<LoanResponse>> closeLoan(
            @PathVariable("id") Long id) {
        log.info("Close loan request for id: {}", id);
        LoanResponse response = loanService.closeLoan(id);
        return ResponseEntity.ok(ApiResponse.success("Loan closed successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLoan(
            @PathVariable("id") Long id) {
        log.info("Delete loan request for id: {}", id);
        loanService.deleteLoan(id);
        return ResponseEntity.ok(ApiResponse.success("Loan deleted successfully"));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateLoan(
            @PathVariable("id") Long id) {
        log.info("Activate loan request for id: {}", id);
        loanService.activateLoan(id);
        return ResponseEntity.ok(ApiResponse.success("Loan activated successfully"));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateLoan(
            @PathVariable("id") Long id) {
        log.info("Deactivate loan request for id: {}", id);
        loanService.deactivateLoan(id);
        return ResponseEntity.ok(ApiResponse.success("Loan deactivated successfully"));
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<ApiResponse<LoanResponse>> getLoanDashboard(
            @PathVariable("id") Long id) {
        log.info("Get loan dashboard for id: {}", id);
        LoanResponse response = loanService.getLoanDashboard(id);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched", response));
    }

    @GetMapping("/customer/{customerId}/summary")
    public ResponseEntity<ApiResponse<CustomerLoanSummary>> getCustomerLoanSummary(
            @PathVariable("customerId") Long customerId) {
        log.info("Get loan summary for customer: {}", customerId);
        CustomerLoanSummary summary = loanService.getCustomerLoanSummary(customerId);
        return ResponseEntity.ok(ApiResponse.success("Loan summary fetched", summary));
    }

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
