'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, Activity, AlertTriangle, Play, Lock, CheckCircle2 } from 'lucide-react';

export default function SimulationsHub() {
  const [loading, setLoading] = useState(true);

  // For this milestone UI demonstration we use mock data representing fetched DB state
  const mockSimulation = {
    id: 'sim-1',
    role: 'Software Engineer',
    status: 'IN_PROGRESS',
    rounds: [
      { type: 'ASSESSMENT', title: 'Quantitative & Logical', status: 'COMPLETED', score: 85 },
      { type: 'CODING', title: 'Technical Coding Round', status: 'READY', reqs: [] },
      { type: 'INTERVIEW', title: 'Technical Interview', status: 'LOCKED', reqs: [] },
      { type: 'INTERVIEW', title: 'HR & Behavioral', status: 'LOCKED', reqs: [] }
    ]
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-indigo-100 rounded-xl">
          <Activity className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment Simulations</h1>
          <p className="text-muted-foreground mt-1">End-to-end multi-round hiring journeys.</p>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
              Active Simulation: {mockSimulation.role}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {mockSimulation.rounds.map((round, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg bg-white relative">
                  <div className="flex-shrink-0">
                    {round.status === 'COMPLETED' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                    {round.status === 'UNAVAILABLE' && <AlertTriangle className="w-6 h-6 text-yellow-500" />}
                    {round.status === 'LOCKED' && <Lock className="w-6 h-6 text-slate-300" />}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{round.title}</h4>
                    <p className="text-sm text-slate-500 capitalize">{round.type.toLowerCase()} Round</p>
                    
                    {round.status === 'UNAVAILABLE' && (
                      <p className="text-xs text-yellow-600 mt-1">Missing dependency: {round.reqs?.join(', ')}</p>
                    )}
                  </div>
                  
                  <div>
                    {round.status === 'COMPLETED' && <span className="text-sm font-bold text-slate-700">{round.score}%</span>}
                    {round.status === 'READY' && <Button size="sm"><Play className="w-4 h-4 mr-1"/> Start</Button>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
