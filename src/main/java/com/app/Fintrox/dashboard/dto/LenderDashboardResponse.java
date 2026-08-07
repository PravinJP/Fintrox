package com.app.Fintrox.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LenderDashboardResponse {

    private Double totalLoanAmountGiven;
    private Double totalAmountReceived;
    private Double outstandingBalance;
    private Integer activeLoans;
    private Integer totalCustomers;
    private Integer overdueLoans;
    private List<RecentLoanDTO> recentLoans;
    private List<RecentCollectionDTO> recentCollections;
    private List<UpcomingPaymentDTO> upcomingPayments;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentLoanDTO {
        private Long loanId;
        private String loanNumber;
        private String customerName;
        private Double amount;
        private String status;
        private String createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentCollectionDTO {
        private Long collectionId;
        private String customerName;
        private Double amount;
        private String collectedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpcomingPaymentDTO {
        private Long loanId;
        private String customerName;
        private Double dueAmount;
        private String dueDate;
    }
}
