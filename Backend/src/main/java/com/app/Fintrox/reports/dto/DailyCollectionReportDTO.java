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
public class DailyCollectionReportDTO {

    private String reportDate;
    private Double totalCollection;
    private Integer totalTransactions;
    private Double averageTransaction;
    private Integer totalCustomers;
    private Integer totalEmployees;
    private List<EmployeeCollectionDTO> employeeCollections;
    private List<PaymentMethodDTO> paymentMethodBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeeCollectionDTO {
        private Long employeeId;
        private String employeeName;
        private Double collectionAmount;
        private Integer customerCount;
        private Integer transactionCount;
        private Double targetAchievement;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentMethodDTO {
        private String paymentMethod;
        private Double amount;
        private Integer count;
        private Double percentage;
    }
}
