'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, FileSearch, Sparkles, ChevronRight, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EvaluationFinding {
  ruleId: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  evidence?: string | null;
  recommendedFix?: string | null;
  aiFixable: boolean;
  scoreImpact: number;
}

interface ATSAnalysisWorkspaceProps {
  report: {
    overallScore: number;
    breakdown: Record<string, number>;
    findings: EvaluationFinding[];
    parserSimulation: { parsedOrder: string[], rawText: string };
  };
  onClose: () => void;
  onFixWithAI: (finding: EvaluationFinding) => void;
}

export function ATSAnalysisWorkspace({ report, onClose, onFixWithAI }: ATSAnalysisWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'FINDINGS' | 'PARSER'>('FINDINGS');

  const { overallScore, breakdown, findings, parserSimulation } = report;

  const scoreColor = overallScore >= 80 ? 'text-green-600' : overallScore >= 60 ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="flex flex-col h-full bg-background border-l w-[450px] overflow-hidden shadow-xl z-50">
      {/* Header */}
      <div className="p-5 border-b bg-muted/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-primary" />
            ATS Analysis
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 px-2">Close</Button>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className={`text-4xl font-black ${scoreColor}`}>{overallScore}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Overall Score</div>
          </div>
          <div className="text-[10px] text-muted-foreground text-right max-w-[200px]">
            *Disclaimer: This is an estimation based on standard parser behavior, not a specific employer's actual ATS.
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="p-5 border-b bg-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Category Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(breakdown).map(([category, score]) => (
            <div key={category} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>{category}</span>
                <span className={score >= 80 ? 'text-green-600' : score >= 60 ? 'text-orange-500' : 'text-red-500'}>{score}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-orange-500' : 'bg-red-500'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b text-sm font-medium">
        <button
          onClick={() => setActiveTab('FINDINGS')}
          className={`flex-1 py-3 border-b-2 transition-colors ${activeTab === 'FINDINGS' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Findings ({findings.length})
        </button>
        <button
          onClick={() => setActiveTab('PARSER')}
          className={`flex-1 py-3 border-b-2 transition-colors ${activeTab === 'PARSER' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Parser Preview
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 bg-muted/10">
        {activeTab === 'FINDINGS' ? (
          <div className="space-y-4">
            {findings.length === 0 ? (
              <div className="text-center py-10">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <p className="text-sm font-medium">Your resume looks perfect!</p>
                <p className="text-xs text-muted-foreground mt-1">No critical issues detected.</p>
              </div>
            ) : (
              findings.map((f, i) => (
                <div key={i} className={`p-4 rounded-xl border bg-card shadow-sm space-y-3 ${
                  f.severity === 'CRITICAL' ? 'border-red-300 bg-red-50/30' : 
                  f.severity === 'HIGH' ? 'border-orange-300 bg-orange-50/30' : 
                  'border-yellow-300 bg-yellow-50/30'
                }`}>
                  <div className="flex items-start gap-2">
                    {f.severity === 'CRITICAL' || f.severity === 'HIGH' ? (
                      <XCircle className={`w-4 h-4 shrink-0 mt-0.5 ${f.severity === 'CRITICAL' ? 'text-red-500' : 'text-orange-500'}`} />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${
                          f.severity === 'CRITICAL' ? 'text-red-700' : 
                          f.severity === 'HIGH' ? 'text-orange-700' : 
                          'text-yellow-700'
                        }`}>{f.severity}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{f.ruleId}</span>
                      </div>
                      <p className="text-sm font-medium mt-1">{f.message}</p>
                    </div>
                  </div>

                  {f.evidence && (
                    <div className="text-xs bg-white/50 p-2 rounded-lg border border-white/50 text-muted-foreground italic">
                      "{f.evidence}"
                    </div>
                  )}

                  {f.recommendedFix && (
                    <div className="text-xs flex items-start gap-1.5 text-muted-foreground mt-2">
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
                      <span>{f.recommendedFix}</span>
                    </div>
                  )}

                  {f.aiFixable && (
                    <div className="pt-2">
                      <Button size="sm" onClick={() => onFixWithAI(f)} className="w-full gap-2 h-8 text-xs">
                        <Sparkles className="w-3.5 h-3.5" /> Fix with AI
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex gap-2">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  This simulates how a standard ATS linearly extracts your text. If the order seems scrambled or sections are missing here, they will likely be missed by a real ATS.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Extracted Section Order</h4>
              <div className="flex flex-wrap gap-2">
                {parserSimulation.parsedOrder.map((sec, i) => (
                  <span key={i} className="px-2 py-1 bg-white border rounded text-xs font-medium text-muted-foreground shadow-sm">
                    {i + 1}. {sec}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Raw Text Dump</h4>
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-xl text-[10px] whitespace-pre-wrap overflow-x-auto leading-relaxed shadow-inner">
                {parserSimulation.rawText}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
