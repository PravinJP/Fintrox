package com.app.Fintrox.reports.service;

import com.app.Fintrox.collection.repository.CollectionRepository;
import com.app.Fintrox.customer.repository.CustomerRepository;
import com.app.Fintrox.employee.repository.EmployeeRepository;
import com.app.Fintrox.loan.repository.LoanRepository;
import com.app.Fintrox.loan.repository.InstallmentRepository;
import com.app.Fintrox.reports.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final CollectionRepository collectionRepository;
    private final LoanRepository loanRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final InstallmentRepository installmentRepository;
    private final ExcelExportService excelExportService;
    private final PDFExportService pdfExportService;

    @Override
    public DailyCollectionReportDTO getDailyReport(Long organizationId, LocalDate date) {
        return DailyCollectionReportDTO.builder()
                .reportDate(date.format(DateTimeFormatter.ISO_LOCAL_DATE))
                .totalCollection(0.0)
                .totalTransactions(0)
                .averageTransaction(0.0)
                .totalCustomers(0)
                .totalEmployees(0)
                .employeeCollections(new ArrayList<>())
                .paymentMethodBreakdown(new ArrayList<>())
                .build();
    }

    @Override
    public WeeklyCollectionReportDTO getWeeklyReport(Long organizationId, LocalDate date) {
        LocalDate weekStart = date.minusDays(7);
        LocalDate weekEnd = date;

        return WeeklyCollectionReportDTO.builder()
                .weekStart(weekStart.format(DateTimeFormatter.ISO_LOCAL_DATE))
                .weekEnd(weekEnd.format(DateTimeFormatter.ISO_LOCAL_DATE))
                .totalCollection(0.0)
                .previousWeekCollection(0.0)
                .growthPercentage(0.0)
                .totalTransactions(0)
                .totalCustomers(0)
                .dailyBreakdown(new ArrayList<>())
                .build();
    }

    @Override
    public MonthlyCollectionReportDTO getMonthlyReport(Long organizationId, Integer month, Integer year) {
        return MonthlyCollectionReportDTO.builder()
                .month(month.toString())
                .year(year)
                .totalCollection(0.0)
                .previousMonthCollection(0.0)
                .growthPercentage(0.0)
                .totalTransactions(0)
                .totalCustomers(0)
                .totalEmployees(0)
                .averageDailyCollection(0.0)
                .collectionTarget(0.0)
                .targetAchievement(0.0)
                .weeklyBreakdown(new ArrayList<>())
                .build();
    }

    @Override
    public EmployeePerformanceReportDTO getEmployeePerformanceReport(Long organizationId, LocalDate startDate, LocalDate endDate) {
        return EmployeePerformanceReportDTO.builder()
                .reportDate(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .totalEmployees(0)
                .totalCollection(0.0)
                .employeePerformances(new ArrayList<>())
                .build();
    }

    @Override
    public OverdueLoanReportDTO getOverdueLoanReport(Long organizationId) {
        return OverdueLoanReportDTO.builder()
                .reportDate(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .totalOverdueLoans(0)
                .totalOverdueAmount(0.0)
                .totalCustomers(0)
                .overdueLoans(new ArrayList<>())
                .build();
    }

    @Override
    public CustomerLoanReportDTO getCustomerLoanReport(Long organizationId) {
        return CustomerLoanReportDTO.builder()
                .reportDate(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .totalCustomers(0)
                .totalLoanAmount(0.0)
                .totalReceived(0.0)
                .totalOutstanding(0.0)
                .customerLoans(new ArrayList<>())
                .build();
    }

    @Override
    public byte[] exportToExcel(String reportType, Long organizationId, LocalDate startDate, LocalDate endDate) {
        log.info("Exporting {} report to Excel", reportType);

        switch (reportType.toLowerCase()) {
            case "daily":
                DailyCollectionReportDTO dailyReport = getDailyReport(organizationId, startDate);
                return excelExportService.exportDailyReport(dailyReport);
            case "employee":
                EmployeePerformanceReportDTO empReport = getEmployeePerformanceReport(organizationId, startDate, endDate);
                return excelExportService.exportEmployeePerformanceReport(empReport);
            case "overdue":
                OverdueLoanReportDTO overdueReport = getOverdueLoanReport(organizationId);
                return excelExportService.exportOverdueLoanReport(overdueReport);
            case "customer":
                CustomerLoanReportDTO customerReport = getCustomerLoanReport(organizationId);
                return excelExportService.exportCustomerLoanReport(customerReport);
            default:
                throw new IllegalArgumentException("Unknown report type: " + reportType);
        }
    }

    @Override
    public byte[] exportToPDF(String reportType, Long organizationId, LocalDate startDate, LocalDate endDate) {
        log.info("Exporting {} report to PDF", reportType);

        switch (reportType.toLowerCase()) {
            case "daily":
                DailyCollectionReportDTO dailyReport = getDailyReport(organizationId, startDate);
                return pdfExportService.exportDailyReport(dailyReport);
            case "employee":
                EmployeePerformanceReportDTO empReport = getEmployeePerformanceReport(organizationId, startDate, endDate);
                return pdfExportService.exportEmployeePerformanceReport(empReport);
            case "overdue":
                OverdueLoanReportDTO overdueReport = getOverdueLoanReport(organizationId);
                return pdfExportService.exportOverdueLoanReport(overdueReport);
            case "customer":
                CustomerLoanReportDTO customerReport = getCustomerLoanReport(organizationId);
                return pdfExportService.exportCustomerLoanReport(customerReport);
            default:
                throw new IllegalArgumentException("Unknown report type: " + reportType);
        }
    }
}