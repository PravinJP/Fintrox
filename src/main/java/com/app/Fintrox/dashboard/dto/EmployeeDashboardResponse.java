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
public class EmployeeDashboardResponse {

    private Double todayCollection;
    private Integer todayVisits;
    private Double weeklyCollection;
    private Double monthlyCollection;
    private Double monthlyTarget;
    private Double targetAchievementPercentage;
    private Integer assignedCustomers;
    private Integer visitedCustomers;
    private Integer pendingCustomers;
    private Long routeId;
    private String routeName;
    private List<CustomerVisitDTO> todayCustomers;
    private List<RecentCollectionDTO> recentCollections;
    private List<OverdueCustomerDTO> overdueCustomers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerVisitDTO {
        private Long customerId;
        private String customerName;
        private String phone;
        private String address;
        private Double dueAmount;
        private Double outstandingBalance;
        private Integer priority;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentCollectionDTO {
        private Long collectionId;
        private String customerName;
        private Double amount;
        private String paymentMethod;
        private String collectedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OverdueCustomerDTO {
        private Long customerId;
        private String customerName;
        private String phone;
        private Double overdueAmount;
        private Integer daysOverdue;
    }
}
