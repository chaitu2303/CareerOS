'use client';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  milestone: string;
}

export function ComingSoon({ title, description, milestone }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Construction className="w-8 h-8 text-primary/60" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground max-w-md">{description}</p>
      <div className="px-3 py-1.5 bg-muted rounded-full text-xs font-semibold text-muted-foreground">
        {milestone}
      </div>
    </div>
  );
}
