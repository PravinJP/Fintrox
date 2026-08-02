package com.app.Fintrox.loan.mapper;



import com.app.Fintrox.loan.dto.request.LoanRequest;
import com.app.Fintrox.loan.dto.response.InstallmentResponse;
import com.app.Fintrox.loan.dto.response.LoanResponse;
import com.app.Fintrox.loan.entity.Installment;
import com.app.Fintrox.loan.entity.Loan;
import com.app.Fintrox.customer.entity.Customer;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class LoanMapper {

    public Loan toEntity(LoanRequest request, Long organizationId, Long createdBy) {
        return Loan.builder()
                .customerId(request.getCustomerId())
                .organizationId(organizationId)
                .principalAmount(request.getPrincipalAmount())
                .interestRate(request.getInterestRate())
                .tenureMonths(request.getTenureMonths())
                .loanType(request.getLoanType())
                .startDate(request.getStartDate() != null ? request.getStartDate() : java.time.LocalDate.now())
                .createdBy(createdBy)
                .status("ACTIVE")
                .isActive(true)
                .build();
    }

    public LoanResponse toResponse(Loan loan) {
        return LoanResponse.builder()
                .id(loan.getId())
                .loanNumber(loan.getLoanNumber())
                .customerId(loan.getCustomerId())
                .principalAmount(loan.getPrincipalAmount())
                .interestRate(loan.getInterestRate())
                .tenureMonths(loan.getTenureMonths())
                .loanType(loan.getLoanType())
                .installmentAmount(loan.getInstallmentAmount())
                .totalInterest(loan.getTotalInterest())
                .totalPayable(loan.getTotalPayable())
                .amountPaid(loan.getAmountPaid())
                .outstandingBalance(loan.getOutstandingBalance())
                .installmentsPaid(loan.getInstallmentsPaid())
                .totalInstallments(loan.getTotalInstallments())
                .nextDueDate(loan.getNextDueDate())
                .startDate(loan.getStartDate())
                .endDate(loan.getEndDate())
                .status(loan.getStatus())
                .createdAt(loan.getCreatedAt())
                .updatedAt(loan.getUpdatedAt())
                .build();
    }

    public LoanResponse toResponseWithDetails(Loan loan, Customer customer) {
        LoanResponse response = toResponse(loan);
        if (customer != null) {
            response.setCustomerName(customer.getFullName());
            response.setCustomerPhone(customer.getPhone());
        }
        return response;
    }

    public LoanResponse toResponseWithSchedule(Loan loan, Customer customer, List<Installment> installments) {
        LoanResponse response = toResponseWithDetails(loan, customer);
        if (installments != null) {
            List<InstallmentResponse> installmentResponses = installments.stream()
                    .map(this::toInstallmentResponse)
                    .collect(Collectors.toList());
            response.setInstallmentSchedule(installmentResponses);
        }
        return response;
    }

    public InstallmentResponse toInstallmentResponse(Installment installment) {
        return InstallmentResponse.builder()
                .id(installment.getId())
                .installmentNumber(installment.getInstallmentNumber())
                .dueDate(installment.getDueDate())
                .amount(installment.getAmount())
                .status(installment.getStatus())
                .paidDate(installment.getPaidDate())
                .paidAmount(installment.getPaidAmount())
                .paymentMethod(installment.getPaymentMethod())
                .collectionId(installment.getCollectionId())
                .createdAt(installment.getCreatedAt())
                .updatedAt(installment.getUpdatedAt())
                .build();
    }
}
