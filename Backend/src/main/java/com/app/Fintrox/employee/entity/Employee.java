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
    private String employeeCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeeRole role;  // COLLECTION_AGENT, FIELD_MANAGER, BRANCH_MANAGER

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "route_id")
    private Long routeId;

    @Column(name = "loan_limit")
    private BigDecimal loanLimit;  // Max loan amount they can approve (if applicable)

    @Column(name = "monthly_target")
    private BigDecimal monthlyTarget;  // Collection target per month

    @Column(name = "daily_target")
    private BigDecimal dailyTarget;  // Collection target per day

    // ❌ REMOVED: commissionRate (not applicable)

    @Builder.Default
    @Column(name = "is_active")
    private boolean isActive = true;

    @Builder.Default
    @Column(name = "is_online")
    private boolean isOnline = false;

    @Column(name = "last_check_in")
    private LocalDateTime lastCheckIn;

    @Column(name = "current_latitude")
    private Double currentLatitude;

    @Column(name = "current_longitude")
    private Double currentLongitude;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

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