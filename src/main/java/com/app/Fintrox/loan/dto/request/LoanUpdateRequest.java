package com.app.Fintrox.loan.dto.request;



import jakarta.validation.constraints.Min;
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
public class LoanUpdateRequest {

    private Double principalAmount;

    @Min(value = 0, message = "Interest rate must be greater than or equal to 0")
    private Double interestRate;

    @Min(value = 1, message = "Tenure must be at least 1 month")
    private Integer tenureMonths;

    @Pattern(regexp = "^(DAILY|WEEKLY|MONTHLY)$",
            message = "Loan type must be DAILY, WEEKLY, or MONTHLY")
    private String loanType;

    private LocalDate startDate;

    private String notes;
}