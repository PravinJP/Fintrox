package com.app.Fintrox.route.service;



import com.app.Fintrox.route.dto.request.RouteRequest;
import com.app.Fintrox.route.dto.response.RouteResponse;
import com.app.Fintrox.route.entity.Route;

import java.util.List;

public interface RouteService {

    RouteResponse createRoute(RouteRequest request, Long userId, Long organizationId);

    RouteResponse getRouteById(Long id);
    List<String> getDistinctAreasByOrganization(Long organizationId);

    List<RouteResponse> getRoutesByOrganization(Long organizationId);

    List<RouteResponse> getActiveRoutesByOrganization(Long organizationId);

    List<RouteResponse> getRoutesByEmployee(Long employeeId);

    List<RouteResponse> getRoutesAssignedToUser(Long userId);

    RouteResponse updateRoute(Long id, RouteRequest request, Long userId);

    void deleteRoute(Long id, Long userId);

    void activateRoute(Long id, Long userId);

    void deactivateRoute(Long id, Long userId);

    RouteResponse assignEmployee(Long routeId, Long employeeId, Long userId);

    RouteResponse assignSelf(Long routeId, Long userId);

    RouteResponse unassignEmployee(Long routeId, Long userId);

    List<RouteResponse> searchRoutes(String searchTerm, Long organizationId);

    RouteResponse getRouteDashboard(Long routeId);

    Route getRouteEntityById(Long id);
}