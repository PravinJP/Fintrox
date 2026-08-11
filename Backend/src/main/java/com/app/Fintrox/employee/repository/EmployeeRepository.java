package com.app.Fintrox.employee.repository;

import com.app.Fintrox.employee.entity.Employee;
import com.app.Fintrox.security.permissions.EmployeeRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // ===== Basic Find Methods =====
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Optional<Employee> findByUserId(Long userId);
    Optional<Employee> findById(Long id);

    // ===== Organization-based Queries =====
    List<Employee> findByOrganizationId(Long organizationId);
    List<Employee> findByOrganizationIdAndIsActiveTrue(Long organizationId);
    List<Employee> findByOrganizationIdAndRole(Long organizationId, EmployeeRole role);


    List<Employee> findByRouteId(Long routeId);
    List<Employee> findByRouteIdAndIsActiveTrue(Long routeId);

    // ===== Status Queries =====
    List<Employee> findByIsActiveTrue();
    List<Employee> findByIsOnlineTrue();

    // ===== Existence Checks =====
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByEmployeeCode(String employeeCode);

    // ===== Count Queries =====
    long countByOrganizationId(Long organizationId);
    long countByOrganizationIdAndIsActiveTrue(Long organizationId);
    long countByOrganizationIdAndRole(Long organizationId, EmployeeRole role);

    // ===== Search Queries =====
    @Query("SELECT e FROM Employee e WHERE " +
            "LOWER(e.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "e.phone LIKE CONCAT('%', :searchTerm, '%') OR " +
            "e.employeeCode LIKE CONCAT('%', :searchTerm, '%')")
    List<Employee> searchEmployees(@Param("searchTerm") String searchTerm);

    @Query("SELECT e FROM Employee e WHERE e.organizationId = :orgId AND " +
            "(LOWER(e.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "e.phone LIKE CONCAT('%', :searchTerm, '%'))")
    List<Employee> searchEmployeesInOrganization(@Param("orgId") Long orgId,
                                                 @Param("searchTerm") String searchTerm);

    // ===== Update Queries =====
    @Modifying
    @Transactional
    @Query("UPDATE Employee e SET e.isActive = :active, e.updatedAt = CURRENT_TIMESTAMP WHERE e.id = :employeeId")
    void updateActiveStatus(@Param("employeeId") Long employeeId, @Param("active") boolean active);

    @Modifying
    @Transactional
    @Query("UPDATE Employee e SET e.routeId = :routeId, e.updatedAt = CURRENT_TIMESTAMP WHERE e.id = :employeeId")
    void assignRoute(@Param("employeeId") Long employeeId, @Param("routeId") Long routeId);

    @Modifying
    @Transactional
    @Query("UPDATE Employee e SET e.isOnline = :online, e.lastCheckIn = CURRENT_TIMESTAMP WHERE e.id = :employeeId")
    void updateOnlineStatus(@Param("employeeId") Long employeeId, @Param("online") boolean online);

    @Modifying
    @Transactional
    @Query("UPDATE Employee e SET e.currentLatitude = :latitude, e.currentLongitude = :longitude, " +
            "e.lastCheckIn = CURRENT_TIMESTAMP WHERE e.id = :employeeId")
    void updateLocation(@Param("employeeId") Long employeeId,
                        @Param("latitude") Double latitude,
                        @Param("longitude") Double longitude);

    // ===== Custom Queries =====
    // ✅ REMOVED: findEmployeeWithRoute - causing the error

    @Query("SELECT e FROM Employee e WHERE e.organizationId = :orgId AND e.isOnline = true")
    List<Employee> findOnlineEmployeesByOrganization(@Param("orgId") Long orgId);

    @Query("SELECT e FROM Employee e WHERE e.organizationId = :orgId ORDER BY e.monthlyTarget DESC")
    List<Employee> findEmployeesByTarget(@Param("orgId") Long orgId);
}