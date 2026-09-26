import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

const DashboardHeader: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="bg-[#1B4332] text-white shadow-sm z-10 flex justify-between items-center w-full px-4 md:px-12 h-16">
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <img
          src="/logo3.png"
          alt="Fintrox"
          className="h-8 w-auto object-contain "
        />
      </div>

      <div className="flex items-center gap-4 text-white">
        <button className="relative hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
        </button>

        <div className="w-8 h-8 rounded-full bg-white/15 border border-white/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[20px]">
            person
          </span>
        </div>

        <span className="text-sm hidden sm:block">
          {user?.fullName || 'Admin'}
        </span>
      </div>
    </header>
  );
};

export default DashboardHeader;