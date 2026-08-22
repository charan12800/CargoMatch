import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { MetricsBar } from '../components/landing/MetricsBar';
import { HowItWorks } from '../components/landing/HowItWorks';
import { ValueProposition } from '../components/landing/ValueProposition';
import { EmptyReturnSpotlight } from '../components/landing/EmptyReturnSpotlight';
import { AiMatchingSection } from '../components/landing/AiMatchingSection';
import { CostEstimator } from '../components/landing/CostEstimator';
import { PopularRoutes } from '../components/landing/PopularRoutes';
import { TrustAndSafety } from '../components/landing/TrustAndSafety';
import { CtaBanner } from '../components/landing/CtaBanner';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <MetricsBar />
        <HowItWorks />
        <ValueProposition />
        <EmptyReturnSpotlight />
        <AiMatchingSection />
        <CostEstimator />
        <PopularRoutes />
        <TrustAndSafety />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
};
