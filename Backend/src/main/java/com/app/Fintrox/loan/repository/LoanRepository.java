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

    List<Loan> findByStatus(String status);
    List<Loan> findByStatusAndOrganizationId(String status, Long organizationId);

    List<Loan> findByIsActiveTrue();
    List<Loan> findByIsActiveTrueAndOrganizationId(Long organizationId);

    List<Loan> findByCustomerIdAndIsActiveTrue(Long customerId);

    @Query("SELECT l FROM Loan l WHERE l.status = 'ACTIVE' AND l.nextDueDate < :date")
    List<Loan> findOverdueLoans(@Param("date") LocalDate date);

    @Query("SELECT l FROM Loan l WHERE l.organizationId = :orgId AND l.status = 'ACTIVE' AND l.nextDueDate < :date")
    List<Loan> findOverdueLoansByOrganization(@Param("orgId") Long orgId, @Param("date") LocalDate date);

    long countByOrganizationId(Long organizationId);
    long countByOrganizationIdAndStatus(Long organizationId, String status);

    @Query(value = "SELECT COALESCE(SUM(l.principal_amount), 0) FROM loans l WHERE l.organization_id = :orgId", nativeQuery = true)
    Double getTotalLoanAmountByOrganization(@Param("orgId") Long orgId);

    @Query(value = "SELECT COALESCE(SUM(l.outstanding_balance), 0) FROM loans l WHERE l.organization_id = :orgId AND l.status = 'ACTIVE'", nativeQuery = true)
    Double getTotalOutstandingBalance(@Param("orgId") Long orgId);

    @Query(value = "SELECT COUNT(*) FROM loans l WHERE l.organization_id = :orgId AND l.status = :status", nativeQuery = true)
    Long countByOrganizationIdAndStatusNative(@Param("orgId") Long orgId, @Param("status") String status);

    @Modifying
    @Transactional
    @Query("UPDATE Loan l SET l.status = :status WHERE l.id = :loanId")
    void updateStatus(@Param("loanId") Long loanId, @Param("status") String status);

    @Modifying
    @Transactional
    @Query("UPDATE Loan l SET l.isActive = :active WHERE l.id = :loanId")
    void updateActiveStatus(@Param("loanId") Long loanId, @Param("active") boolean active);
}