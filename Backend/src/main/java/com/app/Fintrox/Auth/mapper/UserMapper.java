package com.app.Fintrox.Auth.mapper;

import com.app.Fintrox.Auth.dto.request.RegisterRequest;
import com.app.Fintrox.Auth.dto.response.UserResponse;
import com.app.Fintrox.Auth.entity.User;
import com.app.Fintrox.security.permissions.UserType;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class UserMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Convert RegisterRequest to User entity
     */
    public User toEntity(RegisterRequest request) {
        // ✅ FIXED: Explicitly set userType
        UserType userType;
        try {
            userType = UserType.valueOf(request.getUserType().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            // Default to INDIVIDUAL_LENDER if not provided or invalid
            userType = UserType.INDIVIDUAL_LENDER;
        }

        return User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(null) // Password will be set separately in service
                .userType(userType) // ✅ Explicitly set userType
                .isActive(true)
                .isEmailVerified(false)
                .isPhoneVerified(false)
                .build();
    }


    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .userType(user.getUserType() != null ? user.getUserType().name() : null)
                .organizationId(user.getOrganizationId())
                .isEmailVerified(user.isEmailVerified())
                .isPhoneVerified(user.isPhoneVerified())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().format(DATE_FORMATTER) : null)
                .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().format(DATE_FORMATTER) : null)
                .build();
    }


    public void updateEntity(RegisterRequest request, User user) {
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getUserType() != null) {
            try {
                user.setUserType(UserType.valueOf(request.getUserType().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Keep existing userType
            }
        }
    }
}