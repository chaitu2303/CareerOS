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

import { ATSAnalysisWorkspace, EvaluationFinding } from './ATSAnalysisWorkspace';

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
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-muted/5 relative">
      {/* Topbar */}
      <header className="h-12 border-b bg-card flex items-center justify-between px-4 shrink-0 gap-3 no-print">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard/resumes" className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeft className="w-4 h-4" />
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
            className="text-sm font-semibold bg-transparent border-none outline-none min-w-0 max-w-[200px]"
          />
          <SaveIndicator />
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="hidden md:flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
            {([
              { mode: 'desktop', icon: Monitor },
              { mode: 'mobile', icon: Smartphone },
            ] as const).map(({ mode: vm, icon: Icon }) => (
              <button
                key={vm}
                onClick={() => setViewMode(vm)}
                className={`p-1.5 rounded-md transition-all ${viewMode === vm ? 'bg-card shadow-sm' : 'hover:bg-card/50'}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={runAtsAnalysis}
            disabled={atsLoading}
            className="gap-1.5 text-xs h-8 bg-blue-600 hover:bg-blue-700"
          >
            {atsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSearch className="w-3.5 h-3.5" />}
            ATS Score
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => saveVersion('Manual save')}
            className="gap-1.5 text-xs h-8"
          >
            <History className="w-3.5 h-3.5" /> Save Version
          </Button>

          <Button
            size="sm"
            onClick={exportPdf}
            className="gap-1.5 text-xs h-8"
          >
            <FileDown className="w-3.5 h-3.5" /> Export PDF
          </Button>
        </div>
      </header>

      {/* Main Studio Layout */}
      <div className="flex flex-1 min-h-0">

        {/* LEFT PANEL — Sections & Controls */}
        <aside className="w-72 border-r bg-card flex flex-col shrink-0 overflow-hidden no-print hidden md:flex">
          {/* Panel Tabs */}
          <div className="flex border-b shrink-0">
            {([
              { key: 'sections', label: 'Sections' },
              { key: 'ai', label: 'AI' },
              { key: 'versions', label: 'History' },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActivePanel(tab.key)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                  activePanel === tab.key
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
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
    <div className="p-4 space-y-3">
      <p className="text-xs text-muted-foreground">Click a version to restore it as your working copy.</p>
      {versions.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">No saved versions yet.</p>
      )}
      {versions.map(v => (
        <div key={v.id} className="border rounded-xl p-3 space-y-1 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">v{v.versionNumber}</span>
            <span className="text-[10px] text-muted-foreground">
              {new Date(v.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          {v.title && <div className="text-xs text-muted-foreground">{v.title}</div>}
          {v.tailoredForJob && (
            <div className="text-[10px] text-blue-600">🎯 Tailored version</div>
          )}
          <button
            onClick={() => restore(v.id)}
            disabled={loading === v.id}
            className="mt-2 w-full text-xs py-1.5 rounded-lg border hover:bg-muted transition-all disabled:opacity-50"
          >
            {loading === v.id ? 'Restoring...' : 'Restore this version'}
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
