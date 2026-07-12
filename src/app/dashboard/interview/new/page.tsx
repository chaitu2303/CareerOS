'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, ArrowRight, Loader2, Target, Briefcase, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function NewMockInterviewPage() {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [interviewType, setInterviewType] = useState<'BEHAVIORAL' | 'TECHNICAL'>('BEHAVIORAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = async () => {
    if (!targetRole) {
      toast.error('Please enter a target role.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          targetCompany,
          type: interviewType,
          mode: 'CHAT', // default to chat mode
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create interview');
      
      router.push(`/dashboard/interview/${data.session.id}/chat`);
    } catch (err: any) {
      toast.error(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
          <Brain className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configure Interview</h1>
          <p className="text-muted-foreground">Set up your mock interview parameters.</p>
        </div>
      </div>

      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm space-y-8">
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold">1. Target Position</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Target Role
              </label>
              <Input 
                placeholder="e.g. Senior Frontend Engineer" 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="h-12 rounded-xl bg-muted/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" /> Target Company (Optional)
              </label>
              <Input 
                placeholder="e.g. Google, Vercel, Startup" 
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="h-12 rounded-xl bg-muted/50"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">2. Interview Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setInterviewType('BEHAVIORAL')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                interviewType === 'BEHAVIORAL' 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'border-border/50 hover:border-primary/50 bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${interviewType === 'BEHAVIORAL' ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Brain className={`w-5 h-5 ${interviewType === 'BEHAVIORAL' ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="font-bold">Behavioral</h3>
              </div>
              <p className="text-sm text-muted-foreground">Focus on leadership, past experiences, and soft skills.</p>
            </button>

            <button
              onClick={() => setInterviewType('TECHNICAL')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                interviewType === 'TECHNICAL' 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'border-border/50 hover:border-primary/50 bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${interviewType === 'TECHNICAL' ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Video className={`w-5 h-5 ${interviewType === 'TECHNICAL' ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="font-bold">Technical</h3>
              </div>
              <p className="text-sm text-muted-foreground">Focus on system design, coding paradigms, and architecture.</p>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50 flex justify-end">
          <Button 
            className="h-12 px-8 rounded-xl text-lg gap-2"
            onClick={handleStart}
            disabled={isSubmitting || !targetRole}
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Preparing...</>
            ) : (
              <>Start Interview <ArrowRight className="w-5 h-5" /></>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
