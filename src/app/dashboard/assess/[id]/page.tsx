'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Play, ShieldAlert, Info } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AssessmentInstructions() {
  const params = useParams();
  const router = useRouter();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [mode, setMode] = useState<string>('PRACTICE');

  useEffect(() => {
    fetch(`/api/assessments/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setAssessment(data.assessment);
        if (data.assessment) {
          setMode(data.assessment.mode || 'PRACTICE');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  const handleStart = async () => {
    setStarting(true);
    try {
      const res = await fetch(`/api/assessments/${params.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
      const data = await res.json();
      if (data.attempt) {
        router.push(`/dashboard/assess/${params.id}/arena/${data.attempt.id}`);
      }
    } catch (e) {
      console.error(e);
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Assessment Not Found</h1>
        <Link href="/dashboard/assess">
          <Button className="mt-4" variant="outline">Back to Arena</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link href="/dashboard/assess" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Arena
      </Link>

      <Card>
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">{assessment.department} • {assessment.domain}</p>
              <CardTitle className="text-2xl">{assessment.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-2">Description</h3>
            <p className="text-muted-foreground">{assessment.description}</p>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-2">Instructions</h3>
            <p className="text-muted-foreground">{assessment.instructions || 'Follow the instructions provided within the assessment.'}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3 text-blue-900">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Details</p>
              <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                <li>Duration: {assessment.durationMinutes ? `${assessment.durationMinutes} minutes` : 'Untimed'}</li>
                <li>Difficulty: {assessment.difficulty}</li>
                <li>Topics: {assessment.topicCoverage.join(', ')}</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-3">Select Mode</h3>
            <Select value={mode} onValueChange={(val: string | null) => { if (val) setMode(val); }}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRACTICE">Practice Mode (Untimed, explanations)</SelectItem>
                <SelectItem value="TIMED">Timed Mode</SelectItem>
                <SelectItem value="STRICT">Strict Mode (Proctored, logged)</SelectItem>
              </SelectContent>
            </Select>
            
            {mode === 'STRICT' && (
              <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded flex items-start space-x-3 text-sm">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <p><strong>Strict Mode Enabled:</strong> Your session will be monitored. Tab switches and loss of focus will be logged for integrity review.</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t bg-slate-50 py-4 flex justify-end">
          <Button onClick={handleStart} disabled={starting} size="lg" className="w-full sm:w-auto">
            {starting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Start {mode.toLowerCase()} attempt
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
