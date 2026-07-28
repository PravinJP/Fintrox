package com.app.Fintrox.route.service;



import com.app.Fintrox.route.dto.request.RouteRequest;
import com.app.Fintrox.route.dto.response.RouteResponse;
import com.app.Fintrox.route.entity.Route;

import java.util.List;

public interface RouteService {

    /**
     * Create a new route (Owner only)
     */
    RouteResponse createRoute(RouteRequest request, Long ownerId);

    /**
     * Get route by ID
     */
    RouteResponse getRouteById(Long id);

    /**
     * Get all routes in an organization
     */
    List<RouteResponse> getRoutesByOrganization(Long organizationId);

    /**
     * Get active routes in an organization
     */
    List<RouteResponse> getActiveRoutesByOrganization(Long organizationId);

    /**
     * Get routes assigned to an employee
     */
    List<RouteResponse> getRoutesByEmployee(Long employeeId);

    /**
     * Update route details
     */
    RouteResponse updateRoute(Long id, RouteRequest request, Long ownerId);

    /**
     * Delete route (soft delete)
     */
    void deleteRoute(Long id, Long ownerId);

    /**
     * Activate route
     */
    void activateRoute(Long id, Long ownerId);

    /**
     * Deactivate route
     */
    void deactivateRoute(Long id, Long ownerId);

    /**
     * Assign employee to route
     */
    RouteResponse assignEmployee(Long routeId, Long employeeId, Long ownerId);

    /**
     * Unassign employee from route
     */
    RouteResponse unassignEmployee(Long routeId, Long ownerId);

    /**
     * Search routes
     */
    List<RouteResponse> searchRoutes(String searchTerm, Long organizationId);

    /**
     * Get route dashboard (with customer counts)
     */
    RouteResponse getRouteDashboard(Long routeId);

    /**
     * Get route entity by ID
     */
    Route getRouteEntityById(Long id);
}
