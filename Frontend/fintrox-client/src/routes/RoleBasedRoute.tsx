import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface RoleBasedRouteProps {
  allowedRoles: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || !allowedRoles.includes(user.userType)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;