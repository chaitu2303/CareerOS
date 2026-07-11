import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface StateFeedbackProps {
  icon: any; // LucideIcon type in practice
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: any;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: any;
  };
  variant?: 'default' | 'destructive' | 'warning' | 'success';
}

export function StateFeedback({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
}: StateFeedbackProps) {
  
  const colors = {
    default: 'text-primary bg-primary/10 border-primary/20',
    destructive: 'text-destructive bg-destructive/10 border-destructive/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    success: 'text-success bg-success/10 border-success/20',
  };

  const bgGlow = {
    default: 'bg-primary/5',
    destructive: 'bg-destructive/5',
    warning: 'bg-warning/5',
    success: 'bg-success/5',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 border border-border/50 rounded-3xl bg-card shadow-sm text-center relative overflow-hidden w-full">
      {/* Background ambient glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-50 pointer-events-none ${bgGlow[variant]}`} />
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-md mx-auto space-y-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center relative ${colors[variant].split(' ').slice(1).join(' ')}`}>
          <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${colors[variant].split(' ')[1]}`} />
          <Icon className={`w-8 h-8 ${colors[variant].split(' ')[0]}`} />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground text-balance">
            {description}
          </p>
        </div>
        
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {secondaryAction && (
              secondaryAction.href ? (
                <Link href={secondaryAction.href}>
                  <Button variant="outline" size="lg" className="rounded-xl">
                    {secondaryAction.icon && <secondaryAction.icon className="w-4 h-4 mr-2" />}
                    {secondaryAction.label}
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="lg" className="rounded-xl" onClick={secondaryAction.onClick}>
                  {secondaryAction.icon && <secondaryAction.icon className="w-4 h-4 mr-2" />}
                  {secondaryAction.label}
                </Button>
              )
            )}
            
            {primaryAction && (
              primaryAction.href ? (
                <Link href={primaryAction.href}>
                  <Button size="lg" className="rounded-xl shadow-lg">
                    {primaryAction.icon && <primaryAction.icon className="w-4 h-4 mr-2" />}
                    {primaryAction.label}
                  </Button>
                </Link>
              ) : (
                <Button size="lg" className="rounded-xl shadow-lg" onClick={primaryAction.onClick}>
                  {primaryAction.icon && <primaryAction.icon className="w-4 h-4 mr-2" />}
                  {primaryAction.label}
                </Button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
