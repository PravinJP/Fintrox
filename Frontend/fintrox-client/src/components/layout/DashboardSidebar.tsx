import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/employees', label: 'Employees', icon: 'badge' },
    { path: '/routes', label: 'Routes', icon: 'route' },
    { path: '/customers', label: 'Customers', icon: 'groups' },
    { path: '/loans', label: 'Loans', icon: 'account_balance_wallet' },
    { path: '/collections', label: 'Collections', icon: 'payments' },
    { path: '/reports', label: 'Reports', icon: 'analytics' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="hidden md:flex flex-col h-screen p-4 fixed left-0 top-0 w-64 bg-[#f4fafd] border-r border-[#dde4e6] z-20">
      <div className="mb-8 px-4 flex items-center gap-3 mt-4">
        <div className="w-10 h-10 rounded-full bg-[#2d6a4f] flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-xl">domain</span>
        </div>
        <div>
          <h1 className="text-[20px] leading-[28px] font-semibold text-[#0f5238]">Fintrox Admin</h1>
          <p className="text-[12px] leading-[16px] tracking-[0.02em] font-medium text-[#404943]">Professional Plan</p>
        </div>
      </div>

      <ul className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? 'bg-[#beead1] text-[#436b58] scale-[0.98]'
                    : 'text-[#404943] hover:bg-[#e8eff1]'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-[14px] leading-[20px]">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto px-4 mb-4">
        <button className="w-full bg-[#2d6a4f] text-white py-3 rounded-lg text-[14px] leading-[20px] font-medium hover:bg-[#3f6653] transition-colors shadow-sm">
          Upgrade Now
        </button>
      </div>
    </nav>
  );
};

export default DashboardSidebar;