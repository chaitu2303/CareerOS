import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [], // Configure providers in auth.ts
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const onboardingCompleted = (auth?.user as any)?.onboardingCompleted ?? false;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnOnboarding = nextUrl.pathname.startsWith('/onboarding');
      const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

      // Logged-in users trying to access auth pages → redirect appropriately
      if (isLoggedIn && isOnAuth) {
        if (onboardingCompleted) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        } else {
          return Response.redirect(new URL('/onboarding', nextUrl));
        }
      }

      // Dashboard requires login + completed onboarding
      if (isOnDashboard) {
        if (!isLoggedIn) return false; // → /login
        if (!onboardingCompleted) return Response.redirect(new URL('/onboarding', nextUrl));
        return true;
      }

      // Onboarding requires login
      if (isOnOnboarding) {
        if (!isLoggedIn) return false; // → /login
        return true;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
