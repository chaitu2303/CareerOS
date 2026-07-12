import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Briefcase, CheckCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function JobsIndexPage() {
  const session = await auth();
  const authUser = session?.user;
  if (!authUser) redirect('/');

  const dbUser = await prisma.user.findUnique({ 
    where: { email: authUser.email! },
    include: { careerProfile: true }
  });

  const jobs = dbUser
    ? await prisma.jobTarget.findMany({
        where: { userId: dbUser.id },
        include: { matchAnalysis: true },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Job Intelligence</h1>
          </div>
          <p className="text-muted-foreground text-balance">
            Analyze {dbUser?.careerProfile?.targetRole || 'job descriptions'} against your Master Profile to get actionable insights.
          </p>
        </div>
        <div>
          <Link href="/dashboard/jobs/new">
            <Button className="rounded-xl shadow-lg gap-2">
              <Plus className="w-4 h-4" /> Analyze New Job
            </Button>
          </Link>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-border/50 rounded-3xl bg-card shadow-sm text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-20" />
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <div className="max-w-md px-4">
            <h2 className="text-2xl font-bold mb-2">No jobs analyzed yet</h2>
            <p className="text-muted-foreground text-balance">
              Paste a job description to see how well your profile matches, get a personalized gap analysis, and automatically tailor your resume.
            </p>
          </div>
          <Link href="/dashboard/jobs/new">
            <Button size="lg" className="rounded-xl shadow-lg gap-2">
              <Plus className="w-4 h-4" /> Analyze Your First Job
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Create New Card */}
          <Link
            href="/dashboard/jobs/new"
            className="flex flex-col items-center justify-center gap-4 bg-muted/10 border-2 border-dashed border-border/60 rounded-3xl p-8 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground mb-1">Analyze New Job</div>
              <div className="text-xs text-muted-foreground font-medium">Extract requirements with AI</div>
            </div>
          </Link>

          {jobs.map(job => {
            const score = job.matchAnalysis?.overallScore;
            
            return (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="group flex flex-col bg-card border border-border/50 rounded-3xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 min-h-[220px] relative overflow-hidden"
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="relative z-10 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/10">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    {score ? (
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 border ${
                        score >= 80 ? 'bg-success/10 text-success border-success/20' :
                        score >= 60 ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-destructive/10 text-destructive border-destructive/20'
                      }`}>
                        <span>{score}% Match</span>
                      </div>
                    ) : (
                      <div className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-muted/50 text-muted-foreground flex items-center gap-1.5 border border-border/50">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Analyzing</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {job.roleTitle}
                  </h3>
                  <div className="text-sm text-muted-foreground font-medium mb-3">
                    {job.company}{job.department ? ` · ${job.department}` : ''}
                  </div>
                  
                  <div className="mt-auto pt-2">
                    {score && (
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            score >= 80 ? 'bg-success' :
                            score >= 60 ? 'bg-warning' :
                            'bg-destructive'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span className="uppercase tracking-widest">
                    {new Date(job.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
                    <span>View Report</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
