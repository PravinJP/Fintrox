package com.app.Fintrox.Auth.service;

import com.app.Fintrox.Auth.dto.request.ChangePasswordRequest;
import com.app.Fintrox.Auth.dto.request.ForgotPasswordRequest;
import com.app.Fintrox.Auth.dto.request.LoginRequest;
import com.app.Fintrox.Auth.dto.request.RegisterRequest;
import com.app.Fintrox.Auth.dto.response.AuthResponse;
import com.app.Fintrox.Auth.dto.response.UserResponse;
import com.app.Fintrox.Auth.entity.User;

public interface AuthService {

    /**
     * Authenticate user and generate JWT tokens
     */
    AuthResponse login(LoginRequest request);

    /**
     * Register new user (Owner or Individual Lender)
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Refresh access token using refresh token
     */
    AuthResponse refreshToken(String refreshToken);

    /**
     * Logout user - invalidate token
     */
    void logout(String token);

    /**
     * Send password reset link to email
     */
    void forgotPassword(ForgotPasswordRequest request);

    /**
     * Reset password using token
     */
    void resetPassword(String token, String newPassword);

    /**
     * Change password for authenticated user
     */
    void changePassword(ChangePasswordRequest request);

    /**
     * Get current authenticated user
     */
    User getCurrentUser();

    /**
     * Get current user details as response DTO
     */
    UserResponse getCurrentUserResponse();

    /**
     * Get user by ID
     */
    User getUserById(Long id);

    /**
     * Get user by email
     */
    User getUserByEmail(String email);

    /**
     * Validate if email is available for registration
     */
    boolean isEmailAvailable(String email);

    /**
     * Validate if phone is available for registration
     */
    boolean isPhoneAvailable(String phone);

    /**
     * Activate user account
     */
    void activateUser(Long userId);

    /**
     * Deactivate user account
     */
    void deactivateUser(Long userId);

    /**
     * Verify user email
     */
    void verifyEmail(Long userId);

    /**
     * Verify user phone
     */
    void verifyPhone(Long userId);
}