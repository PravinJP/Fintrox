package com.app.Fintrox.route.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponse {

    private Long id;
    private String name;
    private String description;
    private String area;
    private String city;
    private String state;
    private String pincode;
    private Long organizationId;
    private String organizationName;
    private Long assignedEmployeeId;
    private String assignedEmployeeName;
    private boolean isActive;
    private Integer customerCount;
    private Integer visitedCount;
    private Integer pendingCount;
    private Double collectionAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
