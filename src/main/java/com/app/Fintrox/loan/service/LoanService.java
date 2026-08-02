package com.app.Fintrox.loan.service;





import com.app.Fintrox.loan.dto.request.LoanRequest;
import com.app.Fintrox.loan.dto.response.CustomerLoanSummary;
import com.app.Fintrox.loan.dto.response.LoanResponse;

import java.util.List;

public interface LoanService {

    LoanResponse createLoan(LoanRequest request, Long userId, Long organizationId);

    LoanResponse getLoanById(Long id);

    List<LoanResponse> getLoansByOrganization(Long organizationId);

    List<LoanResponse> getLoansByCustomer(Long customerId);

    List<LoanResponse> getActiveLoansByCustomer(Long customerId);

    List<LoanResponse> getLoansByStatus(String status, Long organizationId);

    List<LoanResponse> getOverdueLoans(Long organizationId);

    LoanResponse updateLoanStatus(Long loanId, String status);

    LoanResponse closeLoan(Long loanId);

    void deleteLoan(Long id);

    void activateLoan(Long id);

    void deactivateLoan(Long id);

    LoanResponse getLoanDashboard(Long loanId);

    CustomerLoanSummary getCustomerLoanSummary(Long customerId);
}