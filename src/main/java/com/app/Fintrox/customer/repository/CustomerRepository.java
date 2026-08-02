package com.app.Fintrox.customer.repository;



import com.app.Fintrox.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // ===== Basic Find Methods =====
    Optional<Customer> findById(Long id);
    Optional<Customer> findByPhone(String phone);
    Optional<Customer> findByEmail(String email);
    List<Customer> findByFullNameContainingIgnoreCase(String fullName);

    // ===== Organization-based Queries =====
    List<Customer> findByOrganizationId(Long organizationId);
    List<Customer> findByOrganizationIdAndIsActiveTrue(Long organizationId);
    List<Customer> findByOrganizationIdOrderByFullNameAsc(Long organizationId);

    // ===== Route-based Queries =====
    List<Customer> findByRouteId(Long routeId);
    List<Customer> findByRouteIdAndIsActiveTrue(Long routeId);

    // ===== Employee-based Queries =====
    List<Customer> findByAssignedEmployeeId(Long employeeId);
    List<Customer> findByAssignedEmployeeIdAndIsActiveTrue(Long employeeId);

    // ===== Status Queries =====
    List<Customer> findByIsActiveTrue();
    List<Customer> findByIsBlockedTrue();

    // ===== Existence Checks =====
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);

    // ===== Count Queries =====
    long countByOrganizationId(Long organizationId);
    long countByOrganizationIdAndIsActiveTrue(Long organizationId);

    // ===== Search Queries =====
    @Query("SELECT c FROM Customer c WHERE " +
            "LOWER(c.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "c.phone LIKE CONCAT('%', :searchTerm, '%') OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Customer> searchCustomers(@Param("searchTerm") String searchTerm);

    @Query("SELECT c FROM Customer c WHERE c.organizationId = :orgId AND " +
            "(LOWER(c.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "c.phone LIKE CONCAT('%', :searchTerm, '%') OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Customer> searchCustomersInOrganization(@Param("orgId") Long orgId,
                                                 @Param("searchTerm") String searchTerm);

    // ===== Update Queries =====
    @Modifying
    @Transactional
    @Query("UPDATE Customer c SET c.isActive = :active WHERE c.id = :customerId")
    void updateActiveStatus(@Param("customerId") Long customerId, @Param("active") boolean active);

    @Modifying
    @Transactional
    @Query("UPDATE Customer c SET c.isBlocked = :blocked WHERE c.id = :customerId")
    void updateBlockStatus(@Param("customerId") Long customerId, @Param("blocked") boolean blocked);

    @Modifying
    @Transactional
    @Query("UPDATE Customer c SET c.routeId = :routeId WHERE c.id = :customerId")
    void assignRoute(@Param("customerId") Long customerId, @Param("routeId") Long routeId);

    @Modifying
    @Transactional
    @Query("UPDATE Customer c SET c.assignedEmployeeId = :employeeId WHERE c.id = :customerId")
    void assignEmployee(@Param("customerId") Long customerId, @Param("employeeId") Long employeeId);

    // ===== Financial Summary Updates =====
    @Modifying
    @Transactional
    @Query("UPDATE Customer c SET c.totalLoansTaken = c.totalLoansTaken + 1, " +
            "c.activeLoansCount = c.activeLoansCount + 1, " +
            "c.totalLoanAmountGiven = c.totalLoanAmountGiven + :loanAmount " +
            "WHERE c.id = :customerId")
    void addLoan(@Param("customerId") Long customerId, @Param("loanAmount") Double loanAmount);

    @Modifying
    @Transactional
    @Query("UPDATE Customer c SET c.totalAmountReceived = c.totalAmountReceived + :amount, " +
            "c.outstandingBalance = c.outstandingBalance - :amount " +
            "WHERE c.id = :customerId")
    void addCollection(@Param("customerId") Long customerId, @Param("amount") Double amount);

    @Modifying
    @Transactional
    @Query("UPDATE Customer c SET c.activeLoansCount = c.activeLoansCount - 1 " +
            "WHERE c.id = :customerId AND c.activeLoansCount > 0")
    void removeActiveLoan(@Param("customerId") Long customerId);
}