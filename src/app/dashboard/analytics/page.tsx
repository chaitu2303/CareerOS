import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { BarChart3, TrendingUp, TrendingDown, Target, Zap, Clock, Activity } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function StatCard({ title, value, trend, trendValue, icon: Icon, colorClass }: any) {
  return (
    <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-current" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold">{value}</h3>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-1">{title}</p>
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      xpRecord: true,
      streakRecord: true,
    }
  });

  if (!user) redirect('/');

  // Mock aggregates
  const appsCount = 0;
  const interviewsCount = 0;
  
  // Dummy analytics data for now until telemetry is fully built
  const winRate = appsCount > 0 ? '45%' : 'N/A';
  const hoursSpent = Math.floor(interviewsCount * 0.75 + appsCount * 0.2);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
          <BarChart3 className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground">Track your job search velocity and skill progression.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Applications" 
          value={appsCount} 
          trend="up" 
          trendValue="+3 this week"
          icon={Target}
          colorClass="bg-blue-500/10 text-blue-500"
        />
        <StatCard 
          title="Interview Rate" 
          value={winRate} 
          trend={appsCount > 0 ? "up" : null} 
          trendValue="+12%"
          icon={Activity}
          colorClass="bg-green-500/10 text-green-500"
        />
        <StatCard 
          title="Active Streak" 
          value={`${user.streakRecord?.currentStreak || 0} Days`} 
          icon={Zap}
          colorClass="bg-orange-500/10 text-orange-500"
        />
        <StatCard 
          title="Hours Practicing" 
          value={`${hoursSpent}h`} 
          icon={Clock}
          colorClass="bg-purple-500/10 text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Placeholder for real charts */}
        <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm min-h-[350px] flex flex-col">
          <h2 className="text-lg font-bold mb-6">Activity Timeline</h2>
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed rounded-xl border-border/50 bg-muted/20">
            <BarChart3 className="w-10 h-10 text-muted-foreground opacity-20 mb-3" />
            <p className="text-muted-foreground text-sm">More activity required to generate timeline chart.</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm min-h-[350px] flex flex-col">
          <h2 className="text-lg font-bold mb-6">Skill Proficiency</h2>
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed rounded-xl border-border/50 bg-muted/20">
            <Target className="w-10 h-10 text-muted-foreground opacity-20 mb-3" />
            <p className="text-muted-foreground text-sm">Complete coding assessments to view proficiency radar.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
