package com.app.Fintrox.Auth.mapper;

import com.app.Fintrox.Auth.dto.request.RegisterRequest;
import com.app.Fintrox.Auth.dto.response.UserResponse;
import com.app.Fintrox.Auth.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(RegisterRequest request) {
        return User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .userType(user.getUserType().name())
                .organizationId(user.getOrganizationId())
                .isEmailVerified(user.isEmailVerified())
                .isPhoneVerified(user.isPhoneVerified())
                .build();
    }
}

