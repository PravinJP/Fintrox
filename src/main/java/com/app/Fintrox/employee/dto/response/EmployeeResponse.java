package com.app.Fintrox.employee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String employeeCode;
    private String role;
    private Long organizationId;
    private String organizationName;
    private Long userId;
    private Long routeId;
    private String routeName;
    private BigDecimal loanLimit;
    private BigDecimal monthlyTarget;
    private BigDecimal dailyTarget;
    // ❌ REMOVED: commissionRate
    private boolean isActive;
    private boolean isOnline;

    // Performance metrics
    private BigDecimal todayCollection;
    private BigDecimal monthlyCollection;
    private Double targetAchievementPercentage;
    private Integer assignedCustomers;
    private Integer visitedCustomers;
    private Integer overdueCustomers;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}