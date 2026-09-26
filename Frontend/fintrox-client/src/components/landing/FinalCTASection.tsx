import React from 'react';
import { Link } from 'react-router-dom';

const FinalCTASection: React.FC = () => {
  return (
    <section className="bg-[#1B4332] py-16 md:py-20 px-4 md:px-8 text-center text-white w-full">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[28px] md:text-[40px] font-bold text-white mb-4 tracking-tight">
          Bring order to your lending business.
        </h2>
        <p className="text-[16px] md:text-[18px] text-[#D8F3DC] mb-8">
          Set up your workspace in minutes.
        </p>
        <Link
          to="/register"
          className="bg-white text-[#1B4332] font-semibold px-8 py-3.5 rounded-[6px] hover:bg-[#F4F6F8] transition-colors inline-block text-[15px]"
        >
          Get started
        </Link>
      </div>
    </section>
  );
};

export default FinalCTASection;