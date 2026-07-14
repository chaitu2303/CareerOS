'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Target, Loader2, CheckCircle, AlertTriangle, Briefcase, Zap, Rocket } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ATSAnalysisPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFetchUrl = async () => {
    if (!jobUrl) {
      toast.error('Please enter a job URL');
      return;
    }
    
    setIsFetchingUrl(true);
    try {
      const res = await fetch('/api/jobs/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jobUrl }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch job description');
      
      setJobDescription(data.text);
      toast.success('Job description extracted successfully!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsFetchingUrl(false);
    }
  };

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
      toast.success('Resume tailored successfully!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloudApply = async () => {
    if (!jobUrl) {
      toast.error('Job URL is required for Cloud Auto-Apply');
      return;
    }
    
    setIsApplying(true);
    try {
      const res = await fetch('/api/jobs/auto-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jobUrl }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Auto-apply failed');
      
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Resume Tailor & Auto-Apply</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Paste a job link to instantly tailor your resume and automatically apply.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Job Input & JD */}
        <div className="xl:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-500" /> 1. Target Job
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Job URL (Required for Auto-Apply)</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://linkedin.com/jobs/view/..." 
                    value={jobUrl}
                    onChange={(e: any) => setJobUrl(e.target.value)}
                    className="flex-1 rounded-xl bg-background border-border focus-visible:ring-indigo-500"
                  />
                  <Button 
                    onClick={handleFetchUrl} 
                    disabled={isFetchingUrl || !jobUrl}
                    className="rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300"
                  >
                    {isFetchingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch'}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-border flex-1"></div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">OR PASTE JD</span>
                <div className="h-px bg-border flex-1"></div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Job Description</label>
                <Textarea 
                  placeholder="Paste the target job description here..." 
                  value={jobDescription}
                  onChange={(e: any) => setJobDescription(e.target.value)}
                  className="w-full rounded-xl bg-background border-border resize-none min-h-[220px] focus-visible:ring-indigo-500"
                />
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-xl text-md font-semibold gap-2 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription}
            >
              {isAnalyzing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Tailoring Resume...</>
              ) : (
                <><Target className="w-5 h-5" /> Tailor Resume to Job</>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Right Column: Tailored Results & Auto Apply */}
        <div className="xl:col-span-7 flex flex-col space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex-1 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-500" /> 2. Tailored Profile & Analysis
            </h2>
            
            {results ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Match Score</h3>
                      <p className="text-3xl font-extrabold">{results.score}%</p>
                    </div>
                    <div className="w-16 h-16 relative">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-muted" />
                        <circle 
                          cx="32" cy="32" r="28" 
                          stroke="currentColor" 
                          strokeWidth="6" 
                          fill="transparent" 
                          strokeDasharray={176} 
                          strokeDashoffset={176 - (176 * results.score) / 100}
                          className={results.score >= 80 ? "text-green-500" : results.score >= 60 ? "text-amber-500" : "text-rose-500"} 
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-green-500/5 rounded-2xl border border-green-500/10">
                      <div className="flex items-center gap-2 mb-3 text-green-600 dark:text-green-400 font-bold text-sm">
                        <CheckCircle className="w-4 h-4" /> Added Keywords
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {results.matchedSkills.map((s: string) => (
                          <span key={s} className="px-2.5 py-1 text-xs bg-green-500/10 rounded-md font-medium text-green-700 dark:text-green-400 border border-green-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-5 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                      <div className="flex items-center gap-2 mb-3 text-rose-600 dark:text-rose-400 font-bold text-sm">
                        <AlertTriangle className="w-4 h-4" /> Missing Keywords
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {results.missingSkills.map((s: string) => (
                          <span key={s} className="px-2.5 py-1 text-xs bg-rose-500/10 rounded-md font-medium text-rose-700 dark:text-rose-400 border border-rose-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auto Apply Action */}
                <div className="mt-8 p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Rocket className="w-24 h-24" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Ready to Apply?</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md">Your resume is now perfectly tailored. Use our Cloud Auto-Apply engine to submit your application seamlessly.</p>
                  
                  <Button 
                    className="h-12 px-8 rounded-xl text-md font-semibold gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02]"
                    onClick={handleCloudApply}
                    disabled={isApplying || !jobUrl}
                  >
                    {isApplying ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Submitting via Cloud...</>
                    ) : (
                      <><Rocket className="w-5 h-5" /> Auto-Apply in Cloud</>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-60">
                <Target className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-center max-w-sm">Paste a job link and click Tailor Resume to see your customized profile.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
