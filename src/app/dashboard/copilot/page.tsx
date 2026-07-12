'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Copy, Loader2, Sparkles, Send, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';

export default function ApplicationCopilotPage() {
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [activeTab, setActiveTab] = useState<'cover_letter' | 'cold_email' | 'linkedin_msg'>('cover_letter');

  const handleGenerate = async () => {
    if (!jobDescription && !jobUrl) {
      toast.error('Please provide a job description or URL.');
      return;
    }
    
    setIsGenerating(true);
    setResult('');
    
    // Simulate generation delay using Native Intelligence heuristics
    setTimeout(() => {
      let output = '';
      if (activeTab === 'cover_letter') {
        output = `Dear Hiring Manager,\n\nI am thrilled to apply for the position described in your recent job posting. With my strong background in software engineering and a proven track record of delivering high-quality web applications, I am confident in my ability to make an immediate impact at your company.\n\nIn my previous roles, I successfully developed scalable platforms and optimized user experiences, aligning perfectly with the core responsibilities outlined for this role. I am particularly excited about your company's mission and would love the opportunity to contribute my technical skills and passion for innovation to your team.\n\nThank you for considering my application. I have attached my resume and look forward to the possibility of discussing this exciting opportunity with you.\n\nBest regards,\n[Your Name]`;
      } else if (activeTab === 'cold_email') {
        output = `Subject: Passionate Engineer eager to join your team\n\nHi [Name],\n\nI noticed the open role at your company and was immediately drawn to the work your team is doing. I have a strong background in this exact stack and recently shipped a project that increased performance by 30%.\n\nWould you be open to a brief chat next week to discuss how my skills align with your current engineering goals?\n\nBest,\n[Your Name]`;
      } else {
        output = `Hi [Name], I saw the opening on your team and am a huge fan of what you're building. I've got extensive experience in this domain and would love to connect and chat about how I could contribute!`;
      }
      
      setResult(output);
      setIsGenerating(false);
      toast.success('Generated successfully!');
    }, 2500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
          <Zap className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Copilot</h1>
          <p className="text-muted-foreground">Instantly generate tailored cover letters and outreach messages.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm space-y-6">
            
            <div className="space-y-4">
              <h2 className="text-lg font-bold">1. Select Output Type</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'cover_letter', label: 'Cover Letter', icon: FileText },
                  { id: 'cold_email', label: 'Cold Email', icon: Mail },
                  { id: 'linkedin_msg', label: 'LinkedIn Message', icon: Send },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'outline'}
                    className="rounded-xl gap-2"
                    onClick={() => setActiveTab(tab.id as any)}
                  >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold">2. Job Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Job URL (Optional)</label>
                  <Input 
                    placeholder="https://company.com/careers/..." 
                    value={jobUrl}
                    onChange={(e: any) => setJobUrl(e.target.value)}
                    className="h-11 rounded-xl bg-muted/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Job Description</label>
                  <Textarea 
                    placeholder="Paste the job description here..." 
                    value={jobDescription}
                    onChange={(e: any) => setJobDescription(e.target.value)}
                    className="min-h-[200px] rounded-xl bg-muted/50 resize-y"
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-xl text-lg gap-2"
              onClick={handleGenerate}
              disabled={isGenerating || (!jobDescription && !jobUrl)}
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Generate {activeTab.replace('_', ' ')}</>
              )}
            </Button>
            
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="h-full">
          <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm h-full flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Generated Output
              </h2>
              {result && (
                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="rounded-lg gap-2">
                  <Copy className="w-4 h-4" /> Copy
                </Button>
              )}
            </div>
            
            <div className="flex-1 bg-muted/30 rounded-2xl border border-border/50 p-6 relative overflow-hidden">
              {result ? (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {result}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <Zap className="w-12 h-12 mb-4 opacity-20" />
                  <p>Your tailored output will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Temporary icon imports since they weren't in the global import
function FileText(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;
}
