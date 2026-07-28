package com.app.Fintrox.route.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteRequest {

    @NotBlank(message = "Route name is required")
    @Size(min = 2, max = 100, message = "Route name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    private String area;
    private String city;
    private String state;
    private String pincode;

    private Long assignedEmployeeId;  // Optional - can assign later
}
