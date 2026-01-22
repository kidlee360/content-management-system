import { Suspense } from 'react';
import UnsubscribeClient from './UnsubscribeClient';

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto mt-20 p-8 text-center">Loading...</div>}>
      <UnsubscribeClient />
    </Suspense>
  );
}
