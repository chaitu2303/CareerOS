'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Service Unavailable</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        We encountered a critical runtime error connecting to our services. This might be due to missing configuration or maintenance.
      </p>
      
      <div className="bg-card border p-4 rounded-lg text-left w-full max-w-md mb-6 overflow-auto">
        <p className="text-sm font-mono text-destructive">{error.message || "Unknown Error"}</p>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => window.location.href = '/'}>
          Return Home
        </Button>
        <Button variant="outline" onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
