import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  CheckCircle, AlertTriangle, ArrowRight, Target, Briefcase,
  FileText, BookOpen, ChevronRight, TrendingUp, Zap, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f97316' : '#ef4444';
  const circumference = 2 * Math.PI * 15.9155;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor"
          className="text-muted/20" strokeWidth="3" />
        <circle cx="18" cy="18" r="15.9155" fill="none" stroke={color}
          strokeWidth="3" strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-bold text-xl"
        style={{ color }}>
        {score}
      </div>
    </div>
  );
}

export default async function JobAnalysisPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/');

  const job = await prisma.jobTarget.findUnique({
    where: { id },
    include: { matchAnalysis: true }
  });

  if (!job) notFound();

  const analysis = job.matchAnalysis;

  type MatchedSkill = {
    skill: string;
    evidenceFactId: string;
    evidenceType?: string;
    explanation: string;
    matchStrength?: 'STRONG' | 'PARTIAL';
  };

  type MissingSkill = {
    skill: string;
    criticality: 'HIGH' | 'MEDIUM' | 'LOW';
    improvementPlan: string;
  };

  const matchedSkills: MatchedSkill[] = Array.isArray(analysis?.matchedSkills)
    ? (analysis.matchedSkills as MatchedSkill[])
    : [];
  const missingSkills: MissingSkill[] = Array.isArray(analysis?.missingSkills)
    ? (analysis.missingSkills as MissingSkill[])
    : [];
  const resumeRecs: string[] = Array.isArray(analysis?.resumeRecommendations)
    ? (analysis.resumeRecommendations as string[])
    : [];
  const interviewRecs: string[] = Array.isArray(analysis?.interviewRecommendations)
    ? (analysis.interviewRecommendations as string[])
    : [];

  const strongMatches = matchedSkills.filter(m => m.matchStrength !== 'PARTIAL');
  const partialMatches = matchedSkills.filter(m => m.matchStrength === 'PARTIAL');
  const highGaps = missingSkills.filter(m => m.criticality === 'HIGH');
  const score = analysis?.overallScore ?? 0;

  const extractedSkills = job.extractedSkills as { required?: string[]; preferred?: string[]; tools?: string[] } | null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/dashboard/jobs" className="hover:text-foreground transition-colors">Jobs</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{job.roleTitle}</span>
      </nav>

      {/* Hero Header */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {job.department && (
                <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {job.department}
                </span>
              )}
              {job.seniority && (
                <span className="text-xs font-medium px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                  {job.seniority}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight mt-2">{job.roleTitle}</h1>
            <div className="flex items-center gap-2 mt-2 text-lg text-muted-foreground">
              <Briefcase className="w-5 h-5" />
              <span>{job.company}</span>
              {job.industry && <><span className="text-muted-foreground/50">·</span><span>{job.industry}</span></>}
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{strongMatches.length}</div>
                <div className="text-xs text-muted-foreground">Strong Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{partialMatches.length}</div>
                <div className="text-xs text-muted-foreground">Partial Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{highGaps.length}</div>
                <div className="text-xs text-muted-foreground">Critical Gaps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{(extractedSkills?.required ?? []).length}</div>
                <div className="text-xs text-muted-foreground">Skills Required</div>
              </div>
            </div>
          </div>

          {/* Score Ring */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <ScoreRing score={score} />
            <div className="text-center">
              <div className="text-sm font-semibold">Profile Match</div>
              <div className="text-xs text-muted-foreground">
                {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column: Matches & Gaps */}
        <div className="lg:col-span-2 space-y-6">

          {/* Strong Matches */}
          {strongMatches.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Verified Matches
                <span className="text-sm font-normal text-muted-foreground">({strongMatches.length})</span>
              </h2>
              <div className="space-y-3">
                {strongMatches.map((match, i) => (
                  <div key={i} className="relative bg-card border rounded-xl p-4 overflow-hidden group hover:border-green-300 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400 rounded-l-xl" />
                    <div className="pl-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{match.skill}</h3>
                        <span className="text-[10px] shrink-0 px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full font-medium">
                          ✓ STRONG MATCH
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{match.explanation}</p>
                      {match.evidenceType && (
                        <div className="mt-2 text-[10px] text-green-700 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Grounded in {match.evidenceType} · ID: {match.evidenceFactId.slice(0, 8)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Partial Matches */}
          {partialMatches.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Partial / Transferable Matches
                <span className="text-sm font-normal text-muted-foreground">({partialMatches.length})</span>
              </h2>
              <div className="space-y-3">
                {partialMatches.map((match, i) => (
                  <div key={i} className="relative bg-card border rounded-xl p-4 overflow-hidden hover:border-blue-300 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-l-xl" />
                    <div className="pl-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{match.skill}</h3>
                        <span className="text-[10px] shrink-0 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-medium">
                          ~ PARTIAL
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{match.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Missing Skills / Gap Analysis */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Gap Analysis
              <span className="text-sm font-normal text-muted-foreground">({missingSkills.length} gaps)</span>
            </h2>
            {missingSkills.length === 0 ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-green-700 font-medium">No critical gaps detected — excellent profile match!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {missingSkills.map((missing, i) => (
                  <div key={i} className={`relative bg-card border rounded-xl p-4 overflow-hidden hover:shadow-sm transition-all ${
                    missing.criticality === 'HIGH' ? 'hover:border-red-300' : 'hover:border-orange-300'
                  }`}>
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                      missing.criticality === 'HIGH' ? 'bg-red-400' : 
                      missing.criticality === 'MEDIUM' ? 'bg-orange-400' : 'bg-yellow-400'
                    }`} />
                    <div className="pl-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{missing.skill}</h3>
                        <span className={`text-[10px] shrink-0 px-2 py-0.5 rounded-full border font-bold ${
                          missing.criticality === 'HIGH' 
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : missing.criticality === 'MEDIUM'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {missing.criticality}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{missing.improvementPlan}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column: Recommendations & Actions */}
        <div className="space-y-6">

          {/* CTA Actions */}
          <div className="bg-card border rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold text-sm">Next Steps</h3>
            <Link href="/dashboard/resumes/new" className="w-full">
              <Button className="w-full gap-2 justify-start" variant="default">
                <Target className="w-4 h-4" />
                Generate Tailored Resume
              </Button>
            </Link>
            <Button className="w-full gap-2 justify-start" variant="outline">
              <Zap className="w-4 h-4" />
              Start Mock Interview
            </Button>
            <Button className="w-full gap-2 justify-start" variant="outline">
              <BookOpen className="w-4 h-4" />
              Practice Related Assessment
            </Button>
          </div>

          {/* Resume Recommendations */}
          {resumeRecs.length > 0 && (
            <div className="bg-card border rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Resume Improvements
              </h3>
              <ul className="space-y-2">
                {resumeRecs.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interview Prep */}
          {interviewRecs.length > 0 && (
            <div className="bg-card border rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Interview Prep Topics
              </h3>
              <ul className="space-y-2">
                {interviewRecs.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Score Disclaimer */}
          <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-xl text-xs text-muted-foreground">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>This match score is an AI-estimated analysis based on your verified profile. It does not represent the exact score used by any employer&apos;s ATS system.</span>
          </div>

          {/* Required Skills Reference */}
          {extractedSkills?.required && extractedSkills.required.length > 0 && (
            <div className="bg-card border rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold text-sm">All Required Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {extractedSkills.required.map((s, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded-md border">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
