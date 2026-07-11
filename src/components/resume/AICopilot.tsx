'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Wand2, Briefcase, AlertTriangle } from 'lucide-react';
import type { ResumeContent } from '@/lib/ai/resume-schema';
import { Button } from '@/components/ui/button';

interface JobTarget {
  id: string;
  roleTitle: string;
  company: string;
}

interface AICopilotProps {
  content: ResumeContent;
  onChange: (content: ResumeContent) => void;
  jobTargets: JobTarget[];
  selectedJobId: string;
  onSelectJob: (id: string) => void;
  tailoringMode: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  onSelectMode: (mode: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE') => void;
  onRunTailoring: () => void;
  tailoringLoading: boolean;
  tailoringError: string | null;
}

const MODE_DESCRIPTIONS = {
  CONSERVATIVE: 'Minimal changes — keyword alignment and wording improvements only.',
  BALANCED: 'Reorder content and rewrite bullets for better relevance.',
  AGGRESSIVE: 'Significant restructuring for maximum match. No fabrication.',
};

export function AICopilot({
  content,
  onChange,
  jobTargets,
  selectedJobId,
  onSelectJob,
  tailoringMode,
  onSelectMode,
  onRunTailoring,
  tailoringLoading,
  tailoringError,
}: AICopilotProps) {
  const [nlCommand, setNlCommand] = useState('');
  const [nlLoading, setNlLoading] = useState(false);
  const [nlError, setNlError] = useState<string | null>(null);

  const QUICK_COMMANDS = [
    'Improve project descriptions without adding fake information.',
    'Strengthen action verbs in experience bullets.',
    'Make the summary more concise and impactful.',
    'Fit this resume into one page.',
    'Prioritize the most relevant experience for a software role.',
  ];

  async function runNLCommand(command: string) {
    setNlLoading(true);
    setNlError(null);
    try {
      const res = await fetch('/api/resumes/ai-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNlError(data.error ?? 'AI edit failed');
        return;
      }
      // NL edits return proposed content directly
      if (data.content) onChange(data.content);
    } catch {
      setNlError('Network error. Try again.');
    } finally {
      setNlLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full p-3 space-y-5 overflow-y-auto">

      {/* Job-Specific Tailoring */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Job-Specific Tailoring</span>
        </div>

        {jobTargets.length === 0 ? (
          <div className="p-3 bg-muted/30 rounded-xl text-xs text-muted-foreground">
            No job targets yet. <a href="/dashboard/jobs/new" className="text-primary underline">Analyze a job</a> first.
          </div>
        ) : (
          <>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Target Job</label>
              <select
                value={selectedJobId}
                onChange={e => onSelectJob(e.target.value)}
                className="w-full text-xs px-2 py-2 rounded-lg border bg-background"
              >
                <option value="">Select a job...</option>
                {jobTargets.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.roleTitle} @ {job.company}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Selection */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tailoring Mode</label>
              <div className="space-y-1.5">
                {(['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => onSelectMode(m)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                      tailoringMode === m ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'
                    }`}
                  >
                    <div className="font-medium">{m.charAt(0) + m.slice(1).toLowerCase()}</div>
                    <div className="text-muted-foreground mt-0.5">{MODE_DESCRIPTIONS[m]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-orange-700">
                  <strong>Truth Guard Active.</strong> AI will never insert skills, certifications, or experience not present in your verified profile. Unverifiable requirements will be listed as gaps.
                </p>
              </div>
            </div>

            <Button
              onClick={onRunTailoring}
              disabled={!selectedJobId || tailoringLoading}
              className="w-full gap-2"
              size="sm"
            >
              {tailoringLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Tailoring...</>
              ) : (
                <><Wand2 className="w-4 h-4" /> Tailor Resume</>
              )}
            </Button>

            {tailoringError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                {tailoringError}
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t" />

      {/* Natural Language Editor */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">AI Natural Language Editor</span>
        </div>

        {/* Quick commands */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            Quick Actions
          </div>
          {QUICK_COMMANDS.map((cmd, i) => (
            <button
              key={i}
              onClick={() => runNLCommand(cmd)}
              disabled={nlLoading}
              className="w-full text-left p-2 rounded-lg hover:bg-muted/50 text-xs text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-muted disabled:opacity-50"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Custom command */}
        <div className="space-y-2">
          <div className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            Custom Command
          </div>
          <textarea
            value={nlCommand}
            onChange={e => setNlCommand(e.target.value)}
            placeholder='e.g. "Make this resume suitable for a cybersecurity analyst role."'
            rows={3}
            className="w-full text-xs px-3 py-2 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button
            onClick={() => { runNLCommand(nlCommand); setNlCommand(''); }}
            disabled={!nlCommand.trim() || nlLoading}
            variant="outline"
            size="sm"
            className="w-full gap-2"
          >
            {nlLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Run Command
          </Button>
        </div>

        {nlError && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">{nlError}</div>
        )}
      </div>
    </div>
  );
}
