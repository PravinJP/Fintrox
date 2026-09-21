import React, { useState, useEffect } from 'react';
import reportApi, { type DailyCollectionReport, type WeeklyCollectionReport, type MonthlyCollectionReport, type EmployeePerformanceReport, type OverdueLoanReport, type CustomerLoanReport } from '../api/reportsApi';
import CustomerLoanReportView from '../components/reports/CustomerLoanReportView';
import DailyReportView from '../components/reports/DailyReportView';
import EmployeePerformanceView from '../components/reports/EmployeePerformanceView';
import MonthlyReportView from '../components/reports/MonthlyReportView';
import OverdueReportView from '../components/reports/OverdueReportView';
import ReportDateRange from '../components/reports/ReportDateRange';
import ReportExportActions from '../components/reports/ReportExportActions';
import ReportTypeSelector, { type ReportType } from '../components/reports/ReportTypeSelector';
import WeeklyReportView from '../components/reports/WeeklyReportView';


const Reports: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0];

  const [reportType, setReportType] = useState<ReportType>('daily');
  const [date, setDate] = useState(today);
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [dailyReport, setDailyReport] = useState<DailyCollectionReport | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyCollectionReport | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyCollectionReport | null>(null);
  const [employeeReport, setEmployeeReport] = useState<EmployeePerformanceReport | null>(null);
  const [overdueReport, setOverdueReport] = useState<OverdueLoanReport | null>(null);
  const [customerReport, setCustomerReport] = useState<CustomerLoanReport | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, [reportType, date, month, year, startDate, endDate]);

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      switch (reportType) {
        case 'daily': {
          const res = await reportApi.getDailyReport(date);
          setDailyReport(res.data.data);
          break;
        }
        case 'weekly': {
          const res = await reportApi.getWeeklyReport(date);
          setWeeklyReport(res.data.data);
          break;
        }
        case 'monthly': {
          const res = await reportApi.getMonthlyReport(month, year);
          setMonthlyReport(res.data.data);
          break;
        }
        case 'employee-performance': {
          const res = await reportApi.getEmployeePerformanceReport(startDate, endDate);
          setEmployeeReport(res.data.data);
          break;
        }
        case 'overdue': {
          const res = await reportApi.getOverdueReport();
          setOverdueReport(res.data.data);
          break;
        }
        case 'customer-loans': {
          const res = await reportApi.getCustomerLoanReport();
          setCustomerReport(res.data.data);
          break;
        }
      }
    } catch (err: any) {
      console.error('Error fetching report:', err);
      setError(err?.response?.data?.message || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const showExportActions = reportType !== 'overdue' && reportType !== 'customer-loans';

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500 mt-1">
            Analyze collections, performance, and financial insights.
          </p>
        </div>
        {showExportActions && (
          <ReportExportActions
            reportType={reportType}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </div>

      <ReportTypeSelector selectedType={reportType} onTypeChange={setReportType} />

      <ReportDateRange
        reportType={reportType}
        date={date}
        onDateChange={setDate}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        month={month}
        onMonthChange={setMonth}
        year={year}
        onYearChange={setYear}
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading report...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {reportType === 'daily' && <DailyReportView data={dailyReport} />}
          {reportType === 'weekly' && <WeeklyReportView data={weeklyReport} />}
          {reportType === 'monthly' && <MonthlyReportView data={monthlyReport} />}
          {reportType === 'employee-performance' && (
            <EmployeePerformanceView data={employeeReport} />
          )}
          {reportType === 'overdue' && <OverdueReportView data={overdueReport} />}
          {reportType === 'customer-loans' && (
            <CustomerLoanReportView data={customerReport} />
          )}
        </>
      )}
    </div>
  );
};

export default Reports;