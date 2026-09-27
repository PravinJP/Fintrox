import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const allMenuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      roles: ['OWNER', 'EMPLOYEE', 'INDIVIDUAL_LENDER'],
    },
    {
      path: '/employees',
      label: 'Employees',
      icon: 'badge',
      roles: ['OWNER'],
    },
    {
      path: '/routes',
      label: 'Routes',
      icon: 'route',
      roles: ['OWNER', 'INDIVIDUAL_LENDER'],
    },
    {
      path: '/customers',
      label: 'Customers',
      icon: 'groups',
      roles: ['OWNER', 'EMPLOYEE', 'INDIVIDUAL_LENDER'],
    },
    {
      path: '/loans',
      label: 'Loans',
      icon: 'account_balance_wallet',
      roles: ['OWNER', 'EMPLOYEE', 'INDIVIDUAL_LENDER'],
    },
    {
      path: '/collections',
      label: 'Collections',
      icon: 'payments',
      roles: ['OWNER', 'EMPLOYEE', 'INDIVIDUAL_LENDER'],
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: 'analytics',
      roles: ['OWNER', 'EMPLOYEE', 'INDIVIDUAL_LENDER'],
    },
  ];

  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(user?.userType || '')
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getRoleLabel = (userType?: string) => {
    if (userType === 'OWNER') return 'Business Owner';
    if (userType === 'EMPLOYEE') return 'Field Agent';
    if (userType === 'INDIVIDUAL_LENDER') return 'Individual Lender';
    return 'Professional Plan';
  };

  return (
    <>
      <nav
        className="
          hidden md:flex fixed left-0 top-0 z-20 h-screen w-64 flex-col
          border-r border-[#dde4e6] bg-[#f4fafd] p-4
        "
      >
        <div className="mb-8 mt-4 flex items-center gap-3 px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d6a4f] text-white text-sm font-semibold">
            {getInitials(user?.fullName)}
          </div>
          <div className="min-w-0">
            <h1 className="text-[16px] font-semibold leading-[22px] text-[#0f5238] truncate">
              {user?.fullName || 'User'}
            </h1>
            <p className="text-[12px] font-medium leading-[16px] tracking-[0.02em] text-[#404943] truncate">
              {getRoleLabel(user?.userType)}
            </p>
          </div>
        </div>

        <ul className="flex flex-1 flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 rounded-lg px-4 py-3 transition-all
                    ${isActive
                      ? 'scale-[0.98] bg-[#beead1] text-[#436b58]'
                      : 'text-[#404943] hover:bg-[#e8eff1]'
                    }
                  `}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="text-[14px] leading-[20px]">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <header
        className="
          fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between
          border-b border-[#dde4e6] bg-[#f4fafd] px-4 md:hidden
        "
      >
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="
            flex h-10 w-10 items-center justify-center rounded-lg
            text-[#404943] transition-colors hover:bg-[#e8eff1] active:bg-[#dde4e6]
          "
          aria-label="Open navigation"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d6a4f] text-white text-xs font-semibold">
            {getInitials(user?.fullName)}
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold leading-[20px] text-[#0f5238] truncate">
              {user?.fullName || 'User'}
            </h1>
            <p className="text-[10px] font-medium text-[#404943] truncate">
              {getRoleLabel(user?.userType)}
            </p>
          </div>
        </div>

        <div className="w-10" />
      </header>

      {isMobileMenuOpen && (
        <div
          className="
            fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-[2px] md:hidden
          "
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside
            className="h-full w-[280px] max-w-[85vw] bg-[#f4fafd] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#dde4e6] p-5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d6a4f] text-white text-sm font-semibold shrink-0">
                  {getInitials(user?.fullName)}
                </div>
                <div className="min-w-0">
                  <h1 className="text-[16px] font-semibold leading-[22px] text-[#0f5238] truncate">
                    {user?.fullName || 'User'}
                  </h1>
                  <p className="text-[11px] font-medium text-[#404943] truncate">
                    {getRoleLabel(user?.userType)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="
                  flex h-9 w-9 items-center justify-center rounded-lg
                  text-[#404943] transition-colors hover:bg-[#e8eff1] shrink-0
                "
                aria-label="Close navigation"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex h-[calc(100%-81px)] flex-col p-4">
              <ul className="flex flex-1 flex-col gap-2">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={handleNavigation}
                        className={`
                          flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all
                          ${isActive
                            ? 'bg-[#beead1] text-[#436b58]'
                            : 'text-[#404943] hover:bg-[#e8eff1]'
                          }
                        `}
                      >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="text-[14px] font-medium leading-[20px]">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;