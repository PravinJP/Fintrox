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
public class EmployeePerformanceReportDTO {

    private String reportDate;
    private Integer totalEmployees;
    private Double totalCollection;
    private List<EmployeePerformanceDTO> employeePerformances;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeePerformanceDTO {
        private Long employeeId;
        private String employeeName;
        private String role;
        private String routeName;
        private Double todayCollection;
        private Double weeklyCollection;
        private Double monthlyCollection;
        private Double monthlyTarget;
        private Double targetAchievement;
        private Integer customersAssigned;
        private Integer customersVisited;
        private Integer overdueCustomers;
        private Double collectionEfficiency;
        private String performanceRating;
    }
}
