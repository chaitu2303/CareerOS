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
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Studio</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Build, tailor, and export professional resumes from your Master Career Profile.
          </p>
        </div>
        <div className="flex gap-2">
          {hasProfile && (
            <Link href="/dashboard/resumes/new?mode=FROM_PROFILE">
              <Button variant="outline" className="gap-2">
                <Copy className="w-4 h-4" /> From Profile
              </Button>
            </Link>
          )}
          <Link href="/dashboard/resumes/new?mode=BLANK">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> New Resume
            </Button>
          </Link>
        </div>
      </div>

      {resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border rounded-2xl bg-card text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary/60" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">No resumes yet</h2>
            <p className="text-muted-foreground max-w-sm text-sm mt-1">
              Create your first resume — either from scratch or automatically generated from your Master Career Profile.
            </p>
          </div>
          <div className="flex gap-3">
            {hasProfile && (
              <Link href="/dashboard/resumes/new?mode=FROM_PROFILE">
                <Button variant="outline" className="gap-2">
                  <Copy className="w-4 h-4" /> Generate from Profile
                </Button>
              </Link>
            )}
            <Link href="/dashboard/resumes/new?mode=BLANK">
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Start from Scratch
              </Button>
            </Link>
          </div>
          {!hasProfile && (
            <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700">
              Complete your <Link href="/onboarding" className="font-semibold underline">Career Profile</Link> to unlock profile-based generation.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumes.map(resume => {
            const latestVersion = resume.versions[0];
            return (
              <Link
                key={resume.id}
                href={`/dashboard/resumes/${resume.id}`}
                className="group flex flex-col bg-card border rounded-2xl p-5 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  {resume.atsScore != null && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      resume.atsScore >= 80 ? 'bg-green-100 text-green-700' :
                      resume.atsScore >= 60 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      ATS {resume.atsScore}%
                    </span>
                  )}
                </div>
                <h3 className="font-semibold leading-tight">{resume.title}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Updated {new Date(resume.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
                {latestVersion?.tailoredForJob && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600">
                    <Briefcase className="w-3 h-3" />
                    Tailored version
                  </div>
                )}
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{resume.versions.length > 0 ? `v${resume.versions[0]?.versionNumber ?? 1}` : 'v1'}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            );
          })}

          {/* Create new card */}
          <Link
            href="/dashboard/resumes/new?mode=BLANK"
            className="flex flex-col items-center justify-center gap-3 bg-muted/20 border-2 border-dashed rounded-2xl p-8 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <div className="text-sm font-medium">Create New Resume</div>
              <div className="text-xs text-muted-foreground">From scratch or profile</div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
