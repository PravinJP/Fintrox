package com.app.Fintrox.dashboard.service;

import com.app.Fintrox.dashboard.dto.EmployeeDashboardResponse;
import com.app.Fintrox.dashboard.dto.LenderDashboardResponse;
import com.app.Fintrox.dashboard.dto.OwnerDashboardResponse;
import com.app.Fintrox.collection.repository.CollectionRepository;
import com.app.Fintrox.customer.repository.CustomerRepository;
import com.app.Fintrox.employee.repository.EmployeeRepository;
import com.app.Fintrox.loan.repository.LoanRepository;
import com.app.Fintrox.loan.repository.InstallmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
            Double todayCollection = collectionRepository.getTodayTotalCollection(organizationId);
            Long totalEmployees = employeeRepository.countByOrganizationId(organizationId);
            Long totalCustomers = customerRepository.countByOrganizationId(organizationId);
            Double totalOutstanding = loanRepository.getTotalOutstandingBalance(organizationId);
            Long activeLoansCount = loanRepository.countByOrganizationIdAndStatus(organizationId, "ACTIVE");
            Integer todayCollectionCount = collectionRepository.findTodayCollections(organizationId).size();

            return OwnerDashboardResponse.builder()
                    .todayCollection(todayCollection != null ? todayCollection : 0.0)
                    .todayCollectionCount(todayCollectionCount)
                    .weeklyCollection(0.0)
                    .monthlyCollection(0.0)
                    .totalOutstanding(totalOutstanding != null ? totalOutstanding : 0.0)
                    .activeLoansCount(activeLoansCount != null ? activeLoansCount.intValue() : 0)
                    .totalEmployees(totalEmployees != null ? totalEmployees.intValue() : 0)
                    .totalCustomers(totalCustomers != null ? totalCustomers.intValue() : 0)
                    .overdueLoansCount(0)
                    .overdueAmount(0.0)
                    .overdueLoans(new ArrayList<>())
                    .topPerformers(new ArrayList<>())
                    .recentActivities(new ArrayList<>())
                    .weeklyTrend(new ArrayList<>())
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
            Double todayCollection = collectionRepository.getTodayCollectionByEmployee(employeeId);

            return EmployeeDashboardResponse.builder()
                    .todayCollection(todayCollection != null ? todayCollection : 0.0)
                    .todayVisits(0)
                    .weeklyCollection(0.0)
                    .monthlyCollection(0.0)
                    .monthlyTarget(0.0)
                    .targetAchievementPercentage(0.0)
                    .assignedCustomers(0)
                    .visitedCustomers(0)
                    .pendingCustomers(0)
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