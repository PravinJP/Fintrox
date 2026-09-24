package com.app.Fintrox.reports.service;

import com.app.Fintrox.collection.repository.CollectionRepository;
import com.app.Fintrox.customer.entity.Customer;
import com.app.Fintrox.customer.repository.CustomerRepository;
import com.app.Fintrox.employee.entity.Employee;
import com.app.Fintrox.employee.repository.EmployeeRepository;
import com.app.Fintrox.loan.entity.Loan;
import com.app.Fintrox.loan.repository.LoanRepository;
import com.app.Fintrox.loan.repository.InstallmentRepository;
import com.app.Fintrox.reports.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

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
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);

        Double totalCollection = collectionRepository.sumCollectionsBetween(organizationId, start, end);
        Long totalTransactions = collectionRepository.countCollectionsBetween(organizationId, start, end);
        Long totalCustomers = collectionRepository.countDistinctCustomersBetween(organizationId, start, end);
        Long totalEmployees = collectionRepository.countDistinctEmployeesBetween(organizationId, start, end);

        Double averageTransaction = totalTransactions > 0 ? totalCollection / totalTransactions : 0.0;

        List<Object[]> empData = collectionRepository.sumByEmployeeBetween(organizationId, start, end);
        List<DailyCollectionReportDTO.EmployeeCollectionDTO> employeeCollections = new ArrayList<>();
        for (Object[] row : empData) {
            Long employeeId = (Long) row[0];
            Double amount = ((Number) row[1]).doubleValue();
            Long customerCount = ((Number) row[2]).longValue();
            Long txnCount = ((Number) row[3]).longValue();

            Employee emp = employeeRepository.findById(employeeId).orElse(null);
            Double targetAchievement = 0.0;
            if (emp != null && emp.getDailyTarget() != null && emp.getDailyTarget().doubleValue() > 0) {
                targetAchievement = (amount / emp.getDailyTarget().doubleValue()) * 100;
            }

            employeeCollections.add(DailyCollectionReportDTO.EmployeeCollectionDTO.builder()
                    .employeeId(employeeId)
                    .employeeName(emp != null ? emp.getFullName() : "Unknown")
                    .collectionAmount(amount)
                    .customerCount(customerCount.intValue())
                    .transactionCount(txnCount.intValue())
                    .targetAchievement(targetAchievement)
                    .build());
        }

        List<Object[]> pmData = collectionRepository.sumByPaymentMethodBetween(organizationId, start, end);
        List<DailyCollectionReportDTO.PaymentMethodDTO> paymentBreakdown = new ArrayList<>();
        for (Object[] row : pmData) {
            String method = (String) row[0];
            Double amount = ((Number) row[1]).doubleValue();
            Long count = ((Number) row[2]).longValue();
            Double percentage = totalCollection > 0 ? (amount / totalCollection) * 100 : 0.0;

            paymentBreakdown.add(DailyCollectionReportDTO.PaymentMethodDTO.builder()
                    .paymentMethod(method)
                    .amount(amount)
                    .count(count.intValue())
                    .percentage(percentage)
                    .build());
        }

        return DailyCollectionReportDTO.builder()
                .reportDate(date.format(DateTimeFormatter.ISO_LOCAL_DATE))
                .totalCollection(totalCollection)
                .totalTransactions(totalTransactions.intValue())
                .averageTransaction(averageTransaction)
                .totalCustomers(totalCustomers.intValue())
                .totalEmployees(totalEmployees.intValue())
                .employeeCollections(employeeCollections)
                .paymentMethodBreakdown(paymentBreakdown)
                .build();
    }

    @Override
    public WeeklyCollectionReportDTO getWeeklyReport(Long organizationId, LocalDate date) {
        LocalDate weekStart = date.minusDays(6);
        LocalDate weekEnd = date;
        LocalDate prevWeekStart = weekStart.minusDays(7);
        LocalDate prevWeekEnd = weekStart.minusDays(1);

        LocalDateTime start = weekStart.atStartOfDay();
        LocalDateTime end = weekEnd.atTime(LocalTime.MAX);
        LocalDateTime prevStart = prevWeekStart.atStartOfDay();
        LocalDateTime prevEnd = prevWeekEnd.atTime(LocalTime.MAX);

        Double totalCollection = collectionRepository.sumCollectionsBetween(organizationId, start, end);
        Double previousWeekCollection = collectionRepository.sumCollectionsBetween(organizationId, prevStart, prevEnd);
        Long totalTransactions = collectionRepository.countCollectionsBetween(organizationId, start, end);
        Long totalCustomers = collectionRepository.countDistinctCustomersBetween(organizationId, start, end);

        Double growthPercentage = previousWeekCollection > 0
                ? ((totalCollection - previousWeekCollection) / previousWeekCollection) * 100
                : 0.0;

        List<Object[]> dailyData = collectionRepository.getDailyBreakdown(organizationId, start, end);
        List<WeeklyCollectionReportDTO.DailyBreakdownDTO> dailyBreakdown = new ArrayList<>();
        for (Object[] row : dailyData) {
            dailyBreakdown.add(WeeklyCollectionReportDTO.DailyBreakdownDTO.builder()
                    .date(row[0].toString())
                    .collectionAmount(((Number) row[1]).doubleValue())
                    .transactionCount(((Number) row[2]).intValue())
                    .customerCount(((Number) row[3]).intValue())
                    .build());
        }

        return WeeklyCollectionReportDTO.builder()
                .weekStart(weekStart.format(DateTimeFormatter.ISO_LOCAL_DATE))
                .weekEnd(weekEnd.format(DateTimeFormatter.ISO_LOCAL_DATE))
                .totalCollection(totalCollection)
                .previousWeekCollection(previousWeekCollection)
                .growthPercentage(growthPercentage)
                .totalTransactions(totalTransactions.intValue())
                .totalCustomers(totalCustomers.intValue())
                .dailyBreakdown(dailyBreakdown)
                .build();
    }

    @Override
    public MonthlyCollectionReportDTO getMonthlyReport(Long organizationId, Integer month, Integer year) {
        LocalDate monthStart = LocalDate.of(year, month, 1);
        LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());

        LocalDate prevMonthStart = monthStart.minusMonths(1);
        LocalDate prevMonthEnd = prevMonthStart.withDayOfMonth(prevMonthStart.lengthOfMonth());

        LocalDateTime start = monthStart.atStartOfDay();
        LocalDateTime end = monthEnd.atTime(LocalTime.MAX);
        LocalDateTime prevStart = prevMonthStart.atStartOfDay();
        LocalDateTime prevEnd = prevMonthEnd.atTime(LocalTime.MAX);

        Double totalCollection = collectionRepository.sumCollectionsBetween(organizationId, start, end);
        Double previousMonthCollection = collectionRepository.sumCollectionsBetween(organizationId, prevStart, prevEnd);
        Long totalTransactions = collectionRepository.countCollectionsBetween(organizationId, start, end);
        Long totalCustomers = collectionRepository.countDistinctCustomersBetween(organizationId, start, end);
        Long totalEmployees = collectionRepository.countDistinctEmployeesBetween(organizationId, start, end);

        Double growthPercentage = previousMonthCollection > 0
                ? ((totalCollection - previousMonthCollection) / previousMonthCollection) * 100
                : 0.0;

        Double averageDailyCollection = totalCollection / monthStart.lengthOfMonth();

        Double collectionTarget = employeeRepository.findAll().stream()
                .filter(e -> e.getOrganizationId().equals(organizationId))
                .mapToDouble(e -> e.getMonthlyTarget() != null ? e.getMonthlyTarget().doubleValue() : 0.0)

                .sum();

        Double targetAchievement = collectionTarget > 0
                ? (totalCollection / collectionTarget) * 100
                : 0.0;

        List<Object[]> weeklyData = collectionRepository.getWeeklyBreakdown(organizationId, start, end);
        List<MonthlyCollectionReportDTO.WeeklyBreakdownDTO> weeklyBreakdown = new ArrayList<>();
        for (Object[] row : weeklyData) {
            weeklyBreakdown.add(MonthlyCollectionReportDTO.WeeklyBreakdownDTO.builder()
                    .week("Week " + row[0].toString())
                    .collectionAmount(((Number) row[1]).doubleValue())
                    .transactionCount(((Number) row[2]).intValue())
                    .build());
        }

        return MonthlyCollectionReportDTO.builder()
                .month(monthStart.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH))
                .year(year)
                .totalCollection(totalCollection)
                .previousMonthCollection(previousMonthCollection)
                .growthPercentage(growthPercentage)
                .totalTransactions(totalTransactions.intValue())
                .totalCustomers(totalCustomers.intValue())
                .totalEmployees(totalEmployees.intValue())
                .averageDailyCollection(averageDailyCollection)
                .collectionTarget(collectionTarget)
                .targetAchievement(targetAchievement)
                .weeklyBreakdown(weeklyBreakdown)
                .build();
    }

    @Override
    public EmployeePerformanceReportDTO getEmployeePerformanceReport(Long organizationId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        Double totalCollection = collectionRepository.sumCollectionsBetween(organizationId, start, end);

        List<Employee> employees = employeeRepository.findAll().stream()
                .filter(e -> e.getOrganizationId().equals(organizationId))
                .collect(Collectors.toList());

        List<EmployeePerformanceReportDTO.EmployeePerformanceDTO> performances = new ArrayList<>();

        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(LocalTime.MAX);
        LocalDateTime weekStart = today.minusDays(6).atStartOfDay();
        LocalDateTime monthStart = today.withDayOfMonth(1).atStartOfDay();

        for (Employee emp : employees) {
            Double todayCollection = collectionRepository.sumCollectionsByEmployeeBetween(
                    organizationId, emp.getId(), todayStart, todayEnd);
            Double weeklyCollection = collectionRepository.sumCollectionsByEmployeeBetween(
                    organizationId, emp.getId(), weekStart, todayEnd);
            Double monthlyCollection = collectionRepository.sumCollectionsByEmployeeBetween(
                    organizationId, emp.getId(), monthStart, todayEnd);

            Double monthlyTarget = emp.getMonthlyTarget() != null
                    ? emp.getMonthlyTarget().doubleValue()
                    : 0.0;
            Double targetAchievement = monthlyTarget > 0
                    ? (monthlyCollection / monthlyTarget) * 100
                    : 0.0;

            String rating = targetAchievement >= 100 ? "EXCELLENT"
                    : targetAchievement >= 75 ? "GOOD"
                    : targetAchievement >= 50 ? "AVERAGE"
                    : "POOR";

            performances.add(EmployeePerformanceReportDTO.EmployeePerformanceDTO.builder()
                    .employeeId(emp.getId())
                    .employeeName(emp.getFullName())
                    .role(emp.getRole().name())
                    .routeName(null)
                    .todayCollection(todayCollection)
                    .weeklyCollection(weeklyCollection)
                    .monthlyCollection(monthlyCollection)
                    .monthlyTarget(monthlyTarget)
                    .targetAchievement(targetAchievement)
                    .customersAssigned(0)
                    .customersVisited(0)
                    .overdueCustomers(0)
                    .collectionEfficiency(targetAchievement)
                    .performanceRating(rating)
                    .build());
        }

        return EmployeePerformanceReportDTO.builder()
                .reportDate(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .totalEmployees(employees.size())
                .totalCollection(totalCollection)
                .employeePerformances(performances)
                .build();
    }

    @Override
    public OverdueLoanReportDTO getOverdueLoanReport(Long organizationId) {
        List<Loan> overdueLoans = loanRepository.findAll().stream()
                .filter(l -> l.getOrganizationId().equals(organizationId))
                .filter(l -> "OVERDUE".equals(l.getStatus()))
                .collect(Collectors.toList());

        Double totalOverdueAmount = overdueLoans.stream()
                .mapToDouble(l -> l.getOutstandingBalance() != null ? l.getOutstandingBalance() : 0.0)
                .sum();

        List<OverdueLoanReportDTO.OverdueLoanDTO> loanDTOs = new ArrayList<>();
        for (Loan loan : overdueLoans) {
            Customer customer = customerRepository.findById(loan.getCustomerId()).orElse(null);
            Long daysOverdue = 0L;
            if (loan.getNextDueDate() != null) {
                daysOverdue = (long) (LocalDate.now().toEpochDay() - loan.getNextDueDate().toEpochDay());
            }

            loanDTOs.add(OverdueLoanReportDTO.OverdueLoanDTO.builder()
                    .loanId(loan.getId())
                    .loanNumber(loan.getLoanNumber())
                    .customerName(customer != null ? customer.getFullName() : "Unknown")
                    .customerPhone(customer != null ? customer.getPhone() : "")
                    .overdueAmount(loan.getOutstandingBalance())
                    .daysOverdue(daysOverdue.intValue())
                    .assignedEmployee(null)
                    .status(loan.getStatus())
                    .build());
        }

        return OverdueLoanReportDTO.builder()
                .reportDate(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .totalOverdueLoans(overdueLoans.size())
                .totalOverdueAmount(totalOverdueAmount)
                .totalCustomers(loanDTOs.size())
                .overdueLoans(loanDTOs)
                .build();
    }

    @Override
    public CustomerLoanReportDTO getCustomerLoanReport(Long organizationId) {
        List<Customer> customers = customerRepository.findByOrganizationId(organizationId);

        Double totalLoanAmount = customers.stream()
                .mapToDouble(c -> c.getTotalLoanAmountGiven() != null ? c.getTotalLoanAmountGiven() : 0.0)
                .sum();

        Double totalReceived = customers.stream()
                .mapToDouble(c -> c.getTotalAmountReceived() != null ? c.getTotalAmountReceived() : 0.0)
                .sum();

        Double totalOutstanding = customers.stream()
                .mapToDouble(c -> c.getOutstandingBalance() != null ? c.getOutstandingBalance() : 0.0)
                .sum();

        List<CustomerLoanReportDTO.CustomerLoanDTO> customerLoans = new ArrayList<>();
        for (Customer c : customers) {
            customerLoans.add(CustomerLoanReportDTO.CustomerLoanDTO.builder()
                    .customerId(c.getId())
                    .customerName(c.getFullName())
                    .phone(c.getPhone())
                    .address(c.getAddress())
                    .totalLoans(c.getTotalLoansTaken() != null ? c.getTotalLoansTaken() : 0)
                    .totalLoanAmount(c.getTotalLoanAmountGiven())
                    .totalPaid(c.getTotalAmountReceived())
                    .outstandingBalance(c.getOutstandingBalance())
                    .loanStatus(c.getActiveLoansCount() > 0 ? "ACTIVE" : "CLOSED")
                    .assignedEmployee(null)
                    .routeName(null)
                    .build());
        }

        return CustomerLoanReportDTO.builder()
                .reportDate(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .totalCustomers(customers.size())
                .totalLoanAmount(totalLoanAmount)
                .totalReceived(totalReceived)
                .totalOutstanding(totalOutstanding)
                .customerLoans(customerLoans)
                .build();
    }

    @Override
    public byte[] exportToExcel(String reportType, Long organizationId, LocalDate startDate, LocalDate endDate) {
        log.info("Exporting {} report to Excel", reportType);
        switch (reportType.toLowerCase()) {
            case "daily":
                return excelExportService.exportDailyReport(getDailyReport(organizationId, startDate));
            case "employee":
                return excelExportService.exportEmployeePerformanceReport(getEmployeePerformanceReport(organizationId, startDate, endDate));
            case "overdue":
                return excelExportService.exportOverdueLoanReport(getOverdueLoanReport(organizationId));
            case "customer":
                return excelExportService.exportCustomerLoanReport(getCustomerLoanReport(organizationId));
            default:
                throw new IllegalArgumentException("Unknown report type: " + reportType);
        }
    }

    @Override
    public byte[] exportToPDF(String reportType, Long organizationId, LocalDate startDate, LocalDate endDate) {
        log.info("Exporting {} report to PDF", reportType);
        switch (reportType.toLowerCase()) {
            case "daily":
                return pdfExportService.exportDailyReport(getDailyReport(organizationId, startDate));
            case "employee":
                return pdfExportService.exportEmployeePerformanceReport(getEmployeePerformanceReport(organizationId, startDate, endDate));
            case "overdue":
                return pdfExportService.exportOverdueLoanReport(getOverdueLoanReport(organizationId));
            case "customer":
                return pdfExportService.exportCustomerLoanReport(getCustomerLoanReport(organizationId));
            default:
                throw new IllegalArgumentException("Unknown report type: " + reportType);
        }
    }
}