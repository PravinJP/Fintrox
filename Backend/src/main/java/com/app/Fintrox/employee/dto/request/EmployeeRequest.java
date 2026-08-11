package com.app.Fintrox.employee.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phone;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(COLLECTION_AGENT|FIELD_MANAGER|BRANCH_MANAGER)$",
            message = "Role must be COLLECTION_AGENT, FIELD_MANAGER, or BRANCH_MANAGER")
    private String role;

    private Long routeId;  // Optional

    private BigDecimal loanLimit;  // Optional - default 50000
    private BigDecimal monthlyTarget;  // Optional - default 500000
    private BigDecimal dailyTarget;  // Optional - default 25000

}