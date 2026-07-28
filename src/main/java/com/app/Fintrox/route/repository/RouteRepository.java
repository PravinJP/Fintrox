package com.app.Fintrox.route.repository;

import com.app.Fintrox.route.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {

    // ===== Basic Find Methods =====
    Optional<Route> findById(Long id);
    Optional<Route> findByName(String name);

    // ===== Organization-based Queries =====
    List<Route> findByOrganizationId(Long organizationId);
    List<Route> findByOrganizationIdAndIsActiveTrue(Long organizationId);
    List<Route> findByOrganizationIdOrderByNameAsc(Long organizationId);

    // ===== Employee-based Queries =====
    List<Route> findByAssignedEmployeeId(Long employeeId);
    List<Route> findByAssignedEmployeeIdAndIsActiveTrue(Long employeeId);

    // ===== Active/Inactive Queries =====
    List<Route> findByIsActiveTrue();
    List<Route> findByIsActiveFalse();

    // ===== Existence Checks =====
    boolean existsByNameAndOrganizationId(String name, Long organizationId);
    boolean existsByAssignedEmployeeId(Long employeeId);

    // ===== Count Queries =====
    long countByOrganizationId(Long organizationId);
    long countByOrganizationIdAndIsActiveTrue(Long organizationId);

    // ===== Search Queries =====
    @Query("SELECT r FROM Route r WHERE " +
            "LOWER(r.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(r.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(r.area) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(r.city) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Route> searchRoutes(@Param("searchTerm") String searchTerm);

    @Query("SELECT r FROM Route r WHERE r.organizationId = :orgId AND " +
            "(LOWER(r.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(r.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(r.area) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Route> searchRoutesInOrganization(@Param("orgId") Long orgId,
                                           @Param("searchTerm") String searchTerm);

    // ===== Update Queries =====
    @Modifying
    @Transactional
    @Query("UPDATE Route r SET r.isActive = :active, r.updatedAt = CURRENT_TIMESTAMP WHERE r.id = :routeId")
    void updateActiveStatus(@Param("routeId") Long routeId, @Param("active") boolean active);

    @Modifying
    @Transactional
    @Query("UPDATE Route r SET r.assignedEmployeeId = :employeeId, r.updatedAt = CURRENT_TIMESTAMP WHERE r.id = :routeId")
    void assignEmployee(@Param("routeId") Long routeId, @Param("employeeId") Long employeeId);

    @Modifying
    @Transactional
    @Query("UPDATE Route r SET r.assignedEmployeeId = NULL, r.updatedAt = CURRENT_TIMESTAMP WHERE r.assignedEmployeeId = :employeeId")
    void unassignEmployee(@Param("employeeId") Long employeeId);

    // ===== Custom Queries =====
    @Query("SELECT r FROM Route r JOIN FETCH r.organization WHERE r.id = :routeId")
    Optional<Route> findRouteWithOrganization(@Param("routeId") Long routeId);

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.routeId = :routeId")
    Long countCustomersByRoute(@Param("routeId") Long routeId);

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.routeId = :routeId AND c.isVisited = true")
    Long countVisitedCustomersByRoute(@Param("routeId") Long routeId);

    @Query("SELECT SUM(c.amount) FROM Collection c WHERE c.routeId = :routeId")
    Double getTotalCollectionByRoute(@Param("routeId") Long routeId);
}
