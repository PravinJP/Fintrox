import React from 'react';
import LandingContainer from './LandingContainer';

const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24 w-full" id="features">
      <LandingContainer>
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[13px] uppercase tracking-wider font-semibold text-[#8B9298] block mb-2">
            What's Inside
          </span>
          <h2 className="text-[28px] md:text-[40px] font-bold text-[#0F1419] tracking-tight mb-4">
            Everything you need to run your lending business
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#5A6A72] max-w-xl mx-auto">
            Built for how lending actually works.
          </p>
        </div>

        <div className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 border border-[#E5E9EB] rounded-[8px] p-6 md:p-8 bg-white hover:border-[#D1D6DA] transition-colors flex flex-col justify-between">
              <div>
                <h3 className="text-[20px] md:text-[22px] font-semibold text-[#0F1419] mb-2">
                  Customer Management
                </h3>
                <p className="text-[14px] md:text-[15px] text-[#5A6A72] mb-6">
                  Complete customer profiles with contact details, address, and full loan history.
                </p>
              </div>
              <div className="border border-[#E5E9EB] bg-[#F8FAFB] rounded-[6px] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E9EB]">
                  <div>
                    <span className="text-[14px] font-semibold text-[#0F1419] block">Anand Vardhan</span>
                    <span className="text-[12px] font-mono text-[#5A6A72]">+91 98402 11920</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#E5E9EB] text-[#5A6A72] text-[11px] font-medium">
                      Route #4
                    </span>
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#D8F3DC] text-[#1B4332] text-[11px] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span> KYC Verified
                    </span>
                  </div>
                </div>
                <div className="pt-3 flex items-center justify-between text-[12px]">
                  <span className="text-[#5A6A72]">
                    Active Balance: <strong className="text-[#0F1419]">₹18,400</strong>
                  </span>
                  <span className="text-[#8B9298]">3 loans cleared</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 border border-[#E5E9EB] rounded-[8px] p-6 md:p-8 bg-white hover:border-[#D1D6DA] transition-colors flex flex-col justify-between">
              <div>
                <h3 className="text-[20px] md:text-[22px] font-semibold text-[#0F1419] mb-2">
                  Daily, Weekly & Monthly Loans
                </h3>
                <p className="text-[14px] md:text-[15px] text-[#5A6A72] mb-4">
                  Create loans of any type. Interest, installments, and due dates are calculated automatically.
                </p>
              </div>
              <div className="border border-[#E5E9EB] bg-[#F8FAFB] rounded-[6px] p-4 mt-4">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="px-2.5 py-1 text-[11px] font-medium bg-[#2D6A4F] text-white rounded-[4px]">
                    Daily (100d)
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-medium bg-white text-[#5A6A72] border border-[#E5E9EB] rounded-[4px]">
                    Weekly (20w)
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-medium bg-white text-[#5A6A72] border border-[#E5E9EB] rounded-[4px]">
                    Monthly (12m)
                  </span>
                </div>
                <div className="text-[12px] bg-white border border-[#E5E9EB] p-2.5 rounded-[4px] text-[#5A6A72]">
                  Principal: <strong className="text-[#0F1419]">₹20,000</strong> • Daily Due:{' '}
                  <strong className="text-[#2D6A4F]">₹240</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#E5E9EB] rounded-[8px] p-6 bg-white hover:border-[#D1D6DA] transition-colors flex flex-col justify-between">
              <div>
                <h3 className="text-[18px] font-semibold text-[#0F1419] mb-2">
                  Collection Recording
                </h3>
                <p className="text-[14px] text-[#5A6A72] leading-relaxed mb-4">
                  Agents record payments with payment method and notes. A receipt is generated instantly.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5E9EB]">
                <span className="text-[11px] font-mono text-[#2D6A4F] bg-[#F4F6F8] px-2.5 py-1 rounded-[4px] inline-block">
                  RCP-89214 • Print Ready
                </span>
              </div>
            </div>

            <div className="border border-[#E5E9EB] rounded-[8px] p-6 bg-white hover:border-[#D1D6DA] transition-colors flex flex-col justify-between">
              <div>
                <h3 className="text-[18px] font-semibold text-[#0F1419] mb-2">
                  Employee & Agent Management
                </h3>
                <p className="text-[14px] text-[#5A6A72] leading-relaxed mb-4">
                  Add field agents, assign them to routes, and set monthly and daily targets.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5E9EB]">
                <span className="text-[11px] font-mono text-[#5A6A72] bg-[#F4F6F8] px-2.5 py-1 rounded-[4px] inline-block">
                  8 Active Agents • Target: 92%
                </span>
              </div>
            </div>

            <div className="border border-[#E5E9EB] rounded-[8px] p-6 bg-white hover:border-[#D1D6DA] transition-colors flex flex-col justify-between">
              <div>
                <h3 className="text-[18px] font-semibold text-[#0F1419] mb-2">
                  Route Management
                </h3>
                <p className="text-[14px] text-[#5A6A72] leading-relaxed mb-4">
                  Group customers into routes, assign them to agents, and view them on an interactive map.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5E9EB]">
                <span className="text-[11px] font-mono text-[#5A6A72] bg-[#F4F6F8] px-2.5 py-1 rounded-[4px] inline-block">
                  Route A (North) • 24 stops
                </span>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 border border-[#E5E9EB] rounded-[8px] p-6 md:p-8 bg-white hover:border-[#D1D6DA] transition-colors flex flex-col justify-between">
              <div>
                <h3 className="text-[20px] md:text-[22px] font-semibold text-[#0F1419] mb-2">
                  Real-Time Dashboard
                </h3>
                <p className="text-[14px] md:text-[15px] text-[#5A6A72] mb-4">
                  Live view of collections, active loans, overdue payments, and top performers.
                </p>
              </div>
              <div className="p-3 bg-[#F8FAFB] border border-[#E5E9EB] rounded-[6px] text-[12px] flex items-center justify-between">
                <span className="text-[#5A6A72]">
                  Overdue loans: <strong className="text-[#BA1A1A]">3 accounts (₹14,200)</strong>
                </span>
                <span className="text-[11px] text-[#8B9298] font-mono uppercase">Flagged</span>
              </div>
            </div>

            <div className="lg:col-span-7 border border-[#E5E9EB] rounded-[8px] p-6 md:p-8 bg-white hover:border-[#D1D6DA] transition-colors flex flex-col sm:flex-row gap-6 md:gap-8 items-start justify-between">
              <div className="sm:w-1/2">
                <h3 className="text-[18px] font-semibold text-[#0F1419] mb-2">
                  Reports & Export
                </h3>
                <p className="text-[14px] text-[#5A6A72] leading-relaxed mb-4">
                  Daily, weekly, and monthly reports. Export to Excel or PDF with a single click.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-[#5A6A72] border border-[#E5E9EB] px-2 py-0.5 rounded-[4px]">
                    Excel (.xlsx)
                  </span>
                  <span className="text-[11px] font-mono text-[#5A6A72] border border-[#E5E9EB] px-2 py-0.5 rounded-[4px]">
                    PDF Ledger
                  </span>
                </div>
              </div>
              <div className="sm:w-1/2 pt-6 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[#E5E9EB] sm:pl-8">
                <h3 className="text-[18px] font-semibold text-[#0F1419] mb-2">
                  Owner, Agent & Lender Roles
                </h3>
                <p className="text-[14px] text-[#5A6A72] leading-relaxed">
                  Separate dashboards for owners, individual lenders, and field agents — each tailored to their exact operational scope.
                </p>
              </div>
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
};

export default FeaturesSection;