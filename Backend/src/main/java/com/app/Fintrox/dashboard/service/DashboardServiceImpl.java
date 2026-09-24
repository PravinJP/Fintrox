package com.app.Fintrox.dashboard.service;

import com.app.Fintrox.collection.entity.Collection;
import com.app.Fintrox.collection.repository.CollectionRepository;
import com.app.Fintrox.customer.entity.Customer;
import com.app.Fintrox.customer.repository.CustomerRepository;
import com.app.Fintrox.dashboard.dto.EmployeeDashboardResponse;
import com.app.Fintrox.dashboard.dto.LenderDashboardResponse;
import com.app.Fintrox.dashboard.dto.OwnerDashboardResponse;
import com.app.Fintrox.employee.entity.Employee;
import com.app.Fintrox.employee.repository.EmployeeRepository;
import com.app.Fintrox.loan.entity.Loan;
import com.app.Fintrox.loan.repository.LoanRepository;
import com.app.Fintrox.loan.repository.InstallmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final CollectionRepository collectionRepository;
    private final LoanRepository loanRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final InstallmentRepository installmentRepository;

    @Cacheable(value = "dashboard", key = "'dashboard_' + #organizationId")
    @Override
    public OwnerDashboardResponse getOwnerDashboard(Long organizationId) {
        log.info("=== CACHE MISS - Fetching from Database ===");

        try {
            LocalDate today = LocalDate.now();
            LocalDateTime todayStart = today.atStartOfDay();
            LocalDateTime todayEnd = today.atTime(LocalTime.MAX);
            LocalDateTime weekStart = today.minusDays(6).atStartOfDay();
            LocalDateTime monthStart = today.withDayOfMonth(1).atStartOfDay();

            Double todayCollection = collectionRepository.sumCollectionsBetween(organizationId, todayStart, todayEnd);
            List<Collection> todayCollections = collectionRepository.findTodayCollections(organizationId);

            Double weeklyCollection = collectionRepository.sumCollectionsBetween(organizationId, weekStart, todayEnd);
            Double monthlyCollection = collectionRepository.sumCollectionsBetween(organizationId, monthStart, todayEnd);

            Double totalOutstanding = loanRepository.getTotalOutstandingBalance(organizationId);
            Long activeLoansCount = loanRepository.countByOrganizationIdAndStatus(organizationId, "ACTIVE");
            Long totalEmployees = employeeRepository.countByOrganizationId(organizationId);
            Long totalCustomers = customerRepository.countByOrganizationId(organizationId);

            Double overdueAmount = loanRepository.getTotalOverdueAmount(organizationId);
            List<Loan> overdueLoans = loanRepository.findOverdueLoans(organizationId);
            List<OwnerDashboardResponse.OverdueLoanDTO> overdueLoanDTOs = new ArrayList<>();
            for (Loan loan : overdueLoans) {
                Customer customer = customerRepository.findById(loan.getCustomerId()).orElse(null);
                Long daysOverdue = 0L;
                if (loan.getNextDueDate() != null) {
                    daysOverdue = (long) (LocalDate.now().toEpochDay() - loan.getNextDueDate().toEpochDay());
                }
                overdueLoanDTOs.add(OwnerDashboardResponse.OverdueLoanDTO.builder()
                        .loanId(loan.getId())
                        .loanNumber(loan.getLoanNumber())
                        .customerName(customer != null ? customer.getFullName() : "Unknown")
                        .overdueAmount(loan.getOutstandingBalance())
                        .daysOverdue(daysOverdue.intValue())
                        .assignedEmployee(null)
                        .build());
            }

            // Top performers
            List<Object[]> topData = collectionRepository.findTopPerformers(organizationId, monthStart, todayEnd);
            List<OwnerDashboardResponse.EmployeePerformanceDTO> topPerformers = new ArrayList<>();
            int limit = Math.min(topData.size(), 5);
            for (int i = 0; i < limit; i++) {
                Object[] row = topData.get(i);
                Long empId = ((Number) row[0]).longValue();
                Double amount = ((Number) row[1]).doubleValue();
                Employee emp = employeeRepository.findById(empId).orElse(null);
                if (emp != null) {
                    topPerformers.add(OwnerDashboardResponse.EmployeePerformanceDTO.builder()
                            .employeeId(empId)
                            .employeeName(emp.getFullName())
                            .todayCollection(0.0)
                            .weeklyCollection(0.0)
                            .monthlyCollection(amount)
                            .targetAchievementPercentage(
                                    emp.getMonthlyTarget() != null && emp.getMonthlyTarget().doubleValue() > 0
                                            ? (amount / emp.getMonthlyTarget().doubleValue()) * 100
                                            : 0.0
                            )
                            .customersVisited(0)
                            .build());
                }
            }

            // Recent activities
            List<Collection> recentCollections = collectionRepository.findRecentCollectionsByOrg(organizationId);
            List<OwnerDashboardResponse.RecentActivityDTO> recentActivities = new ArrayList<>();
            int actLimit = Math.min(recentCollections.size(), 10);
            for (int i = 0; i < actLimit; i++) {
                Collection c = recentCollections.get(i);
                Customer customer = customerRepository.findById(c.getCustomerId()).orElse(null);
                recentActivities.add(OwnerDashboardResponse.RecentActivityDTO.builder()
                        .type("COLLECTION")
                        .message("Collection of ₹" + c.getAmount() + " from " +
                                (customer != null ? customer.getFullName() : "Unknown"))
                        .timestamp(c.getCreatedAt() != null ? c.getCreatedAt().toString() : "")
                        .build());
            }

            // Weekly trend
            List<OwnerDashboardResponse.DailyCollectionDTO> weeklyTrend = new ArrayList<>();
            for (int i = 6; i >= 0; i--) {
                LocalDate d = today.minusDays(i);
                Double dayAmount = collectionRepository.sumCollectionsBetween(
                        organizationId,
                        d.atStartOfDay(),
                        d.atTime(LocalTime.MAX)
                );
                weeklyTrend.add(OwnerDashboardResponse.DailyCollectionDTO.builder()
                        .date(d.toString())
                        .amount(dayAmount != null ? dayAmount : 0.0)
                        .build());
            }

            return OwnerDashboardResponse.builder()
                    .todayCollection(todayCollection != null ? todayCollection : 0.0)
                    .todayCollectionCount(todayCollections.size())
                    .weeklyCollection(weeklyCollection != null ? weeklyCollection : 0.0)
                    .monthlyCollection(monthlyCollection != null ? monthlyCollection : 0.0)
                    .totalOutstanding(totalOutstanding != null ? totalOutstanding : 0.0)
                    .activeLoansCount(activeLoansCount != null ? activeLoansCount.intValue() : 0)
                    .totalEmployees(totalEmployees != null ? totalEmployees.intValue() : 0)
                    .totalCustomers(totalCustomers != null ? totalCustomers.intValue() : 0)
                    .overdueLoansCount(overdueLoans.size())
                    .overdueAmount(overdueAmount != null ? overdueAmount : 0.0)
                    .overdueLoans(overdueLoanDTOs)
                    .topPerformers(topPerformers)
                    .recentActivities(recentActivities)
                    .weeklyTrend(weeklyTrend)
                    .build();

        } catch (Exception e) {
            log.error("Error fetching owner dashboard: {}", e.getMessage(), e);
            return getEmptyOwnerDashboard();
        }
    }

    @Override
    public EmployeeDashboardResponse getEmployeeDashboard(Long employeeId, Long organizationId) {
        log.info("Fetching employee dashboard for employee: {}", employeeId);

        try {
            LocalDate today = LocalDate.now();
            LocalDateTime todayStart = today.atStartOfDay();
            LocalDateTime todayEnd = today.atTime(LocalTime.MAX);
            LocalDateTime weekStart = today.minusDays(6).atStartOfDay();
            LocalDateTime monthStart = today.withDayOfMonth(1).atStartOfDay();

            Employee employee = employeeRepository.findById(employeeId).orElse(null);

            Double todayCollection = collectionRepository.sumCollectionsByEmployeeBetween(
                    organizationId, employeeId, todayStart, todayEnd);
            Double weeklyCollection = collectionRepository.sumCollectionsByEmployeeBetween(
                    organizationId, employeeId, weekStart, todayEnd);
            Double monthlyCollection = collectionRepository.sumCollectionsByEmployeeBetween(
                    organizationId, employeeId, monthStart, todayEnd);

            List<Customer> assignedCustomers = customerRepository.findByAssignedEmployeeId(employeeId);

            Double monthlyTarget = employee != null && employee.getMonthlyTarget() != null
                    ? employee.getMonthlyTarget().doubleValue()
                    : 0.0;
            Double targetAchievement = monthlyTarget > 0
                    ? (monthlyCollection / monthlyTarget) * 100
                    : 0.0;

            return EmployeeDashboardResponse.builder()
                    .todayCollection(todayCollection != null ? todayCollection : 0.0)
                    .todayVisits(0)
                    .weeklyCollection(weeklyCollection != null ? weeklyCollection : 0.0)
                    .monthlyCollection(monthlyCollection != null ? monthlyCollection : 0.0)
                    .monthlyTarget(monthlyTarget)
                    .targetAchievementPercentage(targetAchievement)
                    .assignedCustomers(assignedCustomers.size())
                    .visitedCustomers(0)
                    .pendingCustomers(assignedCustomers.size())
                    .routeId(employee != null ? employee.getRouteId() : null)
                    .routeName(null)
                    .todayCustomers(new ArrayList<>())
                    .recentCollections(new ArrayList<>())
                    .overdueCustomers(new ArrayList<>())
                    .build();

        } catch (Exception e) {
            log.error("Error fetching employee dashboard: {}", e.getMessage(), e);
            return getEmptyEmployeeDashboard();
        }
    }

    @Override
    public LenderDashboardResponse getLenderDashboard(Long organizationId) {
        log.info("Fetching lender dashboard for organization: {}", organizationId);

        try {
            Long totalCustomers = customerRepository.countByOrganizationId(organizationId);
            Double totalLoanAmountGiven = loanRepository.getTotalLoanAmountByOrganization(organizationId);
            Double totalAmountReceived = collectionRepository.getTotalCollectionByOrganization(organizationId);
            Double totalOutstanding = loanRepository.getTotalOutstandingBalance(organizationId);
            Long activeLoansCount = loanRepository.countByOrganizationIdAndStatus(organizationId, "ACTIVE");
            Long overdueLoansCount = loanRepository.countByOrganizationIdAndStatus(organizationId, "OVERDUE");

            return LenderDashboardResponse.builder()
                    .totalLoanAmountGiven(totalLoanAmountGiven != null ? totalLoanAmountGiven : 0.0)
                    .totalAmountReceived(totalAmountReceived != null ? totalAmountReceived : 0.0)
                    .outstandingBalance(totalOutstanding != null ? totalOutstanding : 0.0)
                    .activeLoans(activeLoansCount != null ? activeLoansCount.intValue() : 0)
                    .totalCustomers(totalCustomers != null ? totalCustomers.intValue() : 0)
                    .overdueLoans(overdueLoansCount != null ? overdueLoansCount.intValue() : 0)
                    .recentLoans(new ArrayList<>())
                    .recentCollections(new ArrayList<>())
                    .upcomingPayments(new ArrayList<>())
                    .build();

        } catch (Exception e) {
            log.error("Error fetching lender dashboard: {}", e.getMessage(), e);
            return getEmptyLenderDashboard();
        }
    }

    private OwnerDashboardResponse getEmptyOwnerDashboard() {
        return OwnerDashboardResponse.builder()
                .todayCollection(0.0)
                .todayCollectionCount(0)
                .weeklyCollection(0.0)
                .monthlyCollection(0.0)
                .totalOutstanding(0.0)
                .activeLoansCount(0)
                .totalEmployees(0)
                .totalCustomers(0)
                .overdueLoansCount(0)
                .overdueAmount(0.0)
                .overdueLoans(new ArrayList<>())
                .topPerformers(new ArrayList<>())
                .recentActivities(new ArrayList<>())
                .weeklyTrend(new ArrayList<>())
                .build();
    }

    private EmployeeDashboardResponse getEmptyEmployeeDashboard() {
        return EmployeeDashboardResponse.builder()
                .todayCollection(0.0)
                .todayVisits(0)
                .weeklyCollection(0.0)
                .monthlyCollection(0.0)
                .monthlyTarget(0.0)
                .targetAchievementPercentage(0.0)
                .assignedCustomers(0)
                .visitedCustomers(0)
                .pendingCustomers(0)
                .routeId(null)
                .routeName(null)
                .todayCustomers(new ArrayList<>())
                .recentCollections(new ArrayList<>())
                .overdueCustomers(new ArrayList<>())
                .build();
    }

    private LenderDashboardResponse getEmptyLenderDashboard() {
        return LenderDashboardResponse.builder()
                .totalLoanAmountGiven(0.0)
                .totalAmountReceived(0.0)
                .outstandingBalance(0.0)
                .activeLoans(0)
                .totalCustomers(0)
                .overdueLoans(0)
                .recentLoans(new ArrayList<>())
                .recentCollections(new ArrayList<>())
                .upcomingPayments(new ArrayList<>())
                .build();
    }
}