import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Briefcase, CheckCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function JobsIndexPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/');

  const dbUser = await prisma.user.findUnique({ where: { email: authUser.email! } });

  const jobs = dbUser
    ? await prisma.jobTarget.findMany({
        where: { userId: dbUser.id },
        include: { matchAnalysis: true },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Targets</h1>
          <p className="text-muted-foreground text-sm mt-1">Analyze job descriptions against your Master Profile.</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Analyze New Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border rounded-2xl bg-card text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-primary/60" />
          </div>
          <h2 className="text-xl font-semibold">No jobs analyzed yet</h2>
          <p className="text-muted-foreground max-w-sm text-sm">
            Paste a job description to see how well your profile matches and get a personalized gap analysis.
          </p>
          <Link href="/dashboard/jobs/new">
            <Button>Analyze Your First Job</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => {
            const score = job.matchAnalysis?.overallScore;
            const scoreColor = !score ? 'text-muted-foreground' 
              : score >= 80 ? 'text-green-600' 
              : score >= 60 ? 'text-orange-500' 
              : 'text-red-500';
            const scoreBg = !score ? 'bg-muted/30' 
              : score >= 80 ? 'bg-green-50 border-green-200' 
              : score >= 60 ? 'bg-orange-50 border-orange-200' 
              : 'bg-red-50 border-red-200';

            return (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="flex items-center justify-between p-5 bg-card border rounded-xl hover:border-primary/50 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{job.roleTitle}</div>
                    <div className="text-sm text-muted-foreground">{job.company}{job.department ? ` · ${job.department}` : ''}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 ml-4">
                  {job.matchAnalysis ? (
                    <div className={`px-3 py-1.5 rounded-lg border text-sm font-bold ${scoreBg} ${scoreColor}`}>
                      {score}% Match
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" /> Analyzing...
                    </div>
                  )}
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
