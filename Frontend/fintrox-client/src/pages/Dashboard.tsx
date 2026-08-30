import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { dashboardApi } from '../api/dashboardApi';
import type { DashboardData } from '../api/dashboardApi';
import KPICard from '../components/dashboard/KPICard';
import CollectionTrend from '../components/dashboard/CollectionTrend';
import TopCollectors from '../components/dashboard/TopCollectors';
import RecentCollections from '../components/dashboard/RecentCollections';
import OverdueAlerts from '../components/dashboard/OverdueAlerts';

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsOrganization, setNeedsOrganization] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      let response;
      if (user?.userType === 'OWNER') {
        response = await dashboardApi.getOwnerDashboard();
      } else if (user?.userType === 'EMPLOYEE') {
        response = await dashboardApi.getEmployeeDashboard();
      } else if (user?.userType === 'INDIVIDUAL_LENDER') {
        response = await dashboardApi.getLenderDashboard();
      } else {
        response = await dashboardApi.getOwnerDashboard();
      }
      
      setData(response.data);
      setError('');
      setNeedsOrganization(false);
    } catch (err: any) {
      console.error('Dashboard error:', err);
      
      if (err.response?.data?.message?.includes('does not belong to any organization')) {
        setNeedsOrganization(true);
        setError('Please create your organization first.');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (needsOrganization) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#ffdad6] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl text-[#93000a]">business</span>
          </div>
          <h2 className="text-[24px] leading-[32px] font-semibold text-[#161d1f] mb-2">
            Create Your Organization
          </h2>
          <p className="text-[14px] leading-[20px] text-[#404943] mb-6">
            You need to create an organization before you can access the dashboard.
          </p>
          <button
            onClick={() => navigate('/settings/organization')}
            className="bg-[#2d6a4f] text-white px-6 py-3 rounded-lg hover:bg-[#3f6653] transition-colors"
          >
            Create Organization
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d6a4f] mx-auto"></div>
          <p className="mt-4 text-[#404943]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-[#ffdad6] text-[#93000a] p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const isOwner = user?.userType === 'OWNER';
  const isLender = user?.userType === 'INDIVIDUAL_LENDER';
  const isEmployee = user?.userType === 'EMPLOYEE';

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h2 className="text-[24px] leading-[32px] font-bold text-[#161d1f] tracking-[-0.01em] md:text-[32px] md:leading-[40px]">
            {isOwner && 'Dashboard Overview'}
            {isEmployee && 'My Dashboard'}
            {isLender && 'My Lending Dashboard'}
          </h2>
          <p className="text-[14px] leading-[20px] text-[#404943] mt-1">
            {isOwner && "Here's what's happening with your operations today."}
            {isEmployee && "Here's your collection summary and tasks for today."}
            {isLender && "Here's your lending business summary."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isOwner && (
          <>
            <KPICard
              label="Total Collection Today"
              value={`₹${data?.todayCollection?.toLocaleString() || 0}`}
              icon="payments"
              trend={12}
            />
            <KPICard
              label="Total Customers"
              value={data?.totalCustomers || 0}
              icon="groups"
              trend={5}
            />
            <KPICard
              label="Active Loans"
              value={data?.activeLoans || 0}
              icon="account_balance_wallet"
            />
            <KPICard
              label="Total Employees"
              value={data?.totalEmployees || 0}
              icon="badge"
            />
          </>
        )}

        {isLender && (
          <>
            <KPICard
              label="Total Loan Amount Given"
              value={`₹${data?.totalLoanAmountGiven?.toLocaleString() || 0}`}
              icon="payments"
            />
            <KPICard
              label="Total Amount Received"
              value={`₹${data?.totalAmountReceived?.toLocaleString() || 0}`}
              icon="account_balance_wallet"
            />
            <KPICard
              label="Outstanding Balance"
              value={`₹${data?.outstandingBalance?.toLocaleString() || 0}`}
              icon="trending_up"
            />
            <KPICard
              label="Active Loans"
              value={data?.activeLoans || 0}
              icon="badge"
            />
          </>
        )}

        {isEmployee && (
          <>
            <KPICard
              label="Today's Collection"
              value={`₹${data?.todayCollection?.toLocaleString() || 0}`}
              icon="payments"
            />
            <KPICard
              label="Target Achievement"
              value={`${data?.targetAchievementPercentage || 0}%`}
              icon="trending_up"
            />
            <KPICard
              label="Customers Visited"
              value={data?.visitedCustomers || 0}
              icon="groups"
            />
            <KPICard
              label="Pending Customers"
              value={data?.pendingCustomers || 0}
              icon="schedule"
            />
          </>
        )}
      </div>

      {isOwner && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CollectionTrend data={data?.weeklyTrend || []} />
          <TopCollectors data={data?.topPerformers || []} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentCollections collections={data?.recentCollections || []} />
        {isOwner && <OverdueAlerts alerts={data?.alerts || []} />}
      </div>
    </div>
  );
};

export default Dashboard;