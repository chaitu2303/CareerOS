'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { ResumeContent, TailoringChange } from '@/lib/ai/resume-schema';
import { ResumePreview } from './ResumePreview';
import { SectionsPanel } from './SectionsPanel';
import { AICopilot } from './AICopilot';
import { TailoringDiffViewer } from './TailoringDiffViewer';
import {
  Save, ChevronLeft, History, Copy, FileDown,
  Loader2, CheckCircle, AlertCircle, Monitor, Smartphone, Tablet, FileSearch
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ATSAnalysisWorkspace, EvaluationFinding } from './ATSAnalysisWorkspace';

interface ResumeData {
  id: string;
  title: string;
  content: unknown;
  templateId: string;
  updatedAt: string;
}

interface VersionData {
  id: string;
  versionNumber: number;
  title: string | null;
  changeNote: string | null;
  tailoredForJob: string | null;
  createdAt: string;
}

interface JobTarget {
  id: string;
  roleTitle: string;
  company: string;
}

interface ResumeStudioProps {
  resume: ResumeData;
  versions: VersionData[];
  jobTargets: JobTarget[];
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type ActivePanel = 'sections' | 'ai' | 'versions' | 'tailoring';
type ViewMode = 'desktop' | 'mobile';
type TailoringMode = 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';

export function ResumeStudio({ resume, versions, jobTargets }: ResumeStudioProps) {
  const [content, setContent] = useState<ResumeContent>(() => {
    return resume.content as ResumeContent;
  });
  const [title, setTitle] = useState(resume.title);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [activePanel, setActivePanel] = useState<ActivePanel>('sections');
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [history, setHistory] = useState<ResumeContent[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // ATS state
  const [showAts, setShowAts] = useState(false);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsReport, setAtsReport] = useState<any>(null);

  // Tailoring state
  const [selectedJobId, setSelectedJobId] = useState('');
  const [tailoringMode, setTailoringMode] = useState<TailoringMode>('BALANCED');
  const [tailoringChanges, setTailoringChanges] = useState<TailoringChange[] | null>(null);
  const [tailoringLoading, setTailoringLoading] = useState(false);
  const [tailoringError, setTailoringError] = useState<string | null>(null);
  const [rejectedRequirements, setRejectedRequirements] = useState<{ skill: string; reason: string }[]>([]);

  // Auto-save debounce
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  const pushHistory = useCallback((newContent: ResumeContent) => {
    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newContent].slice(-30); // keep 30 states max
    });
    setHistoryIndex(prev => Math.min(prev + 1, 29));
  }, [historyIndex]);

  const updateContent = useCallback((newContent: ResumeContent) => {
    pushHistory(content);
    setContent(newContent);

    // Auto-save after 1.5s of inactivity
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    setSaveState('saving');
    autoSaveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/resumes/${resume.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newContent }),
        });
        if (isMounted.current) {
          setSaveState(res.ok ? 'saved' : 'error');
          setTimeout(() => isMounted.current && setSaveState('idle'), 2000);
        }
      } catch {
        if (isMounted.current) setSaveState('error');
      }
    }, 1500);
  }, [content, pushHistory, resume.id]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setContent(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setContent(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Save named version
  const saveVersion = useCallback(async (note: string) => {
    setSaveState('saving');
    try {
      const res = await fetch(`/api/resumes/${resume.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, saveVersion: true, versionNote: note }),
      });
      setSaveState(res.ok ? 'saved' : 'error');
      setTimeout(() => isMounted.current && setSaveState('idle'), 2000);
    } catch {
      setSaveState('error');
    }
  }, [content, resume.id]);

  // Tailoring
  const runTailoring = useCallback(async () => {
    if (!selectedJobId) return;
    setTailoringLoading(true);
    setTailoringError(null);
    setTailoringChanges(null);

    try {
      const res = await fetch(`/api/resumes/${resume.id}/tailor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: selectedJobId, mode: tailoringMode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTailoringError(data.error ?? 'Tailoring failed');
        return;
      }
      setTailoringChanges(data.tailoringResult.changes ?? []);
      setRejectedRequirements(data.tailoringResult.rejectedRequirements ?? []);
      setActivePanel('tailoring');
    } catch {
      setTailoringError('Network error during tailoring');
    } finally {
      setTailoringLoading(false);
    }
  }, [resume.id, selectedJobId, tailoringMode]);

  // PDF Export (browser print)
  const exportPdf = useCallback(() => {
    window.print();
  }, []);

  const SaveIndicator = () => {
    if (saveState === 'idle') return null;
    return (
      <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
        saveState === 'saving' ? 'text-muted-foreground' :
        saveState === 'saved' ? 'text-green-600' : 'text-red-500'
      }`}>
        {saveState === 'saving' && <Loader2 className="w-3 h-3 animate-spin" />}
        {saveState === 'saved' && <CheckCircle className="w-3 h-3" />}
        {saveState === 'error' && <AlertCircle className="w-3 h-3" />}
        {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved' : 'Save failed'}
      </div>
    );
  };

  const runAtsAnalysis = useCallback(async () => {
    setAtsLoading(true);
    try {
      // 1. Force save a new version for ATS analysis
      const saveRes = await fetch(`/api/resumes/${resume.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, saveVersion: true, versionNote: 'Pre-ATS Snapshot' }),
      });
      const saveData = await saveRes.json();
      if (!saveData.ok || !saveData.versionId) throw new Error('Failed to save version for ATS');

      // 2. Run ATS Analysis
      const atsRes = await fetch(`/api/resumes/${resume.id}/versions/${saveData.versionId}/ats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: selectedJobId || undefined }),
      });
      const atsData = await atsRes.json();
      if (!atsRes.ok) throw new Error(atsData.error ?? 'ATS failed');

      setAtsReport(atsData.report);
      setShowAts(true);
    } catch (e) {
      console.error(e);
      alert('ATS Analysis failed');
    } finally {
      setAtsLoading(false);
    }
  }, [content, resume.id, selectedJobId]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#faf8f5] text-black relative">
      {/* Topbar */}
      <header className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-6 shrink-0 gap-4 no-print shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] z-20">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/dashboard/resumes" className="p-2 border-2 border-black hover:bg-[#ffe500] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={async () => {
              await fetch(`/api/resumes/${resume.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
              });
            }}
            className="text-lg font-black uppercase tracking-widest bg-transparent border-none outline-none min-w-0 max-w-[250px] focus:ring-0"
          />
          <SaveIndicator />
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="hidden md:flex items-center border-4 border-black bg-white p-1 gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {([
              { mode: 'desktop', icon: Monitor },
              { mode: 'mobile', icon: Smartphone },
            ] as const).map(({ mode: vm, icon: Icon }) => (
              <button
                key={vm}
                onClick={() => setViewMode(vm)}
                className={`p-2 transition-all ${viewMode === vm ? 'bg-black text-white' : 'hover:bg-gray-200 text-black'}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <button
            onClick={runAtsAnalysis}
            disabled={atsLoading}
            className="flex items-center gap-2 h-10 px-4 border-4 border-black bg-[#90c0ff] hover:bg-[#70aaff] text-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          >
            {atsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
            ATS Score
          </button>

          <button
            onClick={() => saveVersion('Manual save')}
            className="flex items-center gap-2 h-10 px-4 border-4 border-black bg-white hover:bg-slate-100 text-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <History className="w-4 h-4" /> Save Version
          </button>

          <button
            onClick={exportPdf}
            className="flex items-center gap-2 h-10 px-4 border-4 border-black bg-[#abf5d1] hover:bg-[#8ee5c0] text-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <FileDown className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>

      {/* Main Studio Layout */}
      <div className="flex flex-1 min-h-0 relative z-10">

        {/* LEFT PANEL — Sections & Controls */}
        <aside className="w-80 border-r-4 border-black bg-white flex flex-col shrink-0 overflow-hidden no-print hidden md:flex">
          {/* Panel Tabs */}
          <div className="flex border-b-4 border-black shrink-0">
            {([
              { key: 'sections', label: 'Sections', color: 'bg-[#90c0ff]' },
              { key: 'ai', label: 'AI', color: 'bg-[#ff90e8]' },
              { key: 'versions', label: 'History', color: 'bg-[#ffe500]' },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActivePanel(tab.key)}
                className={`flex-1 py-3 text-sm font-black uppercase transition-all ${
                  activePanel === tab.key
                    ? `border-b-4 border-black ${tab.color} translate-y-1`
                    : 'text-black hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {activePanel === 'sections' && (
              <SectionsPanel content={content} onChange={updateContent} />
            )}
            {activePanel === 'ai' && (
              <AICopilot
                content={content}
                onChange={updateContent}
                jobTargets={jobTargets}
                selectedJobId={selectedJobId}
                onSelectJob={setSelectedJobId}
                tailoringMode={tailoringMode}
                onSelectMode={setTailoringMode}
                onRunTailoring={runTailoring}
                tailoringLoading={tailoringLoading}
                tailoringError={tailoringError}
              />
            )}
            {activePanel === 'versions' && (
              <VersionHistory
                versions={versions}
                resumeId={resume.id}
                onRestoreVersion={(vContent) => {
                  pushHistory(content);
                  setContent(vContent);
                }}
              />
            )}
          </div>
        </aside>

        {/* CENTER — Resume Preview */}
        <main className="flex-1 overflow-auto bg-muted/30 flex flex-col items-center py-6 px-4">
          {tailoringChanges && activePanel === 'tailoring' ? (
            <TailoringDiffViewer
              content={content}
              changes={tailoringChanges}
              rejectedRequirements={rejectedRequirements}
              onAccept={(change) => {
                // Apply accepted change to content
                const next = applyChange(content, change);
                updateContent(next);
                setTailoringChanges(prev => prev?.filter(c => c !== change) ?? null);
              }}
              onReject={(change) => {
                setTailoringChanges(prev => prev?.filter(c => c !== change) ?? null);
              }}
              onAcceptAll={() => {
                let next = content;
                for (const ch of tailoringChanges) {
                  if (!ch.isFabricated) next = applyChange(next, ch);
                }
                updateContent(next);
                setTailoringChanges(null);
              }}
              onDismiss={() => {
                setTailoringChanges(null);
                setActivePanel('ai');
              }}
            />
          ) : (
            <div className={`${viewMode === 'mobile' ? 'w-80' : 'w-full max-w-[794px]'} transition-all duration-300`}>
              <ResumePreview content={content} />
            </div>
          )}
        </main>

        {/* RIGHT PANEL — AI Copilot (desktop only, secondary) */}
        {/* On desktop we show copilot inline in left panel; on larger screens show dedicated right panel */}
      </div>
    </div>
  );
}

