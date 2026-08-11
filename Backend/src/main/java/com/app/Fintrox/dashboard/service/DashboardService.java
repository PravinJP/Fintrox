package com.app.Fintrox.dashboard.service;



import com.app.Fintrox.dashboard.dto.EmployeeDashboardResponse;
import com.app.Fintrox.dashboard.dto.LenderDashboardResponse;
import com.app.Fintrox.dashboard.dto.OwnerDashboardResponse;

public interface DashboardService {

    OwnerDashboardResponse getOwnerDashboard(Long organizationId);

    EmployeeDashboardResponse getEmployeeDashboard(Long employeeId, Long organizationId);

    LenderDashboardResponse getLenderDashboard(Long organizationId);
}
