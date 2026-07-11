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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

      {/* Hero Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getHourGreeting()}, {userName} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            {hasProfile
              ? `Your profile is ${completenessScore}% complete. Keep building your career.`
              : "Welcome to CareerOS. Let's build your career profile."}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full font-medium text-orange-700">
            <FlameKindling className="w-4 h-4" />
            {streak > 0 ? `${streak}-day streak` : 'Start your streak'}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full font-medium text-yellow-700">
            <Zap className="w-4 h-4" />
            Level {level} · {xp.toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Career Readiness + Quick Actions */}
        <div className="lg:col-span-2 space-y-6">

          {/* Career Readiness Card */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Career Readiness</h2>
              <Link href="/dashboard/analytics" className="text-sm text-primary flex items-center gap-1 hover:underline">
                Full Report <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Big Score */}
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor"
                    className="text-muted/20" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9155" fill="none"
                    stroke={completenessScore >= 80 ? '#22c55e' : completenessScore >= 60 ? '#f97316' : '#ef4444'}
                    strokeWidth="3"
                    strokeDasharray={`${(completenessScore / 100) * 100.53} 100.53`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                  {completenessScore}%
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <ReadinessBar score={skillCount > 5 ? 80 : skillCount * 15} label="Technical Skills" />
                <ReadinessBar score={expCount > 0 ? 75 : 0} label="Experience" />
                <ReadinessBar score={projectCount > 1 ? 70 : projectCount * 35} label="Projects" />
              </div>
            </div>

            {!hasProfile && (
              <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Build your Master Profile to unlock all features.</p>
                <Link href="/onboarding">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: '/dashboard/jobs/new', icon: Briefcase, label: 'Analyze Job', color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { href: '/dashboard/resumes/new', icon: FileText, label: 'Create Resume', color: 'text-purple-600 bg-purple-50 border-purple-200' },
              { href: '/dashboard/interview/new', icon: Brain, label: 'Mock Interview', color: 'text-green-600 bg-green-50 border-green-200' },
              { href: '/dashboard/code', icon: Code2, label: 'Code Practice', color: 'text-orange-600 bg-orange-50 border-orange-200' },
            ].map(action => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-0.5 text-center group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Recent Job Targets */}
          {recentJobs.length > 0 && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Recent Job Analyses</h2>
                <Link href="/dashboard/jobs" className="text-sm text-primary flex items-center gap-1 hover:underline">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentJobs.map(job => {
                  const score = job.matchAnalysis?.overallScore;
                  return (
                    <Link
                      key={job.id}
                      href={`/dashboard/jobs/${job.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl border hover:border-primary/40 hover:bg-muted/20 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{job.roleTitle}</div>
                        <div className="text-xs text-muted-foreground">{job.company}</div>
                      </div>
                      {score != null && (
                        <span className={`text-sm font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                          {score}%
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Missions, Badges, Stats */}
        <div className="space-y-6">

          {/* Today's Missions */}
          <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Today&apos;s Missions
              </h3>
              <span className="text-xs text-muted-foreground">
                {missionTasks.filter(t => t.completed).length}/{missionTasks.length} done
              </span>
            </div>
            <div className="space-y-2.5">
              {missionTasks.map(task => (
                <div key={task.id} className="flex items-start gap-2.5">
                  {task.completed
                    ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    : <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />}
                  <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Your Progress
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Skills', value: skillCount, icon: MonitorCheck, color: 'text-blue-600' },
                { label: 'Experience', value: expCount, icon: Briefcase, color: 'text-purple-600' },
                { label: 'Projects', value: projectCount, icon: Code2, color: 'text-green-600' },
                { label: 'Certs', value: profile?.certifications.length ?? 0, icon: Trophy, color: 'text-orange-600' },
              ].map(stat => (
                <div key={stat.label} className="p-3 bg-muted/30 rounded-xl text-center">
                  <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Badges */}
          {(dbUser?.userBadges.length ?? 0) > 0 ? (
            <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" /> Recent Badges
              </h3>
              <div className="space-y-2">
                {dbUser?.userBadges.map(ub => (
                  <div key={ub.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-base">🏆</div>
                    <div>
                      <div className="text-sm font-medium">{ub.badge.name}</div>
                      <div className="text-xs text-muted-foreground">{ub.badge.category}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/achievements" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all achievements <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="bg-card border rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-yellow-500" /> Achievements
              </h3>
              <p className="text-sm text-muted-foreground">Complete activities to earn your first badge.</p>
              <Link href="/dashboard/achievements" className="text-xs text-primary hover:underline flex items-center gap-1 mt-2">
                View badges <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Streak Calendar Teaser */}
          <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Consistency
            </h3>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{streak}</div>
              <div>
                <div className="text-sm font-medium">day streak 🔥</div>
                <div className="text-xs text-muted-foreground">
                  Longest: {dbUser?.streakRecord?.longestStreak ?? 0} days
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {streak > 0
                ? `You've been consistent for ${streak} days. Don't break the chain!`
                : 'Complete any career activity today to start your streak.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
