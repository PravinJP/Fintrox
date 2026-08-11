package com.app.Fintrox.collection.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectionRequest {

    @NotNull(message = "Loan ID is required")
    private Long loanId;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be greater than 0")
    private Double amount;

    @NotNull(message = "Payment method is required")
    @Pattern(regexp = "^(CASH|UPI|BANK_TRANSFER|CHEQUE)$",
            message = "Payment method must be CASH, UPI, BANK_TRANSFER, or CHEQUE")
    private String paymentMethod;

    private String paymentModeDetails;

    private Double gpsLatitude;
    private Double gpsLongitude;

    private String photoUrl;

    private String notes;
}
