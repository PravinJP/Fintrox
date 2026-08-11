package com.app.Fintrox.customer.service;



import com.app.Fintrox.customer.dto.request.CustomerRequest;
import com.app.Fintrox.customer.dto.response.CustomerResponse;
import com.app.Fintrox.customer.entity.Customer;

import java.util.List;

public interface CustomerService {

    /**
     * Create a new customer
     */
    CustomerResponse createCustomer(CustomerRequest request, Long userId, Long organizationId);

    /**
     * Get all customers in an organization
     */
    List<CustomerResponse> getCustomersByOrganization(Long organizationId);

    /**
     * Get customers assigned to an employee
     */
    List<CustomerResponse> getCustomersByEmployee(Long employeeId);

    /**
     * Get customer by ID
     */
    CustomerResponse getCustomerById(Long id);

    /**
     * Update customer details
     */
    CustomerResponse updateCustomer(Long id, CustomerRequest request);

    /**
     * Delete customer (soft delete)
     */
    void deleteCustomer(Long id);

    /**
     * Activate customer
     */
    void activateCustomer(Long id);

    /**
     * Deactivate customer
     */
    void deactivateCustomer(Long id);

    /**
     * Block customer
     */
    void blockCustomer(Long id);

    /**
     * Unblock customer
     */
    void unblockCustomer(Long id);

    /**
     * Assign customer to route
     */
    CustomerResponse assignRoute(Long customerId, Long routeId);

    /**
     * Assign customer to employee
     */
    CustomerResponse assignEmployee(Long customerId, Long employeeId);

    /**
     * Search customers
     */
    List<CustomerResponse> searchCustomers(String searchTerm, Long organizationId);

    /**
     * Get customer dashboard
     */
    CustomerResponse getCustomerDashboard(Long customerId);

    /**
     * Get customer entity by ID
     */
    Customer getCustomerEntity(Long id);

    /**
     * Update customer financial summary (called from loan module)
     */
    void updateFinancialSummary(Long customerId, Double loanAmount, Double collectionAmount);
}
