'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // We don't check for 404s intentionally. The API always returns 200
      // unless there's a severe server error, to prevent email enumeration.
      if (!res.ok) {
        throw new Error('An error occurred. Please try again.');
      }

      setStatus('success');
    } catch (err: any) {
      setError(err.message);
      setStatus('idle');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {status === 'success' ? (
          <div className="space-y-4">
            <div className="text-green-600 dark:text-green-400 text-sm text-center bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              If that email is registered, you will receive a reset link shortly. Please check your inbox and spam folder.
            </div>
            <Link
              href="/login"
              className="block w-full text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2.5 rounded-lg hover:opacity-90 font-medium transition-opacity"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email-input" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email-input"
                type="email"
                required
                autoComplete="email"
                className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 font-medium transition-opacity"
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="text-center text-sm">
              <Link href="/login" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                &larr; Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
