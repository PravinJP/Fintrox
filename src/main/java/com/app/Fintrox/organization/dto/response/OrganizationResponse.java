package com.app.Fintrox.organization.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationResponse {

    private Long id;
    private String name;
    private String address;
    private String phone;
    private String email;
    private Long ownerId;
    private String ownerName;
    private String gst;  // Optional - may be null
    private String businessType;
    private boolean isCompany;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ✅ Counts for Dashboard
    private Long employeeCount;
    private Long customerCount;
    private Long loanCount;
    private Double totalCollection;
}
