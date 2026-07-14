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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-[#faf8f5] text-black">
      <div className="w-full max-w-xl space-y-8 bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#ff90e8] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto rotate-3">
            <FileText className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">New Resume</h1>
          <p className="font-bold uppercase tracking-widest text-sm bg-black text-white inline-block px-2 py-1">Choose how to start building.</p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => setMode('FROM_PROFILE')}
            className={`flex flex-col items-center justify-center gap-4 p-6 border-4 transition-all text-center group ${
              mode === 'FROM_PROFILE'
                ? 'border-black bg-[#90c0ff] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1'
                : 'border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <div className={`w-14 h-14 border-4 border-black flex items-center justify-center transition-transform ${
              mode === 'FROM_PROFILE' ? 'bg-white rotate-3' : 'bg-black text-white group-hover:rotate-6'
            }`}>
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="font-black text-lg uppercase">From Master Profile</div>
              <div className="text-xs font-bold uppercase mt-2 opacity-80">
                Native Intelligence extracts your facts.
              </div>
            </div>
          </button>

          <button
            onClick={() => setMode('BLANK')}
            className={`flex flex-col items-center justify-center gap-4 p-6 border-4 transition-all text-center group ${
              mode === 'BLANK'
                ? 'border-black bg-[#abf5d1] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1'
                : 'border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <div className={`w-14 h-14 border-4 border-black flex items-center justify-center transition-transform ${
              mode === 'BLANK' ? 'bg-white -rotate-3' : 'bg-black text-white group-hover:-rotate-6'
            }`}>
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <div className="font-black text-lg uppercase">Start from Scratch</div>
              <div className="text-xs font-bold uppercase mt-2 opacity-80">
                Build manually with a clean template.
              </div>
            </div>
          </button>
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label htmlFor="resumeTitle" className="text-sm font-black uppercase tracking-widest bg-black text-white px-2 py-1">Resume Title (optional)</label>
          <input
            id="resumeTitle"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={mode === 'FROM_PROFILE' ? 'e.g. Full Stack Developer Resume' : 'e.g. Software Engineer Resume'}
            className="w-full px-4 py-4 border-4 border-black font-bold focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-[#faf8f5]"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-[#ff4040] border-4 border-black text-white font-black uppercase">
            {error}
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full h-16 border-4 border-black bg-[#ffe500] hover:bg-black hover:text-[#ffe500] text-black font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 flex items-center justify-center gap-3 disabled:pointer-events-none"
        >
          {loading ? (
            <><Loader2 className="w-6 h-6 animate-spin" /> Creating Resume...</>
          ) : (
            <>{mode === 'FROM_PROFILE' ? 'Generate Resume' : 'Create Resume'} <ArrowRight className="w-6 h-6" /></>
          )}
        </button>

        {mode === 'FROM_PROFILE' && (
          <p className="text-center text-xs font-bold uppercase opacity-60">
            Only verified career facts will be included. No hallucinations.
          </p>
        )}
      </div>
    </div>
  );
}

export default function NewResumePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    }>
      <NewResumeContent />
    </Suspense>
  );
}
