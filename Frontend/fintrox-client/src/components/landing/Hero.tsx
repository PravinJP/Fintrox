import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="px-6 max-w-7xl mx-auto py-20 md:py-[120px] flex flex-col lg:flex-row items-center gap-20 relative">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#aeeecb]/20 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="w-full lg:w-1/2 flex flex-col items-start gap-8 z-10">
        <h1 className="text-[60px] leading-[72px] font-bold text-[#191c1c] hidden md:block tracking-[-0.02em]">
          The Future of<br/>
          <span className="text-[#1b4332]">Finance Management</span>
        </h1>
        <h1 className="text-[36px] leading-[44px] font-bold text-[#191c1c] md:hidden">
          The Future of<br/>
          <span className="text-[#1b4332]">Finance Management</span>
        </h1>

        <p className="text-[18px] leading-[28px] text-[#414844] max-w-lg">
          Streamline operations, automate complex loan workflows, and gain unprecedented clarity
          into your financial ecosystem with an enterprise-grade platform built for stability and scale.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link
            to="/register"
            className="bg-[#1b4332] text-white hover:bg-[#2c694e] font-semibold text-xs px-8 py-4 rounded transition-colors flex items-center justify-center min-h-[48px] shadow-sm hover:shadow-md"
          >
            Start Your Free Trial
          </Link>
          <button className="bg-[#f2f4f3] text-[#012d1d] hover:bg-[#e1e3e2] font-semibold text-xs px-8 py-4 rounded transition-colors flex items-center justify-center min-h-[48px] border border-[#c1c8c2]">
            Request a Demo
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="material-symbols-outlined text-[#95d4b3] icon-fill-1 text-sm">
            verified_user
          </span>
          <span className="text-sm text-[#414844]">
            Bank-grade security. No credit card required.
          </span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 relative z-10">
        <div className="bg-white rounded-xl shadow-lg border border-[#c1c8c2] overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
          <div className="bg-[#eceeed] h-8 flex items-center px-4 gap-2 border-b border-[#c1c8c2]">
            <div className="w-3 h-3 rounded-full bg-[#ba1a1a]/70"></div>
            <div className="w-3 h-3 rounded-full bg-[#b1f0ce]/80"></div>
            <div className="w-3 h-3 rounded-full bg-[#a5d0b9]/80"></div>
          </div>
          <img
            alt="Fintrox Owner Dashboard"
            className="w-full h-auto object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD877OK-7kKD7QPg5P2dq_m--scVRVSsnc7sviJ7PTNOW9gjwIvXdaa5mhAs4xBXJ2x-UEFExbgJ8UNIUpVPJhOjtZh20rbpJ6989m6CQ7xcBFsY_wQNosJ0hbhKupK12pHVg2C5oeGF07OcLABzJpOPzChMBM1AO6caHV4kndDSPvWnwmkaRhRp2jZak8T0VyvKO1pHEoB0nO1lkD-Us8XE7mHNJSveQv8bap72JLdH_CAO_a8NIzS"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;