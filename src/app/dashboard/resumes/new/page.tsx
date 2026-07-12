'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { FileText, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function NewResumeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') as 'BLANK' | 'FROM_PROFILE' | null;

  const [mode, setMode] = useState<'BLANK' | 'FROM_PROFILE'>(initialMode ?? 'FROM_PROFILE');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          title: title.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to create resume');
        return;
      }
      
      const jobId = searchParams.get('jobId');
      if (jobId) {
        // Automatically tailor the newly created resume
        const tailorRes = await fetch(`/api/resumes/${data.resumeId}/tailor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId, mode: 'BALANCED' })
        });
        
        if (tailorRes.ok) {
          const tailorData = await tailorRes.json();
          // Navigate to the tailored version directly if you want, or just the base resume
        }
      }

      router.push(`/dashboard/resumes/${data.resumeId}`);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Resume</h1>
          <p className="text-muted-foreground text-sm">Choose how to start building your resume.</p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setMode('FROM_PROFILE')}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all text-center ${
              mode === 'FROM_PROFILE'
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-primary/40'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              mode === 'FROM_PROFILE' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-sm">From Master Profile</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Native Intelligence Engine generates a complete resume from your verified career facts.
              </div>
            </div>
          </button>

          <button
            onClick={() => setMode('BLANK')}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all text-center ${
              mode === 'BLANK'
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-primary/40'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              mode === 'BLANK' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-sm">Start from Scratch</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Build your resume manually with a clean template.
              </div>
            </div>
          </button>
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label htmlFor="resumeTitle" className="text-sm font-medium">Resume Title (optional)</label>
          <input
            id="resumeTitle"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={mode === 'FROM_PROFILE' ? 'e.g. Full Stack Developer Resume' : 'e.g. Software Engineer Resume'}
            className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          disabled={loading}
          className="w-full gap-2 py-6 text-base"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Creating Resume...</>
          ) : (
            <>{mode === 'FROM_PROFILE' ? 'Generate Resume' : 'Create Resume'} <ArrowRight className="w-5 h-5" /></>
          )}
        </Button>

        {mode === 'FROM_PROFILE' && (
          <p className="text-center text-xs text-muted-foreground">
            Only USER_CONFIRMED and USER_CREATED career facts will be included.
            No information will be fabricated.
          </p>
        )}
      </div>
    </div>
  );
}

export default function NewResumePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    }>
      <NewResumeContent />
    </Suspense>
  );
}
