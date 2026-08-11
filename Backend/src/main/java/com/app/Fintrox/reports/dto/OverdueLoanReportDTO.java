package com.app.Fintrox.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OverdueLoanReportDTO {

    private String reportDate;
    private Integer totalOverdueLoans;
    private Double totalOverdueAmount;
    private Integer totalCustomers;
    private List<OverdueLoanDTO> overdueLoans;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OverdueLoanDTO {
        private Long loanId;
        private String loanNumber;
        private String customerName;
        private String customerPhone;
        private Double overdueAmount;
        private Integer daysOverdue;
        private String assignedEmployee;
        private String status;
    }
}
