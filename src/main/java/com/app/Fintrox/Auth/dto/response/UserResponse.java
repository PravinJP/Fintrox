package com.app.Fintrox.Auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String userType;
    private Long organizationId;
    private Boolean isEmailVerified;
    private Boolean isPhoneVerified;
    private String createdAt;
    private String updatedAt;
}
