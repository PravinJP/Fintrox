import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import Sidebar from '../common/Sidebar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f4fafd]">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 h-full overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-12 bg-[#f4fafd]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;