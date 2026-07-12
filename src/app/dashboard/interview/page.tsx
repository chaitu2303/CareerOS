import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Brain, Plus, Calendar, Clock, ChevronRight, Video, Target, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function InterviewHubPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect('/');

  const interviews: any[] = [];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
            <Brain className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Interview Hub</h1>
            <p className="text-muted-foreground">Practice and master your interview skills with AI.</p>
          </div>
        </div>

        <Link href="/dashboard/interview/new">
          <Button className="rounded-xl gap-2 shadow-sm" size="lg">
            <Plus className="w-5 h-5" /> New Mock Interview
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stats */}
        <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Video className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Sessions</p>
            <p className="text-2xl font-bold">{interviews.length}</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Avg Accuracy</p>
            <p className="text-2xl font-bold">85%</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Best Score</p>
            <p className="text-2xl font-bold">92%</p>
          </div>
        </div>

      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Past Interviews</h2>
        
        {interviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview: any) => (
              <Link key={interview.id} href={`/dashboard/interview/${interview.id}/chat`} className="block group">
                <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm hover:border-primary/50 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="capitalize">{interview.type.toLowerCase()}</Badge>
                    <Badge variant={interview.status === 'COMPLETED' ? 'default' : 'outline'} className="capitalize bg-green-500/10 text-green-600">
                      {interview.status.toLowerCase()}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {interview.targetRole}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{interview.targetCompany || 'General Practice'}</p>
                  
                  <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-card p-12 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center text-center">
            <Brain className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-xl font-bold mb-2">No interviews yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">Start your first mock interview session to practice behavioral or technical questions.</p>
            <Link href="/dashboard/interview/new">
              <Button className="rounded-xl">Start Interview</Button>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
