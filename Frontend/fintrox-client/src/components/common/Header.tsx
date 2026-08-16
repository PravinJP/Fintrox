import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#f8faf9]/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center h-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1b4332] text-3xl icon-fill-1">
            account_balance
          </span>
          <span className="font-heading text-2xl font-bold text-[#012d1d]">
            Fintrox
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a className="text-[#012d1d] font-semibold border-b-2 border-[#012d1d] text-sm" href="#">
            Features
          </a>
          <a className="text-[#414844] hover:text-[#012d1d] transition-colors text-sm" href="#">
            About
          </a>
          <a className="text-[#414844] hover:text-[#012d1d] transition-colors text-sm" href="#">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden md:block text-xs font-semibold tracking-wider text-[#012d1d] hover:text-[#2c694e] transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#1b4332] text-white hover:bg-[#2c694e] font-semibold text-xs px-6 py-3 rounded transition-colors flex items-center justify-center min-h-[48px] shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
          <button className="md:hidden text-[#012d1d] p-2">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;