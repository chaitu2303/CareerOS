import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Compass, Briefcase, GraduationCap, Code, Trophy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function CareerPassportPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      careerProfile: {
        include: {
          skills: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
          experiences: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
          educations: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
        }
      },
      xpRecord: true,
      streakRecord: true,
      userBadges: { include: { badge: true } }
    }
  });

  if (!user) redirect('/');

  const profile = user.careerProfile;
  const xp = user.xpRecord?.totalXp || 0;
  const level = user.xpRecord?.currentLevel || 1;
  const streak = user.streakRecord?.currentStreak || 0;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
            <Compass className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{user.name}</h1>
            <p className="text-muted-foreground text-lg">{profile?.targetRole || 'Exploring Opportunities'}</p>
            <div className="flex items-center gap-3 mt-3">
              <Badge variant="secondary" className="px-3 py-1 font-semibold rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
                Level {level}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 font-semibold rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-500">
                {streak} Day Streak
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 font-semibold rounded-lg bg-primary/10 text-primary">
                {xp} XP
              </Badge>
            </div>
          </div>
        </div>

        <Button className="relative z-10 rounded-xl gap-2 shadow-sm" variant="outline">
          <Share2 className="w-4 h-4" /> Share Passport
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Experience Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" /> Experience
            </h2>
            {profile?.experiences && profile.experiences.length > 0 ? (
              <div className="space-y-4">
                {profile.experiences.map((exp: any) => (
                  <div key={exp.id} className="p-5 bg-card rounded-2xl border border-border/50 shadow-sm">
                    <h3 className="font-semibold text-lg">{exp.role}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mt-1">{exp.startDate} - {exp.endDate || 'Present'}</p>
                    {exp.description && (
                      <p className="mt-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-card rounded-2xl border border-dashed text-center text-muted-foreground">
                No experience listed yet.
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" /> Education
            </h2>
            {profile?.educations && profile.educations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.educations.map((edu: any) => (
                  <div key={edu.id} className="p-5 bg-card rounded-2xl border border-border/50 shadow-sm">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-primary font-medium text-sm mt-1">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground mt-2">{edu.startDate} - {edu.endDate || 'Present'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-card rounded-2xl border border-dashed text-center text-muted-foreground">
                No education listed yet.
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Skills */}
          <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-primary" /> Verified Skills
            </h2>
            {profile?.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: any) => (
                  <Badge key={skill.id} variant="secondary" className="px-3 py-1 text-sm font-medium bg-secondary/50 text-foreground">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No skills verified yet.</p>
            )}
          </div>

          {/* Badges */}
          <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-500" /> Career Badges
            </h2>
            {user.userBadges && user.userBadges.length > 0 ? (
              <div className="space-y-3">
                {user.userBadges.map((ub: any) => (
                  <div key={ub.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{ub.badge.name}</p>
                      <p className="text-xs text-muted-foreground">{ub.badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Complete assessments and arenas to earn badges!</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
