package com.app.Fintrox.organization.service;



import com.app.Fintrox.organization.dto.request.OrganizationRequest;
import com.app.Fintrox.organization.dto.response.OrganizationResponse;
import com.app.Fintrox.organization.entity.Organization;

import java.util.List;

public interface OrganizationService {

    /**
     * Create a new organization (Owner only - one per owner)
     */
    OrganizationResponse createOrganization(OrganizationRequest request, Long ownerId);

    /**
     * Get organization by ID
     */
    OrganizationResponse getOrganizationById(Long id);

    /**
     * Get organization by owner ID
     */
    OrganizationResponse getOrganizationByOwnerId(Long ownerId);

    /**
     * Get organization entity by owner ID (internal use)
     */
    Organization getOrganizationEntityByOwnerId(Long ownerId);

    /**
     * Get all organizations (Admin/Super Admin only)
     */
    List<OrganizationResponse> getAllOrganizations();

    /**
     * Get all active organizations
     */
    List<OrganizationResponse> getActiveOrganizations();

    /**
     * Update organization details
     */
    OrganizationResponse updateOrganization(Long id, OrganizationRequest request, Long ownerId);

    /**
     * Activate organization
     */
    void activateOrganization(Long id);

    /**
     * Deactivate organization
     */
    void deactivateOrganization(Long id);

    /**
     * Check if owner has an organization
     */
    boolean hasOrganization(Long ownerId);

    /**
     * Get organization dashboard data
     */
    OrganizationResponse getOrganizationDashboard(Long ownerId);

    /**
     * Search organizations by name, email, or phone
     */
    List<OrganizationResponse> searchOrganizations(String searchTerm);

    /**
     * Validate organization existence
     */
    boolean organizationExists(Long id);

    /**
     * Get organization entity by ID (internal use)
     */
    Organization getOrganizationEntityById(Long id);
}