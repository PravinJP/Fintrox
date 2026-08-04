package com.app.Fintrox.collection.mapper;



import com.app.Fintrox.collection.dto.request.CollectionRequest;
import com.app.Fintrox.collection.dto.response.CollectionResponse;
import com.app.Fintrox.collection.entity.Collection;
import com.app.Fintrox.customer.entity.Customer;
import com.app.Fintrox.employee.entity.Employee;
import com.app.Fintrox.loan.entity.Loan;
import org.springframework.stereotype.Component;

@Component
public class CollectionMapper {

    public Collection toEntity(CollectionRequest request, Long organizationId, Long employeeId, Long createdBy) {
        return Collection.builder()
                .loanId(request.getLoanId())
                .customerId(request.getCustomerId())
                .organizationId(organizationId)
                .employeeId(employeeId)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .paymentModeDetails(request.getPaymentModeDetails())
                .gpsLatitude(request.getGpsLatitude())
                .gpsLongitude(request.getGpsLongitude())
                .photoUrl(request.getPhotoUrl())
                .notes(request.getNotes())
                .isVerified(false)
                .isReceiptGenerated(false)
                .isActive(true)
                .createdBy(createdBy)
                .build();
    }

    public CollectionResponse toResponse(Collection collection) {
        return CollectionResponse.builder()
                .id(collection.getId())
                .collectionNumber(collection.getCollectionNumber())
                .loanId(collection.getLoanId())
                .customerId(collection.getCustomerId())
                .employeeId(collection.getEmployeeId())
                .amount(collection.getAmount())
                .paymentMethod(collection.getPaymentMethod())
                .paymentModeDetails(collection.getPaymentModeDetails())
                .installmentNumber(collection.getInstallmentNumber())
                .isFullPayment(collection.isFullPayment())
                .gpsLatitude(collection.getGpsLatitude())
                .gpsLongitude(collection.getGpsLongitude())
                .photoUrl(collection.getPhotoUrl())
                .isVerified(collection.isVerified())
                .receiptUrl(collection.getReceiptUrl())
                .isReceiptGenerated(collection.isReceiptGenerated())
                .notes(collection.getNotes())
                .createdAt(collection.getCreatedAt())
                .build();
    }

    public CollectionResponse toResponseWithDetails(Collection collection, Loan loan, Customer customer, Employee employee) {
        CollectionResponse response = toResponse(collection);

        if (loan != null) {
            response.setLoanNumber(loan.getLoanNumber());
        }
        if (customer != null) {
            response.setCustomerName(customer.getFullName());
            response.setCustomerPhone(customer.getPhone());
        }
        if (employee != null) {
            response.setEmployeeName(employee.getFullName());
        }

        return response;
    }

    public CollectionResponse toResponseWithBalance(Collection collection, Double outstandingBalance) {
        CollectionResponse response = toResponse(collection);
        response.setOutstandingBalanceAfter(outstandingBalance);
        return response;
    }
}
