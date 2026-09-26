import React from 'react';

const SolvesSection: React.FC = () => {
  return (
    <section className="bg-[#F8FAFB] py-16 md:py-24 px-4 md:px-8 border-y border-[#E5E9EB] w-full">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-[28px] md:text-[40px] font-bold text-[#0F1419] mb-4 tracking-tight">
            Lending without software is chaos.
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#5A6A72] max-w-2xl mx-auto">
            Spreadsheets and WhatsApp groups don't scale. Fintrox brings structure to the business.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E9EB]">
          <div className="py-8 md:py-0 md:px-8">
            <span className="text-[14px] font-mono text-[#8B9298] block mb-2">01</span>
            <h3 className="text-[18px] font-semibold text-[#0F1419] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#2D6A4F]">payments</span>
              Track every payment
            </h3>
            <p className="text-[15px] text-[#5A6A72] leading-relaxed">
              Every collection is timestamped and tied to a loan and customer. Nothing gets lost.
            </p>
          </div>
          <div className="py-8 md:py-0 md:px-8">
            <span className="text-[14px] font-mono text-[#8B9298] block mb-2">02</span>
            <h3 className="text-[18px] font-semibold text-[#0F1419] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#2D6A4F]">visibility</span>
              See the whole picture
            </h3>
            <p className="text-[15px] text-[#5A6A72] leading-relaxed">
              Owners see all activity. Agents see only their assigned work. No overlap.
            </p>
          </div>
          <div className="py-8 md:py-0 md:px-8">
            <span className="text-[14px] font-mono text-[#8B9298] block mb-2">03</span>
            <h3 className="text-[18px] font-semibold text-[#0F1419] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#2D6A4F]">schedule</span>
              Skip the manual work
            </h3>
            <p className="text-[15px] text-[#5A6A72] leading-relaxed">
              Interest, installment schedules, and due dates are calculated automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolvesSection;