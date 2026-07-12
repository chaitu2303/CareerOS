'use client';
import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Show success message after registration redirect
  const justRegistered = searchParams.get('registered') === 'true';
  // OAuth error
  const oauthError = searchParams.get('error');

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const onboardingCompleted = (session.user as any)?.onboardingCompleted;
      router.replace(onboardingCompleted ? '/dashboard' : '/onboarding');
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);
    if (result?.error) {
      setError('Invalid email or password. Please try again.');
    }
    // Redirect handled by useEffect above
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/onboarding' });
    } catch {
      setError('Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your CareerOS account</p>
        </div>

        {justRegistered && (
          <div className="text-green-600 dark:text-green-400 text-sm text-center bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            Account created! Sign in to continue.
          </div>
        )}

        {(error || oauthError) && (
          <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
            {error || (oauthError === 'OAuthAccountNotLinked' ? 'This email is already registered. Please sign in with your password.' : `Sign-in error: ${oauthError}`)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
          <div>
            <label htmlFor="email-input" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email-input"
              data-testid="email-input"
              type="email"
              required
              autoComplete="email"
              className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password-input" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password-input"
              data-testid="password-input"
              type="password"
              required
              autoComplete="current-password"
              className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            data-testid="signin-button"
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 font-medium transition-opacity"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading || !process.env.NEXT_PUBLIC_GOOGLE_ENABLED}
          data-testid="google-signin-button"
          className="w-full border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors font-medium"
        >
          {googleLoading ? (
            'Redirecting...'
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-slate-900 dark:text-white font-medium hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
