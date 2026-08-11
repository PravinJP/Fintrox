package com.app.Fintrox.loan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstallmentResponse {

    private Long id;
    private Integer installmentNumber;
    private LocalDate dueDate;
    private Double amount;
    private String status;  // PENDING, PAID, OVERDUE
    private LocalDate paidDate;
    private Double paidAmount;
    private String paymentMethod;
    private Long collectionId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
