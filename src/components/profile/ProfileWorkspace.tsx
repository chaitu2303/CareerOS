'use client';

import { useState } from 'react';
import { UserCircle, Briefcase, GraduationCap, Code, Upload, Search, Filter, AlertTriangle, Archive, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Detailed interfaces to match Prisma schema with included provenance
export interface FactProvenance {
  confidence?: number | null;
  sourceText?: string | null;
  extractionMethod: string;
}

export interface CareerFact {
  id: string;
  status: string;
  provenance?: FactProvenance | null;
  [key: string]: any;
}

export interface ProfileWorkspaceProps {
  initialProfile: {
    id: string;
    completenessScore: number;
    basics?: CareerFact | null;
    skills: CareerFact[];
    experiences: CareerFact[];
    educations: CareerFact[];
    projects: CareerFact[];
    certifications: CareerFact[];
  };
}

export function ProfileWorkspace({ initialProfile }: ProfileWorkspaceProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (type: string, id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      await fetch('/api/profile/facts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, data: { status: newStatus } })
      });
      router.refresh();
      // Optimistic UI update could go here, but router.refresh is safer for server components
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    setIsUpdating(true);
    try {
      await fetch(`/api/profile/facts?type=${type}&id=${id}`, { method: 'DELETE' });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Filter facts based on search term
  const filterFacts = (facts: CareerFact[], keys: string[]) => {
    if (!searchTerm) return facts;
    const term = searchTerm.toLowerCase();
    return facts.filter(fact => 
      keys.some(key => fact[key] && String(fact[key]).toLowerCase().includes(term))
    );
  };

  const activeSkills = filterFacts(profile.skills.filter(s => s.status !== 'ARCHIVED'), ['name']);
  const activeExp = filterFacts(profile.experiences.filter(e => e.status !== 'ARCHIVED'), ['role', 'company', 'description']);
  const activeEdu = filterFacts(profile.educations.filter(e => e.status !== 'ARCHIVED'), ['degree', 'institution']);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Header & Global Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Career Workspace</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your canonical Master Career Profile.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search facts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-card border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <Link href="/onboarding">
            <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap">
              <Upload className="w-4 h-4" /> Add Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* Completeness & Stats */}
      <div className="bg-card border rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-semibold mb-1">Profile Readiness</h2>
          <p className="text-sm text-muted-foreground">Your profile is {profile.completenessScore}% complete.</p>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
           {/* In a real app we'd use SVG circle for progress */}
           <span className="font-bold text-primary">{profile.completenessScore}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-1">
          {/* Basics */}
          <div className="bg-card border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2"><UserCircle className="w-4 h-4 text-primary" /> Basics</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
            </div>
            {profile.basics && profile.basics.status !== 'ARCHIVED' ? (
              <div className="space-y-3 text-sm">
                <div><span className="text-muted-foreground text-xs block">Name</span>{profile.basics.name}</div>
                <div><span className="text-muted-foreground text-xs block">Email</span>{profile.basics.email}</div>
                <div><span className="text-muted-foreground text-xs block">Location</span>{profile.basics.location}</div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No basic info.</p>
            )}
          </div>

          {/* Skills */}
          <div className="bg-card border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2"><Code className="w-4 h-4 text-primary" /> Skills</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeSkills.map((skill) => (
                <div key={skill.id} className="group relative flex items-center px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md cursor-pointer hover:bg-primary/20 transition-colors">
                  {skill.name}
                  {skill.status === 'CONFLICTED' && <AlertTriangle className="w-3 h-3 ml-1 text-orange-500" />}
                </div>
              ))}
              {activeSkills.length === 0 && <p className="text-xs text-muted-foreground">No matching skills.</p>}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Experience */}
          <div className="bg-card border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> Experience</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">Add New</Button>
            </div>
            <div className="space-y-4">
              {activeExp.map((exp) => (
                <div key={exp.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors relative group">
                  {exp.status === 'CONFLICTED' && (
                    <div className="absolute -top-2 -right-2 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200 flex items-center gap-1 shadow-sm">
                      <AlertTriangle className="w-3 h-3" /> Conflict Detected
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold">{exp.role}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{exp.duration}</span>
                  </div>
                  <p className="text-sm font-medium mb-2">{exp.company}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">{exp.description}</p>
                  
                  <div className="mt-4 pt-3 border-t flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-[10px] text-muted-foreground">
                      {exp.provenance ? `Extracted via ${exp.provenance.extractionMethod}` : 'Manually created'}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-6 text-[10px] px-2" disabled={isUpdating}>Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleStatusChange('experience', exp.id, 'ARCHIVED')} className="h-6 text-[10px] px-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50" disabled={isUpdating}><Archive className="w-3 h-3 mr-1" /> Archive</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete('experience', exp.id)} className="h-6 text-[10px] px-2 text-red-500 hover:text-red-600 hover:bg-red-50" disabled={isUpdating}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                </div>
              ))}
              {activeExp.length === 0 && <p className="text-sm text-muted-foreground">No experience found.</p>}
            </div>
          </div>

          {/* Education */}
          <div className="bg-card border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" /> Education</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">Add New</Button>
            </div>
            <div className="space-y-3">
              {activeEdu.map((edu) => (
                <div key={edu.id} className="p-3 border rounded-lg flex justify-between items-center group">
                  <div>
                    <h4 className="font-semibold text-sm">{edu.degree}</h4>
                    <p className="text-xs text-muted-foreground">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded">{edu.year}</span>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1.5" disabled={isUpdating}>Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleStatusChange('education', edu.id, 'ARCHIVED')} className="h-5 text-[10px] px-1.5 text-orange-500" disabled={isUpdating}>Arch</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete('education', edu.id)} className="h-5 text-[10px] px-1.5 text-red-500" disabled={isUpdating}>Del</Button>
                    </div>
                  </div>
                </div>
              ))}
              {activeEdu.length === 0 && <p className="text-sm text-muted-foreground">No education found.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
