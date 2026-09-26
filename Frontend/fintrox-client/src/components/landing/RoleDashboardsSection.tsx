import React from 'react';
import LandingContainer from './LandingContainer';

const RoleDashboardsSection: React.FC = () => {
  const roles = [
    {
      title: 'Business Owners',
      desc: 'Full visibility into collections, employees, routes, and loan performance. Monitor targets and daily operational activity.',
    },
    {
      title: 'Individual Lenders',
      desc: 'A simplified workspace for solo lenders. Manage your own customers and loans without team overhead.',
    },
    {
      title: 'Field Agents',
      desc: 'See assigned routes and customers, record collections, and track daily and monthly targets with zero distraction.',
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24 w-full" id="dashboards">
      <LandingContainer>
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[13px] uppercase tracking-wider font-semibold text-[#8B9298] block mb-2">
            Built for Every Role
          </span>
          <h2 className="text-[28px] md:text-[40px] font-bold text-[#0F1419] tracking-tight">
            One platform. Three tailored dashboards.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E9EB]">
          {roles.map((role) => (
            <div key={role.title} className="py-8 md:py-0 md:px-8">
              <h3 className="text-[18px] md:text-[20px] font-semibold text-[#0F1419] mb-3">
                {role.title}
              </h3>
              <p className="text-[14px] md:text-[15px] text-[#5A6A72] leading-relaxed">
                {role.desc}
              </p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
};

export default RoleDashboardsSection;