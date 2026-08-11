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
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(7);
        LocalDate monthStart = today.withDayOfMonth(1);

        Double todayCollection = collectionRepository.getTodayTotalCollection(organizationId);
        Long totalEmployees = employeeRepository.countByOrganizationId(organizationId);
        Long totalCustomers = customerRepository.countByOrganizationId(organizationId);
        Double totalOutstanding = loanRepository.getTotalOutstandingBalance(organizationId);
        Long activeLoansCount = loanRepository.countByOrganizationIdAndStatus(organizationId, "ACTIVE");
        Integer todayCollectionCount = collectionRepository.findTodayCollections(organizationId).size();

        List<OwnerDashboardResponse.OverdueLoanDTO> overdueLoans = new ArrayList<>();
        Integer overdueLoansCount = overdueLoans.size();
        Double overdueAmount = 0.0;

        return OwnerDashboardResponse.builder()
                .todayCollection(todayCollection != null ? todayCollection : 0.0)
                .todayCollectionCount(todayCollectionCount)
                .weeklyCollection(0.0)
                .monthlyCollection(0.0)
                .totalOutstanding(totalOutstanding != null ? totalOutstanding : 0.0)
                .activeLoansCount(activeLoansCount != null ? activeLoansCount.intValue() : 0)
                .totalEmployees(totalEmployees != null ? totalEmployees.intValue() : 0)
                .totalCustomers(totalCustomers != null ? totalCustomers.intValue() : 0)
                .overdueLoansCount(overdueLoansCount)
                .overdueAmount(overdueAmount)
                .overdueLoans(overdueLoans)
                .topPerformers(new ArrayList<>())
                .recentActivities(new ArrayList<>())
                .weeklyTrend(new ArrayList<>())
                .build();
    }

    @Override
    public EmployeeDashboardResponse getEmployeeDashboard(Long employeeId, Long organizationId) {
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

    @Override
    public LenderDashboardResponse getLenderDashboard(Long organizationId) {
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
