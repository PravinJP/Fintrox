package com.app.Fintrox.employee.entity;



import com.app.Fintrox.security.permissions.EmployeeRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(unique = true, nullable = false, length = 15)
    private String phone;

    @Column(unique = true, nullable = false, length = 20)
    private String employeeCode;  // Auto-generated: EMP-20260728-0001

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeeRole role;  // COLLECTION_AGENT, FIELD_MANAGER, BRANCH_MANAGER

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;  // Which organization this employee belongs to

    @Column(name = "user_id", nullable = false)
    private Long userId;  // Link to User table (for login)

    @Column(name = "route_id")
    private Long routeId;  // Assigned route (optional)

    @Column(name = "loan_limit")
    private BigDecimal loanLimit;  // Max loan amount this employee can approve

    @Column(name = "monthly_target")
    private BigDecimal monthlyTarget;  // Collection target per month

    @Column(name = "daily_target")
    private BigDecimal dailyTarget;  // Collection target per day

    @Column(name = "commission_rate")
    private BigDecimal commissionRate;  // Commission percentage on collections

    @Builder.Default
    @Column(name = "is_active")
    private boolean isActive = true;

    @Builder.Default
    @Column(name = "is_online")
    private boolean isOnline = false;  // For live tracking

    @Column(name = "last_check_in")
    private LocalDateTime lastCheckIn;

    @Column(name = "current_latitude")
    private Double currentLatitude;  // For GPS tracking

    @Column(name = "current_longitude")
    private Double currentLongitude;  // For GPS tracking

    @Column(name = "created_by", nullable = false)
    private Long createdBy;  // Owner ID who created this employee

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (employeeCode == null) {
            employeeCode = generateEmployeeCode();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private String generateEmployeeCode() {
        String date = LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%04d", (int)(Math.random() * 10000));
        return "EMP-" + date + "-" + random;
    }
}
