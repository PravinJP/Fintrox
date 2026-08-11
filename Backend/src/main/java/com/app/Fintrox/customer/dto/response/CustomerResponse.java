package com.app.Fintrox.customer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {

    private Long id;
    private String fullName;
    private String phone;
    private String email;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private Long organizationId;
    private Long routeId;
    private String routeName;
    private Long assignedEmployeeId;
    private String assignedEmployeeName;

    // Financial Summary
    private Integer totalLoansTaken;
    private Integer activeLoansCount;
    private Double totalLoanAmountGiven;
    private Double totalAmountReceived;
    private Double outstandingBalance;

    // Status
    private boolean isActive;
    private boolean isBlocked;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
