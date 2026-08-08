package com.app.Fintrox.reports.controller;

import com.app.Fintrox.reports.dto.*;
import com.app.Fintrox.reports.service.ReportService;
import com.app.Fintrox.common.responses.ApiResponse;
import com.app.Fintrox.common.exceptions.BadRequestException;
import com.app.Fintrox.common.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/daily")
    public ResponseEntity<ApiResponse<DailyCollectionReportDTO>> getDailyReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Long organizationId = getCurrentOrganizationId();
        log.info("Get daily report for date: {}", date);
        DailyCollectionReportDTO report = reportService.getDailyReport(organizationId, date);
        return ResponseEntity.ok(ApiResponse.success("Daily report fetched", report));
    }

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<WeeklyCollectionReportDTO>> getWeeklyReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Long organizationId = getCurrentOrganizationId();
        log.info("Get weekly report for date: {}", date);
        WeeklyCollectionReportDTO report = reportService.getWeeklyReport(organizationId, date);
        return ResponseEntity.ok(ApiResponse.success("Weekly report fetched", report));
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<MonthlyCollectionReportDTO>> getMonthlyReport(
            @RequestParam Integer month,
            @RequestParam Integer year) {
        Long organizationId = getCurrentOrganizationId();
        log.info("Get monthly report for {}/{}", month, year);
        MonthlyCollectionReportDTO report = reportService.getMonthlyReport(organizationId, month, year);
        return ResponseEntity.ok(ApiResponse.success("Monthly report fetched", report));
    }

    @GetMapping("/employee-performance")
    public ResponseEntity<ApiResponse<EmployeePerformanceReportDTO>> getEmployeePerformanceReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long organizationId = getCurrentOrganizationId();
        log.info("Get employee performance report from {} to {}", startDate, endDate);
        EmployeePerformanceReportDTO report = reportService.getEmployeePerformanceReport(organizationId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Employee performance report fetched", report));
    }

    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<OverdueLoanReportDTO>> getOverdueLoanReport() {
        Long organizationId = getCurrentOrganizationId();
        log.info("Get overdue loan report");
        OverdueLoanReportDTO report = reportService.getOverdueLoanReport(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Overdue loan report fetched", report));
    }

    @GetMapping("/customer-loans")
    public ResponseEntity<ApiResponse<CustomerLoanReportDTO>> getCustomerLoanReport() {
        Long organizationId = getCurrentOrganizationId();
        log.info("Get customer loan report");
        CustomerLoanReportDTO report = reportService.getCustomerLoanReport(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Customer loan report fetched", report));
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportToExcel(
            @RequestParam String reportType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long organizationId = getCurrentOrganizationId();
        log.info("Export {} report to Excel", reportType);
        byte[] file = reportService.exportToExcel(reportType, organizationId, startDate, endDate);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "report.xlsx");

        return ResponseEntity.ok().headers(headers).body(file);
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportToPDF(
            @RequestParam String reportType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long organizationId = getCurrentOrganizationId();
        log.info("Export {} report to PDF", reportType);
        byte[] file = reportService.exportToPDF(reportType, organizationId, startDate, endDate);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "report.pdf");

        return ResponseEntity.ok().headers(headers).body(file);
    }

    private Long getCurrentOrganizationId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof com.app.Fintrox.Auth.entity.User) {
            Long orgId = ((com.app.Fintrox.Auth.entity.User) principal).getOrganizationId();
            if (orgId == null) {
                throw new BadRequestException("User does not belong to any organization");
            }
            return orgId;
        }
        throw new UnauthorizedException("User not properly authenticated");
    }
}
