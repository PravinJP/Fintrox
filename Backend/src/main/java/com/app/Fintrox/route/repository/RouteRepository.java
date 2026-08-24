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

    Optional<Route> findById(Long id);
    Optional<Route> findByName(String name);

    List<Route> findByOrganizationId(Long organizationId);
    List<Route> findByOrganizationIdAndIsActiveTrue(Long organizationId);
    List<Route> findByOrganizationIdOrderByNameAsc(Long organizationId);

    List<Route> findByAssignedEmployeeId(Long employeeId);
    List<Route> findByAssignedEmployeeIdAndIsActiveTrue(Long employeeId);

    List<Route> findByIsActiveTrue();
    List<Route> findByIsActiveFalse();

    boolean existsByNameAndOrganizationId(String name, Long organizationId);
    boolean existsByAssignedEmployeeId(Long employeeId);

    long countByOrganizationId(Long organizationId);
    long countByOrganizationIdAndIsActiveTrue(Long organizationId);

    @Query("SELECT r FROM Route r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(r.area) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(r.city) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Route> searchRoutes(@Param("searchTerm") String searchTerm);

    @Query("SELECT r FROM Route r WHERE r.organizationId = :orgId AND (LOWER(r.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(r.area) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Route> searchRoutesInOrganization(@Param("orgId") Long orgId, @Param("searchTerm") String searchTerm);

    @Modifying
    @Transactional
    @Query("UPDATE Route r SET r.isActive = :active WHERE r.id = :routeId")
    void updateActiveStatus(@Param("routeId") Long routeId, @Param("active") boolean active);

    @Modifying
    @Transactional
    @Query("UPDATE Route r SET r.assignedEmployeeId = :employeeId WHERE r.id = :routeId")
    void assignEmployee(@Param("routeId") Long routeId, @Param("employeeId") Long employeeId);

    @Modifying
    @Transactional
    @Query("UPDATE Route r SET r.assignedEmployeeId = NULL WHERE r.assignedEmployeeId = :employeeId")
    void unassignEmployee(@Param("employeeId") Long employeeId);

    @Query(value = "SELECT COUNT(*) FROM customers c WHERE c.route_id = :routeId", nativeQuery = true)
    Long countCustomersByRoute(@Param("routeId") Long routeId);

    @Query(value = "SELECT COUNT(*) FROM customers c WHERE c.route_id = :routeId AND c.is_visited = true", nativeQuery = true)
    Long countVisitedCustomersByRoute(@Param("routeId") Long routeId);

    @Query(value = "SELECT COALESCE(SUM(c.amount), 0) FROM collections c WHERE c.route_id = :routeId", nativeQuery = true)
    Double getTotalCollectionByRoute(@Param("routeId") Long routeId);

    Optional<Route> findByOrganizationIdAndAssignedEmployeeId(Long organizationId, Long employeeId);
    Optional<Route> findByIdAndOrganizationId(Long id, Long organizationId);
    boolean existsByOrganizationIdAndName(Long organizationId, String name);

    @Query("SELECT r FROM Route r WHERE r.organizationId = :orgId AND r.isActive = :active")
    List<Route> findByOrganizationIdAndIsActive(@Param("orgId") Long orgId, @Param("active") boolean active);

    @Query("SELECT COUNT(r) FROM Route r WHERE r.organizationId = :orgId AND r.isActive = true")
    long countActiveRoutesByOrganization(@Param("orgId") Long orgId);

    @Query("SELECT r FROM Route r WHERE r.assignedEmployeeId = :employeeId AND r.isActive = true")
    List<Route> findActiveRoutesByEmployee(@Param("employeeId") Long employeeId);

    @Query(value = "SELECT * FROM routes WHERE organization_id = :orgId AND is_active = true ORDER BY name", nativeQuery = true)
    List<Route> findActiveRoutesByOrganizationNative(@Param("orgId") Long orgId);

    List<Route> findByOrganizationIdAndNameContainingIgnoreCase(Long organizationId, String name);

    @Query("SELECT DISTINCT r.area FROM Route r WHERE r.organizationId = :orgId")
    List<String> findDistinctAreasByOrganization(@Param("orgId") Long orgId);

    @Query("SELECT r FROM Route r WHERE r.organizationId = :orgId AND r.city = :city")
    List<Route> findByOrganizationIdAndCity(@Param("orgId") Long orgId, @Param("city") String city);
}