package com.app.Fintrox.customer.mapper;



import com.app.Fintrox.customer.dto.request.CustomerRequest;
import com.app.Fintrox.customer.dto.response.CustomerResponse;
import com.app.Fintrox.customer.entity.Customer;
import com.app.Fintrox.employee.entity.Employee;
import com.app.Fintrox.route.entity.Route;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    /**
     * Convert CustomerRequest to Customer entity
     */
    public Customer toEntity(CustomerRequest request, Long organizationId, Long createdBy) {
        return Customer.builder()
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .organizationId(organizationId)
                .routeId(request.getRouteId())
                .assignedEmployeeId(request.getAssignedEmployeeId())
                .isActive(true)
                .isBlocked(false)
                .totalLoansTaken(0)
                .activeLoansCount(0)
                .totalLoanAmountGiven(0.0)
                .totalAmountReceived(0.0)
                .outstandingBalance(0.0)
                .createdBy(createdBy)
                .build();
    }

    /**
     * Update existing Customer entity with request data
     */
    public void updateEntity(CustomerRequest request, Customer customer) {
        if (request.getFullName() != null) {
            customer.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            customer.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            customer.setEmail(request.getEmail());
        }
        if (request.getAddress() != null) {
            customer.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            customer.setCity(request.getCity());
        }
        if (request.getState() != null) {
            customer.setState(request.getState());
        }
        if (request.getPincode() != null) {
            customer.setPincode(request.getPincode());
        }
        if (request.getRouteId() != null) {
            customer.setRouteId(request.getRouteId());
        }
        if (request.getAssignedEmployeeId() != null) {
            customer.setAssignedEmployeeId(request.getAssignedEmployeeId());
        }
    }

    /**
     * Convert Customer entity to CustomerResponse DTO
     */
    public CustomerResponse toResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .fullName(customer.getFullName())
                .phone(customer.getPhone())
                .email(customer.getEmail())
                .address(customer.getAddress())
                .city(customer.getCity())
                .state(customer.getState())
                .pincode(customer.getPincode())
                .organizationId(customer.getOrganizationId())
                .routeId(customer.getRouteId())
                .assignedEmployeeId(customer.getAssignedEmployeeId())
                .totalLoansTaken(customer.getTotalLoansTaken())
                .activeLoansCount(customer.getActiveLoansCount())
                .totalLoanAmountGiven(customer.getTotalLoanAmountGiven())
                .totalAmountReceived(customer.getTotalAmountReceived())
                .outstandingBalance(customer.getOutstandingBalance())
                .isActive(customer.isActive())
                .isBlocked(customer.isBlocked())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

    /**
     * Convert Customer to Response with Route and Employee details
     */
    public CustomerResponse toResponseWithDetails(Customer customer, Route route, Employee employee) {
        CustomerResponse response = toResponse(customer);

        if (route != null) {
            response.setRouteName(route.getName());
        }
        if (employee != null) {
            response.setAssignedEmployeeName(employee.getFullName());
        }

        return response;
    }
}
