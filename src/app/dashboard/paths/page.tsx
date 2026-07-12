'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Map, Compass, BookOpen, Briefcase, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function CareerPathsHub() {
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/domains')
      .then(res => res.json())
      .then(data => {
        setDomains(data.domains || []);
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
        <div className="p-3 bg-indigo-100 rounded-xl">
          <Map className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Career Paths</h1>
          <p className="text-muted-foreground mt-1">Explore domains, discover roles, and map your competencies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map(domain => (
          <Card key={domain.id} className="hover:border-indigo-300 transition-colors flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Compass className="w-5 h-5 mr-2 text-indigo-500" />
                {domain.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">{domain.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Top Roles</h4>
                  <ul className="space-y-2">
                    {domain.roles?.slice(0, 3).map((role: any) => (
                      <li key={role.id} className="flex items-center text-sm text-slate-700">
                        <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                        {role.title}
                      </li>
                    ))}
                    {domain.roles?.length === 0 && <li className="text-sm text-slate-400 italic">No roles mapped yet</li>}
                  </ul>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Link href={`/dashboard/paths/${domain.slug}`} className="w-full">
                <Button className="w-full" variant="outline">
                  Explore Domain
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
      
      {domains.length === 0 && (
        <div className="py-12 text-center text-muted-foreground border rounded-lg bg-slate-50 mt-8">
          No domain packs installed yet.
        </div>
      )}
    </div>
  );
}
