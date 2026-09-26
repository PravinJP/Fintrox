import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/employees', label: 'Employees', icon: 'badge' },
    { path: '/routes', label: 'Routes', icon: 'route' },
    { path: '/customers', label: 'Customers', icon: 'groups' },
    {
      path: '/loans',
      label: 'Loans',
      icon: 'account_balance_wallet',
    },
    {
      path: '/collections',
      label: 'Collections',
      icon: 'payments',
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: 'analytics',
    },
  ];

  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
          ===================================================== */}
      <nav
        className="
          hidden
          md:flex
          fixed
          left-0
          top-0
          z-20
          h-screen
          w-64
          flex-col
          border-r
          border-[#dde4e6]
          bg-[#f4fafd]
          p-4
        "
      >
        {/* Logo / Brand */}
        <div className="mb-8 mt-4 flex items-center gap-3 px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d6a4f] text-white">
            <span className="material-symbols-outlined text-xl">
              domain
            </span>
          </div>

          <div>
            <h1 className="text-[20px] font-semibold leading-[28px] text-[#0f5238]">
              Fintrox Admin
            </h1>

            <p className="text-[12px] font-medium leading-[16px] tracking-[0.02em] text-[#404943]">
              Professional Plan
            </p>
          </div>
        </div>

        {/* Navigation */}
        <ul className="flex flex-1 flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-4
                    py-3
                    transition-all
                    ${
                      isActive
                        ? 'scale-[0.98] bg-[#beead1] text-[#436b58]'
                        : 'text-[#404943] hover:bg-[#e8eff1]'
                    }
                  `}
                >
                  <span className="material-symbols-outlined">
                    {item.icon}
                  </span>

                  <span className="text-[14px] leading-[20px]">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        
        <div className="mt-auto mb-4 px-4">
          <button className="w-full rounded-lg bg-[#2d6a4f] py-3 text-[14px] font-medium leading-[20px] text-white shadow-sm transition-colors hover:bg-[#3f6653]">
            Upgrade Now
          </button>
        </div>
      </nav>

      
      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-40
          flex
          h-16
          items-center
          justify-between
          border-b
          border-[#dde4e6]
          bg-[#f4fafd]
          px-4
          md:hidden
        "
      >
        
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            text-[#404943]
            transition-colors
            hover:bg-[#e8eff1]
          "
          aria-label="Open navigation"
        >
          <span className="material-symbols-outlined text-2xl">
            menu
          </span>
        </button>

        
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d6a4f] text-white">
            <span className="material-symbols-outlined text-lg">
              domain
            </span>
          </div>

          <div>
            <h1 className="text-[17px] font-semibold leading-[22px] text-[#0f5238]">
              Fintrox
            </h1>

            <p className="text-[10px] font-medium text-[#404943]">
              Admin
            </p>
          </div>
        </div>

        
        <div className="w-10" />
      </header>

      
      {isMobileMenuOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-slate-900/40
            backdrop-blur-[2px]
            md:hidden
          "
          onClick={() => setIsMobileMenuOpen(false)}
        >
          
          <aside
            className="
              h-full
              w-[280px]
              max-w-[85vw]
              bg-[#f4fafd]
              shadow-2xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="flex items-center justify-between border-b border-[#dde4e6] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d6a4f] text-white">
                  <span className="material-symbols-outlined text-xl">
                    domain
                  </span>
                </div>

                <div>
                  <h1 className="text-[18px] font-semibold leading-[24px] text-[#0f5238]">
                    Fintrox Admin
                  </h1>

                  <p className="text-[11px] font-medium text-[#404943]">
                    Professional Plan
                  </p>
                </div>
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-[#404943]
                  transition-colors
                  hover:bg-[#e8eff1]
                "
                aria-label="Close navigation"
              >
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>
            </div>

            
            <div className="flex h-[calc(100%-81px)] flex-col p-4">
              <ul className="flex flex-1 flex-col gap-2">
                {menuItems.map((item) => {
                  const isActive =
                    location.pathname === item.path;

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={handleNavigation}
                        className={`
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-4
                          py-3.5
                          transition-all
                          ${
                            isActive
                              ? 'bg-[#beead1] text-[#436b58]'
                              : 'text-[#404943] hover:bg-[#e8eff1]'
                          }
                        `}
                      >
                        <span className="material-symbols-outlined">
                          {item.icon}
                        </span>

                        <span className="text-[14px] font-medium leading-[20px]">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile Upgrade */}
              <div className="border-t border-[#dde4e6] pt-4">
                <button className="w-full rounded-xl bg-[#2d6a4f] py-3 text-[14px] font-medium leading-[20px] text-white shadow-sm transition-colors hover:bg-[#3f6653]">
                  Upgrade Now
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;