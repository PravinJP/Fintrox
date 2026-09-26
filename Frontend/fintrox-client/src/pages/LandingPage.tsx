import React from 'react';
import CollectionsShowcase from '../components/landing/CollectionsShowcase';
import DetailsSection from '../components/landing/DetailsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import FinalCTASection from '../components/landing/FinalCTASection';
import HeroSection from '../components/landing/HeroSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import LandingFooter from '../components/landing/LandingFooter';
import LandingNav from '../components/landing/LandingNav';
import ReportsShowcase from '../components/landing/ReportsShowcase';
import RoleDashboardsSection from '../components/landing/RoleDashboardsSection';
import SolvesSection from '../components/landing/SolvesSection';

const LandingPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      <LandingNav />
      <main className="w-full pt-16">
        <HeroSection />
        <SolvesSection />
        <FeaturesSection />
        <CollectionsShowcase />
        <ReportsShowcase />
        <HowItWorksSection />
        <RoleDashboardsSection />
        <DetailsSection />
        <FinalCTASection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;