package com.app.Fintrox.loan.repository;

import com.app.Fintrox.loan.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

    Optional<Loan> findById(Long id);
    Optional<Loan> findByLoanNumber(String loanNumber);
    List<Loan> findByCustomerId(Long customerId);
    List<Loan> findByOrganizationId(Long organizationId);

    @Query("SELECT COALESCE(SUM(l.principalAmount), 0) FROM Loan l WHERE l.organizationId = :orgId")
    Double getTotalLoanAmountByOrganization(@Param("orgId") Long orgId);





    // ===== Status-based Queries =====
    List<Loan> findByStatus(String status);
    List<Loan> findByStatusAndOrganizationId(String status, Long organizationId);
    List<Loan> findByCustomerIdAndStatus(Long customerId, String status);

    // ===== Active Loans =====
    List<Loan> findByIsActiveTrue();
    List<Loan> findByIsActiveTrueAndOrganizationId(Long organizationId);

    // ===== Overdue Loans =====
    @Query("SELECT l FROM Loan l WHERE l.status = 'ACTIVE' AND l.nextDueDate < :date")
    List<Loan> findOverdueLoans(@Param("date") LocalDate date);

    @Query("SELECT l FROM Loan l WHERE l.organizationId = :orgId AND l.status = 'ACTIVE' AND l.nextDueDate < :date")
    List<Loan> findOverdueLoansByOrganization(@Param("orgId") Long orgId, @Param("date") LocalDate date);

    // ===== Customer-based Queries =====
    List<Loan> findByCustomerIdAndIsActiveTrue(Long customerId);

    // ===== Count Queries =====
    long countByOrganizationId(Long organizationId);
    long countByOrganizationIdAndStatus(Long organizationId, String status);

    // ===== Financial Summaries =====
    @Query("SELECT SUM(l.principalAmount) FROM Loan l WHERE l.organizationId = :orgId AND l.status = 'ACTIVE'")
    Double getTotalActiveLoanAmount(@Param("orgId") Long orgId);

    @Query("SELECT SUM(l.outstandingBalance) FROM Loan l WHERE l.organizationId = :orgId AND l.status = 'ACTIVE'")
    Double getTotalOutstandingBalance(@Param("orgId") Long orgId);

    @Query("SELECT SUM(l.amountPaid) FROM Loan l WHERE l.organizationId = :orgId AND l.status = 'ACTIVE'")
    Double getTotalAmountReceived(@Param("orgId") Long orgId);

    // ===== Update Queries =====
    @Modifying
    @Transactional
    @Query("UPDATE Loan l SET l.status = :status WHERE l.id = :loanId")
    void updateStatus(@Param("loanId") Long loanId, @Param("status") String status);

    @Modifying
    @Transactional
    @Query("UPDATE Loan l SET l.isActive = :active WHERE l.id = :loanId")
    void updateActiveStatus(@Param("loanId") Long loanId, @Param("active") boolean active);
}