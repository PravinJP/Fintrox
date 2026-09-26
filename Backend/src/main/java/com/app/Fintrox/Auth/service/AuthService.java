package com.app.Fintrox.Auth.service;

import com.app.Fintrox.Auth.dto.request.ChangePasswordRequest;
import com.app.Fintrox.Auth.dto.request.ForgotPasswordRequest;
import com.app.Fintrox.Auth.dto.request.LoginRequest;
import com.app.Fintrox.Auth.dto.request.RegisterRequest;
import com.app.Fintrox.Auth.dto.response.AuthResponse;
import com.app.Fintrox.Auth.dto.response.UserResponse;
import com.app.Fintrox.Auth.entity.User;

public interface AuthService {

    
    AuthResponse login(LoginRequest request);

    
    AuthResponse register(RegisterRequest request);

    
    AuthResponse refreshToken(String refreshToken);

    
    void logout(String token);

    
    void forgotPassword(ForgotPasswordRequest request);

    
    void resetPassword(String token, String newPassword);

    
    void changePassword(ChangePasswordRequest request);

    
    User getCurrentUser();

    
    UserResponse getCurrentUserResponse();

    
    User getUserById(Long id);

    
    User getUserByEmail(String email);

    
    boolean isEmailAvailable(String email);

   
    boolean isPhoneAvailable(String phone);

    
    void activateUser(Long userId);

    
    void deactivateUser(Long userId);

    
    void verifyEmail(Long userId);

   
    void verifyPhone(Long userId);
}