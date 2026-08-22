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
    public RouteResponse createRoute(RouteRequest request, Long userId, Long organizationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BadRequestException("Route name is required");
        }

        boolean routeExists = routeRepository.existsByNameAndOrganizationId(request.getName(), organizationId);
        if (routeExists) {
            throw new BadRequestException("Route name already exists in your organization");
        }

        Route route = new Route();
        route.setName(request.getName());
        route.setDescription(request.getDescription());
        route.setArea(request.getArea());
        route.setCity(request.getCity());
        route.setState(request.getState());
        route.setPincode(request.getPincode());
        route.setOrganizationId(organizationId);
        route.setCreatedBy(userId);
        route.setActive(true);

        if (user.getUserType() == UserType.INDIVIDUAL_LENDER) {
            Employee selfEmployee = employeeRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Employee record not found for lender. Please contact support."));
            route.setAssignedEmployeeId(selfEmployee.getId());
        } else if (request.getAssignedEmployeeId() != null) {
            Employee employee = employeeRepository.findById(request.getAssignedEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
            if (!employee.getOrganizationId().equals(organizationId)) {
                throw new BadRequestException("Employee does not belong to your organization");
            }
            route.setAssignedEmployeeId(request.getAssignedEmployeeId());
        }

        Route savedRoute = routeRepository.save(route);
        log.info("Route created: {} by user: {}", savedRoute.getName(), user.getEmail());
        return routeMapper.toResponse(savedRoute);
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
                .map(routeMapper::toResponse)
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
                .map(routeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RouteResponse> getRoutesAssignedToUser(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for user"));
        return getRoutesByEmployee(employee.getId());
    }

    @Override
    @Transactional
    public RouteResponse updateRoute(Long id, RouteRequest request, Long userId) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));

        validateRouteOwnership(route, userId);

        if (request.getName() != null && !request.getName().equals(route.getName())) {
            boolean routeExists = routeRepository.existsByNameAndOrganizationId(request.getName(), route.getOrganizationId());
            if (routeExists) {
                throw new BadRequestException("Route name already exists in your organization");
            }
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

        Route updatedRoute = routeRepository.save(route);
        log.info("Route updated: {} by user: {}", updatedRoute.getName(), userId);
        return routeMapper.toResponse(updatedRoute);
    }

    @Override
    @Transactional
    public void deleteRoute(Long id, Long userId) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        validateRouteOwnership(route, userId);
        route.setActive(false);
        routeRepository.save(route);
        log.info("Route deleted: {} by user: {}", route.getName(), userId);
    }

    @Override
    @Transactional
    public void activateRoute(Long id, Long userId) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        validateRouteOwnership(route, userId);
        route.setActive(true);
        routeRepository.save(route);
        log.info("Route activated: {}", route.getName());
    }

    @Override
    @Transactional
    public void deactivateRoute(Long id, Long userId) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        validateRouteOwnership(route, userId);
        route.setActive(false);
        routeRepository.save(route);
        log.info("Route deactivated: {}", route.getName());
    }

    @Override
    @Transactional
    public RouteResponse assignEmployee(Long routeId, Long employeeId, Long userId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getUserType() == UserType.INDIVIDUAL_LENDER) {
            Employee selfEmployee = employeeRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Employee record not found"));
            if (!selfEmployee.getId().equals(employeeId)) {
                throw new BadRequestException("Individual lender can only assign routes to themselves");
            }
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (!employee.getOrganizationId().equals(route.getOrganizationId())) {
            throw new BadRequestException("Employee does not belong to this organization");
        }

        route.setAssignedEmployeeId(employeeId);
        Route updatedRoute = routeRepository.save(route);
        log.info("Employee {} assigned to route: {} by user: {}", employeeId, route.getName(), userId);
        return routeMapper.toResponse(updatedRoute);
    }

    @Override
    @Transactional
    public RouteResponse assignSelf(Long routeId, Long userId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getUserType() != UserType.INDIVIDUAL_LENDER) {
            throw new BadRequestException("Only individual lenders can assign routes to themselves");
        }

        Employee selfEmployee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee record not found for lender"));

        if (!selfEmployee.getOrganizationId().equals(route.getOrganizationId())) {
            throw new BadRequestException("Route does not belong to your organization");
        }

        route.setAssignedEmployeeId(selfEmployee.getId());
        Route updatedRoute = routeRepository.save(route);
        log.info("Route assigned to self: {} by lender: {}", route.getName(), user.getEmail());
        return routeMapper.toResponse(updatedRoute);
    }

    @Override
    @Transactional
    public RouteResponse unassignEmployee(Long routeId, Long userId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        validateRouteOwnership(route, userId);

        route.setAssignedEmployeeId(null);
        Route updatedRoute = routeRepository.save(route);
        log.info("Employee unassigned from route: {} by user: {}", route.getName(), userId);
        return routeMapper.toResponse(updatedRoute);
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

    private void validateRouteOwnership(Route route, Long userId) {
        Organization organization = organizationRepository.findById(route.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!organization.getOwnerId().equals(userId) && user.getUserType() != UserType.INDIVIDUAL_LENDER) {
            throw new UnauthorizedException("You don't have permission to access this route");
        }

        if (user.getUserType() == UserType.INDIVIDUAL_LENDER) {
            Employee selfEmployee = employeeRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
            if (!route.getAssignedEmployeeId().equals(selfEmployee.getId())) {
                throw new UnauthorizedException("You don't have permission to access this route");
            }
        }
    }

    @Override
    public List<String> getDistinctAreasByOrganization(Long organizationId) {
        return routeRepository.findDistinctAreasByOrganization(organizationId);
    }
}