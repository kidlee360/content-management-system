import React, { useState } from 'react';
import axios from 'axios';



const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post('/api/newsletter', { email });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-blue-50 p-8 rounded-2xl mt-12 text-center border border-blue-100">
      <h3 className="text-xl font-bold text-blue-900 mb-2">Enjoying these posts?</h3>
      <p className="text-blue-700 mb-6">Join the newsletter to get new articles delivered to your inbox.</p>
      
      {status === 'success' ? (
        <p className="text-green-600 font-medium">Thanks for signing up! 🎉</p>
      ) : (
        <form onSubmit={handleSignup} className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {status === 'loading' ? 'Joining...' : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && <p className="text-red-500 mt-2 text-sm">Something went wrong. Maybe you're already subscribed?</p>}
    </div>
  );
};
export default NewsletterSignup;