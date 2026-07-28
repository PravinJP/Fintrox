package com.app.Fintrox.route.service;



import com.app.Fintrox.Auth.entity.User;
import com.app.Fintrox.Auth.repository.UserRepository;
import com.app.Fintrox.route.dto.request.RouteRequest;
import com.app.Fintrox.route.dto.response.RouteResponse;
import com.app.Fintrox.route.entity.Route;
import com.app.Fintrox.route.mapper.RouteMapper;
import com.app.Fintrox.route.repository.RouteRepository;
import com.app.Fintrox.employee.entity.Employee;
import com.app.Fintrox.employee.repository.EmployeeRepository;
import com.app.Fintrox.organization.entity.Organization;
import com.app.Fintrox.organization.repository.OrganizationRepository;
import com.app.Fintrox.common.exceptions.BadRequestException;
import com.app.Fintrox.common.exceptions.ResourceNotFoundException;
import com.app.Fintrox.common.exceptions.UnauthorizedException;
import com.app.Fintrox.security.permissions.UserType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;
    private final OrganizationRepository organizationRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final RouteMapper routeMapper;

    @Override
    @Transactional
    public RouteResponse createRoute(RouteRequest request, Long ownerId) {
        // 1. Validate owner
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (owner.getUserType() != UserType.OWNER && owner.getUserType() != UserType.INDIVIDUAL_LENDER) {
            throw new UnauthorizedException("Only owners can create routes");
        }

        // 2. Get organization
        Organization organization = organizationRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new BadRequestException("Please create an organization first"));

        // 3. Check if route name already exists in organization
        if (routeRepository.existsByNameAndOrganizationId(request.getName(), organization.getId())) {
            throw new BadRequestException("Route name already exists in your organization");
        }

        // 4. Validate assigned employee if provided
        if (request.getAssignedEmployeeId() != null) {
            Employee employee = employeeRepository.findById(request.getAssignedEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
            if (!employee.getOrganizationId().equals(organization.getId())) {
                throw new BadRequestException("Employee does not belong to your organization");
            }
        }

        // 5. Create route
        Route route = routeMapper.toEntity(request, organization.getId(), ownerId);
        Route savedRoute = routeRepository.save(route);

        log.info("Route created: {} by owner: {}", savedRoute.getName(), owner.getEmail());

        return routeMapper.toResponseWithOrg(savedRoute, organization);
    }

    @Override
    public RouteResponse getRouteById(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        return routeMapper.toResponse(route);
    }

    @Override
    public List<RouteResponse> getRoutesByOrganization(Long organizationId) {
        List<Route> routes = routeRepository.findByOrganizationId(organizationId);
        return routes.stream()
                .map(route -> {
                    Organization org = organizationRepository.findById(organizationId).orElse(null);
                    return routeMapper.toResponseWithOrg(route, org);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<RouteResponse> getActiveRoutesByOrganization(Long organizationId) {
        List<Route> routes = routeRepository.findByOrganizationIdAndIsActiveTrue(organizationId);
        return routes.stream()
                .map(routeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RouteResponse> getRoutesByEmployee(Long employeeId) {
        List<Route> routes = routeRepository.findByAssignedEmployeeId(employeeId);
        return routes.stream()
                .map(route -> {
                    Employee emp = employeeRepository.findById(employeeId).orElse(null);
                    return routeMapper.toResponseWithEmployee(route, emp);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RouteResponse updateRoute(Long id, RouteRequest request, Long ownerId) {
        // 1. Find route
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));

        // 2. Validate owner access
        validateOwnerAccess(route.getOrganizationId(), ownerId);

        // 3. Check name uniqueness (if changed)
        if (request.getName() != null && !request.getName().equals(route.getName())) {
            if (routeRepository.existsByNameAndOrganizationId(request.getName(), route.getOrganizationId())) {
                throw new BadRequestException("Route name already exists in your organization");
            }
        }

        // 4. Update route
        routeMapper.updateEntity(request, route);
        Route updatedRoute = routeRepository.save(route);

        log.info("Route updated: {} by owner: {}", updatedRoute.getName(), ownerId);

        Organization org = organizationRepository.findById(route.getOrganizationId()).orElse(null);
        return routeMapper.toResponseWithOrg(updatedRoute, org);
    }

    @Override
    @Transactional
    public void deleteRoute(Long id, Long ownerId) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        validateOwnerAccess(route.getOrganizationId(), ownerId);

        route.setActive(false);
        routeRepository.save(route);

        log.info("Route deleted: {} by owner: {}", route.getName(), ownerId);
    }

    @Override
    @Transactional
    public void activateRoute(Long id, Long ownerId) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        validateOwnerAccess(route.getOrganizationId(), ownerId);
        route.setActive(true);
        routeRepository.save(route);
        log.info("Route activated: {}", route.getName());
    }

    @Override
    @Transactional
    public void deactivateRoute(Long id, Long ownerId) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        validateOwnerAccess(route.getOrganizationId(), ownerId);
        route.setActive(false);
        routeRepository.save(route);
        log.info("Route deactivated: {}", route.getName());
    }

    @Override
    @Transactional
    public RouteResponse assignEmployee(Long routeId, Long employeeId, Long ownerId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        validateOwnerAccess(route.getOrganizationId(), ownerId);

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (!employee.getOrganizationId().equals(route.getOrganizationId())) {
            throw new BadRequestException("Employee does not belong to this organization");
        }

        route.setAssignedEmployeeId(employeeId);
        routeRepository.save(route);

        log.info("Employee {} assigned to route: {}", employee.getEmail(), route.getName());

        return routeMapper.toResponseWithEmployee(route, employee);
    }

    @Override
    @Transactional
    public RouteResponse unassignEmployee(Long routeId, Long ownerId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        validateOwnerAccess(route.getOrganizationId(), ownerId);

        Employee employee = null;
        if (route.getAssignedEmployeeId() != null) {
            employee = employeeRepository.findById(route.getAssignedEmployeeId()).orElse(null);
        }

        route.setAssignedEmployeeId(null);
        routeRepository.save(route);

        log.info("Employee unassigned from route: {}", route.getName());

        return routeMapper.toResponseWithEmployee(route, employee);
    }

    @Override
    public List<RouteResponse> searchRoutes(String searchTerm, Long organizationId) {
        List<Route> routes;
        if (organizationId != null) {
            routes = routeRepository.searchRoutesInOrganization(organizationId, searchTerm);
        } else {
            routes = routeRepository.searchRoutes(searchTerm);
        }
        return routes.stream()
                .map(routeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RouteResponse getRouteDashboard(Long routeId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));

        // Get counts from repository
        Long customerCount = routeRepository.countCustomersByRoute(routeId);
        Long visitedCount = routeRepository.countVisitedCustomersByRoute(routeId);
        Double collectionAmount = routeRepository.getTotalCollectionByRoute(routeId);

        Long pendingCount = customerCount - visitedCount;

        Organization org = organizationRepository.findById(route.getOrganizationId()).orElse(null);
        Employee emp = route.getAssignedEmployeeId() != null ?
                employeeRepository.findById(route.getAssignedEmployeeId()).orElse(null) : null;

        return routeMapper.toResponseWithDetails(route, org, emp,
                customerCount.intValue(), visitedCount.intValue(),
                pendingCount.intValue(), collectionAmount);
    }

    @Override
    public Route getRouteEntityById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
    }

    // ===== Helper Methods =====

    private void validateOwnerAccess(Long organizationId, Long ownerId) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        if (!organization.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You don't have permission to access this route");
        }
    }
}
