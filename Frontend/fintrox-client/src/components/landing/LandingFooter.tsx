import React from 'react';
import { Link } from 'react-router-dom';
import LandingContainer from './LandingContainer';

const LandingFooter: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 64;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-white border-t border-[#E5E9EB]">
      <LandingContainer className="pt-12 md:pt-16 pb-8 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-[#2D6A4F] flex items-center justify-center">
                <span className="text-white font-bold text-xs leading-none">F</span>
              </div>
              <span className="font-semibold text-[#0F1419] text-lg tracking-tight">Fintrox</span>
            </Link>
            <p className="text-[14px] text-[#5A6A72] max-w-xs">
              Loan management for modern lenders.
            </p>
          </div>

          <div>
            <h4 className="text-[14px] font-semibold text-[#0F1419] uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-[14px] text-[#5A6A72] hover:text-[#0F1419] transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-[14px] text-[#5A6A72] hover:text-[#0F1419] transition-colors"
                >
                  How it Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('dashboards')}
                  className="text-[14px] text-[#5A6A72] hover:text-[#0F1419] transition-colors"
                >
                  Dashboards
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[14px] font-semibold text-[#0F1419] uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-[14px] text-[#5A6A72] hover:text-[#0F1419] transition-colors"
                >
                  What it Solves
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-[14px] text-[#5A6A72] hover:text-[#0F1419] transition-colors"
                >
                  Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-[14px] text-[#5A6A72] hover:text-[#0F1419] transition-colors"
                >
                  Reports
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[14px] font-semibold text-[#0F1419] uppercase tracking-wider mb-4">
              Get Started
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/login"
                  className="text-[14px] text-[#5A6A72] hover:text-[#0F1419] transition-colors"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-[14px] text-[#5A6A72] hover:text-[#0F1419] transition-colors"
                >
                  Get started
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-[#E5E9EB] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-[#5A6A72]">
            © 2025 Fintrox. All rights reserved.
          </p>
        </div>
      </LandingContainer>
    </footer>
  );
};

export default LandingFooter;