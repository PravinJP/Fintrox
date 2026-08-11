package com.app.Fintrox.reports.service;


import com.app.Fintrox.reports.dto.*;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;

@Service
public class PDFExportService {

    public byte[] exportDailyReport(DailyCollectionReportDTO report) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Title
            Paragraph title = new Paragraph("Daily Collection Report")
                    .setFontSize(18)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(title);

            document.add(new Paragraph("Date: " + report.getReportDate()));

            // Summary
            document.add(new Paragraph("Total Collection: ₹" + report.getTotalCollection()));
            document.add(new Paragraph("Total Transactions: " + report.getTotalTransactions()));
            document.add(new Paragraph("Average Transaction: ₹" + report.getAverageTransaction()));

            document.add(new Paragraph("\n"));

            // Employee Collection Table
            Table table = new Table(4);
            table.addHeaderCell(createHeaderCell("Employee"));
            table.addHeaderCell(createHeaderCell("Amount"));
            table.addHeaderCell(createHeaderCell("Customers"));
            table.addHeaderCell(createHeaderCell("Achievement"));

            for (DailyCollectionReportDTO.EmployeeCollectionDTO emp : report.getEmployeeCollections()) {
                table.addCell(emp.getEmployeeName());
                table.addCell("₹" + emp.getCollectionAmount());
                table.addCell(String.valueOf(emp.getCustomerCount()));
                table.addCell(emp.getTargetAchievement() + "%");
            }

            document.add(table);

            // Footer
            document.add(new Paragraph("\nReport generated on: " + LocalDate.now()));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create PDF report", e);
        }
    }

    public byte[] exportEmployeePerformanceReport(EmployeePerformanceReportDTO report) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            Paragraph title = new Paragraph("Employee Performance Report")
                    .setFontSize(18)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(title);

            document.add(new Paragraph("Report Date: " + report.getReportDate()));
            document.add(new Paragraph("Total Employees: " + report.getTotalEmployees()));
            document.add(new Paragraph("Total Collection: ₹" + report.getTotalCollection()));

            document.add(new Paragraph("\n"));

            Table table = new Table(5);
            table.addHeaderCell(createHeaderCell("Employee"));
            table.addHeaderCell(createHeaderCell("Today"));
            table.addHeaderCell(createHeaderCell("Weekly"));
            table.addHeaderCell(createHeaderCell("Monthly"));
            table.addHeaderCell(createHeaderCell("Achievement"));

            for (EmployeePerformanceReportDTO.EmployeePerformanceDTO emp : report.getEmployeePerformances()) {
                table.addCell(emp.getEmployeeName());
                table.addCell("₹" + emp.getTodayCollection());
                table.addCell("₹" + emp.getWeeklyCollection());
                table.addCell("₹" + emp.getMonthlyCollection());
                table.addCell(emp.getTargetAchievement() + "%");
            }

            document.add(table);

            document.add(new Paragraph("\nReport generated on: " + LocalDate.now()));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create PDF report", e);
        }
    }

    public byte[] exportOverdueLoanReport(OverdueLoanReportDTO report) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            Paragraph title = new Paragraph("Overdue Loans Report")
                    .setFontSize(18)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(title);

            document.add(new Paragraph("Report Date: " + report.getReportDate()));
            document.add(new Paragraph("Total Overdue Loans: " + report.getTotalOverdueLoans()));
            document.add(new Paragraph("Total Overdue Amount: ₹" + report.getTotalOverdueAmount()));

            document.add(new Paragraph("\n"));

            Table table = new Table(5);
            table.addHeaderCell(createHeaderCell("Customer"));
            table.addHeaderCell(createHeaderCell("Amount"));
            table.addHeaderCell(createHeaderCell("Days Overdue"));
            table.addHeaderCell(createHeaderCell("Employee"));
            table.addHeaderCell(createHeaderCell("Status"));

            for (OverdueLoanReportDTO.OverdueLoanDTO loan : report.getOverdueLoans()) {
                table.addCell(loan.getCustomerName());
                table.addCell("₹" + loan.getOverdueAmount());
                table.addCell(String.valueOf(loan.getDaysOverdue()));
                table.addCell(loan.getAssignedEmployee());
                table.addCell(loan.getStatus());
            }

            document.add(table);

            document.add(new Paragraph("\nReport generated on: " + LocalDate.now()));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create PDF report", e);
        }
    }

    public byte[] exportCustomerLoanReport(CustomerLoanReportDTO report) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            Paragraph title = new Paragraph("Customer Loan Report")
                    .setFontSize(18)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(title);

            document.add(new Paragraph("Report Date: " + report.getReportDate()));
            document.add(new Paragraph("Total Customers: " + report.getTotalCustomers()));
            document.add(new Paragraph("Total Loan Amount: ₹" + report.getTotalLoanAmount()));
            document.add(new Paragraph("Total Outstanding: ₹" + report.getTotalOutstanding()));

            document.add(new Paragraph("\n"));

            Table table = new Table(5);
            table.addHeaderCell(createHeaderCell("Customer"));
            table.addHeaderCell(createHeaderCell("Total Loans"));
            table.addHeaderCell(createHeaderCell("Total Amount"));
            table.addHeaderCell(createHeaderCell("Outstanding"));
            table.addHeaderCell(createHeaderCell("Status"));

            for (CustomerLoanReportDTO.CustomerLoanDTO customer : report.getCustomerLoans()) {
                table.addCell(customer.getCustomerName());
                table.addCell(String.valueOf(customer.getTotalLoans()));
                table.addCell("₹" + customer.getTotalLoanAmount());
                table.addCell("₹" + customer.getOutstandingBalance());
                table.addCell(customer.getLoanStatus());
            }

            document.add(table);

            document.add(new Paragraph("\nReport generated on: " + LocalDate.now()));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create PDF report", e);
        }
    }

    private Cell createHeaderCell(String text) {
        Cell cell = new Cell();
        cell.add(new Paragraph(text).setBold());
        cell.setBackgroundColor(ColorConstants.LIGHT_GRAY);
        return cell;
    }
}
