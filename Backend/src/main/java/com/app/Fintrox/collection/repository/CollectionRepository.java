package com.app.Fintrox.collection.repository;

import com.app.Fintrox.collection.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {

    Optional<Collection> findById(Long id);
    Optional<Collection> findByCollectionNumber(String collectionNumber);

    List<Collection> findByLoanId(Long loanId);
    List<Collection> findByCustomerId(Long customerId);
    List<Collection> findByEmployeeId(Long employeeId);
    List<Collection> findByOrganizationId(Long organizationId);

    List<Collection> findByLoanIdOrderByCreatedAtDesc(Long loanId);
    List<Collection> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    @Query(value = "SELECT * FROM collections c WHERE DATE(c.created_at) = CURRENT_DATE AND c.organization_id = :orgId", nativeQuery = true)
    List<Collection> findTodayCollections(@Param("orgId") Long orgId);

    @Query(value = "SELECT * FROM collections c WHERE DATE(c.created_at) = CURRENT_DATE AND c.employee_id = :employeeId", nativeQuery = true)
    List<Collection> findTodayCollectionsByEmployee(@Param("employeeId") Long employeeId);

    @Query(value = "SELECT COALESCE(SUM(c.amount), 0) FROM collections c WHERE c.loan_id = :loanId", nativeQuery = true)
    Double getTotalCollectedByLoan(@Param("loanId") Long loanId);

    @Query(value = "SELECT COALESCE(SUM(c.amount), 0) FROM collections c WHERE c.customer_id = :customerId", nativeQuery = true)
    Double getTotalCollectedByCustomer(@Param("customerId") Long customerId);

    @Query(value = "SELECT COALESCE(SUM(c.amount), 0) FROM collections c WHERE DATE(c.created_at) = CURRENT_DATE AND c.organization_id = :orgId", nativeQuery = true)
    Double getTodayTotalCollection(@Param("orgId") Long orgId);

    @Query(value = "SELECT COALESCE(SUM(c.amount), 0) FROM collections c WHERE c.organization_id = :orgId", nativeQuery = true)
    Double getTotalCollectionByOrganization(@Param("orgId") Long orgId);

    @Query(value = "SELECT COALESCE(SUM(c.amount), 0) FROM collections c WHERE c.employee_id = :employeeId AND DATE(c.created_at) = CURRENT_DATE", nativeQuery = true)
    Double getTodayCollectionByEmployee(@Param("employeeId") Long employeeId);

    @Query("SELECT COALESCE(SUM(c.amount), 0.0) FROM Collection c WHERE c.organizationId = :orgId AND c.createdAt BETWEEN :start AND :end")
    Double sumCollectionsBetween(@Param("orgId") Long orgId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(c.amount), 0.0) FROM Collection c WHERE c.organizationId = :orgId AND c.employeeId = :employeeId AND c.createdAt BETWEEN :start AND :end")
    Double sumCollectionsByEmployeeBetween(@Param("orgId") Long orgId, @Param("employeeId") Long employeeId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(c) FROM Collection c WHERE c.organizationId = :orgId AND c.createdAt BETWEEN :start AND :end")
    Long countCollectionsBetween(@Param("orgId") Long orgId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT c FROM Collection c WHERE c.organizationId = :orgId AND c.createdAt BETWEEN :start AND :end ORDER BY c.createdAt DESC")
    List<Collection> findCollectionsBetween(@Param("orgId") Long orgId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(DISTINCT c.customerId) FROM Collection c WHERE c.organizationId = :orgId AND c.createdAt BETWEEN :start AND :end")
    Long countDistinctCustomersBetween(@Param("orgId") Long orgId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(DISTINCT c.employeeId) FROM Collection c WHERE c.organizationId = :orgId AND c.employeeId IS NOT NULL AND c.createdAt BETWEEN :start AND :end")
    Long countDistinctEmployeesBetween(@Param("orgId") Long orgId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT c.employeeId, COALESCE(SUM(c.amount), 0.0), COUNT(DISTINCT c.customerId), COUNT(c) FROM Collection c WHERE c.organizationId = :orgId AND c.createdAt BETWEEN :start AND :end AND c.employeeId IS NOT NULL GROUP BY c.employeeId")
    List<Object[]> sumByEmployeeBetween(@Param("orgId") Long orgId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT c.paymentMethod, COALESCE(SUM(c.amount), 0.0), COUNT(c) FROM Collection c WHERE c.organizationId = :orgId AND c.createdAt BETWEEN :start AND :end GROUP BY c.paymentMethod")
    List<Object[]> sumByPaymentMethodBetween(@Param("orgId") Long orgId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query(value = "SELECT DATE(c.created_at), COALESCE(SUM(c.amount), 0), COUNT(c), COUNT(DISTINCT c.customer_id) FROM collections c WHERE c.organization_id = :orgId AND c.created_at BETWEEN :start AND :end GROUP BY DATE(c.created_at) ORDER BY DATE(c.created_at)", nativeQuery = true)
    List<Object[]> getDailyBreakdown(@Param("orgId") Long orgId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query(value = "SELECT EXTRACT(WEEK FROM c.created_at), COALESCE(SUM(c.amount), 0), COUNT(c) FROM collections c WHERE c.organization_id = :orgId AND c.created_at BETWEEN :start AND :end GROUP BY EXTRACT(WEEK FROM c.created_at) ORDER BY EXTRACT(WEEK FROM c.created_at)", nativeQuery = true)
    List<Object[]> getWeeklyBreakdown(@Param("orgId") Long orgId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);


    @Query("SELECT c FROM Collection c WHERE c.organizationId = :orgId ORDER BY c.createdAt DESC")
    List<Collection> findRecentCollections(@Param("orgId") Long orgId, org.springframework.data.domain.Pageable pageable);



    @Query("SELECT c.employeeId, COALESCE(SUM(c.amount), 0.0) FROM Collection c WHERE c.organizationId = :orgId AND c.employeeId IS NOT NULL AND c.createdAt BETWEEN :start AND :end GROUP BY c.employeeId ORDER BY SUM(c.amount) DESC")
    List<Object[]> findTopPerformers(@Param("orgId") Long orgId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}