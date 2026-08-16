import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Dashboard from '../pages/Dashboard';

const AppRoutes: React.FC = () => {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard/*"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default AppRoutes;