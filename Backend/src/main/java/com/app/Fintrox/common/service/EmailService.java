package com.app.Fintrox.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final RestTemplate restTemplate;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("sender", Map.of("email", fromEmail, "name", "Fintrox"));
            body.put("to", List.of(Map.of("email", toEmail)));
            body.put("subject", "Reset Your Fintrox Password");
            body.put("htmlContent", "<html><body>" +
                    "<p>Hi,</p>" +
                    "<p>We received a request to reset your Fintrox password.</p>" +
                    "<p><a href=\"" + resetLink + "\" style=\"background-color: #2D6A4F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;\">Reset Password</a></p>" +
                    "<p>This link expires in 1 hour.</p>" +
                    "<p>If you didn't request this, you can safely ignore this email.</p>" +
                    "<p>Thanks,<br>Fintrox Team</p>" +
                    "</body></html>");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            restTemplate.postForEntity("https://api.brevo.com/v3/smtp/email", request, String.class);

            log.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send email");
        }
    }
}