package com.app.Fintrox.customer.service;



import com.app.Fintrox.customer.dto.request.CustomerRequest;
import com.app.Fintrox.customer.dto.response.CustomerResponse;
import com.app.Fintrox.customer.entity.Customer;
import com.app.Fintrox.customer.mapper.CustomerMapper;
import com.app.Fintrox.customer.repository.CustomerRepository;
import com.app.Fintrox.employee.entity.Employee;
import com.app.Fintrox.employee.repository.EmployeeRepository;
import com.app.Fintrox.route.entity.Route;
import com.app.Fintrox.route.repository.RouteRepository;
import com.app.Fintrox.common.exceptions.BadRequestException;
import com.app.Fintrox.common.exceptions.ResourceNotFoundException;
import com.app.Fintrox.common.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final RouteRepository routeRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerMapper customerMapper;

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request, Long userId, Long organizationId) {
        // 1. Check if phone already exists
        if (customerRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number already registered");
        }

        // 2. Validate route if provided
        if (request.getRouteId() != null) {
            Route route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
            if (!route.getOrganizationId().equals(organizationId)) {
                throw new BadRequestException("Route does not belong to your organization");
            }
        }

        // 3. Validate employee if provided
        if (request.getAssignedEmployeeId() != null) {
            Employee employee = employeeRepository.findById(request.getAssignedEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
            if (!employee.getOrganizationId().equals(organizationId)) {
                throw new BadRequestException("Employee does not belong to your organization");
            }
        }

        // 4. Create customer
        Customer customer = customerMapper.toEntity(request, organizationId, userId);
        Customer savedCustomer = customerRepository.save(customer);

        log.info("Customer created: {} by user: {}", savedCustomer.getFullName(), userId);
        return customerMapper.toResponse(savedCustomer);
    }

    @Override
    public List<CustomerResponse> getCustomersByOrganization(Long organizationId) {
        List<Customer> customers = customerRepository.findByOrganizationIdAndIsActiveTrue(organizationId);
        return customers.stream()
                .map(customer -> {
                    Route route = customer.getRouteId() != null ?
                            routeRepository.findById(customer.getRouteId()).orElse(null) : null;
                    Employee employee = customer.getAssignedEmployeeId() != null ?
                            employeeRepository.findById(customer.getAssignedEmployeeId()).orElse(null) : null;
                    return customerMapper.toResponseWithDetails(customer, route, employee);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerResponse> getCustomersByEmployee(Long employeeId) {
        List<Customer> customers = customerRepository.findByAssignedEmployeeIdAndIsActiveTrue(employeeId);
        return customers.stream()
                .map(customer -> {
                    Route route = customer.getRouteId() != null ?
                            routeRepository.findById(customer.getRouteId()).orElse(null) : null;
                    Employee employee = customer.getAssignedEmployeeId() != null ?
                            employeeRepository.findById(customer.getAssignedEmployeeId()).orElse(null) : null;
                    return customerMapper.toResponseWithDetails(customer, route, employee);
                })
                .collect(Collectors.toList());
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Route route = customer.getRouteId() != null ?
                routeRepository.findById(customer.getRouteId()).orElse(null) : null;
        Employee employee = customer.getAssignedEmployeeId() != null ?
                employeeRepository.findById(customer.getAssignedEmployeeId()).orElse(null) : null;

        return customerMapper.toResponseWithDetails(customer, route, employee);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // Check if phone changed and already exists
        if (request.getPhone() != null && !request.getPhone().equals(customer.getPhone())) {
            if (customerRepository.existsByPhone(request.getPhone())) {
                throw new BadRequestException("Phone number already registered");
            }
        }

        customerMapper.updateEntity(request, customer);
        Customer updatedCustomer = customerRepository.save(customer);

        log.info("Customer updated: {}", updatedCustomer.getFullName());
        return customerMapper.toResponse(updatedCustomer);
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        customer.setActive(false);
        customerRepository.save(customer);
        log.info("Customer deleted: {}", customer.getFullName());
    }

    @Override
    @Transactional
    public void activateCustomer(Long id) {
        customerRepository.updateActiveStatus(id, true);
        log.info("Customer activated: {}", id);
    }

    @Override
    @Transactional
    public void deactivateCustomer(Long id) {
        customerRepository.updateActiveStatus(id, false);
        log.info("Customer deactivated: {}", id);
    }

    @Override
    @Transactional
    public void blockCustomer(Long id) {
        customerRepository.updateBlockStatus(id, true);
        log.info("Customer blocked: {}", id);
    }

    @Override
    @Transactional
    public void unblockCustomer(Long id) {
        customerRepository.updateBlockStatus(id, false);
        log.info("Customer unblocked: {}", id);
    }

    @Override
    @Transactional
    public CustomerResponse assignRoute(Long customerId, Long routeId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));

        customer.setRouteId(routeId);
        customerRepository.save(customer);

        log.info("Route {} assigned to customer: {}", routeId, customer.getFullName());
        return customerMapper.toResponseWithDetails(customer, route, null);
    }

    @Override
    @Transactional
    public CustomerResponse assignEmployee(Long customerId, Long employeeId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        customer.setAssignedEmployeeId(employeeId);
        customerRepository.save(customer);

        log.info("Employee {} assigned to customer: {}", employeeId, customer.getFullName());
        return customerMapper.toResponseWithDetails(customer, null, employee);
    }

    @Override
    public List<CustomerResponse> searchCustomers(String searchTerm, Long organizationId) {
        List<Customer> customers;
        if (organizationId != null) {
            customers = customerRepository.searchCustomersInOrganization(organizationId, searchTerm);
        } else {
            customers = customerRepository.searchCustomers(searchTerm);
        }
        return customers.stream()
                .map(customerMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerResponse getCustomerDashboard(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // TODO: Add loan details and collection history when loan module is ready
        return customerMapper.toResponse(customer);
    }

    @Override
    public Customer getCustomerEntity(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
    }

    @Override
    @Transactional
    public void updateFinancialSummary(Long customerId, Double loanAmount, Double collectionAmount) {
        if (loanAmount != null && loanAmount > 0) {
            customerRepository.addLoan(customerId, loanAmount);
        }
        if (collectionAmount != null && collectionAmount > 0) {
            customerRepository.addCollection(customerId, collectionAmount);
        }
    }
}
