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
public class CustomerLoanReportDTO {

    private String reportDate;
    private Integer totalCustomers;
    private Double totalLoanAmount;
    private Double totalReceived;
    private Double totalOutstanding;
    private List<CustomerLoanDTO> customerLoans;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerLoanDTO {
        private Long customerId;
        private String customerName;
        private String phone;
        private String address;
        private Integer totalLoans;
        private Double totalLoanAmount;
        private Double totalPaid;
        private Double outstandingBalance;
        private String loanStatus;
        private String assignedEmployee;
        private String routeName;
    }
}
