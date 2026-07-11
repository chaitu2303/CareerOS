import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  ArrowRight, Briefcase, FileText, Brain, Code2,
  FlameKindling, Zap, Target, CheckCircle, Circle,
  TrendingUp, ChevronRight, Plus, MonitorCheck,
  Clock, Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

function getHourGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function ReadinessBar({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-orange-500' : 'bg-red-500';
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{score}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/');

  const dbUser = await prisma.user.findUnique({
    where: { email: authUser.email! },
    include: {
      streakRecord: true,
      xpRecord: true,
      careerProfile: {
        include: {
          skills: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
          experiences: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
          educations: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
          projects: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
          certifications: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
        }
      },
      jobTargets: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { matchAnalysis: true }
      },
      userBadges: { take: 3, include: { badge: true }, orderBy: { earnedAt: 'desc' } },
      dailyMissions: {
        where: { missionDate: new Date().toISOString().slice(0, 10) },
        take: 1,
      }
    }
  });

  const userName = dbUser?.name ?? authUser.email?.split('@')[0] ?? 'there';
  const streak = dbUser?.streakRecord?.currentStreak ?? 0;
  const xp = dbUser?.xpRecord?.totalXp ?? 0;
  const level = dbUser?.xpRecord?.currentLevel ?? 1;
  const profile = dbUser?.careerProfile;

  // Compute profile completeness
  const completenessScore = profile?.completenessScore ?? 0;
  const hasProfile = !!profile;
  const skillCount = profile?.skills.length ?? 0;
  const expCount = profile?.experiences.length ?? 0;
  const projectCount = profile?.projects.length ?? 0;

  // Today's missions
  const todayMission = dbUser?.dailyMissions[0];
  const missionTasks: Array<{ id: string; label: string; completed: boolean }> = Array.isArray(todayMission?.tasks)
    ? (todayMission.tasks as Array<{ id: string; label: string; completed: boolean }>)
    : [
      { id: '1', label: 'Solve 5 aptitude questions', completed: false },
      { id: '2', label: 'Complete today\'s coding challenge', completed: false },
      { id: '3', label: 'Practice 1 interview answer', completed: false },
    ];

  const recentJobs = dbUser?.jobTargets ?? [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* TOP AREA: Hero & Status */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {getHourGreeting()}, {userName}
            </h1>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-semibold text-green-600 uppercase tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              AI Core Online
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl text-balance">
            {hasProfile
              ? `You are preparing for Software Engineering roles. Your profile is ${completenessScore}% complete.`
              : "Welcome to your new Career Operating System. Let's build your verified profile."}
          </p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Current Streak</span>
            <div className={`flex items-center gap-2 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`}>
              <FlameKindling className="w-5 h-5" />
              <span className="text-xl font-bold">{streak}</span>
            </div>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Career Level</span>
            <div className="flex items-center gap-2 text-yellow-500">
              <Zap className="w-5 h-5" />
              <span className="text-xl font-bold">{level}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
        
        {/* LEFT COLUMN (2/3 width on LG) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PRIMARY ACTION: Next Best Action */}
          <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-3xl p-6 sm:p-8 premium-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary-foreground/80 font-semibold uppercase tracking-widest text-xs mb-4">
                <Target className="w-4 h-4" />
                <span>Next Best Action</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-balance">
                Complete your DBMS baseline assessment.
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-lg">
                Your Job Intelligence scans show DBMS as a highly requested skill for your target roles, but you have no verified evidence yet.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/dashboard/assess">
                  <Button variant="secondary" size="lg" className="rounded-xl font-bold shadow-lg">
                    Start Assessment
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" className="rounded-xl text-primary-foreground hover:bg-white/20 hover:text-white">
                  Dismiss
                </Button>
              </div>
            </div>
          </div>

          {/* PROGRESS: Career Readiness (Reimagined) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Career Readiness</h3>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-4xl font-black">{completenessScore}</span>
                <span className="text-muted-foreground pb-1">/ 100</span>
              </div>
              <div className="space-y-3">
                <ReadinessBar score={Math.min(100, skillCount * 10)} label="Verified Skills" />
                <ReadinessBar score={Math.min(100, expCount * 25)} label="Experience Coverage" />
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Recent Achievement</h3>
                  <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
                {dbUser?.userBadges && dbUser.userBadges.length > 0 ? (
                  <div className="mt-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-3 border border-yellow-500/20">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="font-bold text-lg">{dbUser.userBadges[0].badge.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">Earned recently. Keep pushing!</div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col items-center justify-center text-center py-4 bg-muted/30 rounded-2xl border border-dashed border-border">
                    <Trophy className="w-8 h-8 text-muted-foreground/30 mb-2" />
                    <div className="text-sm font-medium text-muted-foreground">No achievements yet</div>
                    <div className="text-xs text-muted-foreground/70 mt-1">Complete tasks to earn badges</div>
                  </div>
                )}
              </div>
              <Link href="/dashboard/achievements">
                <Button variant="outline" className="w-full mt-4 rounded-xl">
                  View Career Passport
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Quick Tools (replaces old generic boxes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/dashboard/resumes" className="flex flex-col items-center justify-center gap-3 p-4 bg-card border border-border/50 rounded-2xl hover:bg-accent hover:border-border transition-all group">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">Resume Studio</span>
            </Link>
            <Link href="/dashboard/jobs" className="flex flex-col items-center justify-center gap-3 p-4 bg-card border border-border/50 rounded-2xl hover:bg-accent hover:border-border transition-all group">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">Job Intel</span>
            </Link>
            <Link href="/dashboard/interview" className="flex flex-col items-center justify-center gap-3 p-4 bg-card border border-border/50 rounded-2xl hover:bg-accent hover:border-border transition-all group">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">Mock Interview</span>
            </Link>
            <Link href="/dashboard/code" className="flex flex-col items-center justify-center gap-3 p-4 bg-card border border-border/50 rounded-2xl hover:bg-accent hover:border-border transition-all group">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">Coding Arena</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* TODAY: Daily Missions */}
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Today&apos;s Missions</h3>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {missionTasks.map(task => (
                <div key={task.id} className="flex items-start gap-3 group cursor-pointer">
                  <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed 
                      ? 'bg-success border-success text-success-foreground' 
                      : 'border-border group-hover:border-primary'
                  }`}>
                    {task.completed && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <div className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OPPORTUNITIES: Active Targets */}
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Opportunities</h3>
              <Link href="/dashboard/jobs" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map(job => (
                  <div key={job.id} className="group border border-border/50 rounded-2xl p-4 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="font-semibold text-sm mb-1">{job.roleTitle}</div>
                    <div className="text-xs text-muted-foreground mb-3">{job.company}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${job.matchAnalysis?.overallScore ?? 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold w-8 text-right">{job.matchAnalysis?.overallScore ?? 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-sm font-medium">No active targets</div>
                <div className="text-xs text-muted-foreground mt-1 mb-4">Start tracking a job to see it here</div>
                <Link href="/dashboard/jobs">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    Add Target
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
