import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

const DashboardHeader: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="bg-[#1B4332] text-white shadow-sm z-10 flex justify-between items-center w-full px-4 md:px-12 h-16">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="text-[24px] leading-[32px] font-bold tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined">eco</span> Fintrox
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#b1f0ce] focus:border-transparent text-sm"
            placeholder="Search customers, loans, routes..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 text-white">
        <button className="relative hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
        </button>
        <img
          alt="User Avatar"
          className="w-8 h-8 rounded-full border border-white/30 object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD3sf4-CRu-Q0Uj7y6lRiw1V2zY6JW9YZ-xivSD6sk4ZBpuyp-KDplcCcewc7hzAr-fzP-oyteDWPzxHVB3o9Ax_Q6oy7xN3EgWae_zPiditCOFs7te6Qcf0lBuudMYBGir59XCFeRmSZVqez940jvTdjS1DEe2yvGLzWXST25H1YMCyy0SAgYsk8Sle9L3khiDLlHdda9vt6YT2H0ebs0Ea0woaOZ92yDCZqVWXo5haHzFarhANy2"
        />
        <span className="text-sm hidden sm:block">{user?.fullName || 'Admin'}</span>
      </div>
    </header>
  );
};

export default DashboardHeader;