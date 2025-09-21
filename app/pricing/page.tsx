'use client';

import { PricingSection } from '@/components/pricing-section';
import Footer from '@/components/footer';
import { Navigation } from '@/components/navigation';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
} 