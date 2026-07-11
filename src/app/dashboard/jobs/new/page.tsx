'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Link as LinkIcon, FileText, Upload, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewJobTargetPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'upload'>('text');
  const [jobText, setJobText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jobText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/jobs/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: jobText })
      });
      if (res.ok) {
        const { jobId } = await res.json();
        router.push(`/dashboard/jobs/${jobId}`);
      } else {
        console.error('Failed to analyze job');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Job Intelligence Engine</h1>
        <p className="text-muted-foreground">Target a specific role and let our AI compare it against your Master Career Profile.</p>
      </div>

      <div className="bg-card border rounded-2xl p-2 shadow-sm">
        <div className="flex gap-2 p-2 bg-muted/30 rounded-xl">
          <button 
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'text' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
          >
            <FileText className="w-4 h-4" /> Paste Description
          </button>
          <button 
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'url' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
          >
            <LinkIcon className="w-4 h-4" /> URL Link
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'upload' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
          >
            <Upload className="w-4 h-4" /> Upload JD
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'text' && (
            <div className="space-y-4">
              <label className="text-sm font-medium">Job Description Text</label>
              <textarea 
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full h-64 p-4 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          )}

          {activeTab === 'url' && (
            <div className="py-12 text-center space-y-4">
              <LinkIcon className="w-12 h-12 mx-auto text-muted-foreground/30" />
              <p className="text-muted-foreground">URL Scraping coming in the next iteration.</p>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="py-12 text-center space-y-4">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground/30" />
              <p className="text-muted-foreground">PDF/Image uploading coming in the next iteration.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          size="lg" 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || (activeTab === 'text' && !jobText.trim())}
          className="gap-2"
        >
          {isAnalyzing ? 'Analyzing Match...' : 'Analyze Job Target'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
