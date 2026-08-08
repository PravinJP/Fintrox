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
public class MonthlyCollectionReportDTO {

    private String month;
    private Integer year;
    private Double totalCollection;
    private Double previousMonthCollection;
    private Double growthPercentage;
    private Integer totalTransactions;
    private Integer totalCustomers;
    private Integer totalEmployees;
    private Double averageDailyCollection;
    private Double collectionTarget;
    private Double targetAchievement;
    private List<WeeklyBreakdownDTO> weeklyBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyBreakdownDTO {
        private String week;
        private Double collectionAmount;
        private Integer transactionCount;
    }
}
