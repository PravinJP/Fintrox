package com.app.Fintrox.loan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanResponse {

    private Long id;
    private String loanNumber;
    private Long customerId;
    private String customerName;
    private String customerPhone;

    private Double principalAmount;
    private Double interestRate;
    private Integer tenureMonths;
    private String loanType;
    private Double installmentAmount;
    private Double totalInterest;
    private Double totalPayable;
    private Double amountPaid;
    private Double outstandingBalance;
    private Integer installmentsPaid;
    private Integer totalInstallments;
    private LocalDate nextDueDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    // ✅ Use the separate DTO
    private List<InstallmentScheduleDto> installmentSchedule;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}