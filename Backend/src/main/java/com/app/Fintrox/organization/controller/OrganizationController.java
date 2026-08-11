package com.app.Fintrox.organization.controller;


import com.app.Fintrox.organization.dto.request.OrganizationRequest;
import com.app.Fintrox.organization.dto.response.OrganizationResponse;
import com.app.Fintrox.organization.service.OrganizationService;
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
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
@Slf4j
public class OrganizationController {

    private final OrganizationService organizationService;




    @PostMapping
    public ResponseEntity<ApiResponse<OrganizationResponse>> createOrganization(
            @Valid @RequestBody OrganizationRequest request) {

        Long ownerId = getCurrentUserId();
        log.info("Create organization request for owner: {}", ownerId);

        OrganizationResponse response = organizationService.createOrganization(request, ownerId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Organization created successfully", response));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> getOrganization(@PathVariable Long id) {
        log.info("Get organization request for id: {}", id);

        OrganizationResponse response = organizationService.getOrganizationById(id);
        return ResponseEntity.ok(ApiResponse.success("Organization details fetched", response));
    }


    @GetMapping("/me")
    public ResponseEntity<ApiResponse<OrganizationResponse>> getMyOrganization() {
        Long ownerId = getCurrentUserId();
        log.info("Get my organization request for owner: {}", ownerId);

        OrganizationResponse response = organizationService.getOrganizationByOwnerId(ownerId);
        return ResponseEntity.ok(ApiResponse.success("Organization details fetched", response));
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> updateOrganization(
            @PathVariable Long id,
            @Valid @RequestBody OrganizationRequest request) {

        Long ownerId = getCurrentUserId();
        log.info("Update organization request for id: {}", id);

        OrganizationResponse response = organizationService.updateOrganization(id, request, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Organization updated successfully", response));
    }


    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateOrganization(@PathVariable Long id) {
        log.info("Activate organization request for id: {}", id);

        organizationService.activateOrganization(id);
        return ResponseEntity.ok(ApiResponse.success("Organization activated successfully"));
    }


    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateOrganization(@PathVariable Long id) {
        log.info("Deactivate organization request for id: {}", id);

        organizationService.deactivateOrganization(id);
        return ResponseEntity.ok(ApiResponse.success("Organization deactivated successfully"));
    }


    @GetMapping("/has-org")
    public ResponseEntity<ApiResponse<Boolean>> hasOrganization() {
        Long ownerId = getCurrentUserId();
        log.info("Check organization existence for owner: {}", ownerId);

        boolean hasOrg = organizationService.hasOrganization(ownerId);
        return ResponseEntity.ok(ApiResponse.success(
                hasOrg ? "User has an organization" : "User does not have an organization",
                hasOrg
        ));
    }


    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<OrganizationResponse>> getDashboard() {
        Long ownerId = getCurrentUserId();
        log.info("Get organization dashboard for owner: {}", ownerId);

        OrganizationResponse response = organizationService.getOrganizationDashboard(ownerId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched", response));
    }




    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<OrganizationResponse>>> getAllOrganizations() {
        log.info("Get all organizations request");

        // TODO: Check if user is Admin/Super Admin
        List<OrganizationResponse> responses = organizationService.getAllOrganizations();
        return ResponseEntity.ok(ApiResponse.success("All organizations fetched", responses));
    }

    /**
     * Search organizations (Admin/Super Admin only)
     * GET /api/organizations/search?query=abc
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<OrganizationResponse>>> searchOrganizations(
            @RequestParam String query) {

        log.info("Search organizations with query: {}", query);

        // TODO: Check if user is Admin/Super Admin
        List<OrganizationResponse> responses = organizationService.searchOrganizations(query);
        return ResponseEntity.ok(ApiResponse.success("Search results", responses));
    }



    /**
     * Get current authenticated user's ID from Security Context
     */
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
