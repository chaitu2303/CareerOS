'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Target, Loader2, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ATSAnalysisPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!jobDescription) {
      toast.error('Please paste a job description.');
      return;
    }
    
    setIsAnalyzing(true);
    setResults(null);
    
    try {
      const res = await fetch('/api/ats/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      
      setResults(data);
      toast.success('Analysis complete!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
          <Target className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ATS Resume Matcher</h1>
          <p className="text-muted-foreground">Compare your Master Profile against a specific job description to find missing keywords.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input */}
        <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col h-full">
          <h2 className="text-lg font-bold mb-4">Job Description</h2>
          <Textarea 
            placeholder="Paste the target job description here to analyze against your Master Profile..." 
            value={jobDescription}
            onChange={(e: any) => setJobDescription(e.target.value)}
            className="flex-1 rounded-xl bg-muted/50 resize-none min-h-[300px]"
          />
          <Button 
            className="w-full h-12 rounded-xl text-lg gap-2 mt-6"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription}
          >
            {isAnalyzing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Scanning against Profile...</>
            ) : (
              <><Target className="w-5 h-5" /> Analyze Match</>
            )}
          </Button>
        </div>

        {/* Right Column: Results */}
        <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm min-h-[400px] flex flex-col">
          <h2 className="text-lg font-bold mb-4">Analysis Results</h2>
          
          {results ? (
            <div className="space-y-6 flex-1">
              <div className="flex items-center justify-center py-6">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                    <circle 
                      cx="64" cy="64" r="60" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={377} 
                      strokeDashoffset={377 - (377 * results.score) / 100}
                      className={results.score >= 80 ? "text-green-500" : results.score >= 60 ? "text-orange-500" : "text-red-500"} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{results.score}%</span>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Match</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400 font-bold">
                    <CheckCircle className="w-4 h-4" /> Found Keywords
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {results.matchedSkills.map((s: string) => (
                      <span key={s} className="px-2 py-1 text-xs bg-green-500/20 rounded-md font-medium text-green-700 dark:text-green-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400 font-bold">
                    <AlertTriangle className="w-4 h-4" /> Missing Keywords
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {results.missingSkills.map((s: string) => (
                      <span key={s} className="px-2 py-1 text-xs bg-red-500/20 rounded-md font-medium text-red-700 dark:text-red-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <Target className="w-12 h-12 mb-4 opacity-20" />
              <p>Paste a job description to see how well you match.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
