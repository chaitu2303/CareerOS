import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
      <h1 className="text-5xl font-extrabold mb-6">CareerOS AI</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl text-center">
        One intelligent platform for Resume Building, Job Tailoring, ATS Optimization, AI Video Interviews, and Application Copilot.
      </p>
      
      <Link href="/login">
        <Button size="lg" className="text-lg px-8">Get Started</Button>
      </Link>
    </main>
  );
}
