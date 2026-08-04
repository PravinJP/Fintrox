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

    @Query("SELECT c FROM Collection c WHERE DATE(c.createdAt) = CURRENT_DATE AND c.employeeId = :employeeId")
    List<Collection> findTodayCollectionsByEmployee(@Param("employeeId") Long employeeId);

    @Query("SELECT SUM(c.amount) FROM Collection c WHERE c.loanId = :loanId")
    Double getTotalCollectedByLoan(@Param("loanId") Long loanId);

    @Query("SELECT SUM(c.amount) FROM Collection c WHERE c.customerId = :customerId")
    Double getTotalCollectedByCustomer(@Param("customerId") Long customerId);

    @Query("SELECT SUM(c.amount) FROM Collection c WHERE DATE(c.createdAt) = CURRENT_DATE AND c.organizationId = :orgId")
    Double getTodayTotalCollection(@Param("orgId") Long orgId);

    @Query("SELECT SUM(c.amount) FROM Collection c WHERE c.employeeId = :employeeId AND DATE(c.createdAt) = CURRENT_DATE")
    Double getTodayCollectionByEmployee(@Param("employeeId") Long employeeId);
}