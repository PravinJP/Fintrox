import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm bg-surface">
      <div className="flex justify-between items-center h-20 px-gutter max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container text-3xl icon-fill-1">
            account_balance
          </span>
          <span className="font-headline-sm text-headline-sm font-bold text-primary">
            Fintrox
          </span>
        </div>

        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <a className="font-body-md text-body-md text-primary font-semibold border-b-2 border-primary active:scale-95 transition-transform" href="#">
            Features
          </a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 active:scale-95" href="#">
            About
          </a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 active:scale-95" href="#">
            Contact
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden md:block font-label-md text-label-md text-primary hover:text-secondary transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-primary-container text-on-primary hover:bg-secondary font-label-md text-label-md px-6 py-3 rounded-DEFAULT transition-colors duration-200 flex items-center justify-center min-h-[48px]"
          >
            Get Started
          </Link>
          <button className="md:hidden text-primary p-2">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;