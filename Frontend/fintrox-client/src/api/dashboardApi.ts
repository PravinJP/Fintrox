import api from './axiosConfig';

export interface DashboardData {
  todayCollection?: number;
  totalCustomers?: number;
  activeLoans?: number;
  totalEmployees?: number;
  weeklyTrend?: { date: string; amount: number }[];
  topPerformers?: { name: string; amount: number; percentage: number }[];
  recentCollections?: {
    id: number;
    customerName: string;
    initials: string;
    amount: number;
    route: string;
    time: string;
  }[];
  alerts?: {
    id: number;
    type: 'overdue' | 'route' | 'approval';
    title: string;
    description: string;
  }[];
  
  // Lender specific
  totalLoanAmountGiven?: number;
  totalAmountReceived?: number;
  outstandingBalance?: number;
  
  // Employee specific
  targetAchievementPercentage?: number;
  visitedCustomers?: number;
  pendingCustomers?: number;
}

export const dashboardApi = {
  getOwnerDashboard: () => api.get<DashboardData>('/dashboard/owner'),
  getEmployeeDashboard: () => api.get<DashboardData>('/dashboard/employee'),
  getLenderDashboard: () => api.get<DashboardData>('/dashboard/lender'),
};