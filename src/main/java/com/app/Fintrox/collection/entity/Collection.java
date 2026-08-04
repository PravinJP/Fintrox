package com.app.Fintrox.collection.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "collections")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Collection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "collection_number", unique = true, nullable = false, length = 20)
    private String collectionNumber;

    @Column(name = "loan_id", nullable = false)
    private Long loanId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "payment_mode_details")
    private String paymentModeDetails;

    @Column(name = "installment_number")
    private Integer installmentNumber;

    @Column(name = "is_full_payment")
    private boolean isFullPayment = false;

    @Column(name = "gps_latitude")
    private Double gpsLatitude;

    @Column(name = "gps_longitude")
    private Double gpsLongitude;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "is_verified")
    private boolean isVerified = false;

    @Column(name = "receipt_url")
    private String receiptUrl;

    @Column(name = "is_receipt_generated")
    private boolean isReceiptGenerated = false;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (collectionNumber == null) {
            collectionNumber = generateCollectionNumber();
        }
    }

    private String generateCollectionNumber() {
        String date = LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%04d", (int)(Math.random() * 10000));
        return "COL-" + date + "-" + random;
    }
}
