'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function DomainDetailsHub() {
  const params = useParams();
  const slug = params.slug as string;
  const [domain, setDomain] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/domains/${slug}`)
      .then(res => res.json())
      .then(data => {
        setDomain(data.domain || null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
        <h2 className="text-xl font-bold">Domain not found</h2>
        <Link href="/dashboard/paths">
          <Button>Back to Paths</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{domain.name}</h1>
        <p className="text-muted-foreground mt-1">{domain.description}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Roles & Career Paths</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {domain.roles?.map((role: any) => (
          <Card key={role.id} className="hover:border-indigo-300 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-indigo-500" />
                {role.title}
              </CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider flex items-center">
                <GraduationCap className="w-4 h-4 mr-1" /> Core Competencies
              </h4>
              <ul className="space-y-1">
                {role.competencies?.map((comp: any, idx: number) => (
                  <li key={idx} className="text-sm text-slate-700 list-disc list-inside">
                    {comp.competencyId || JSON.stringify(comp)}
                  </li>
                ))}
                {(!role.competencies || role.competencies.length === 0) && (
                  <li className="text-sm text-slate-400 italic">Competencies mapping pending</li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
        {domain.roles?.length === 0 && (
          <div className="py-8 text-muted-foreground">
            No roles mapped to this domain yet.
          </div>
        )}
      </div>
    </div>
  );
}
