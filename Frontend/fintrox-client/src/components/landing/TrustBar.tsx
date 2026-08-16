import React from 'react';

const TrustBar: React.FC = () => {
  return (
    <section className="border-y border-outline-variant/50 bg-surface-container-lowest/50 py-12">
      <div className="px-gutter max-w-7xl mx-auto flex flex-col items-center gap-8">
        <p className="font-label-md text-label-md text-outline tracking-wider uppercase text-center">
          Trusted by 500+ forward-thinking finance teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            <span className="font-headline-sm text-headline-sm font-bold">AcmeBank</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">trending_up</span>
            <span className="font-headline-sm text-headline-sm font-bold">LendFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">payments</span>
            <span className="font-headline-sm text-headline-sm font-bold">CapitalX</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">savings</span>
            <span className="font-headline-sm text-headline-sm font-bold">Vaulted</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;