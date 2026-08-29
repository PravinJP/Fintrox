import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import LandingPage from '../pages/LandingPage';

import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../components/layout/DashboardLayout';
import CreateOrganization from '../components/settings/CreateOrganization';
import ProtectedRoute from './ProtectedRoute';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

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
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/settings/organization"
        element={isAuthenticated ? <CreateOrganization /> : <Navigate to="/login" replace />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;