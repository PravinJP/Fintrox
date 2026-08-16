import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Hero from '../components/landing/Hero';
import TrustBar from '../components/landing/TrustBar';
import Features from '../components/landing/Features';
import './index.css';


const LandingPage: React.FC = () => {
  return (
    <div className="pt-20">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;