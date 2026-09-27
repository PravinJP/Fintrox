import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import DashboardLayout from '../components/layout/DashboardLayout';
import CreateOrganization from '../components/settings/CreateOrganization';
import Collections from '../pages/Collections';
import Customers from '../pages/Customers';
import Dashboard from '../pages/Dashboard';
import Employees from '../pages/Employees';
import LandingPage from '../pages/LandingPage';
import Loans from '../pages/Loans';
import Reports from '../pages/Reports';
import RoutesPage from '../pages/Routes';
import type { RootState } from '../store/store';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';


const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/settings/organization"
        element={isAuthenticated ? <CreateOrganization /> : <Navigate to="/login" replace />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Shared routes (all roles) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/collections" element={<Collections />} />

          {/* Owner-only routes */}
          <Route element={<RoleBasedRoute allowedRoles={['OWNER']} />}>
            <Route path="/employees" element={<Employees />} />
          </Route>

          {/* Owner + Individual Lender routes */}
          <Route element={<RoleBasedRoute allowedRoles={['OWNER', 'INDIVIDUAL_LENDER']} />}>
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;