// ── Inline Version History ──────────────────────────────────────────────────

function VersionHistory({
  versions,
  resumeId,
  onRestoreVersion,
}: {
  versions: VersionData[];
  resumeId: string;
  onRestoreVersion: (content: ResumeContent) => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  async function restore(versionId: string) {
    setLoading(versionId);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/versions/${versionId}`);
      const data = await res.json();
      if (data.content) onRestoreVersion(data.content as ResumeContent);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="p-6 space-y-4 font-bold">
      <p className="text-xs uppercase tracking-widest bg-black text-white px-2 py-1 inline-block">Click a version to restore.</p>
      {versions.length === 0 && (
        <p className="text-sm uppercase text-center py-6">No saved versions yet.</p>
      )}
      {versions.map(v => (
        <div key={v.id} className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-2 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xl font-black uppercase">v{v.versionNumber}</span>
            <span className="text-xs uppercase tracking-widest bg-black text-white px-2">
              {new Date(v.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          {v.title && <div className="text-sm font-bold opacity-80">{v.title}</div>}
          {v.tailoredForJob && (
            <div className="text-xs font-black uppercase bg-[#90c0ff] border-2 border-black px-2 py-1 inline-block">🎯 Tailored</div>
          )}
          <button
            onClick={() => restore(v.id)}
            disabled={loading === v.id}
            className="mt-4 w-full text-sm font-black uppercase py-2 border-4 border-black bg-[#ffe500] hover:bg-black hover:text-[#ffe500] transition-colors disabled:opacity-50"
          >
            {loading === v.id ? 'Restoring...' : 'Restore'}
          </button>
        </div>
      ))}
    </div>
  );
}

const renderAtsOverlay = (showAts: boolean, atsReport: any, setShowAts: any, setActivePanel: any) => {
  if (!showAts || !atsReport) return null;
  return (
    <div className="absolute right-0 top-0 h-full flex no-print shadow-2xl">
      <ATSAnalysisWorkspace 
        report={atsReport} 
        onClose={() => setShowAts(false)} 
        onFixWithAI={(finding) => {
          setActivePanel('ai');
          setShowAts(false);
          alert(`AI Fix requested for: ${finding.message}`);
        }} 
      />
    </div>
  );
};

// ── Apply tailoring change to content ──────────────────────────────────────

function applyChange(content: ResumeContent, change: TailoringChange): ResumeContent {
  const next: ResumeContent = JSON.parse(JSON.stringify(content));
  for (const section of next.sections) {
    if (section.type !== change.sectionType) continue;
    if (section.type === 'summary' && change.field === 'text') {
      (section as any).data.text = change.proposed;
    }
    if (section.type === 'experience' && change.itemId) {
      const item = (section as any).data.items?.find((i: any) => i.id === change.itemId);
      if (item) {
        if (change.field.startsWith('bullets[')) {
          const idx = parseInt(change.field.replace('bullets[', '').replace(']', ''));
          if (!isNaN(idx) && item.bullets) item.bullets[idx] = change.proposed;
        } else {
          item[change.field] = change.proposed;
        }
      }
    }
  }
  return next;
}
