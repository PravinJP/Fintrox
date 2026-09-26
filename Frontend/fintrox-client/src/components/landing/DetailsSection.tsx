import React from 'react';
import LandingContainer from './LandingContainer';

const DetailsSection: React.FC = () => {
  const details = [
    { title: 'Mobile Responsive', desc: 'Works on phone, tablet, and desktop.' },
    { title: 'Secure Login', desc: 'JWT authentication with role-based access.' },
    { title: 'Instant Search', desc: 'Find any customer, loan, or collection in seconds.' },
    { title: 'Data Export', desc: 'Download reports as Excel or PDF.' },
  ];

  return (
    <section className="bg-[#F8FAFB] py-16 md:py-24 border-y border-[#E5E9EB] w-full">
      <LandingContainer>
        <h2 className="text-[24px] md:text-[32px] font-bold text-[#0F1419] text-center mb-10 md:mb-12 tracking-tight">
          Built with details that matter.
        </h2>
        <div className="border border-[#E5E9EB] rounded-[8px] bg-white grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5E9EB]">
          {details.map((item, i) => (
            <div key={i} className="p-6 md:p-8">
              <h3 className="text-[16px] font-semibold text-[#0F1419] mb-1">{item.title}</h3>
              <p className="text-[14px] text-[#5A6A72]">{item.desc}</p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
};

export default DetailsSection;