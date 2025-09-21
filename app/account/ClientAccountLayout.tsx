'use client'

import React from 'react';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/footer';

export default function ClientAccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 