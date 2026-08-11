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
public class WeeklyCollectionReportDTO {

    private String weekStart;
    private String weekEnd;
    private Double totalCollection;
    private Double previousWeekCollection;
    private Double growthPercentage;
    private Integer totalTransactions;
    private Integer totalCustomers;
    private List<DailyBreakdownDTO> dailyBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyBreakdownDTO {
        private String date;
        private Double collectionAmount;
        private Integer transactionCount;
        private Integer customerCount;
    }
}
