package com.app.Fintrox.reports.service;



import com.app.Fintrox.reports.dto.*;
import java.time.LocalDate;

public interface ReportService {

    DailyCollectionReportDTO getDailyReport(Long organizationId, LocalDate date);

    WeeklyCollectionReportDTO getWeeklyReport(Long organizationId, LocalDate date);

    MonthlyCollectionReportDTO getMonthlyReport(Long organizationId, Integer month, Integer year);

    EmployeePerformanceReportDTO getEmployeePerformanceReport(Long organizationId, LocalDate startDate, LocalDate endDate);

    OverdueLoanReportDTO getOverdueLoanReport(Long organizationId);

    CustomerLoanReportDTO getCustomerLoanReport(Long organizationId);

    byte[] exportToExcel(String reportType, Long organizationId, LocalDate startDate, LocalDate endDate);

    byte[] exportToPDF(String reportType, Long organizationId, LocalDate startDate, LocalDate endDate);
}
