package com.app.Fintrox.Auth.service;

import com.app.Fintrox.Auth.dto.request.ChangePasswordRequest;
import com.app.Fintrox.Auth.dto.request.ForgotPasswordRequest;
import com.app.Fintrox.Auth.dto.request.LoginRequest;
import com.app.Fintrox.Auth.dto.request.RegisterRequest;
import com.app.Fintrox.Auth.dto.response.AuthResponse;
import com.app.Fintrox.Auth.dto.response.UserResponse;
import com.app.Fintrox.Auth.entity.User;
import com.app.Fintrox.Auth.mapper.UserMapper;
import com.app.Fintrox.Auth.repository.UserRepository;
import com.app.Fintrox.security.auth.JwtTokenProvider;
import com.app.Fintrox.security.permissions.UserType;
import com.app.Fintrox.common.exceptions.BadRequestException;
import com.app.Fintrox.common.exceptions.ResourceNotFoundException;
import com.app.Fintrox.common.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;

    @Override
    public AuthResponse login(LoginRequest request) {
        try {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);


            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));


            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            // Generate tokens
            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

            log.info("User logged in: {}", user.getEmail());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .userId(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .userType(user.getUserType().name())
                    .organizationId(user.getOrganizationId())
                    .isEmailVerified(user.isEmailVerified())
                    .build();

        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getEmail(), e);
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        // Check if phone already exists
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number already registered");
        }

        // ✅ FIXED: Create user with proper userType
        UserType userType;
        try {
            userType = UserType.valueOf(request.getUserType().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            userType = UserType.INDIVIDUAL_LENDER; // Default
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .userType(userType) // ✅ Explicitly set userType
                .isActive(true)
                .isEmailVerified(false)
                .isPhoneVerified(false)
                .build();

        // ✅ Log the user before saving for debugging
        log.info("Saving user: email={}, userType={}, fullName={}",
                user.getEmail(), user.getUserType(), user.getFullName());

        User savedUser = userRepository.save(user);

        log.info("User registered: {}", savedUser.getEmail());

        // Auto-login after registration
        LoginRequest loginRequest = LoginRequest.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .build();

        return login(loginRequest);
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user,
                null,
                user.getAuthorities()
        );

        String newAccessToken = jwtTokenProvider.generateAccessToken(authentication);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .userType(user.getUserType().name())
                .organizationId(user.getOrganizationId())
                .isEmailVerified(user.isEmailVerified())
                .build();
    }

    @Override
    public void logout(String token) {
        jwtTokenProvider.invalidateToken(token);
        log.info("User logged out");
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate reset token
        String resetToken = jwtTokenProvider.generatePasswordResetToken(request.getEmail());
        // TODO: Send email with reset link
        log.info("Password reset token generated for: {}", request.getEmail());
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException("Invalid or expired reset token");
        }

        String email = jwtTokenProvider.getEmailFromToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        log.info("Password reset for: {}", email);
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed for user: {}", user.getEmail());
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public UserResponse getCurrentUserResponse() {
        User user = getCurrentUser();
        return userMapper.toResponse(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    @Override
    public boolean isPhoneAvailable(String phone) {
        return !userRepository.existsByPhone(phone);
    }

    @Override
    @Transactional
    public void activateUser(Long userId) {
        userRepository.updateActiveStatus(userId, true);
        log.info("User activated: {}", userId);
    }

    @Override
    @Transactional
    public void deactivateUser(Long userId) {
        userRepository.updateActiveStatus(userId, false);
        log.info("User deactivated: {}", userId);
    }

    @Override
    @Transactional
    public void verifyEmail(Long userId) {
        userRepository.verifyEmail(userId);
        log.info("Email verified for user: {}", userId);
    }

    @Override
    @Transactional
    public void verifyPhone(Long userId) {
        userRepository.verifyPhone(userId);
        log.info("Phone verified for user: {}", userId);
    }
}