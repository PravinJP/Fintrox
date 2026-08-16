import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="px-gutter max-w-7xl mx-auto py-xl md:py-[120px] flex flex-col lg:flex-row items-center gap-xl relative">
      {/* Background Blob */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-secondary-container/20 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="w-full lg:w-1/2 flex flex-col items-start gap-8 z-10">
        <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight hidden md:block">
          The Future of<br/>
          <span className="text-primary-container">Finance Management</span>
        </h1>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-tight md:hidden">
          The Future of<br/>
          <span className="text-primary-container">Finance Management</span>
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
          Streamline operations, automate complex loan workflows, and gain unprecedented clarity
          into your financial ecosystem with an enterprise-grade platform built for stability and scale.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link
            to="/register"
            className="bg-primary-container text-on-primary hover:bg-secondary font-label-md text-label-md px-8 py-4 rounded-DEFAULT transition-colors duration-200 flex items-center justify-center min-h-[48px] shadow-level-1 hover:shadow-level-2"
          >
            Start Your Free Trial
          </Link>
          <button className="bg-surface-container-low text-primary hover:bg-surface-variant font-label-md text-label-md px-8 py-4 rounded-DEFAULT transition-colors duration-200 flex items-center justify-center min-h-[48px] border border-outline-variant">
            Request a Demo
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="material-symbols-outlined text-secondary-fixed-dim icon-fill-1 text-sm">
            verified_user
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Bank-grade security. No credit card required.
          </span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 relative z-10 perspective-1000">
        <div className="bg-surface-container-lowest rounded-xl shadow-level-2 border border-outline-variant overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
          <div className="bg-surface-container h-8 flex items-center px-4 gap-2 border-b border-outline-variant">
            <div className="w-3 h-3 rounded-full bg-error/70"></div>
            <div className="w-3 h-3 rounded-full bg-secondary-fixed/80"></div>
            <div className="w-3 h-3 rounded-full bg-primary-fixed-dim/80"></div>
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