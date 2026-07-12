import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Star, Target, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AchievementsPage() {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect('/');

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: {
      xpRecord: { include: { events: { orderBy: { createdAt: 'desc' }, take: 10 } } },
      userBadges: { include: { badge: true }, orderBy: { earnedAt: 'desc' } },
      certificates: { orderBy: { issuedAt: 'desc' } }
    }
  });

  if (!dbUser) redirect('/');

  const xpRecord = dbUser.xpRecord;
  const badges = dbUser.userBadges;
  const certificates = dbUser.certificates;
  const events = xpRecord?.events || [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Achievements & Passport</h1>
        <p className="text-slate-500 mt-1">Your verifiable career progression and gamified milestones.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total XP</p>
              <h2 className="text-3xl font-bold text-slate-900">{xpRecord?.totalXp || 0}</h2>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Current Level</p>
              <h2 className="text-3xl font-bold text-slate-900">{xpRecord?.currentLevel || 1}</h2>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Medal className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Badges Earned</p>
              <h2 className="text-3xl font-bold text-slate-900">{badges.length}</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Badges & Certificates */}
        <div className="space-y-8">
          {/* Certificates */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> Verifiable Certificates
            </h2>
            {certificates.length === 0 ? (
              <Card className="border-dashed bg-slate-50">
                <CardContent className="p-8 text-center text-slate-500 text-sm">
                  No certificates earned yet. Complete major skill tracks to earn your first verifiable certificate.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {certificates.map(cert => (
                  <Card key={cert.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{cert.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">Issued {new Date(cert.issuedAt).toLocaleDateString()}</p>
                        </div>
                        {cert.status === 'VALID' && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Valid
                          </span>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-mono text-xs">ID: {cert.certificateCode}</span>
                        <Link href={`/verify/${cert.certificateCode}`} className="text-indigo-600 hover:underline">
                          Verify Publicly &rarr;
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Badges */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5 text-orange-500" /> Earned Badges
            </h2>
            {badges.length === 0 ? (
              <Card className="border-dashed bg-slate-50">
                <CardContent className="p-8 text-center text-slate-500 text-sm">
                  Complete daily missions and assessments to start earning badges.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {badges.map(b => (
                  <Card key={b.id} className="text-center hover:bg-slate-50 transition-colors">
                    <CardContent className="p-4">
                      <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-2 shadow-inner">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-sm line-clamp-1" title={b.badge.name}>{b.badge.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(b.earnedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: XP Timeline */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" /> XP History
          </h2>
          <Card>
            <CardContent className="p-0">
              {events.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm bg-slate-50">
                  No XP history yet.
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {events.map(ev => (
                    <li key={ev.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-medium text-sm text-slate-800">{ev.activity}</p>
                        {ev.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{ev.description}</p>
                        )}
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(ev.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="shrink-0 ml-4 font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        +{ev.xpEarned} XP
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
