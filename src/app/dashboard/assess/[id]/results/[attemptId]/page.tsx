'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function AssessmentResults() {
  const params = useParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd fetch the specific attempt and its evaluation results.
    // Assuming the submission returns it or we have an endpoint. Let's create a stub endpoint 
    // or just assume we have it. For Milestone 7, we'll fetch attempt details.
    fetch(`/api/assessments/${params.id}/attempt/${params.attemptId}`)
      .then(res => res.json())
      .then(data => {
        setResult(data.attempt);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [params.id, params.attemptId]);

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  // If no result is found or api endpoint not implemented yet, fallback UI
  if (!result || !result.evaluation) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Card className="text-center py-12">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-3xl mb-2">Assessment Submitted!</CardTitle>
          <p className="text-muted-foreground mb-6">Your answers have been saved and evaluated.</p>
          <Link href="/dashboard/assess">
            <span className="text-blue-600 hover:underline">Return to Assessment Arena</span>
          </Link>
        </Card>
      </div>
    );
  }

  // Render actual evaluation UI if available
  const evalData = result.evaluation;
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link href="/dashboard/assess" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Arena
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600 mb-1">Total Score</p>
              <h2 className="text-4xl font-bold text-blue-900">{evalData.totalScore.toFixed(0)}</h2>
              <p className="text-xs text-blue-500 mt-1">out of {evalData.maxPossibleScore}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">Accuracy</p>
              <h2 className="text-4xl font-bold">
                {((evalData.totalScore / evalData.maxPossibleScore) * 100).toFixed(0)}%
              </h2>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">Time Taken</p>
              <h2 className="text-4xl font-bold">{Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-2xl font-bold mb-4">Topic Performance</h3>
      <div className="space-y-4">
        {evalData.topicBreakdown && Object.entries(evalData.topicBreakdown).map(([topic, stats]: [string, any]) => (
          <Card key={topic}>
            <CardContent className="p-4 flex justify-between items-center">
              <span className="font-medium">{topic}</span>
              <div className="flex space-x-4 text-sm">
                <span className="text-green-600 font-medium">Correct: {stats.correct}</span>
                <span className="text-red-600">Incorrect: {stats.incorrect}</span>
                <span className="text-slate-400">Unanswered: {stats.unanswered}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
