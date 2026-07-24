package com.app.Fintrox.organization.mapper;



import com.app.Fintrox.organization.dto.request.OrganizationRequest;
import com.app.Fintrox.organization.dto.response.OrganizationResponse;
import com.app.Fintrox.organization.entity.Organization;
import com.app.Fintrox.Auth.entity.User;
import org.springframework.stereotype.Component;

@Component
public class OrganizationMapper {

    /**
     * Convert OrganizationRequest to Organization entity
     */
    public Organization toEntity(OrganizationRequest request, Long ownerId) {
        return Organization.builder()
                .name(request.getName())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail())
                .gst(request.getGst())
                .businessType(request.getBusinessType() != null ? request.getBusinessType() : "INDIVIDUAL")
                .isCompany(request.getBusinessType() != null &&
                        !request.getBusinessType().equals("INDIVIDUAL"))
                .ownerId(ownerId)
                .isActive(true)
                .build();
    }

    /**
     * Update existing Organization entity with request data
     */
    public void updateEntity(OrganizationRequest request, Organization organization) {
        if (request.getName() != null) {
            organization.setName(request.getName());
        }
        if (request.getAddress() != null) {
            organization.setAddress(request.getAddress());
        }
        if (request.getPhone() != null) {
            organization.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            organization.setEmail(request.getEmail());
        }
        if (request.getGst() != null) {
            organization.setGst(request.getGst());
        }
        if (request.getBusinessType() != null) {
            organization.setBusinessType(request.getBusinessType());
            organization.setCompany(!request.getBusinessType().equals("INDIVIDUAL"));
        }
    }

    /**
     * Convert Organization entity to OrganizationResponse DTO
     */
    public OrganizationResponse toResponse(Organization organization) {
        return OrganizationResponse.builder()
                .id(organization.getId())
                .name(organization.getName())
                .address(organization.getAddress())
                .phone(organization.getPhone())
                .email(organization.getEmail())
                .ownerId(organization.getOwnerId())
                .gst(organization.getGst())
                .businessType(organization.getBusinessType())
                .isCompany(organization.isCompany())
                .isActive(organization.isActive())
                .createdAt(organization.getCreatedAt())
                .updatedAt(organization.getUpdatedAt())
                .build();
    }

    /**
     * Convert Organization entity to OrganizationResponse DTO with owner name
     */
    public OrganizationResponse toResponseWithOwner(Organization organization, User owner) {
        OrganizationResponse response = toResponse(organization);
        response.setOwnerName(owner.getFullName());
        return response;
    }

    /**
     * Convert Organization entity to OrganizationResponse DTO with counts
     */
    public OrganizationResponse toResponseWithCounts(
            Organization organization,
            Long employeeCount,
            Long customerCount,
            Long loanCount,
            Double totalCollection) {

        OrganizationResponse response = toResponse(organization);
        response.setEmployeeCount(employeeCount != null ? employeeCount : 0L);
        response.setCustomerCount(customerCount != null ? customerCount : 0L);
        response.setLoanCount(loanCount != null ? loanCount : 0L);
        response.setTotalCollection(totalCollection != null ? totalCollection : 0.0);
        return response;
    }
}
