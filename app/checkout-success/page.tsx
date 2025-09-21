'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SearchParamsContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  return <div className="text-xl font-semibold text-green-700">Checkout {status || 'complete'} ✅</div>;
}

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Thank you for your purchase</h1>
      <Suspense fallback={<p>Loading status...</p>}>
        <SearchParamsContent />
      </Suspense>
    </main>
  );
} 
// Re-committing to trigger deployment // trigger deploy
