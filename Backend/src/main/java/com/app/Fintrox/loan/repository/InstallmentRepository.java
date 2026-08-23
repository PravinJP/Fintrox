package com.app.Fintrox.loan.repository;

import com.app.Fintrox.loan.entity.Installment;
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
public interface InstallmentRepository extends JpaRepository<Installment, Long> {

    List<Installment> findByLoanId(Long loanId);
    List<Installment> findByLoanIdOrderByInstallmentNumberAsc(Long loanId);

    List<Installment> findByStatus(String status);
    List<Installment> findByLoanIdAndStatus(Long loanId, String status);

    List<Installment> findByDueDateBeforeAndStatus(LocalDate date, String status);
    List<Installment> findByDueDateAndStatus(LocalDate date, String status);

    @Query("SELECT i FROM Installment i WHERE i.loanId = :loanId AND i.status = 'PENDING' ORDER BY i.installmentNumber ASC")
    List<Installment> findPendingInstallments(@Param("loanId") Long loanId);

    @Query("SELECT i FROM Installment i WHERE i.loanId = :loanId AND i.status = 'PENDING' ORDER BY i.installmentNumber ASC LIMIT 1")
    Optional<Installment> findNextDueInstallment(@Param("loanId") Long loanId);

    long countByLoanIdAndStatus(Long loanId, String status);
    long countByLoanId(Long loanId);

    @Modifying
    @Transactional
    @Query("UPDATE Installment i SET i.status = :status WHERE i.id = :installmentId")
    void updateStatus(@Param("installmentId") Long installmentId, @Param("status") String status);

    @Modifying
    @Transactional
    @Query("UPDATE Installment i SET i.status = 'PAID', i.paidDate = :paidDate, i.paidAmount = :paidAmount, " +
            "i.paymentMethod = :paymentMethod, i.collectionId = :collectionId WHERE i.id = :installmentId")
    void markAsPaid(@Param("installmentId") Long installmentId,
                    @Param("paidDate") LocalDate paidDate,
                    @Param("paidAmount") Double paidAmount,
                    @Param("paymentMethod") String paymentMethod,
                    @Param("collectionId") Long collectionId);

    @Modifying
    @Transactional
    @Query("UPDATE Installment i SET i.status = 'OVERDUE' WHERE i.dueDate < :date AND i.status = 'PENDING'")
    void markOverdueInstallments(@Param("date") LocalDate date);
}