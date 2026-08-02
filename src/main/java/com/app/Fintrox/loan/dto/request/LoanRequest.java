package com.app.Fintrox.loan.dto.request;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Principal amount is required")
    @Min(value = 1, message = "Principal amount must be greater than 0")
    private Double principalAmount;

    @NotNull(message = "Interest rate is required")
    @Min(value = 0, message = "Interest rate must be greater than or equal to 0")
    private Double interestRate;  // Per month

    @NotNull(message = "Tenure is required")
    @Min(value = 1, message = "Tenure must be at least 1 month")
    private Integer tenureMonths;

    @NotNull(message = "Loan type is required")
    @Pattern(regexp = "^(DAILY|WEEKLY|MONTHLY)$",
            message = "Loan type must be DAILY, WEEKLY, or MONTHLY")
    private String loanType;

    private LocalDate startDate;  // If not provided, uses today
}
