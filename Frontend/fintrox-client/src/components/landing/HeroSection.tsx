import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      const offset = 64;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <span className="text-[13px] uppercase tracking-wider font-semibold text-[#5A6A72] mb-3">
            Loan Management Platform
          </span>
          <h1 className="text-[36px] md:text-[56px] leading-[1.1] font-bold text-[#0F1419] tracking-tight mb-6">
            Manage your lending business. Not spreadsheets.
          </h1>
          <p className="text-[16px] md:text-[18px] leading-relaxed text-[#5A6A72] max-w-xl mb-8">
            Fintrox is a complete platform for small lenders and field agents —
            customers, loans, collections, and reports in one place.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="bg-[#2D6A4F] text-white px-6 py-3 rounded-[6px] font-semibold text-[15px] hover:bg-[#1B4332] transition-colors"
            >
              Get started
            </Link>
            <button
              onClick={scrollToFeatures}
              className="text-[#5A6A72] hover:text-[#2D6A4F] font-medium text-[15px] inline-flex items-center gap-1.5 transition-colors"
            >
              Explore features
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          <p className="text-[14px] text-[#8B9298] mt-4">
            Set up in under 2 minutes.
          </p>
        </div>

        {/* Right: Dashboard Mockup */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white border border-[#E5E9EB] rounded-[8px] shadow-sm overflow-hidden w-full">
            {/* Window Header */}
            <div className="bg-[#F8FAFB] px-4 py-2.5 border-b border-[#E5E9EB] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E9EB]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E9EB]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E9EB]"></span>
              </div>
              <div className="text-[12px] font-mono text-[#8B9298] bg-white border border-[#E5E9EB] px-3 py-0.5 rounded-[4px]">
                app.fintrox.com/dashboard
              </div>
              <div className="w-8"></div>
            </div>

            {/* App Header */}
            <div className="px-5 py-3 border-b border-[#E5E9EB] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-[4px] bg-[#2D6A4F] flex items-center justify-center text-white text-[11px] font-bold">
                  F
                </div>
                <span className="text-[13px] font-semibold text-[#0F1419]">
                  Fintrox Operations
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 bg-[#F4F6F8] px-2.5 py-1 rounded-[4px] text-[#8B9298] text-[12px]">
                  <span className="material-symbols-outlined text-[14px]">search</span>
                  <span>Search...</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#E5E9EB] flex items-center justify-center text-[#5A6A72] text-[11px] font-semibold">
                  VS
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#E5E9EB] border-b border-[#E5E9EB]">
              <div className="bg-white p-3">
                <span className="block text-[11px] text-[#8B9298] uppercase tracking-wider">Today</span>
                <span className="block text-[15px] font-bold text-[#0F1419] mt-0.5">₹29,000</span>
              </div>
              <div className="bg-white p-3">
                <span className="block text-[11px] text-[#8B9298] uppercase tracking-wider">Loans</span>
                <span className="block text-[15px] font-bold text-[#0F1419] mt-0.5">12</span>
              </div>
              <div className="bg-white p-3">
                <span className="block text-[11px] text-[#8B9298] uppercase tracking-wider">Customers</span>
                <span className="block text-[15px] font-bold text-[#0F1419] mt-0.5">48</span>
              </div>
              <div className="bg-white p-3">
                <span className="block text-[11px] text-[#8B9298] uppercase tracking-wider">Employees</span>
                <span className="block text-[15px] font-bold text-[#0F1419] mt-0.5">6</span>
              </div>
            </div>

            {/* Chart */}
            <div className="p-4 border-b border-[#E5E9EB] bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-semibold text-[#0F1419]">7-Day Collection Trajectory</span>
                <span className="text-[11px] text-[#2D6A4F] font-medium">+14.2% vs last week</span>
              </div>
              <div className="h-24 w-full">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 80">
                  <line stroke="#F4F6F8" strokeWidth="1" x1="0" x2="320" y1="20" y2="20"></line>
                  <line stroke="#F4F6F8" strokeWidth="1" x1="0" x2="320" y1="50" y2="50"></line>
                  <polyline
                    fill="none"
                    points="10,65 58,54 106,60 154,38 202,42 250,22 310,14"
                    stroke="#2D6A4F"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></polyline>
                  <circle cx="310" cy="14" fill="#2D6A4F" r="3"></circle>
                </svg>
              </div>
              <div className="flex justify-between text-[10px] text-[#8B9298] font-mono mt-1">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>TODAY</span>
              </div>
            </div>

            {/* Recent Table */}
            <div className="p-4 bg-white">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[12px] font-semibold text-[#0F1419]">Live Entries</span>
                <span className="text-[11px] text-[#8B9298]">3 records logged</span>
              </div>
              <div className="divide-y divide-[#E5E9EB] border border-[#E5E9EB] rounded-[6px] overflow-hidden text-[12px]">
                <div className="flex items-center justify-between p-2.5 bg-white">
                  <div>
                    <span className="font-medium text-[#0F1419] block">Ramesh Kumar</span>
                    <span className="text-[11px] text-[#8B9298] font-mono">LN-4028</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-[#0F1419] block">₹2,500</span>
                    <span className="text-[10px] text-[#5A6A72] uppercase font-mono">UPI • Verified</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white">
                  <div>
                    <span className="font-medium text-[#0F1419] block">Priya Sharma</span>
                    <span className="text-[11px] text-[#8B9298] font-mono">LN-3991</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-[#0F1419] block">₹1,800</span>
                    <span className="text-[10px] text-[#5A6A72] uppercase font-mono">Cash • Verified</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white">
                  <div>
                    <span className="font-medium text-[#0F1419] block">Vijay Nair</span>
                    <span className="text-[11px] text-[#8B9298] font-mono">LN-4105</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-[#0F1419] block">₹3,200</span>
                    <span className="text-[10px] text-[#5A6A72] uppercase font-mono">UPI • Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;