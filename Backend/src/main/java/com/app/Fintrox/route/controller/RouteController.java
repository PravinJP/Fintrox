package com.app.Fintrox.route.controller;

import com.app.Fintrox.route.dto.request.RouteRequest;
import com.app.Fintrox.route.dto.response.RouteResponse;
import com.app.Fintrox.route.service.RouteService;
import com.app.Fintrox.common.responses.ApiResponse;
import com.app.Fintrox.common.exceptions.BadRequestException;
import com.app.Fintrox.common.exceptions.UnauthorizedException;
import com.app.Fintrox.Auth.entity.User;
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

    @PostMapping
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(
            @Valid @RequestBody RouteRequest request) {
        Long userId = getCurrentUserId();
        Long organizationId = getCurrentOrganizationId();
        log.info("Create route request for user: {}", userId);
        RouteResponse response = routeService.createRoute(request, userId, organizationId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Route created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRoute(
            @PathVariable("id") Long id) {
        log.info("Get route request for id: {}", id);
        RouteResponse response = routeService.getRouteById(id);
        return ResponseEntity.ok(ApiResponse.success("Route details fetched", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getAllRoutes() {
        Long organizationId = getCurrentOrganizationId();
        List<RouteResponse> responses = routeService.getRoutesByOrganization(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Routes fetched successfully", responses));
    }

    @GetMapping("/my-routes")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getMyRoutes() {
        Long userId = getCurrentUserId();
        List<RouteResponse> responses = routeService.getRoutesAssignedToUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Your routes fetched successfully", responses));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> updateRoute(
            @PathVariable("id") Long id,
            @Valid @RequestBody RouteRequest request) {
        Long userId = getCurrentUserId();
        log.info("Update route request for id: {}", id);
        RouteResponse response = routeService.updateRoute(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Route updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(
            @PathVariable("id") Long id) {
        Long userId = getCurrentUserId();
        log.info("Delete route request for id: {}", id);
        routeService.deleteRoute(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Route deleted successfully"));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateRoute(
            @PathVariable("id") Long id) {
        Long userId = getCurrentUserId();
        log.info("Activate route request for id: {}", id);
        routeService.activateRoute(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Route activated successfully"));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateRoute(
            @PathVariable("id") Long id) {
        Long userId = getCurrentUserId();
        log.info("Deactivate route request for id: {}", id);
        routeService.deactivateRoute(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Route deactivated successfully"));
    }

    @PatchMapping("/{id}/assign-employee")
    public ResponseEntity<ApiResponse<RouteResponse>> assignEmployee(
            @PathVariable("id") Long id,
            @RequestParam("employeeId") Long employeeId) {
        Long userId = getCurrentUserId();
        log.info("Assign employee {} to route: {}", employeeId, id);
        RouteResponse response = routeService.assignEmployee(id, employeeId, userId);
        return ResponseEntity.ok(ApiResponse.success("Employee assigned successfully", response));
    }

    @PatchMapping("/{id}/assign-self")
    public ResponseEntity<ApiResponse<RouteResponse>> assignSelf(
            @PathVariable("id") Long id) {
        Long userId = getCurrentUserId();
        log.info("Assign self to route: {}", id);
        RouteResponse response = routeService.assignSelf(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Route assigned to you successfully", response));
    }

    @PatchMapping("/{id}/unassign-employee")
    public ResponseEntity<ApiResponse<RouteResponse>> unassignEmployee(
            @PathVariable("id") Long id) {
        Long userId = getCurrentUserId();
        log.info("Unassign employee from route: {}", id);
        RouteResponse response = routeService.unassignEmployee(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Employee unassigned successfully", response));
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteDashboard(
            @PathVariable("id") Long id) {
        log.info("Get route dashboard for id: {}", id);
        RouteResponse response = routeService.getRouteDashboard(id);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched", response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> searchRoutes(
            @RequestParam("query") String query,
            @RequestParam(value = "organizationId", required = false) Long organizationId) {
        log.info("Search routes with query: {}", query);
        List<RouteResponse> responses = routeService.searchRoutes(query, organizationId);
        return ResponseEntity.ok(ApiResponse.success("Search results", responses));
    }

    @GetMapping("/areas")
    public ResponseEntity<ApiResponse<List<String>>> getDistinctAreas() {
        Long organizationId = getCurrentOrganizationId();
        List<String> areas = routeService.getDistinctAreasByOrganization(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Areas fetched successfully", areas));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getActiveRoutes() {
        Long organizationId = getCurrentOrganizationId();
        List<RouteResponse> responses = routeService.getActiveRoutesByOrganization(organizationId);
        return ResponseEntity.ok(ApiResponse.success("Active routes fetched", responses));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            return ((User) principal).getId();
        }
        throw new UnauthorizedException("User not properly authenticated");
    }

    private Long getCurrentOrganizationId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long orgId = user.getOrganizationId();
            if (orgId == null) {
                throw new BadRequestException("User does not belong to any organization");
            }
            return orgId;
        }
        throw new UnauthorizedException("User not properly authenticated");
    }
}