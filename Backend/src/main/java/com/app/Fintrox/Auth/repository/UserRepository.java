package com.app.Fintrox.Auth.repository;


import com.app.Fintrox.Auth.entity.User;
import com.app.Fintrox.security.permissions.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {




    Optional<User> findByEmail(String email);


    Optional<User> findById(Long id);


    Optional<User> findByPhone(String phone);




    boolean existsByEmail(String email);


    boolean existsByPhone(String phone);




    List<User> findByUserType(UserType userType);


    List<User> findByUserTypeAndIsActiveTrue(UserType userType);


    List<User> findByOrganizationId(Long organizationId);


    List<User> findByOrganizationIdAndIsActiveTrue(Long organizationId);


    List<User> findByOrganizationIdAndUserType(Long organizationId, UserType userType);


    List<User> findByOrganizationIdAndUserTypeAndIsActiveTrue(Long organizationId, UserType userType);

    // ===== Employee-specific Queries =====


    Optional<User> findByEmployeeId(Long employeeId);


    @Query("SELECT u FROM User u WHERE u.employeeId IS NOT NULL")
    List<User> findAllEmployees();


    @Query("SELECT u FROM User u WHERE u.organizationId = :orgId AND u.employeeId IS NOT NULL")
    List<User> findEmployeesByOrganization(@Param("orgId") Long orgId);


    List<User> findByIsActiveTrue();


    List<User> findByIsActiveFalse();


    List<User> findByIsEmailVerified(boolean isEmailVerified);

    @Query("SELECT u FROM User u WHERE u.isEmailVerified = false AND u.createdAt < :date")
    List<User> findUnverifiedUsersOlderThan(@Param("date") LocalDateTime date);


    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "u.phone LIKE CONCAT('%', :searchTerm, '%')")
    List<User> searchUsers(@Param("searchTerm") String searchTerm);


    @Query("SELECT u FROM User u WHERE u.organizationId = :orgId AND " +
            "(LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "u.phone LIKE CONCAT('%', :searchTerm, '%'))")
    List<User> searchUsersInOrganization(@Param("orgId") Long orgId, @Param("searchTerm") String searchTerm);


    long countByOrganizationId(Long organizationId);


    long countByOrganizationIdAndIsActiveTrue(Long organizationId);


    long countByOrganizationIdAndUserType(Long organizationId, UserType userType);

    /**
     * Count users by type across all organizations
     */
    long countByUserType(UserType userType);

    // ===== Update Queries =====

    /**
     * Update last login timestamp
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastLogin = :lastLogin WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") Long userId, @Param("lastLogin") LocalDateTime lastLogin);

    /**
     * Activate/deactivate user
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.isActive = :active WHERE u.id = :userId")
    void updateActiveStatus(@Param("userId") Long userId, @Param("active") boolean active);

    /**
     * Verify user's email
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.isEmailVerified = true WHERE u.id = :userId")
    void verifyEmail(@Param("userId") Long userId);

    /**
     * Verify user's phone
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.isPhoneVerified = true WHERE u.id = :userId")
    void verifyPhone(@Param("userId") Long userId);

    // ===== Custom JPQL Queries =====

    /**
     * Find users with their organization and employee details (eager loading)
     */
    @Query("SELECT u FROM User u WHERE u.id = :userId")
    Optional<User> findUserWithDetails(@Param("userId") Long userId);

    /**
     * Find all users who logged in within a date range
     */
    @Query("SELECT u FROM User u WHERE u.lastLogin BETWEEN :startDate AND :endDate")
    List<User> findUsersByLastLoginBetween(@Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    /**
     * Find users who haven't logged in for X days
     */
    @Query("SELECT u FROM User u WHERE u.lastLogin < :date AND u.isActive = true")
    List<User> findInactiveUsers(@Param("date") LocalDateTime date);

    /**
     * Find users by organization and search term with pagination support
     * (This works with Pageable in service layer)
     */
    @Query("SELECT u FROM User u WHERE u.organizationId = :orgId AND " +
            "(:searchTerm IS NULL OR " +
            "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<User> findUsersByOrganizationAndSearch(@Param("orgId") Long orgId,
                                                @Param("searchTerm") String searchTerm);

    // ===== Deletion Queries =====

    /**
     * Soft delete user (set active to false)
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.isActive = false, u.updatedAt = :updatedAt WHERE u.id = :userId")
    void softDeleteUser(@Param("userId") Long userId, @Param("updatedAt") LocalDateTime updatedAt);

    /**
     * Hard delete user (use with caution!)
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM User u WHERE u.id = :userId")
    void hardDeleteUser(@Param("userId") Long userId);
}