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
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnOnboarding = nextUrl.pathname.startsWith('/onboarding');

      // Dashboard and onboarding require login — let the server layouts handle
      // onboarding-complete routing to avoid JWT/DB sync loops
      if (isOnDashboard || isOnOnboarding) {
        if (!isLoggedIn) return false; // Redirects unauthenticated → /login
        return true; // Layouts handle the rest
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
