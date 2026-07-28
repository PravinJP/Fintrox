package com.app.Fintrox.employee.service;



import com.app.Fintrox.Auth.entity.User;
import com.app.Fintrox.Auth.repository.UserRepository;
import com.app.Fintrox.employee.dto.request.EmployeeRequest;
import com.app.Fintrox.employee.dto.response.EmployeeResponse;
import com.app.Fintrox.employee.entity.Employee;
import com.app.Fintrox.employee.mapper.EmployeeMapper;
import com.app.Fintrox.employee.repository.EmployeeRepository;


import com.app.Fintrox.common.exceptions.BadRequestException;
import com.app.Fintrox.common.exceptions.ResourceNotFoundException;
import com.app.Fintrox.common.exceptions.UnauthorizedException;
import com.app.Fintrox.organization.entity.Organization;
import com.app.Fintrox.organization.repository.OrganizationRepository;
import com.app.Fintrox.security.permissions.UserType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final RouteRepository routeRepository;
    private final EmployeeMapper employeeMapper;
    private final PasswordEncoder passwordEncoder;

    private static final String TEMP_PASSWORD = "Temp@123456";

    @Override
    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request, Long ownerId) {
        // 1. Validate owner exists
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2. Check if user is OWNER or INDIVIDUAL_LENDER
        if (owner.getUserType() != UserType.OWNER && owner.getUserType() != UserType.INDIVIDUAL_LENDER) {
            throw new UnauthorizedException("Only owners can create employees");
        }

        // 3. Get organization
        Organization organization = organizationRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new BadRequestException("Please create an organization first"));

        // 4. Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        // 5. Check if phone already exists
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number already registered");
        }

        // 6. Validate route if provided
        if (request.getRouteId() != null) {
            RouteMatcher.Route route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
            if (!route.getOrganizationId().equals(organization.getId())) {
                throw new BadRequestException("Route does not belong to your organization");
            }
        }

        // 7. Create User account for employee
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(TEMP_PASSWORD))
                .userType(UserType.EMPLOYEE)
                .organizationId(organization.getId())
                .isActive(true)
                .isEmailVerified(false)
                .isPhoneVerified(false)
                .build();

        User savedUser = userRepository.save(user);

        // 8. Create Employee record
        Employee employee = employeeMapper.toEntity(request, organization.getId(), ownerId, savedUser.getId());
        Employee savedEmployee = employeeRepository.save(employee);

        // 9. Update User with employee_id
        savedUser.setEmployeeId(savedEmployee.getId());
        userRepository.save(savedUser);

        log.info("Employee created: {} by owner: {}", savedEmployee.getEmail(), owner.getEmail());

        // 10. Send welcome email with temp password (TODO: implement email service)
        sendWelcomeEmail(savedEmployee, TEMP_PASSWORD);

        return employeeMapper.toResponseWithOrg(savedEmployee, organization);
    }

    @Override
    public List<EmployeeResponse> getEmployeesByOrganization(Long organizationId) {
        List<Employee> employees = employeeRepository.findByOrganizationId(organizationId);
        return employees.stream()
                .map(employeeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeResponse> getActiveEmployeesByOrganization(Long organizationId) {
        List<Employee> employees = employeeRepository.findByOrganizationIdAndIsActiveTrue(organizationId);
        return employees.stream()
                .map(employeeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return employeeMapper.toResponse(employee);
    }

    @Override
    public Employee getEmployeeByUserId(Long userId) {
        return employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
    }

    @Override
    public Employee getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request, Long ownerId) {
        // 1. Find employee
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        // 2. Verify owner owns this employee's organization
        validateOwnerAccess(employee.getOrganizationId(), ownerId);

        // 3. Update employee
        employeeMapper.updateEntity(request, employee);
        Employee updatedEmployee = employeeRepository.save(employee);

        // 4. Update User if email/phone changed
        User user = userRepository.findById(employee.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        userRepository.save(user);

        log.info("Employee updated: {} by owner: {}", updatedEmployee.getEmail(), ownerId);
        return employeeMapper.toResponse(updatedEmployee);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id, Long ownerId) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        validateOwnerAccess(employee.getOrganizationId(), ownerId);

        // Soft delete
        employee.setActive(false);
        employeeRepository.save(employee);

        // Deactivate user
        User user = userRepository.findById(employee.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(false);
        userRepository.save(user);

        log.info("Employee deleted: {} by owner: {}", employee.getEmail(), ownerId);
    }

    @Override
    @Transactional
    public void activateEmployee(Long id, Long ownerId) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        validateOwnerAccess(employee.getOrganizationId(), ownerId);

        employee.setActive(true);
        employeeRepository.save(employee);

        // Activate user
        User user = userRepository.findById(employee.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(true);
        userRepository.save(user);

        log.info("Employee activated: {}", employee.getEmail());
    }

    @Override
    @Transactional
    public void deactivateEmployee(Long id, Long ownerId) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        validateOwnerAccess(employee.getOrganizationId(), ownerId);

        employee.setActive(false);
        employeeRepository.save(employee);

        // Deactivate user
        User user = userRepository.findById(employee.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(false);
        userRepository.save(user);

        log.info("Employee deactivated: {}", employee.getEmail());
    }

    @Override
    @Transactional
    public EmployeeResponse assignRoute(Long employeeId, Long routeId, Long ownerId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        validateOwnerAccess(employee.getOrganizationId(), ownerId);

        RouteMatcher.Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));

        if (!route.getOrganizationId().equals(employee.getOrganizationId())) {
            throw new BadRequestException("Route does not belong to employee's organization");
        }

        employee.setRouteId(routeId);
        employeeRepository.save(employee);

        log.info("Route {} assigned to employee: {}", routeId, employee.getEmail());
        return employeeMapper.toResponseWithRoute(employee, route);
    }

    @Override
    @Transactional
    public EmployeeResponse setTargets(Long employeeId, BigDecimal monthlyTarget, BigDecimal dailyTarget, Long ownerId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        validateOwnerAccess(employee.getOrganizationId(), ownerId);

        if (monthlyTarget != null) {
            employee.setMonthlyTarget(monthlyTarget);
        }
        if (dailyTarget != null) {
            employee.setDailyTarget(dailyTarget);
        }

        employeeRepository.save(employee);
        log.info("Targets updated for employee: {}", employee.getEmail());
        return employeeMapper.toResponse(employee);
    }

    @Override
    @Transactional
    public void updateOnlineStatus(Long employeeId, boolean isOnline) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        employee.setOnline(isOnline);
        employee.setLastCheckIn(LocalDateTime.now());
        employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public void updateLocation(Long employeeId, Double latitude, Double longitude) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        employee.setCurrentLatitude(latitude);
        employee.setCurrentLongitude(longitude);
        employee.setLastCheckIn(LocalDateTime.now());
        employeeRepository.save(employee);
    }

    @Override
    public EmployeeResponse getEmployeeDashboard(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        // TODO: Get real performance metrics from Collection/Report modules
        // For now, return with default values
        return employeeMapper.toResponseWithPerformance(
                employee,
                BigDecimal.ZERO,  // todayCollection
                BigDecimal.ZERO,  // monthlyCollection
                0,  // assignedCustomers
                0,  // visitedCustomers
                0   // overdueCustomers
        );
    }

    @Override
    public List<EmployeeResponse> searchEmployees(String searchTerm, Long organizationId) {
        List<Employee> employees;
        if (organizationId != null) {
            employees = employeeRepository.searchEmployeesInOrganization(organizationId, searchTerm);
        } else {
            employees = employeeRepository.searchEmployees(searchTerm);
        }
        return employees.stream()
                .map(employeeMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ===== Helper Methods =====

    private void validateOwnerAccess(Long organizationId, Long ownerId) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        if (!organization.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You don't have permission to access this employee");
        }
    }

    private void sendWelcomeEmail(Employee employee, String tempPassword) {
        // TODO: Implement email service
        log.info("Welcome email sent to: {} with temp password: {}", employee.getEmail(), tempPassword);
    }
}
