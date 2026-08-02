package com.app.Fintrox.loan.service;



import com.app.Fintrox.loan.dto.response.InstallmentResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class LoanCalculatorService {

    /**
     * Calculate loan details and generate installment schedule
     */
    public LoanCalculationResult calculateLoan(Double principal, Double interestRate,
                                               Integer tenureMonths, String loanType,
                                               LocalDate startDate) {

        LoanCalculationResult result = new LoanCalculationResult();

        // 1. Calculate total interest
        Double totalInterest = principal * (interestRate / 100) * tenureMonths;

        // 2. Calculate total payable
        Double totalPayable = principal + totalInterest;

        // 3. Calculate installment amount based on loan type
        Double installmentAmount;
        Integer totalInstallments;

        switch (loanType.toUpperCase()) {
            case "DAILY":
                totalInstallments = tenureMonths * 30;
                installmentAmount = totalPayable / totalInstallments;
                break;
            case "WEEKLY":
                totalInstallments = tenureMonths * 4;
                installmentAmount = totalPayable / totalInstallments;
                break;
            case "MONTHLY":
            default:
                totalInstallments = tenureMonths;
                installmentAmount = totalPayable / totalInstallments;
                break;
        }

        // Round to 2 decimal places
        installmentAmount = Math.round(installmentAmount * 100.0) / 100.0;

        result.setTotalInterest(totalInterest);
        result.setTotalPayable(totalPayable);
        result.setInstallmentAmount(installmentAmount);
        result.setTotalInstallments(totalInstallments);

        // 4. Generate installment schedule
        List<InstallmentResponse> schedule = generateSchedule(
                totalPayable, installmentAmount, totalInstallments, loanType, startDate
        );
        result.setInstallmentSchedule(schedule);

        // 5. Calculate end date
        LocalDate endDate = calculateEndDate(startDate, loanType, totalInstallments);
        result.setEndDate(endDate);

        return result;
    }

    /**
     * Generate installment schedule
     */
    private List<InstallmentResponse> generateSchedule(
            Double totalPayable, Double installmentAmount, Integer totalInstallments,
            String loanType, LocalDate startDate) {

        List<InstallmentResponse> schedule = new ArrayList<>();
        LocalDate currentDate = startDate;
        Double remaining = totalPayable;

        for (int i = 1; i <= totalInstallments; i++) {
            // Calculate due date based on loan type
            switch (loanType.toUpperCase()) {
                case "DAILY":
                    currentDate = currentDate.plusDays(1);
                    break;
                case "WEEKLY":
                    currentDate = currentDate.plusWeeks(1);
                    break;
                case "MONTHLY":
                default:
                    currentDate = currentDate.plusMonths(1);
                    break;
            }

            Double amount = installmentAmount;
            if (i == totalInstallments) {
                // Adjust last installment to account for rounding
                amount = Math.round((remaining) * 100.0) / 100.0;
            }
            remaining -= amount;

            InstallmentResponse installment = InstallmentResponse.builder()
                    .installmentNumber(i)
                    .dueDate(currentDate)
                    .amount(amount)
                    .status("PENDING")
                    .build();

            schedule.add(installment);
        }

        return schedule;
    }

    /**
     * Calculate end date
     */
    private LocalDate calculateEndDate(LocalDate startDate, String loanType, Integer totalInstallments) {
        LocalDate endDate = startDate;
        switch (loanType.toUpperCase()) {
            case "DAILY":
                endDate = startDate.plusDays(totalInstallments);
                break;
            case "WEEKLY":
                endDate = startDate.plusWeeks(totalInstallments);
                break;
            case "MONTHLY":
            default:
                endDate = startDate.plusMonths(totalInstallments);
                break;
        }
        return endDate;
    }

    /**
     * Calculate outstanding balance
     */
    public Double calculateOutstandingBalance(Double totalPayable, Double totalPaid) {
        return Math.round((totalPayable - totalPaid) * 100.0) / 100.0;
    }

    /**
     * Check if loan is overdue
     */
    public boolean isOverdue(LocalDate nextDueDate) {
        return nextDueDate != null && nextDueDate.isBefore(LocalDate.now());
    }

    /**
     * Inner class for calculation results
     */
    public static class LoanCalculationResult {
        private Double totalInterest;
        private Double totalPayable;
        private Double installmentAmount;
        private Integer totalInstallments;
        private LocalDate endDate;
        private List<InstallmentResponse> installmentSchedule;

        // Getters and Setters
        public Double getTotalInterest() { return totalInterest; }
        public void setTotalInterest(Double totalInterest) { this.totalInterest = totalInterest; }
        public Double getTotalPayable() { return totalPayable; }
        public void setTotalPayable(Double totalPayable) { this.totalPayable = totalPayable; }
        public Double getInstallmentAmount() { return installmentAmount; }
        public void setInstallmentAmount(Double installmentAmount) { this.installmentAmount = installmentAmount; }
        public Integer getTotalInstallments() { return totalInstallments; }
        public void setTotalInstallments(Integer totalInstallments) { this.totalInstallments = totalInstallments; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public List<InstallmentResponse> getInstallmentSchedule() { return installmentSchedule; }
        public void setInstallmentSchedule(List<InstallmentResponse> installmentSchedule) {
            this.installmentSchedule = installmentSchedule;
        }
    }
}
