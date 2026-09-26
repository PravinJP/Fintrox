import React from 'react';
import LandingContainer from './LandingContainer';

const ReportsShowcase: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24 w-full">
      <LandingContainer className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <span className="text-[13px] uppercase tracking-wider font-semibold text-[#2D6A4F] block mb-2">
            Reports
          </span>
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#0F1419] mb-4 tracking-tight leading-tight">
            See exactly how your business is doing.
          </h2>
          <p className="text-[15px] md:text-[16px] text-[#5A6A72] leading-relaxed mb-6">
            Daily collection summaries, employee performance, overdue lists, and customer summaries — all available as live views or exported files.
          </p>
          <div className="space-y-3">
            {[
              'Daily, weekly, and monthly reports',
              'Employee performance tracking',
              'Export to Excel or PDF',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[14px] md:text-[15px] text-[#0F1419]">
                <span className="material-symbols-outlined text-[18px] text-[#2D6A4F]">check</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#E5E9EB] rounded-[8px] p-6 bg-white shadow-sm">
          <div className="mb-5 pb-4 border-b border-[#E5E9EB]">
            <div className="flex items-center justify-between text-[13px] mb-2">
              <span className="font-medium text-[#0F1419]">Monthly Recovery Trajectory</span>
              <span className="font-mono text-[#5A6A72]">68.7% target</span>
            </div>
            <div className="w-full bg-[#E5E9EB] h-2 rounded-[2px] overflow-hidden mb-2">
              <div className="bg-[#2D6A4F] h-full" style={{ width: '68.7%' }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-[#8B9298] font-mono">
              <span>Target: ₹8,50,000</span>
              <span>Realized: ₹5,84,000</span>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-[12px] font-semibold text-[#0F1419] uppercase tracking-wide block mb-3">
              Field Agent Activity
            </span>
            <div className="space-y-2">
              {[
                { name: 'Vikram Singh', route: 'North Route • 96% achieved', amount: '₹1,84,500' },
                { name: 'Sunil Rao', route: 'East Sector • 89% achieved', amount: '₹1,42,000' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 border border-[#E5E9EB] rounded-[6px] text-[12px]">
                  <div>
                    <span className="font-medium text-[#0F1419] block">{row.name}</span>
                    <span className="text-[11px] text-[#8B9298]">{row.route}</span>
                  </div>
                  <span className="font-semibold text-[#0F1419] font-mono">{row.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full border border-[#E5E9EB] hover:bg-[#F8FAFB] text-[#0F1419] py-2 rounded-[6px] text-[13px] font-medium transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#5A6A72]">file_download</span>
            Export Summary (PDF / Excel)
          </button>
        </div>
      </LandingContainer>
    </section>
  );
};

export default ReportsShowcase;