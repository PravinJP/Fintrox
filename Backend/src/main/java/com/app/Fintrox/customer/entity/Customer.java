package com.app.Fintrox.customer.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(unique = true, nullable = false, length = 15)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(length = 50)
    private String city;

    @Column(length = 50)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    @Column(name = "route_id")
    private Long routeId;

    @Column(name = "assigned_employee_id")
    private Long assignedEmployeeId;

    // ===== Financial Summary (Auto-calculated from loans) =====
    @Builder.Default
    @Column(name = "total_loans_taken")
    private Integer totalLoansTaken = 0;

    @Builder.Default
    @Column(name = "active_loans_count")
    private Integer activeLoansCount = 0;

    @Builder.Default
    @Column(name = "total_loan_amount_given")
    private Double totalLoanAmountGiven = 0.0;

    @Builder.Default
    @Column(name = "total_amount_received")
    private Double totalAmountReceived = 0.0;

    @Builder.Default
    @Column(name = "outstanding_balance")
    private Double outstandingBalance = 0.0;

    // ===== Status =====
    @Builder.Default
    @Column(name = "is_active")
    private boolean isActive = true;

    @Builder.Default
    @Column(name = "is_blocked")
    private boolean isBlocked = false;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;  // Employee or Owner who created

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
