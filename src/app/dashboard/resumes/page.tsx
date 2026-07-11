import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, FileText, ArrowRight, Copy, Clock, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function ResumesPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/');

  const dbUser = await prisma.user.findUnique({ where: { email: authUser.email! } });
  const resumes = dbUser
    ? await prisma.resume.findMany({
        where: { userId: dbUser.id },
        include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1 } },
        orderBy: { updatedAt: 'desc' },
      })
    : [];

  const hasProfile = dbUser
    ? !!(await prisma.careerProfile.findUnique({ where: { userId: dbUser.id } }))
    : false;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Resume Studio</h1>
          </div>
          <p className="text-muted-foreground text-balance">
            Build, tailor, and export professional resumes from your Master Career Profile.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {hasProfile && (
            <Link href="/dashboard/resumes/new?mode=FROM_PROFILE">
              <Button variant="secondary" className="rounded-xl shadow-sm">
                <Copy className="w-4 h-4 mr-2" /> From Profile
              </Button>
            </Link>
          )}
          <Link href="/dashboard/resumes/new?mode=BLANK">
            <Button className="rounded-xl shadow-lg">
              <Plus className="w-4 h-4 mr-2" /> New Resume
            </Button>
          </Link>
        </div>
      </div>

      {resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-border/50 rounded-3xl bg-card shadow-sm text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-20" />
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div className="max-w-md px-4">
            <h2 className="text-2xl font-bold mb-2">No resumes yet</h2>
            <p className="text-muted-foreground text-balance">
              Create your first ATS-optimized resume. Let the CareerOS AI Engine extract and format your experiences automatically.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {hasProfile && (
              <Link href="/dashboard/resumes/new?mode=FROM_PROFILE">
                <Button variant="secondary" size="lg" className="rounded-xl">
                  <Copy className="w-4 h-4 mr-2" /> Auto-Generate
                </Button>
              </Link>
            )}
            <Link href="/dashboard/resumes/new?mode=BLANK">
              <Button size="lg" className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Start Blank
              </Button>
            </Link>
          </div>
          {!hasProfile && (
            <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-2xl text-sm text-warning-foreground max-w-md mx-4 text-left flex items-start gap-3">
              <div className="w-5 h-5 shrink-0 bg-warning/20 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-warning text-xs font-bold">!</span>
              </div>
              <p>Complete your <Link href="/onboarding" className="font-bold underline hover:text-warning transition-colors">Career Profile</Link> to unlock AI-powered profile-based generation.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Create New Card */}
          <Link
            href="/dashboard/resumes/new?mode=BLANK"
            className="flex flex-col items-center justify-center gap-4 bg-muted/10 border-2 border-dashed border-border/60 rounded-3xl p-8 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground mb-1">Create New Resume</div>
              <div className="text-xs text-muted-foreground font-medium">Blank or via AI Engine</div>
            </div>
          </Link>

          {resumes.map(resume => {
            const latestVersion = resume.versions[0];
            return (
              <Link
                key={resume.id}
                href={`/dashboard/resumes/${resume.id}`}
                className="group flex flex-col bg-card border border-border/50 rounded-3xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 min-h-[220px] relative overflow-hidden"
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="relative z-10 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    {resume.atsScore != null && (
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 border ${
                        resume.atsScore >= 80 ? 'bg-success/10 text-success border-success/20' :
                        resume.atsScore >= 60 ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-destructive/10 text-destructive border-destructive/20'
                      }`}>
                        <span>ATS {resume.atsScore}</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {resume.title}
                  </h3>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(resume.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    {latestVersion?.tailoredForJob && (
                      <div className="flex items-center gap-2 text-xs font-bold text-info">
                        <Briefcase className="w-3.5 h-3.5" />
                        AI Tailored
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span className="uppercase tracking-widest">{resume.versions.length > 0 ? `v${resume.versions[0]?.versionNumber ?? 1}` : 'v1'}</span>
                  <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
                    <span>Open</span>
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
