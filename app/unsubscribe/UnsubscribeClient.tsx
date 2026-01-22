"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!email) {
      setStatus('error');
      return;
    }

    const performUnsubscribe = async () => {
      try {
        await axios.post('/api/unsubscribe', { email });
        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    };

    performUnsubscribe();
  }, [email]);

  return (
    <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white rounded-xl shadow-sm border">
      {status === 'loading' && <p>Processing your request...</p>}
      
      {status === 'success' && (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unsubscribed Successfully</h1>
          <p className="text-gray-600">You will no longer receive our newsletter. We're sorry to see you go!</p>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-gray-600">We couldn't process your request. Please try again or contact support.</p>
        </>
      )}
    </div>
  );
}
