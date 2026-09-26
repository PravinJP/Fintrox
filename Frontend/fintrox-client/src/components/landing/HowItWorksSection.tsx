import React from 'react';
import LandingContainer from './LandingContainer';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Create your account',
      desc: 'Sign up as an owner or individual lender. Set up your organization in under 2 minutes.',
    },
    {
      num: '02',
      title: 'Add customers and employees',
      desc: 'Onboard your customers, add field agents, and assign routes.',
    },
    {
      num: '03',
      title: 'Start collecting',
      desc: 'Create loans, record payments, and watch everything flow into your dashboard.',
    },
  ];

  return (
    <section
      className="bg-[#F8FAFB] py-16 md:py-24 border-y border-[#E5E9EB] w-full"
      id="how-it-works"
    >
      <LandingContainer>
        <h2 className="text-[28px] md:text-[40px] font-bold text-[#0F1419] mb-12 md:mb-16 tracking-tight text-center">
          Three steps to get started.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {steps.map((step) => (
            <div key={step.num}>
              <span className="text-[40px] font-mono font-bold text-[#D1D6DA] block mb-3 leading-none">
                {step.num}
              </span>
              <h3 className="text-[18px] md:text-[20px] font-semibold text-[#0F1419] mb-2">
                {step.title}
              </h3>
              <p className="text-[14px] md:text-[15px] text-[#5A6A72] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
};

export default HowItWorksSection;