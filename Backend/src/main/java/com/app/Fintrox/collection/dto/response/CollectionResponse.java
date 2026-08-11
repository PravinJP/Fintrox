package com.app.Fintrox.collection.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectionResponse {

    private Long id;
    private String collectionNumber;
    private Long loanId;
    private String loanNumber;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private Long employeeId;
    private String employeeName;
    private Double amount;
    private String paymentMethod;
    private String paymentModeDetails;
    private Integer installmentNumber;
    private boolean isFullPayment;
    private Double gpsLatitude;
    private Double gpsLongitude;
    private String photoUrl;
    private boolean isVerified;
    private String receiptUrl;
    private boolean isReceiptGenerated;
    private String notes;
    private Double outstandingBalanceAfter;
    private LocalDateTime createdAt;
}
