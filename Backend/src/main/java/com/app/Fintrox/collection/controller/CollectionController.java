package com.app.Fintrox.collection.controller;



import com.app.Fintrox.collection.dto.request.CollectionRequest;
import com.app.Fintrox.collection.dto.response.CollectionResponse;
import com.app.Fintrox.collection.service.CollectionService;
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
@RequestMapping("/api/collections")
@RequiredArgsConstructor
@Slf4j
public class CollectionController {

    private final CollectionService collectionService;

    @PostMapping
    public ResponseEntity<ApiResponse<CollectionResponse>> recordCollection(
            @Valid @RequestBody CollectionRequest request) {
        Long userId = getCurrentUserId();
        Long organizationId = getCurrentOrganizationId();
        Long employeeId = getCurrentEmployeeId();
        log.info("Record collection request for loan: {}", request.getLoanId());
        CollectionResponse response = collectionService.recordCollection(request, userId, organizationId, employeeId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment recorded successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CollectionResponse>> getCollection(
            @PathVariable("id") Long id) {
        log.info("Get collection request for id: {}", id);
        CollectionResponse response = collectionService.getCollectionById(id);
        return ResponseEntity.ok(ApiResponse.success("Collection details fetched", response));
    }

    @GetMapping("/loan/{loanId}")
    public ResponseEntity<ApiResponse<List<CollectionResponse>>> getCollectionsByLoan(
            @PathVariable("loanId") Long loanId) {
        log.info("Get collections for loan: {}", loanId);
        List<CollectionResponse> responses = collectionService.getCollectionsByLoan(loanId);
        return ResponseEntity.ok(ApiResponse.success("Collections fetched successfully", responses));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<CollectionResponse>>> getCollectionsByCustomer(
            @PathVariable("customerId") Long customerId) {
        log.info("Get collections for customer: {}", customerId);
        List<CollectionResponse> responses = collectionService.getCollectionsByCustomer(customerId);
        return ResponseEntity.ok(ApiResponse.success("Collections fetched successfully", responses));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<CollectionResponse>>> getCollectionsByEmployee(
            @PathVariable("employeeId") Long employeeId) {
        log.info("Get collections for employee: {}", employeeId);
        List<CollectionResponse> responses = collectionService.getCollectionsByEmployee(employeeId);
        return ResponseEntity.ok(ApiResponse.success("Collections fetched successfully", responses));
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<CollectionResponse>>> getTodayCollections() {
        Long organizationId = getCurrentOrganizationId();
        log.info("Get today's collections");
        List<CollectionResponse> responses = collectionService.getTodayCollections(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Today's collections fetched", responses));
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<ApiResponse<CollectionResponse>> verifyCollection(
            @PathVariable("id") Long id) {
        log.info("Verify collection request for id: {}", id);
        CollectionResponse response = collectionService.verifyCollection(id);
        return ResponseEntity.ok(ApiResponse.success("Collection verified successfully", response));
    }

    @PatchMapping("/{id}/receipt")
    public ResponseEntity<ApiResponse<CollectionResponse>> generateReceipt(
            @PathVariable("id") Long id) {
        log.info("Generate receipt for collection: {}", id);
        CollectionResponse response = collectionService.generateReceipt(id);
        return ResponseEntity.ok(ApiResponse.success("Receipt generated successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CollectionResponse>>> getAllCollections() {
        Long organizationId = getCurrentOrganizationId();
        List<CollectionResponse> responses = collectionService.getCollectionsByOrganization(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Collections fetched successfully", responses));
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

    private Long getCurrentEmployeeId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof com.app.Fintrox.Auth.entity.User) {
            Long employeeId = ((com.app.Fintrox.Auth.entity.User) principal).getEmployeeId();
            return employeeId != null ? employeeId : null;
        }
        return null;
    }
}
