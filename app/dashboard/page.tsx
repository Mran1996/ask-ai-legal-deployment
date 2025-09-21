'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold">Payment Status</h1>
      <p className="mt-2 text-gray-600">{status ? `Your payment was ${status}` : 'Status unknown'}</p>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PaymentSuccessInner />
    </Suspense>
  );
}

