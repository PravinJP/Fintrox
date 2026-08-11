package com.app.Fintrox.loan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstallmentScheduleDto {
    private Integer installmentNumber;
    private LocalDate dueDate;
    private Double amount;
    private String status;
}