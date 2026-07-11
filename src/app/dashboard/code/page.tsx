'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Code2, CheckCircle2, Circle, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function CodingArenaHub() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/code/problems')
      .then(res => res.json())
      .then(data => {
        setProblems(data.problems || []);
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
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Code2 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coding Arena</h1>
          <p className="text-muted-foreground mt-1">Master algorithms, data structures, and system design.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main List */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Problem Library</h2>
          {problems.map(problem => {
            const isSolved = problem.progress?.[0]?.status === 'SOLVED';
            const isAttempted = problem.progress?.[0]?.status === 'ATTEMPTED';
            
            return (
              <Card key={problem.id} className="hover:border-blue-300 transition-colors">
                <div className="flex items-center p-4">
                  <div className="mr-4">
                    {isSolved ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : isAttempted ? (
                      <Circle className="w-6 h-6 text-amber-500 fill-amber-50" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-200" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <Link href={`/dashboard/code/${problem.slug}`} className="hover:underline">
                      <h3 className="font-semibold text-lg">{problem.title}</h3>
                    </Link>
                    <div className="flex items-center mt-1 space-x-2 text-xs">
                      <Badge variant={problem.difficulty === 'EASY' ? 'secondary' : problem.difficulty === 'MEDIUM' ? 'default' : 'destructive'}>
                        {problem.difficulty}
                      </Badge>
                      <span className="text-muted-foreground">{problem.topic}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Link href={`/dashboard/code/${problem.slug}`}>
                      <Button variant={isSolved ? 'outline' : 'default'} size="sm">
                        {isSolved ? 'Review' : 'Solve'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
          
          {problems.length === 0 && (
            <div className="py-12 text-center text-muted-foreground border rounded-lg bg-slate-50">
              No problems published yet.
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
                <Trophy className="w-4 h-4 mr-2" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {problems.filter(p => p.progress?.[0]?.status === 'SOLVED').length}
                <span className="text-sm text-muted-foreground font-normal ml-1">/ {problems.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Problems Solved</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
