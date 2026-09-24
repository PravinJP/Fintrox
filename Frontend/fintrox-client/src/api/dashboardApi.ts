export interface DashboardData {
  todayCollection?: number;
  todayCollectionCount?: number;
  weeklyCollection?: number;
  monthlyCollection?: number;
  totalOutstanding?: number;
  activeLoansCount?: number;
  totalEmployees?: number;
  totalCustomers?: number;
  overdueLoansCount?: number;
  overdueAmount?: number;
  overdueLoans?: any[];
  topPerformers?: any[];
  recentActivities?: any[];
  weeklyTrend?: any[];

  totalLoanAmountGiven?: number;
  totalAmountReceived?: number;
  outstandingBalance?: number;
  activeLoans?: number;

  targetAchievementPercentage?: number;
  visitedCustomers?: number;
  pendingCustomers?: number;
  monthlyTarget?: number;
  monthlyCollection?: number;
  todayVisits?: number;

  recentCollections?: any[];
  alerts?: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const dashboardApi = {
  getOwnerDashboard: () => api.get<ApiResponse<DashboardData>>('/dashboard/owner'),
  getEmployeeDashboard: () => api.get<ApiResponse<DashboardData>>('/dashboard/employee'),
  getLenderDashboard: () => api.get<ApiResponse<DashboardData>>('/dashboard/lender'),
};