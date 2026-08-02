package com.app.Fintrox.loan.entity;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "loan_number", unique = true, nullable = false, length = 20)
    private String loanNumber;  // Auto-generated: LN-20260803-001

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    // ===== Loan Details =====
    @Column(name = "principal_amount", nullable = false)
    private Double principalAmount;

    @Column(name = "interest_rate", nullable = false)
    private Double interestRate;  // Per month

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(name = "loan_type", nullable = false)
    private String loanType;  // DAILY, WEEKLY, MONTHLY

    @Column(name = "installment_amount")
    private Double installmentAmount;

    @Column(name = "total_interest")
    private Double totalInterest;

    @Column(name = "total_payable")
    private Double totalPayable;

    @Column(name = "amount_paid")
    private Double amountPaid = 0.0;

    @Column(name = "outstanding_balance")
    private Double outstandingBalance;

    @Column(name = "installments_paid")
    private Integer installmentsPaid = 0;

    @Column(name = "total_installments")
    private Integer totalInstallments;

    @Column(name = "next_due_date")
    private LocalDate nextDueDate;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "status")
    private String status;  // ACTIVE, CLOSED, OVERDUE, DEFAULTED

    @Column(name = "is_active")
    private boolean isActive = true;

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
        if (loanNumber == null) {
            loanNumber = generateLoanNumber();
        }
        if (status == null) {
            status = "ACTIVE";
        }
        outstandingBalance = totalPayable - amountPaid;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        outstandingBalance = totalPayable - amountPaid;
    }

    private String generateLoanNumber() {
        String date = LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%03d", (int)(Math.random() * 1000));
        return "LN-" + date + "-" + random;
    }
}
