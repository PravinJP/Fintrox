import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../components/layout/DashboardLayout';
import CreateOrganization from '../components/settings/CreateOrganization';

const AppRoutes: React.FC = () => {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/settings/organization"
        element={token ? <CreateOrganization /> : <Navigate to="/login" />}
      />

      <Route
        path="/dashboard"
        element={token ? <DashboardLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Dashboard />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;