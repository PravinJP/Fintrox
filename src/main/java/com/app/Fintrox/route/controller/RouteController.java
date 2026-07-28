package com.app.Fintrox.route.controller;



import com.app.Fintrox.route.dto.request.RouteRequest;
import com.app.Fintrox.route.dto.response.RouteResponse;
import com.app.Fintrox.route.service.RouteService;
import com.app.Fintrox.common.responses.ApiResponse;
import com.app.Fintrox.common.exceptions.UnauthorizedException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
@Slf4j
public class RouteController {

    private final RouteService routeService;

    // ===== Route Management =====

    /**
     * Create a new route (Owner only)
     * POST /api/routes
     */
    @PostMapping
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(
            @Valid @RequestBody RouteRequest request) {
        Long ownerId = getCurrentUserId();
        log.info("Create route request for owner: {}", ownerId);
        RouteResponse response = routeService.createRoute(request, ownerId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Route created successfully", response));
    }

    /**
     * Get all routes in organization
     * GET /api/routes
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getAllRoutes() {
        Long userId = getCurrentUserId();
        // For MVP, get all routes for the user's organization
        // TODO: Get organizationId from user
        List<RouteResponse> responses = routeService.getRoutesByOrganization(1L);
        return ResponseEntity.ok(ApiResponse.success("Routes fetched successfully", responses));
    }

    /**
     * Get route by ID
     * GET /api/routes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRoute(@PathVariable Long id) {
        log.info("Get route request for id: {}", id);
        RouteResponse response = routeService.getRouteById(id);
        return ResponseEntity.ok(ApiResponse.success("Route details fetched", response));
    }

    /**
     * Update route
     * PUT /api/routes/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> updateRoute(
            @PathVariable Long id,
            @Valid @RequestBody RouteRequest request) {
        Long ownerId = getCurrentUserId();
        log.info("Update route request for id: {}", id);
        RouteResponse response = routeService.updateRoute(id, request, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Route updated successfully", response));
    }

    /**
     * Delete route (soft delete)
     * DELETE /api/routes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable Long id) {
        Long ownerId = getCurrentUserId();
        log.info("Delete route request for id: {}", id);
        routeService.deleteRoute(id, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Route deleted successfully"));
    }

    /**
     * Activate route
     * PATCH /api/routes/{id}/activate
     */
    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateRoute(@PathVariable Long id) {
        Long ownerId = getCurrentUserId();
        log.info("Activate route request for id: {}", id);
        routeService.activateRoute(id, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Route activated successfully"));
    }

    /**
     * Deactivate route
     * PATCH /api/routes/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateRoute(@PathVariable Long id) {
        Long ownerId = getCurrentUserId();
        log.info("Deactivate route request for id: {}", id);
        routeService.deactivateRoute(id, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Route deactivated successfully"));
    }

    // ===== Employee Assignment =====

    /**
     * Assign employee to route
     * PATCH /api/routes/{id}/assign-employee?employeeId=1
     */
    @PatchMapping("/{id}/assign-employee")
    public ResponseEntity<ApiResponse<RouteResponse>> assignEmployee(
            @PathVariable Long id,
            @RequestParam Long employeeId) {
        Long ownerId = getCurrentUserId();
        log.info("Assign employee {} to route: {}", employeeId, id);
        RouteResponse response = routeService.assignEmployee(id, employeeId, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Employee assigned successfully", response));
    }

    /**
     * Unassign employee from route
     * PATCH /api/routes/{id}/unassign-employee
     */
    @PatchMapping("/{id}/unassign-employee")
    public ResponseEntity<ApiResponse<RouteResponse>> unassignEmployee(@PathVariable Long id) {
        Long ownerId = getCurrentUserId();
        log.info("Unassign employee from route: {}", id);
        RouteResponse response = routeService.unassignEmployee(id, ownerId);
        return ResponseEntity.ok(ApiResponse.success("Employee unassigned successfully", response));
    }

    // ===== Route Dashboard =====

    /**
     * Get route dashboard (with customer counts)
     * GET /api/routes/{id}/dashboard
     */
    @GetMapping("/{id}/dashboard")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteDashboard(@PathVariable Long id) {
        log.info("Get route dashboard for id: {}", id);
        RouteResponse response = routeService.getRouteDashboard(id);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched", response));
    }

    // ===== Search =====

    /**
     * Search routes
     * GET /api/routes/search?query=andheri&organizationId=1
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> searchRoutes(
            @RequestParam String query,
            @RequestParam(required = false) Long organizationId) {
        log.info("Search routes with query: {}", query);
        List<RouteResponse> responses = routeService.searchRoutes(query, organizationId);
        return ResponseEntity.ok(ApiResponse.success("Search results", responses));
    }



    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof com.app.Fintrox.Auth.entity.User) {
            return ((com.app.Fintrox.Auth.entity.User) principal).getId();
        }
        throw new UnauthorizedException("User not properly authenticated");
    }
}
