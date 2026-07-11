import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding | CareerOS AI',
  description: 'Set up your Master Career Profile',
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      {children}
    </div>
  );
}
