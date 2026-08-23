package com.app.Fintrox.collection.repository;

import com.app.Fintrox.collection.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}