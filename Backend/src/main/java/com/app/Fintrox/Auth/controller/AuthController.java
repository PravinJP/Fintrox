package com.app.Fintrox.Auth.controller;




import com.app.Fintrox.Auth.dto.request.ChangePasswordRequest;
import com.app.Fintrox.Auth.dto.request.ForgotPasswordRequest;
import com.app.Fintrox.Auth.dto.request.LoginRequest;
import com.app.Fintrox.Auth.dto.request.RegisterRequest;
import com.app.Fintrox.Auth.dto.response.AuthResponse;
import com.app.Fintrox.Auth.dto.response.UserResponse;
import com.app.Fintrox.Auth.service.AuthService;
import com.app.Fintrox.common.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    // ===== Authentication Endpoints =====


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        log.info("Registration request for email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", response));
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        log.info("Login request for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }


    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestHeader("Authorization") String refreshToken) {
        log.info("Refresh token request");
        // Remove "Bearer " prefix if present
        String token = refreshToken.startsWith("Bearer ") ? refreshToken.substring(7) : refreshToken;
        AuthResponse response = authService.refreshToken(token);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", response));
    }


    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = "Authorization", required = false) String token) {
        log.info("Logout request");
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            authService.logout(jwt);
        }
        return ResponseEntity.ok(ApiResponse.success("Logout successful"));
    }

    // ===== Password Management Endpoints =====


    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Forgot password request for email: {}", request.getEmail());
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset link sent to your email"));
    }


    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {
        log.info("Reset password request");
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(ApiResponse.success("Password reset successful"));
    }


    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        log.info("Change password request");
        authService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    // ===== User Info Endpoints =====


    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        log.info("Get current user request");
        UserResponse user = authService.getCurrentUserResponse();
        return ResponseEntity.ok(ApiResponse.success("User details fetched", user));
    }


    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Boolean>> checkEmailAvailability(
            @RequestParam String email) {
        log.info("Check email availability: {}", email);
        boolean isAvailable = authService.isEmailAvailable(email);
        return ResponseEntity.ok(ApiResponse.success(
                isAvailable ? "Email is available" : "Email is already taken",
                isAvailable
        ));
    }


    @GetMapping("/check-phone")
    public ResponseEntity<ApiResponse<Boolean>> checkPhoneAvailability(
            @RequestParam String phone) {
        log.info("Check phone availability: {}", phone);
        boolean isAvailable = authService.isPhoneAvailable(phone);
        return ResponseEntity.ok(ApiResponse.success(
                isAvailable ? "Phone is available" : "Phone is already registered",
                isAvailable
        ));
    }

    // ===== User Management Endpoints (Admin/Owner Only) =====


    @PatchMapping("/users/{userId}/activate")
    public ResponseEntity<ApiResponse<Void>> activateUser(
            @PathVariable Long userId) {
        log.info("Activate user request for userId: {}", userId);
        authService.activateUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User activated successfully"));
    }


    @PatchMapping("/users/{userId}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(
            @PathVariable Long userId) {
        log.info("Deactivate user request for userId: {}", userId);
        authService.deactivateUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User deactivated successfully"));
    }


    @PatchMapping("/users/{userId}/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(
            @PathVariable Long userId) {
        log.info("Verify email request for userId: {}", userId);
        authService.verifyEmail(userId);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully"));
    }


    @PatchMapping("/users/{userId}/verify-phone")
    public ResponseEntity<ApiResponse<Void>> verifyPhone(
            @PathVariable Long userId) {
        log.info("Verify phone request for userId: {}", userId);
        authService.verifyPhone(userId);
        return ResponseEntity.ok(ApiResponse.success("Phone verified successfully"));
    }

    // ===== Health Check Endpoint =====


    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Auth service is running", "OK"));
    }
}