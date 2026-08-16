import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#c1c8c2] w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1b4332] text-2xl icon-fill-1">
              account_balance
            </span>
            <span className="font-heading text-2xl font-bold text-[#191c1c]">
              Fintrox
            </span>
          </div>
          <p className="text-sm text-[#414844] mt-2">
            Enterprise finance management, simplified.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold tracking-wider text-[#191c1c] mb-2">Legal</h4>
          <a className="text-sm text-[#414844] hover:text-[#012d1d]" href="#">
            Privacy Policy
          </a>
          <a className="text-sm text-[#414844] hover:text-[#012d1d]" href="#">
            Terms of Service
          </a>
          <a className="text-sm text-[#414844] hover:text-[#012d1d]" href="#">
            Security
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold tracking-wider text-[#191c1c] mb-2">Product</h4>
          <a className="text-sm text-[#414844] hover:text-[#012d1d]" href="#">
            Features
          </a>
          <Link className="text-sm text-[#414844] hover:text-[#012d1d]" to="/login">
            Login
          </Link>
          <Link className="text-sm text-[#414844] hover:text-[#012d1d]" to="/register">
            Get Started
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold tracking-wider text-[#191c1c] mb-2">Company</h4>
          <a className="text-sm text-[#414844] hover:text-[#012d1d]" href="#">
            About Us
          </a>
          <a className="text-sm text-[#414844] hover:text-[#012d1d]" href="#">
            Contact
          </a>
        </div>
      </div>

      <div className="border-t border-[#c1c8c2]/30 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#414844]">
            © 2024 Fintrox Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;