'use client';

import type { TailoringChange, ResumeContent } from '@/lib/ai/resume-schema';
import { CheckCircle, XCircle, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TailoringDiffViewerProps {
  content: ResumeContent;
  changes: TailoringChange[];
  rejectedRequirements: { skill: string; reason: string }[];
  onAccept: (change: TailoringChange) => void;
  onReject: (change: TailoringChange) => void;
  onAcceptAll: () => void;
  onDismiss: () => void;
}

export function TailoringDiffViewer({
  content,
  changes,
  rejectedRequirements,
  onAccept,
  onReject,
  onAcceptAll,
  onDismiss,
}: TailoringDiffViewerProps) {
  const safe = changes.filter(c => !c.isFabricated);
  const flagged = changes.filter(c => c.isFabricated);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">AI Tailoring Review</h2>
        <p className="text-sm text-muted-foreground">
          Review each proposed change. Accept, reject, or dismiss. No changes are applied until you accept them.
        </p>
        <div className="flex gap-3">
          <Button size="sm" onClick={onAcceptAll} className="gap-2">
            <CheckCircle className="w-4 h-4" /> Accept All Safe Changes ({safe.length})
          </Button>
          <Button size="sm" variant="outline" onClick={onDismiss}>
            Dismiss All
          </Button>
        </div>
      </div>

      {/* Rejected Requirements (Truth Guard output) */}
      {rejectedRequirements.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-orange-700 font-semibold">
            <AlertTriangle className="w-5 h-5" />
            Unverifiable Requirements ({rejectedRequirements.length})
          </div>
          <p className="text-sm text-orange-600">
            These job requirements could <strong>not</strong> be satisfied from your verified career profile. They have been flagged as gaps — not inserted into your resume.
          </p>
          <div className="space-y-2">
            {rejectedRequirements.map((req, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-white border border-orange-200 rounded-xl">
                <XCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-orange-800">{req.skill}</div>
                  <div className="text-xs text-orange-600 mt-0.5">{req.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safe Changes */}
      {safe.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Proposed Changes ({safe.length})
          </h3>
          {safe.map((change, i) => (
            <ChangeCard key={i} change={change} onAccept={onAccept} onReject={onReject} />
          ))}
        </div>
      )}

      {/* Flagged Changes */}
      {flagged.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-red-500 uppercase tracking-wider">
            ⚠ Truth Guard Flagged ({flagged.length})
          </h3>
          <p className="text-xs text-muted-foreground">These changes were flagged as potentially containing unverified information. Review carefully before accepting.</p>
          {flagged.map((change, i) => (
            <ChangeCard key={i} change={change} onAccept={onAccept} onReject={onReject} flagged />
          ))}
        </div>
      )}

      {safe.length === 0 && flagged.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <CheckCircle className="w-12 h-12 text-green-400" />
          <p className="text-muted-foreground">All changes reviewed.</p>
          <Button variant="outline" onClick={onDismiss}>Back to Editor</Button>
        </div>
      )}
    </div>
  );
}

function ChangeCard({
  change,
  onAccept,
  onReject,
  flagged,
}: {
  change: TailoringChange;
  onAccept: (c: TailoringChange) => void;
  onReject: (c: TailoringChange) => void;
  flagged?: boolean;
}) {
  return (
    <div className={`bg-card border rounded-2xl overflow-hidden shadow-sm ${flagged ? 'border-red-200' : ''}`}>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              {change.sectionType}
            </span>
            {change.field && (
              <ChevronRight className="w-3 h-3 inline text-muted-foreground mx-1" />
            )}
            <span className="text-xs text-muted-foreground">{change.field}</span>
          </div>
          {flagged && (
            <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded-full">
              ⚠ FLAGGED
            </span>
          )}
        </div>

        {/* Before */}
        <div className="space-y-1">
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Before</div>
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-900 line-through">
            {change.original || <span className="not-italic text-muted-foreground">(empty)</span>}
          </div>
        </div>

        {/* After */}
        <div className="space-y-1">
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">After</div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-900">
            {change.proposed}
          </div>
        </div>

        {/* Reason */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{change.reason}</span>
        </div>

        {change.sourceFactId && (
          <div className="text-[10px] text-green-700 font-medium">
            ✓ Grounded in verified career fact · {change.sourceFactId.slice(0, 8)}
          </div>
        )}
      </div>

      <div className="flex border-t">
        <button
          onClick={() => onAccept(change)}
          className="flex-1 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Accept
        </button>
        <div className="w-px bg-border" />
        <button
          onClick={() => onReject(change)}
          className="flex-1 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4" /> Reject
        </button>
      </div>
    </div>
  );
}
