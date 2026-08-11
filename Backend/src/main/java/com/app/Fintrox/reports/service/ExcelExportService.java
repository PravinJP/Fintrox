package com.app.Fintrox.reports.service;



import com.app.Fintrox.reports.dto.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExcelExportService {

    public byte[] exportDailyReport(DailyCollectionReportDTO report) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Daily Collection Report");

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Date", "Employee", "Amount", "Customers", "Transactions", "Target Achievement"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(createHeaderStyle(workbook));
            }

            // Create data rows
            int rowNum = 1;
            for (DailyCollectionReportDTO.EmployeeCollectionDTO emp : report.getEmployeeCollections()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(report.getReportDate());
                row.createCell(1).setCellValue(emp.getEmployeeName());
                row.createCell(2).setCellValue(emp.getCollectionAmount());
                row.createCell(3).setCellValue(emp.getCustomerCount());
                row.createCell(4).setCellValue(emp.getTransactionCount());
                row.createCell(5).setCellValue(emp.getTargetAchievement());
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create Excel report", e);
        }
    }

    public byte[] exportEmployeePerformanceReport(EmployeePerformanceReportDTO report) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Employee Performance Report");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"Employee", "Role", "Today", "Weekly", "Monthly", "Target", "Achievement", "Customers Visited", "Rating"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(createHeaderStyle(workbook));
            }

            int rowNum = 1;
            for (EmployeePerformanceReportDTO.EmployeePerformanceDTO emp : report.getEmployeePerformances()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(emp.getEmployeeName());
                row.createCell(1).setCellValue(emp.getRole());
                row.createCell(2).setCellValue(emp.getTodayCollection());
                row.createCell(3).setCellValue(emp.getWeeklyCollection());
                row.createCell(4).setCellValue(emp.getMonthlyCollection());
                row.createCell(5).setCellValue(emp.getMonthlyTarget());
                row.createCell(6).setCellValue(emp.getTargetAchievement());
                row.createCell(7).setCellValue(emp.getCustomersVisited());
                row.createCell(8).setCellValue(emp.getPerformanceRating());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create Excel report", e);
        }
    }

    public byte[] exportOverdueLoanReport(OverdueLoanReportDTO report) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Overdue Loans Report");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"Loan Number", "Customer", "Phone", "Overdue Amount", "Days Overdue", "Employee", "Status"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(createHeaderStyle(workbook));
            }

            int rowNum = 1;
            for (OverdueLoanReportDTO.OverdueLoanDTO loan : report.getOverdueLoans()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(loan.getLoanNumber());
                row.createCell(1).setCellValue(loan.getCustomerName());
                row.createCell(2).setCellValue(loan.getCustomerPhone());
                row.createCell(3).setCellValue(loan.getOverdueAmount());
                row.createCell(4).setCellValue(loan.getDaysOverdue());
                row.createCell(5).setCellValue(loan.getAssignedEmployee());
                row.createCell(6).setCellValue(loan.getStatus());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create Excel report", e);
        }
    }

    public byte[] exportCustomerLoanReport(CustomerLoanReportDTO report) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Customer Loan Report");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"Customer", "Phone", "Total Loans", "Total Amount", "Paid", "Outstanding", "Status"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(createHeaderStyle(workbook));
            }

            int rowNum = 1;
            for (CustomerLoanReportDTO.CustomerLoanDTO customer : report.getCustomerLoans()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(customer.getCustomerName());
                row.createCell(1).setCellValue(customer.getPhone());
                row.createCell(2).setCellValue(customer.getTotalLoans());
                row.createCell(3).setCellValue(customer.getTotalLoanAmount());
                row.createCell(4).setCellValue(customer.getTotalPaid());
                row.createCell(5).setCellValue(customer.getOutstandingBalance());
                row.createCell(6).setCellValue(customer.getLoanStatus());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create Excel report", e);
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }
}
