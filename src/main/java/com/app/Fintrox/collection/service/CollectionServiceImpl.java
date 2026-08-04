package com.app.Fintrox.collection.service;



import com.app.Fintrox.collection.dto.request.CollectionRequest;
import com.app.Fintrox.collection.dto.response.CollectionResponse;
import com.app.Fintrox.collection.entity.Collection;
import com.app.Fintrox.collection.mapper.CollectionMapper;
import com.app.Fintrox.collection.repository.CollectionRepository;
import com.app.Fintrox.customer.entity.Customer;
import com.app.Fintrox.customer.repository.CustomerRepository;
import com.app.Fintrox.employee.entity.Employee;
import com.app.Fintrox.employee.repository.EmployeeRepository;
import com.app.Fintrox.loan.entity.Installment;
import com.app.Fintrox.loan.entity.Loan;
import com.app.Fintrox.loan.repository.InstallmentRepository;
import com.app.Fintrox.loan.repository.LoanRepository;
import com.app.Fintrox.common.exceptions.BadRequestException;
import com.app.Fintrox.common.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {

    private final CollectionRepository collectionRepository;
    private final LoanRepository loanRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final InstallmentRepository installmentRepository;
    private final CollectionMapper collectionMapper;

    @Override
    @Transactional
    public CollectionResponse recordCollection(CollectionRequest request, Long userId, Long organizationId, Long employeeId) {
        Loan loan = loanRepository.findById(request.getLoanId())
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found"));

        if (!loan.getOrganizationId().equals(organizationId)) {
            throw new BadRequestException("Loan does not belong to your organization");
        }

        if (!"ACTIVE".equals(loan.getStatus())) {
            throw new BadRequestException("Cannot collect payment for inactive loan");
        }

        if (loan.getOutstandingBalance() < request.getAmount()) {
            throw new BadRequestException("Amount exceeds outstanding balance");
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (!customer.getOrganizationId().equals(organizationId)) {
            throw new BadRequestException("Customer does not belong to your organization");
        }

        List<Installment> pendingInstallments = installmentRepository.findPendingInstallments(loan.getId());

        if (pendingInstallments.isEmpty()) {
            throw new BadRequestException("No pending installments for this loan");
        }

        Installment currentInstallment = pendingInstallments.get(0);

        Double remainingAmount = request.getAmount();
        Double totalPaid = 0.0;
        Integer installmentPaidCount = 0;

        for (Installment installment : pendingInstallments) {
            if (remainingAmount <= 0) {
                break;
            }

            Double installmentDue = installment.getAmount();
            Double paidAmount = Math.min(remainingAmount, installmentDue);

            installment.setStatus("PAID");
            installment.setPaidDate(LocalDate.now());
            installment.setPaidAmount(paidAmount);
            installment.setPaymentMethod(request.getPaymentMethod());
            installment.setCollectionId(null);

            installmentRepository.save(installment);

            totalPaid += paidAmount;
            remainingAmount -= paidAmount;
            installmentPaidCount++;
        }

        Collection collection = collectionMapper.toEntity(request, organizationId, employeeId, userId);
        collection.setInstallmentNumber(currentInstallment.getInstallmentNumber());
        collection.setFullPayment(remainingAmount == 0);
        collection.setVerified(false);
        collection.setReceiptGenerated(false);

        Collection savedCollection = collectionRepository.save(collection);

        for (Installment installment : pendingInstallments) {
            if (installment.getStatus().equals("PAID") && installment.getCollectionId() == null) {
                installment.setCollectionId(savedCollection.getId());
                installmentRepository.save(installment);
            }
        }

        loan.setAmountPaid(loan.getAmountPaid() + totalPaid);
        loan.setOutstandingBalance(loan.getTotalPayable() - loan.getAmountPaid());
        loan.setInstallmentsPaid(loan.getInstallmentsPaid() + installmentPaidCount);

        List<Installment> remainingPending = installmentRepository.findPendingInstallments(loan.getId());
        if (remainingPending.isEmpty()) {
            loan.setStatus("CLOSED");
            loan.setActive(false);
            customerRepository.removeActiveLoan(customer.getId());
        } else {
            loan.setNextDueDate(remainingPending.get(0).getDueDate());
        }

        loanRepository.save(loan);

        customer.setTotalAmountReceived(customer.getTotalAmountReceived() + totalPaid);
        customer.setOutstandingBalance(customer.getOutstandingBalance() - totalPaid);
        customerRepository.save(customer);

        log.info("Collection recorded: {} for loan: {} by employee: {}",
                savedCollection.getCollectionNumber(), loan.getLoanNumber(), employeeId);

        Employee employee = employeeRepository.findById(employeeId).orElse(null);

        CollectionResponse response = collectionMapper.toResponseWithDetails(savedCollection, loan, customer, employee);
        response.setOutstandingBalanceAfter(loan.getOutstandingBalance());
        return response;
    }

    @Override
    public CollectionResponse getCollectionById(Long id) {
        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found"));

        Loan loan = loanRepository.findById(collection.getLoanId()).orElse(null);
        Customer customer = customerRepository.findById(collection.getCustomerId()).orElse(null);
        Employee employee = collection.getEmployeeId() != null ?
                employeeRepository.findById(collection.getEmployeeId()).orElse(null) : null;

        CollectionResponse response = collectionMapper.toResponseWithDetails(collection, loan, customer, employee);
        if (loan != null) {
            response.setOutstandingBalanceAfter(loan.getOutstandingBalance());
        }
        return response;
    }

    @Override
    public List<CollectionResponse> getCollectionsByLoan(Long loanId) {
        List<Collection> collections = collectionRepository.findByLoanIdOrderByCreatedAtDesc(loanId);
        return collections.stream()
                .map(collection -> {
                    Loan loan = loanRepository.findById(collection.getLoanId()).orElse(null);
                    Customer customer = customerRepository.findById(collection.getCustomerId()).orElse(null);
                    Employee employee = collection.getEmployeeId() != null ?
                            employeeRepository.findById(collection.getEmployeeId()).orElse(null) : null;
                    CollectionResponse response = collectionMapper.toResponseWithDetails(collection, loan, customer, employee);
                    if (loan != null) {
                        response.setOutstandingBalanceAfter(loan.getOutstandingBalance());
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CollectionResponse> getCollectionsByCustomer(Long customerId) {
        List<Collection> collections = collectionRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
        return collections.stream()
                .map(collection -> {
                    Loan loan = loanRepository.findById(collection.getLoanId()).orElse(null);
                    Customer customer = customerRepository.findById(collection.getCustomerId()).orElse(null);
                    Employee employee = collection.getEmployeeId() != null ?
                            employeeRepository.findById(collection.getEmployeeId()).orElse(null) : null;
                    CollectionResponse response = collectionMapper.toResponseWithDetails(collection, loan, customer, employee);
                    if (loan != null) {
                        response.setOutstandingBalanceAfter(loan.getOutstandingBalance());
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CollectionResponse> getCollectionsByEmployee(Long employeeId) {
        List<Collection> collections = collectionRepository.findByEmployeeId(employeeId);
        return collections.stream()
                .map(collection -> {
                    Loan loan = loanRepository.findById(collection.getLoanId()).orElse(null);
                    Customer customer = customerRepository.findById(collection.getCustomerId()).orElse(null);
                    Employee employee = employeeRepository.findById(collection.getEmployeeId()).orElse(null);
                    CollectionResponse response = collectionMapper.toResponseWithDetails(collection, loan, customer, employee);
                    if (loan != null) {
                        response.setOutstandingBalanceAfter(loan.getOutstandingBalance());
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CollectionResponse> getTodayCollections(Long organizationId) {
        List<Collection> collections = collectionRepository.findTodayCollections(organizationId);
        return collections.stream()
                .map(collection -> {
                    Loan loan = loanRepository.findById(collection.getLoanId()).orElse(null);
                    Customer customer = customerRepository.findById(collection.getCustomerId()).orElse(null);
                    Employee employee = collection.getEmployeeId() != null ?
                            employeeRepository.findById(collection.getEmployeeId()).orElse(null) : null;
                    CollectionResponse response = collectionMapper.toResponseWithDetails(collection, loan, customer, employee);
                    if (loan != null) {
                        response.setOutstandingBalanceAfter(loan.getOutstandingBalance());
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CollectionResponse verifyCollection(Long collectionId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found"));

        collection.setVerified(true);
        collectionRepository.save(collection);

        log.info("Collection verified: {}", collection.getCollectionNumber());
        return getCollectionById(collectionId);
    }

    @Override
    @Transactional
    public CollectionResponse generateReceipt(Long collectionId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found"));

        collection.setReceiptGenerated(true);
        collection.setReceiptUrl("/api/collections/receipt/" + collectionId);
        collectionRepository.save(collection);

        log.info("Receipt generated for collection: {}", collection.getCollectionNumber());
        return getCollectionById(collectionId);
    }

    @Override
    public List<CollectionResponse> getCollectionsByOrganization(Long organizationId) {
        List<Collection> collections = collectionRepository.findByOrganizationId(organizationId);
        return collections.stream()
                .map(collection -> {
                    Loan loan = loanRepository.findById(collection.getLoanId()).orElse(null);
                    Customer customer = customerRepository.findById(collection.getCustomerId()).orElse(null);
                    Employee employee = collection.getEmployeeId() != null ?
                            employeeRepository.findById(collection.getEmployeeId()).orElse(null) : null;
                    CollectionResponse response = collectionMapper.toResponseWithDetails(collection, loan, customer, employee);
                    if (loan != null) {
                        response.setOutstandingBalanceAfter(loan.getOutstandingBalance());
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }
}