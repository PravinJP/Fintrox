package com.app.Fintrox.employee.mapper;

import com.app.Fintrox.employee.dto.request.EmployeeRequest;
import com.app.Fintrox.employee.dto.response.EmployeeResponse;
import com.app.Fintrox.employee.entity.Employee;
import com.app.Fintrox.organization.entity.Organization;
import com.app.Fintrox.route.entity.Route;
import com.app.Fintrox.security.permissions.EmployeeRole;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class EmployeeMapper {

    public Employee toEntity(EmployeeRequest request, Long organizationId, Long createdBy, Long userId) {
        EmployeeRole role;
        try {
            role = EmployeeRole.valueOf(request.getRole());
        } catch (IllegalArgumentException e) {
            role = EmployeeRole.COLLECTION_AGENT;
        }

        return Employee.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(role)
                .organizationId(organizationId)
                .userId(userId)
                .routeId(request.getRouteId())
                .loanLimit(request.getLoanLimit() != null ? request.getLoanLimit() : new BigDecimal("50000"))
                .monthlyTarget(request.getMonthlyTarget() != null ? request.getMonthlyTarget() : new BigDecimal("500000"))
                .dailyTarget(request.getDailyTarget() != null ? request.getDailyTarget() : new BigDecimal("25000"))
                // ❌ REMOVED: commissionRate
                .isActive(true)
                .createdBy(createdBy)
                .build();
    }

    public void updateEntity(EmployeeRequest request, Employee employee) {
        if (request.getFullName() != null) {
            employee.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            employee.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            employee.setPhone(request.getPhone());
        }
        if (request.getRole() != null) {
            try {
                employee.setRole(EmployeeRole.valueOf(request.getRole()));
            } catch (IllegalArgumentException e) {
                // Keep existing role
            }
        }
        if (request.getRouteId() != null) {
            employee.setRouteId(request.getRouteId());
        }
        if (request.getLoanLimit() != null) {
            employee.setLoanLimit(request.getLoanLimit());
        }
        if (request.getMonthlyTarget() != null) {
            employee.setMonthlyTarget(request.getMonthlyTarget());
        }
        if (request.getDailyTarget() != null) {
            employee.setDailyTarget(request.getDailyTarget());
        }
    }

    public EmployeeResponse toResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .fullName(employee.getFullName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .employeeCode(employee.getEmployeeCode())
                .role(employee.getRole().name())
                .organizationId(employee.getOrganizationId())
                .userId(employee.getUserId())
                .routeId(employee.getRouteId())
                .loanLimit(employee.getLoanLimit())
                .monthlyTarget(employee.getMonthlyTarget())
                .dailyTarget(employee.getDailyTarget())
                // ❌ REMOVED: commissionRate
                .isActive(employee.isActive())
                .isOnline(employee.isOnline())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }

    public EmployeeResponse toResponseWithOrg(Employee employee, Organization organization) {
        EmployeeResponse response = toResponse(employee);
        if (organization != null) {
            response.setOrganizationName(organization.getName());
        }
        return response;
    }

    public EmployeeResponse toResponseWithRoute(Employee employee, String routeName) {
        EmployeeResponse response = toResponse(employee);
        if (routeName != null) {
            response.setRouteName(routeName);
        }
        return response;
    }

    public EmployeeResponse toResponseWithPerformance(Employee employee,
                                                      BigDecimal todayCollection,
                                                      BigDecimal monthlyCollection,
                                                      Integer assignedCustomers,
                                                      Integer visitedCustomers,
                                                      Integer overdueCustomers) {
        EmployeeResponse response = toResponse(employee);
        response.setTodayCollection(todayCollection != null ? todayCollection : BigDecimal.ZERO);
        response.setMonthlyCollection(monthlyCollection != null ? monthlyCollection : BigDecimal.ZERO);
        response.setAssignedCustomers(assignedCustomers != null ? assignedCustomers : 0);
        response.setVisitedCustomers(visitedCustomers != null ? visitedCustomers : 0);
        response.setOverdueCustomers(overdueCustomers != null ? overdueCustomers : 0);

        if (employee.getMonthlyTarget() != null && employee.getMonthlyTarget().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal monthlyCol = monthlyCollection != null ? monthlyCollection : BigDecimal.ZERO;
            BigDecimal achievement = monthlyCol
                    .multiply(new BigDecimal("100"))
                    .divide(employee.getMonthlyTarget(), 2, RoundingMode.HALF_UP);
            response.setTargetAchievementPercentage(achievement.doubleValue());
        } else {
            response.setTargetAchievementPercentage(0.0);
        }

        return response;
    }

    public EmployeeResponse toResponseWithRoute(Employee employee, Route route) {
        EmployeeResponse response = toResponse(employee);
        if (route != null) {
            response.setRouteName(route.getName());
            response.setRouteId(route.getId());
        } else if (employee.getRouteId() != null) {
            response.setRouteId(employee.getRouteId());
        }
        return response;
    }
}