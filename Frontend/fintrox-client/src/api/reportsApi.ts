import api from './axiosConfig';

export interface DailyCollectionReport {
  reportDate: string;
  totalCollection: number;
  totalTransactions: number;
  averageTransaction: number;
  totalCustomers: number;
  totalEmployees: number;
  employeeCollections: EmployeeCollection[];
  paymentMethodBreakdown: PaymentMethodBreakdown[];
}

export interface EmployeeCollection {
  employeeId: number;
  employeeName: string;
  collectionAmount: number;
  customerCount: number;
  transactionCount: number;
  targetAchievement: number;
}

export interface PaymentMethodBreakdown {
  paymentMethod: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface WeeklyCollectionReport {
  weekStart: string;
  weekEnd: string;
  totalCollection: number;
  previousWeekCollection: number;
  growthPercentage: number;
  totalTransactions: number;
  totalCustomers: number;
  dailyBreakdown: DailyBreakdown[];
}

export interface DailyBreakdown {
  date: string;
  collectionAmount: number;
  transactionCount: number;
  customerCount: number;
}

export interface MonthlyCollectionReport {
  month: string;
  year: number;
  totalCollection: number;
  previousMonthCollection: number;
  growthPercentage: number;
  totalTransactions: number;
  totalCustomers: number;
  totalEmployees: number;
  averageDailyCollection: number;
  collectionTarget: number;
  targetAchievement: number;
  weeklyBreakdown: WeeklyBreakdown[];
}

export interface WeeklyBreakdown {
  week: string;
  collectionAmount: number;
  transactionCount: number;
}

export interface EmployeePerformanceReport {
  reportDate: string;
  totalEmployees: number;
  totalCollection: number;
  employeePerformances: EmployeePerformance[];
}

export interface EmployeePerformance {
  employeeId: number;
  employeeName: string;
  role: string;
  routeName: string;
  todayCollection: number;
  weeklyCollection: number;
  monthlyCollection: number;
  monthlyTarget: number;
  targetAchievement: number;
  customersAssigned: number;
  customersVisited: number;
  overdueCustomers: number;
  collectionEfficiency: number;
  performanceRating: string;
}

export interface OverdueLoanReport {
  reportDate: string;
  totalOverdueLoans: number;
  totalOverdueAmount: number;
  totalCustomers: number;
  overdueLoans: OverdueLoan[];
}

export interface OverdueLoan {
  loanId: number;
  loanNumber: string;
  customerName: string;
  customerPhone: string;
  overdueAmount: number;
  daysOverdue: number;
  assignedEmployee: string;
  status: string;
}

export interface CustomerLoanReport {
  reportDate: string;
  totalCustomers: number;
  totalLoanAmount: number;
  totalReceived: number;
  totalOutstanding: number;
  customerLoans: CustomerLoan[];
}

export interface CustomerLoan {
  customerId: number;
  customerName: string;
  phone: string;
  address: string;
  totalLoans: number;
  totalLoanAmount: number;
  totalPaid: number;
  outstandingBalance: number;
  loanStatus: string;
  assignedEmployee: string;
  routeName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const reportApi = {
  getDailyReport: (date: string) =>
    api.get<ApiResponse<DailyCollectionReport>>('/reports/daily', { params: { date } }),

  getWeeklyReport: (date: string) =>
    api.get<ApiResponse<WeeklyCollectionReport>>('/reports/weekly', { params: { date } }),

  getMonthlyReport: (month: number, year: number) =>
    api.get<ApiResponse<MonthlyCollectionReport>>('/reports/monthly', { params: { month, year } }),

  getEmployeePerformanceReport: (startDate: string, endDate: string) =>
    api.get<ApiResponse<EmployeePerformanceReport>>('/reports/employee-performance', {
      params: { startDate, endDate },
    }),

  getOverdueReport: () =>
    api.get<ApiResponse<OverdueLoanReport>>('/reports/overdue'),

  getCustomerLoanReport: () =>
    api.get<ApiResponse<CustomerLoanReport>>('/reports/customer-loans'),

  exportToExcel: (reportType: string, startDate: string, endDate: string) =>
    api.get('/reports/export/excel', {
      params: { reportType, startDate, endDate },
      responseType: 'blob',
    }),

  exportToPDF: (reportType: string, startDate: string, endDate: string) =>
    api.get('/reports/export/pdf', {
      params: { reportType, startDate, endDate },
      responseType: 'blob',
    }),
};

export default reportApi;