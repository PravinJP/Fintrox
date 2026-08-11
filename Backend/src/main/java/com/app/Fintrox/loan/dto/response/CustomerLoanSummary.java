package com.app.Fintrox.loan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerLoanSummary {
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private Long totalLoans;
    private Long activeLoans;
    private Long closedLoans;
    private Long overdueLoans;
    private Double totalPrincipal;
    private Double totalPayable;
    private Double totalPaid;
    private Double totalOutstanding;
}
