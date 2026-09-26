import api from './axiosConfig';

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

  targetAchievementPercentage?: number;
  assignedCustomers?: number;
  pendingCustomers?: number;
  visitedCustomers?: number;
  todayVisits?: number;
  monthlyTarget?: number;

  totalLoanAmountGiven?: number;
  totalAmountReceived?: number;
  outstandingBalance?: number;
  activeLoans?: number;

  recentCollections?: any[];
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