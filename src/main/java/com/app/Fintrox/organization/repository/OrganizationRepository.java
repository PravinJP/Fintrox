package com.app.Fintrox.organization.repository;

import com.app.Fintrox.organization.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {



    /**
     * Find organization by ID
     */
    Optional<Organization> findById(Long id);

    /**
     * Find organization by GST (if provided)
     */
    Optional<Organization> findByGst(String gst);

    /**
     * Find organization by email
     */
    Optional<Organization> findByEmail(String email);

    /**
     * Find organization by phone
     */
    Optional<Organization> findByPhone(String phone);


    /**
     * Find organization by owner ID
     */
    Optional<Organization> findByOwnerId(Long ownerId);

    /**
     * Check if owner already has an organization
     */
    boolean existsByOwnerId(Long ownerId);


    /**
     * Check if organization exists by GST
     */
    boolean existsByGst(String gst);

    /**
     * Check if organization exists by email
     */
    boolean existsByEmail(String email);

    /**
     * Check if organization exists by phone
     */
    boolean existsByPhone(String phone);

    /**
     * Check if organization exists by name
     */
    boolean existsByName(String name);



    /**
     * Find all active organizations
     */
    List<Organization> findByIsActiveTrue();

    /**
     * Find all inactive organizations
     */
    List<Organization> findByIsActiveFalse();

    /**
     * Find active organizations by business type
     */
    List<Organization> findByIsActiveTrueAndBusinessType(String businessType);



    /**
     * Search organizations by name, email, or phone
     */
    @Query("SELECT o FROM Organization o WHERE " +
            "LOWER(o.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(o.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "o.phone LIKE CONCAT('%', :searchTerm, '%')")
    List<Organization> searchOrganizations(@Param("searchTerm") String searchTerm);

    /**
     * Search active organizations by name
     */
    @Query("SELECT o FROM Organization o WHERE " +
            "LOWER(o.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND " +
            "o.isActive = true")
    List<Organization> searchActiveOrganizations(@Param("searchTerm") String searchTerm);



    /**
     * Count total active organizations
     */
    long countByIsActiveTrue();

    /**
     * Count organizations by business type
     */
    long countByBusinessType(String businessType);



    /**
     * Update organization status (activate/deactivate)
     */
    @Modifying
    @Transactional
    @Query("UPDATE Organization o SET o.isActive = :active, o.updatedAt = CURRENT_TIMESTAMP WHERE o.id = :orgId")
    void updateActiveStatus(@Param("orgId") Long orgId, @Param("active") boolean active);

    /**
     * Update organization GST
     */
    @Modifying
    @Transactional
    @Query("UPDATE Organization o SET o.gst = :gst, o.updatedAt = CURRENT_TIMESTAMP WHERE o.id = :orgId")
    void updateGst(@Param("orgId") Long orgId, @Param("gst") String gst);



    /**
     * Find organization with owner details (eager loading)
     */
    @Query("SELECT o FROM Organization o WHERE o.id = :orgId")
    Optional<Organization> findOrganizationWithOwner(@Param("orgId") Long orgId);

    /**
     * Get all organization IDs for a list of IDs
     */
    @Query("SELECT o.id FROM Organization o WHERE o.id IN :ids")
    List<Long> findIdsByIdIn(@Param("ids") List<Long> ids);
}
