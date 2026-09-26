import React from 'react';

const CollectionsShowcase: React.FC = () => {
  return (
    <section className="bg-[#F8FAFB] py-16 md:py-24 px-4 md:px-8 border-y border-[#E5E9EB] w-full">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="border border-[#E5E9EB] rounded-[8px] bg-white overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E5E9EB] flex items-center justify-between bg-[#F8FAFB]">
            <span className="text-[12px] font-semibold text-[#0F1419] uppercase tracking-wide">
              Live Collections Ledger
            </span>
            <span className="text-[11px] font-mono text-[#8B9298]">Today</span>
          </div>
          <div className="divide-y divide-[#E5E9EB] text-[13px]">
            {[
              { name: 'Sunil Rao', id: 'LN-4091', amount: '₹2,000', method: 'UPI' },
              { name: 'Deepa Patel', id: 'LN-4188', amount: '₹1,500', method: 'Cash' },
              { name: 'Ramesh V.', id: 'LN-3992', amount: '₹4,000', method: 'Bank' },
              { name: 'Kavita Reddy', id: 'LN-4255', amount: '₹900', method: 'Cash' },
            ].map((row, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-[#0F1419] block">{row.name}</span>
                  <span className="text-[11px] text-[#8B9298] font-mono">{row.id}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[#0F1419] block">{row.amount}</span>
                  <span className="text-[11px] text-[#2D6A4F] font-mono">{row.method} • Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[13px] uppercase tracking-wider font-semibold text-[#2D6A4F] block mb-2">
            Collections
          </span>
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#0F1419] mb-4 tracking-tight leading-tight">
            Record a payment in under 10 seconds.
          </h2>
          <p className="text-[15px] md:text-[16px] text-[#5A6A72] leading-relaxed mb-6">
            Select a customer, enter the amount, pick a payment method, and the outstanding balance updates instantly.
          </p>
          <div className="space-y-3">
            {[
              'Cash, UPI, Bank Transfer, and Cheque supported',
              'Automatic receipt generation',
              'Outstanding balance updates in real time',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[14px] md:text-[15px] text-[#0F1419]">
                <span className="material-symbols-outlined text-[18px] text-[#2D6A4F]">check</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionsShowcase;