package com.app.Fintrox.route.mapper;



import com.app.Fintrox.route.dto.request.RouteRequest;
import com.app.Fintrox.route.dto.response.RouteResponse;
import com.app.Fintrox.route.entity.Route;
import com.app.Fintrox.organization.entity.Organization;
import com.app.Fintrox.employee.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class RouteMapper {

    /**
     * Convert RouteRequest to Route entity
     */
    public Route toEntity(RouteRequest request, Long organizationId, Long createdBy) {
        return Route.builder()
                .name(request.getName())
                .description(request.getDescription())
                .area(request.getArea())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .organizationId(organizationId)
                .assignedEmployeeId(request.getAssignedEmployeeId())
                .isActive(true)
                .createdBy(createdBy)
                .build();
    }

    /**
     * Update existing Route entity with request data
     */
    public void updateEntity(RouteRequest request, Route route) {
        if (request.getName() != null) {
            route.setName(request.getName());
        }
        if (request.getDescription() != null) {
            route.setDescription(request.getDescription());
        }
        if (request.getArea() != null) {
            route.setArea(request.getArea());
        }
        if (request.getCity() != null) {
            route.setCity(request.getCity());
        }
        if (request.getState() != null) {
            route.setState(request.getState());
        }
        if (request.getPincode() != null) {
            route.setPincode(request.getPincode());
        }
        if (request.getAssignedEmployeeId() != null) {
            route.setAssignedEmployeeId(request.getAssignedEmployeeId());
        }
    }

    /**
     * Convert Route entity to RouteResponse DTO
     */
    public RouteResponse toResponse(Route route) {
        return RouteResponse.builder()
                .id(route.getId())
                .name(route.getName())
                .description(route.getDescription())
                .area(route.getArea())
                .city(route.getCity())
                .state(route.getState())
                .pincode(route.getPincode())
                .organizationId(route.getOrganizationId())
                .assignedEmployeeId(route.getAssignedEmployeeId())
                .isActive(route.isActive())
                .createdAt(route.getCreatedAt())
                .updatedAt(route.getUpdatedAt())
                .build();
    }

    /**
     * Convert Route to Response with Organization name
     */
    public RouteResponse toResponseWithOrg(Route route, Organization organization) {
        RouteResponse response = toResponse(route);
        if (organization != null) {
            response.setOrganizationName(organization.getName());
        }
        return response;
    }

    /**
     * Convert Route to Response with Employee name
     */
    public RouteResponse toResponseWithEmployee(Route route, Employee employee) {
        RouteResponse response = toResponse(route);
        if (employee != null) {
            response.setAssignedEmployeeName(employee.getFullName());
        }
        return response;
    }

    /**
     * Convert Route to Response with full details
     */
    public RouteResponse toResponseWithDetails(Route route, Organization organization,
                                               Employee employee, Integer customerCount,
                                               Integer visitedCount, Integer pendingCount,
                                               Double collectionAmount) {
        RouteResponse response = toResponse(route);
        if (organization != null) {
            response.setOrganizationName(organization.getName());
        }
        if (employee != null) {
            response.setAssignedEmployeeName(employee.getFullName());
        }
        response.setCustomerCount(customerCount != null ? customerCount : 0);
        response.setVisitedCount(visitedCount != null ? visitedCount : 0);
        response.setPendingCount(pendingCount != null ? pendingCount : 0);
        response.setCollectionAmount(collectionAmount != null ? collectionAmount : 0.0);
        return response;
    }
}
