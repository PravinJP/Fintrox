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
      {/* Subtle green glow */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(circle at top right, #D8F3DC 0%, transparent 65%)',
        }}
      ></div>

      {/* Original width: max-w-7xl (1280px) */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT: Text */}
          <div className="lg:col-span-6">
            <span className="text-[13px] uppercase tracking-wider font-semibold text-[#2D6A4F] mb-3 inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]"></span>
              Loan Management Platform
            </span>

            <h1 className="text-[36px] md:text-[52px] lg:text-[56px] leading-[1.08] font-bold tracking-tight mb-5">
              <span className="text-[#0F1419]">Manage your lending business. </span>
              <br />
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

          {/* RIGHT: Dashboard image */}
          <div className="lg:col-span-6">
            <div className="relative">
              {/* Decorative dotted pattern */}
              <div
                className="absolute -top-4 -right-4 w-24 h-24 pointer-events-none opacity-40 hidden md:block"
                style={{
                  backgroundImage: 'radial-gradient(circle, #2D6A4F 1.5px, transparent 1.5px)',
                  backgroundSize: '12px 12px',
                }}
              ></div>

              {/* Image frame */}
              <div className="relative rounded-[12px] overflow-hidden border border-[#E5E9EB] shadow-[0_12px_32px_rgba(45,106,79,0.10)] bg-white">
                <img
                  src="/hero-dashboard.png"
                  alt="Fintrox dashboard preview"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;