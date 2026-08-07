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
public class OwnerDashboardResponse {


    private Double todayCollection;
    private Integer todayCollectionCount;
    private Double weeklyCollection;
    private Double monthlyCollection;
    private Double totalOutstanding;
    private Integer activeLoansCount;
    private Integer totalEmployees;
    private Integer totalCustomers;


    private Integer overdueLoansCount;
    private Double overdueAmount;
    private List<OverdueLoanDTO> overdueLoans;

    private List<EmployeePerformanceDTO> topPerformers;


    private List<RecentActivityDTO> recentActivities;


    private List<DailyCollectionDTO> weeklyTrend;


    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OverdueLoanDTO {
        private Long loanId;
        private String loanNumber;
        private String customerName;
        private Double overdueAmount;
        private Integer daysOverdue;
        private String assignedEmployee;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeePerformanceDTO {
        private Long employeeId;
        private String employeeName;
        private Double todayCollection;
        private Double weeklyCollection;
        private Double monthlyCollection;
        private Double targetAchievementPercentage;
        private Integer customersVisited;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivityDTO {
        private String type;
        private String message;
        private String timestamp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyCollectionDTO {
        private String date;
        private Double amount;
    }
}
