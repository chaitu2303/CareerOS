'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlayCircle, Clock, BookOpen, Target, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Calculator } from 'lucide-react';

export default function AssessmentArena() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userDomain, setUserDomain] = useState<string>('General');

  useEffect(() => {
    fetch('/api/assessments')
      .then(res => res.json())
      .then(data => {
        let sortedAssessments = data.assessments || [];
        if (data.userDomain && data.userDomain !== 'General') {
          sortedAssessments.sort((a: any, b: any) => {
            const aMatch = a.domain === data.userDomain || a.department === data.userDomain ? 1 : 0;
            const bMatch = b.domain === data.userDomain || b.department === data.userDomain ? 1 : 0;
            return bMatch - aMatch;
          });
          setUserDomain(data.userDomain);
        }
        setAssessments(sortedAssessments);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-xl">
          <BrainCircuit className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessment Arena</h1>
          <p className="text-muted-foreground mt-1">Practice, test, and prove your skills in {userDomain === 'swe' ? 'Software Engineering' : userDomain} to earn badges.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Static Assessments */}
        <Card className="flex flex-col hover:border-black transition-colors cursor-pointer border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white rounded-none">
          <CardHeader className="bg-[#ffe500] border-b-4 border-black pb-4">
            <div className="flex justify-between items-start mb-2">
              <Badge className="bg-black text-white hover:bg-black rounded-none uppercase font-black text-xs">EASY</Badge>
              <Badge className="bg-white text-black border-2 border-black rounded-none uppercase font-black text-xs">GENERAL</Badge>
            </div>
            <CardTitle className="text-xl font-black uppercase flex items-center gap-2"><Calculator className="w-5 h-5"/> Aptitude Test</CardTitle>
            <CardDescription className="line-clamp-2 font-bold text-black/70">Test your logical and quantitative reasoning skills.</CardDescription>
          </CardHeader>
          <CardFooter className="p-0 border-t-0 mt-auto">
            <Link href="/dashboard/assess/aptitude" className="w-full">
              <Button className="w-full h-12 gap-2 rounded-none border-t-4 border-black bg-white hover:bg-black text-black hover:text-white font-black uppercase transition-colors">
                <PlayCircle className="w-4 h-4" /> Start Test
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col hover:border-black transition-colors cursor-pointer border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white rounded-none">
          <CardHeader className="bg-[#90c0ff] border-b-4 border-black pb-4">
            <div className="flex justify-between items-start mb-2">
              <Badge className="bg-black text-white hover:bg-black rounded-none uppercase font-black text-xs">DYNAMIC</Badge>
              <Badge className="bg-white text-black border-2 border-black rounded-none uppercase font-black text-xs">SKILL</Badge>
            </div>
            <CardTitle className="text-xl font-black uppercase flex items-center gap-2"><Keyboard className="w-5 h-5"/> Typing Test</CardTitle>
            <CardDescription className="line-clamp-2 font-bold text-black/70">Measure your typing speed (WPM) and accuracy.</CardDescription>
          </CardHeader>
          <CardFooter className="p-0 border-t-0 mt-auto">
            <Link href="/dashboard/assess/typing" className="w-full">
              <Button className="w-full h-12 gap-2 rounded-none border-t-4 border-black bg-white hover:bg-black text-black hover:text-white font-black uppercase transition-colors">
                <PlayCircle className="w-4 h-4" /> Start Test
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {assessments.map(assessment => (
          <Card key={assessment.id} className="flex flex-col hover:border-blue-300 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant={assessment.difficulty === 'EASY' ? 'secondary' : assessment.difficulty === 'MEDIUM' ? 'default' : 'destructive'}>
                  {assessment.difficulty}
                </Badge>
                <Badge variant="outline">{assessment.department}</Badge>
              </div>
              <CardTitle className="text-xl">{assessment.title}</CardTitle>
              <CardDescription className="line-clamp-2">{assessment.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>{assessment.domain}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{assessment.durationMinutes ? `${assessment.durationMinutes} Minutes` : 'Untimed'}</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  <span>{assessment.topicCoverage?.length || 0} Topics</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Link href={`/dashboard/assess/${assessment.id}`} className="w-full">
                <Button className="w-full gap-2">
                  <PlayCircle className="w-4 h-4" /> Start Assessment
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        {assessments.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No assessments available at the moment. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
