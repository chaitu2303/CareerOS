import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, AlertCircle, XCircle } from 'lucide-react';
import { CareerReadinessEngine } from '@/lib/analytics/CareerReadinessEngine';

export const dynamic = 'force-dynamic';

export default async function CareerPerformanceCenter() {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect('/');

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) redirect('/');

  let snapshot = await prisma.careerReadinessSnapshot.findFirst({
    where: { userId: dbUser.id },
    orderBy: { createdAt: 'desc' }
  });

  let nextAction = "Continue preparing active applications.";
  if (snapshot) {
    nextAction = await CareerReadinessEngine.getNextBestAction(snapshot.id) || nextAction;
  }

  const dimensions = snapshot ? JSON.parse(snapshot.dimensionScores as string) : [];
  
  // Aggregate application funnel
  const applications = await prisma.application.groupBy({
    by: ['status'],
    where: { userId: dbUser.id },
    _count: true
  });
  
  const funnel = {
    total: 0,
    assessments: 0,
    interviews: 0,
    offers: 0
  };

  applications.forEach(app => {
    funnel.total += app._count;
    if (app.status === 'ASSESSMENT') funnel.assessments += app._count;
    if (app.status === 'INTERVIEW') funnel.interviews += app._count;
    if (app.status === 'OFFER') funnel.offers += app._count;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Career Performance Center</h1>
        <p className="text-slate-500 mt-1">Your comprehensive, evidence-backed career readiness analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-slate-200">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-slate-700 font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Target Role Readiness
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">{snapshot?.targetRole || 'Not Set'}</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-slate-900">
                  {snapshot?.overallScore !== null ? `${snapshot?.overallScore}%` : 'N/A'}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {!snapshot ? (
              <div className="text-center p-6 bg-slate-50 border rounded-lg">
                No readiness data available. Complete assessments to generate a snapshot.
              </div>
            ) : (
              <div className="space-y-4">
                {dimensions.map((dim: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">
                        {dim.dimension} ({Math.round(dim.weight * 100)}% weight)
                      </span>
                      {dim.status === 'NOT_AVAILABLE' ? (
                        <span className="text-slate-400 text-xs flex items-center gap-1">
                          <XCircle className="w-3 h-3"/> Not Available
                        </span>
                      ) : dim.status === 'NO_EVIDENCE' ? (
                        <span className="text-yellow-600 text-xs flex items-center gap-1">
                          No Evidence
                        </span>
                      ) : (
                        <span className="text-slate-500">{dim.score}%</span>
                      )}
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${dim.score >= 80 ? 'bg-green-500' : dim.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                        style={{ width: `${dim.score || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded border mt-6">
              Readiness score is calculated using <strong className="text-slate-500">{snapshot?.formulaVersion || 'READINESS_V1'}</strong> based only on available platforms. Missing providers do not penalize your calculable score.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100 pb-3">
              <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Next Best Action
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-slate-700 font-medium">{nextAction}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">Application Funnel</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-600">Applications</span>
                  <span className="font-semibold text-slate-900">{funnel.total}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-600 pl-4">Assessments</span>
                  <span className="font-semibold text-slate-900">{funnel.assessments}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-600 pl-8">Interviews</span>
                  <span className="font-semibold text-slate-900">{funnel.interviews}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 pl-12 text-green-600">Offers</span>
                  <span className="font-semibold text-green-700">{funnel.offers}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
