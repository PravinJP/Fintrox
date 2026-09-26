package com.app.Fintrox.loan.service;

import com.app.Fintrox.loan.dto.response.InstallmentResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class LoanCalculatorService {

    public LoanCalculationResult calculateLoan(Double principal, Double interestRate,
                                               Integer tenure, String loanType,
                                               LocalDate startDate) {

        LoanCalculationResult result = new LoanCalculationResult();

        String type = (loanType != null ? loanType.toUpperCase() : "MONTHLY");

        double totalInterest;
        int totalInstallments;

        switch (type) {
            case "DAILY":
                totalInterest = principal * (interestRate / 100.0) * (tenure / 30.0);
                totalInstallments = tenure;
                break;
            case "WEEKLY":
                totalInterest = principal * (interestRate / 100.0) * (tenure / 4.0);
                totalInstallments = tenure;
                break;
            case "MONTHLY":
            default:
                totalInterest = principal * (interestRate / 100.0) * tenure;
                totalInstallments = tenure;
                break;
        }

        double totalPayable = principal + totalInterest;
        double installmentAmount = totalPayable / totalInstallments;
        installmentAmount = Math.round(installmentAmount * 100.0) / 100.0;

        result.setTotalInterest(totalInterest);
        result.setTotalPayable(totalPayable);
        result.setInstallmentAmount(installmentAmount);
        result.setTotalInstallments(totalInstallments);

        List<InstallmentResponse> schedule = generateSchedule(
                totalPayable, installmentAmount, totalInstallments, type, startDate
        );
        result.setInstallmentSchedule(schedule);

        LocalDate endDate = calculateEndDate(startDate, type, totalInstallments);
        result.setEndDate(endDate);

        return result;
    }

    private List<InstallmentResponse> generateSchedule(
            Double totalPayable, Double installmentAmount, Integer totalInstallments,
            String loanType, LocalDate startDate) {

        List<InstallmentResponse> schedule = new ArrayList<>();
        LocalDate currentDate = startDate;
        Double remaining = totalPayable;

        for (int i = 1; i <= totalInstallments; i++) {
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
                amount = Math.round(remaining * 100.0) / 100.0;
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

    public Double calculateOutstandingBalance(Double totalPayable, Double totalPaid) {
        return Math.round((totalPayable - totalPaid) * 100.0) / 100.0;
    }

    public boolean isOverdue(LocalDate nextDueDate) {
        return nextDueDate != null && nextDueDate.isBefore(LocalDate.now());
    }

    public static class LoanCalculationResult {
        private Double totalInterest;
        private Double totalPayable;
        private Double installmentAmount;
        private Integer totalInstallments;
        private LocalDate endDate;
        private List<InstallmentResponse> installmentSchedule;

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