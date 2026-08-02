package com.app.Fintrox.loan.service;



import com.app.Fintrox.loan.dto.request.LoanRequest;
import com.app.Fintrox.loan.dto.response.CustomerLoanSummary;
import com.app.Fintrox.loan.dto.response.InstallmentResponse;
import com.app.Fintrox.loan.dto.response.LoanResponse;
import com.app.Fintrox.loan.entity.Installment;
import com.app.Fintrox.loan.entity.Loan;
import com.app.Fintrox.loan.mapper.LoanMapper;
import com.app.Fintrox.loan.repository.InstallmentRepository;
import com.app.Fintrox.loan.repository.LoanRepository;
import com.app.Fintrox.loan.service.LoanCalculatorService.LoanCalculationResult;
import com.app.Fintrox.customer.entity.Customer;
import com.app.Fintrox.customer.repository.CustomerRepository;
import com.app.Fintrox.common.exceptions.BadRequestException;
import com.app.Fintrox.common.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final InstallmentRepository installmentRepository;
    private final CustomerRepository customerRepository;
    private final LoanMapper loanMapper;
    private final LoanCalculatorService loanCalculatorService;

    @Override
    @Transactional
    public LoanResponse createLoan(LoanRequest request, Long userId, Long organizationId) {
        // 1. Validate customer exists
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // 2. Check if customer belongs to this organization
        if (!customer.getOrganizationId().equals(organizationId)) {
            throw new BadRequestException("Customer does not belong to your organization");
        }

        // 3. Create Loan entity
        Loan loan = loanMapper.toEntity(request, organizationId, userId);

        // 4. Calculate loan details
        LocalDate startDate = request.getStartDate() != null ? request.getStartDate() : LocalDate.now();
        LoanCalculationResult calculation = loanCalculatorService.calculateLoan(
                request.getPrincipalAmount(),
                request.getInterestRate(),
                request.getTenureMonths(),
                request.getLoanType(),
                startDate
        );

        // 5. Set calculated values
        loan.setTotalInterest(calculation.getTotalInterest());
        loan.setTotalPayable(calculation.getTotalPayable());
        loan.setInstallmentAmount(calculation.getInstallmentAmount());
        loan.setTotalInstallments(calculation.getTotalInstallments());
        loan.setEndDate(calculation.getEndDate());

        // 6. Set initial values
        loan.setAmountPaid(0.0);
        loan.setOutstandingBalance(calculation.getTotalPayable());
        loan.setInstallmentsPaid(0);
        loan.setStatus("ACTIVE");
        loan.setNextDueDate(calculation.getInstallmentSchedule().get(0).getDueDate());

        // 7. Save loan
        Loan savedLoan = loanRepository.save(loan);

        // 8. Create and save installments
        List<Installment> installments = new ArrayList<>();
        for (InstallmentResponse installmentDto : calculation.getInstallmentSchedule()) {
            Installment installment = Installment.builder()
                    .loanId(savedLoan.getId())
                    .installmentNumber(installmentDto.getInstallmentNumber())
                    .dueDate(installmentDto.getDueDate())
                    .amount(installmentDto.getAmount())
                    .status("PENDING")
                    .isActive(true)
                    .build();
            installments.add(installmentRepository.save(installment));
        }

        // 9. Update customer's financial summary (add loan)
        customerRepository.addLoan(customer.getId(), savedLoan.getPrincipalAmount());
        customerRepository.save(customer);

        log.info("Loan created: {} for customer: {} by user: {}",
                savedLoan.getLoanNumber(), customer.getFullName(), userId);

        return loanMapper.toResponseWithSchedule(savedLoan, customer, installments);
    }

    @Override
    public LoanResponse getLoanById(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));

        Customer customer = customerRepository.findById(loan.getCustomerId())
                .orElse(null);

        List<Installment> installments = installmentRepository.findByLoanIdOrderByInstallmentNumberAsc(id);

        return loanMapper.toResponseWithSchedule(loan, customer, installments);
    }

    @Override
    public List<LoanResponse> getLoansByOrganization(Long organizationId) {
        List<Loan> loans = loanRepository.findByOrganizationId(organizationId);
        return loans.stream()
                .map(loan -> {
                    Customer customer = customerRepository.findById(loan.getCustomerId())
                            .orElse(null);
                    return loanMapper.toResponseWithDetails(loan, customer);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<LoanResponse> getLoansByCustomer(Long customerId) {
        List<Loan> loans = loanRepository.findByCustomerId(customerId);
        Customer customer = customerRepository.findById(customerId).orElse(null);
        return loans.stream()
                .map(loan -> loanMapper.toResponseWithDetails(loan, customer))
                .collect(Collectors.toList());
    }

    @Override
    public List<LoanResponse> getActiveLoansByCustomer(Long customerId) {
        List<Loan> loans = loanRepository.findByCustomerIdAndIsActiveTrue(customerId);
        Customer customer = customerRepository.findById(customerId).orElse(null);
        return loans.stream()
                .map(loan -> loanMapper.toResponseWithDetails(loan, customer))
                .collect(Collectors.toList());
    }

    @Override
    public List<LoanResponse> getLoansByStatus(String status, Long organizationId) {
        List<Loan> loans = loanRepository.findByStatusAndOrganizationId(status, organizationId);
        return loans.stream()
                .map(loan -> {
                    Customer customer = customerRepository.findById(loan.getCustomerId())
                            .orElse(null);
                    return loanMapper.toResponseWithDetails(loan, customer);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<LoanResponse> getOverdueLoans(Long organizationId) {
        List<Loan> loans = loanRepository.findOverdueLoansByOrganization(organizationId, LocalDate.now());
        return loans.stream()
                .map(loan -> {
                    Customer customer = customerRepository.findById(loan.getCustomerId())
                            .orElse(null);
                    return loanMapper.toResponseWithDetails(loan, customer);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LoanResponse updateLoanStatus(Long loanId, String status) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));

        loan.setStatus(status);
        Loan updatedLoan = loanRepository.save(loan);

        Customer customer = customerRepository.findById(loan.getCustomerId()).orElse(null);
        return loanMapper.toResponseWithDetails(updatedLoan, customer);
    }

    @Override
    @Transactional
    public LoanResponse closeLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));

        loan.setStatus("CLOSED");
        loan.setActive(false);
        Loan updatedLoan = loanRepository.save(loan);

        // Update customer's active loan count
        customerRepository.removeActiveLoan(loan.getCustomerId());

        Customer customer = customerRepository.findById(loan.getCustomerId()).orElse(null);
        log.info("Loan closed: {}", loan.getLoanNumber());

        return loanMapper.toResponseWithDetails(updatedLoan, customer);
    }

    @Override
    @Transactional
    public void deleteLoan(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));
        loan.setActive(false);
        loanRepository.save(loan);
        log.info("Loan deleted: {}", loan.getLoanNumber());
    }

    @Override
    @Transactional
    public void activateLoan(Long id) {
        loanRepository.updateActiveStatus(id, true);
        log.info("Loan activated: {}", id);
    }

    @Override
    @Transactional
    public void deactivateLoan(Long id) {
        loanRepository.updateActiveStatus(id, false);
        log.info("Loan deactivated: {}", id);
    }

    @Override
    public LoanResponse getLoanDashboard(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));

        Customer customer = customerRepository.findById(loan.getCustomerId()).orElse(null);
        List<Installment> installments = installmentRepository.findByLoanIdOrderByInstallmentNumberAsc(loanId);

        return loanMapper.toResponseWithSchedule(loan, customer, installments);
    }


    @Override
    public CustomerLoanSummary getCustomerLoanSummary(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        List<Loan> loans = loanRepository.findByCustomerId(customerId);

        long totalLoans = loans.size();
        long activeLoans = loans.stream().filter(l -> "ACTIVE".equals(l.getStatus())).count();
        long closedLoans = loans.stream().filter(l -> "CLOSED".equals(l.getStatus())).count();
        long overdueLoans = loans.stream()
                .filter(l -> "ACTIVE".equals(l.getStatus()) && l.getNextDueDate() != null
                        && l.getNextDueDate().isBefore(LocalDate.now()))
                .count();

        Double totalPrincipal = loans.stream().mapToDouble(Loan::getPrincipalAmount).sum();
        Double totalPayable = loans.stream().mapToDouble(Loan::getTotalPayable).sum();
        Double totalPaid = loans.stream().mapToDouble(Loan::getAmountPaid).sum();
        Double totalOutstanding = loans.stream().mapToDouble(Loan::getOutstandingBalance).sum();

        return CustomerLoanSummary.builder()
                .customerId(customer.getId())
                .customerName(customer.getFullName())
                .customerPhone(customer.getPhone())
                .totalLoans(totalLoans)
                .activeLoans(activeLoans)
                .closedLoans(closedLoans)
                .overdueLoans(overdueLoans)
                .totalPrincipal(totalPrincipal)
                .totalPayable(totalPayable)
                .totalPaid(totalPaid)
                .totalOutstanding(totalOutstanding)
                .build();
    }
}
