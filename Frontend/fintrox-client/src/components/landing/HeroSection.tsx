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
    <section className="relative w-full bg-gradient-to-b from-[#F8FAFB] via-[#F4F8F5] to-[#F8FAFB] overflow-hidden">
      {/* Subtle green glow decoration */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at top right, #D8F3DC 0%, transparent 60%)',
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Text content */}
        <div className="max-w-3xl">
          <span className="text-[13px] uppercase tracking-wider font-semibold text-[#2D6A4F] mb-3 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]"></span>
            Loan Management Platform
          </span>

          <h1 className="text-[36px] md:text-[56px] leading-[1.08] font-bold tracking-tight mb-5">
            <span className="text-[#0F1419]">Manage your lending business. </span>
            <br className="hidden md:block" />
            <span className="text-[#2D6A4F]">Not spreadsheets.</span>
          </h1>

          <p className="text-[16px] md:text-[18px] leading-relaxed text-[#5A6A72] max-w-xl mb-7">
            Fintrox is a complete platform for small lenders and field agents —
            customers, loans, collections, and reports in one place.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="bg-[#2D6A4F] text-white px-6 py-3 rounded-[6px] font-semibold text-[15px] hover:bg-[#1B4332] transition-colors shadow-sm"
            >
              Get started
            </Link>
            <button
              onClick={scrollToFeatures}
              className="text-[#0F1419] hover:text-[#2D6A4F] font-medium text-[15px] inline-flex items-center gap-1.5 transition-colors"
            >
              Explore features
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <p className="text-[13px] text-[#8B9298] mt-4">
            Set up in under 2 minutes.
          </p>
        </div>

        {/* Horizontal dashboard image — full width banner */}
        <div className="mt-10 md:mt-14">
          <div className="rounded-[12px] overflow-hidden border border-[#E5E9EB] shadow-[0_8px_24px_rgba(45,106,79,0.08)] bg-white">
            <img
              src="/hero-dashboard.png"
              alt="Fintrox dashboard preview"
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;