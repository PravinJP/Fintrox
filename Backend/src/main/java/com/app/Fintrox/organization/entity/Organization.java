package com.app.Fintrox.organization.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Column(nullable = false, length = 100)
    private String name;  

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;  // Business address (required)

    @Column(nullable = false, length = 15)
    private String phone;  // Contact number (required)

    @Column(nullable = false, length = 100)
    private String email;  // Business email (required)

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;  // Links to User (Owner)



    @Column(unique = true, length = 50)
    private String gst;  

    @Column(name = "business_type")
    private String businessType;  // INDIVIDUAL, PARTNERSHIP, PVT_LTD, LLP

    @Column(name = "is_company")
    private boolean isCompany = false;  // If false = Individual Lender



    @Column(name = "is_active")
    private boolean isActive = true;

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