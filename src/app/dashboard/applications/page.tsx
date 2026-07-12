'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Kanban, List, Clock, Filter, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ApplicationTrackerHub() {
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE' | 'TIMELINE'>('KANBAN');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedApp, setDraggedApp] = useState<string | null>(null);

  const statuses = ['SAVED', 'PREPARING', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

  useEffect(() => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => {
        setApplications(data.applications || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    try {
      await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedApp(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (draggedApp) {
      updateStatus(draggedApp, status);
      setDraggedApp(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Tracker</h1>
          <p className="text-muted-foreground mt-1">Manage your complete job search pipeline.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex bg-slate-100 p-1 rounded-md">
            <Button 
              variant={viewMode === 'KANBAN' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('KANBAN')}
            >
              <Kanban className="w-4 h-4 mr-2" />
              Board
            </Button>
            <Button 
              variant={viewMode === 'TABLE' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('TABLE')}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button 
              variant={viewMode === 'TIMELINE' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('TIMELINE')}
            >
              <Clock className="w-4 h-4 mr-2" />
              Timeline
            </Button>
          </div>
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> New Application</Button>
        </div>
      </div>

      {viewMode === 'KANBAN' && (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {statuses.map(status => {
            const columnApps = applications.filter(app => app.status === status);
            return (
              <div 
                key={status} 
                className="bg-slate-50 border rounded-lg min-w-[320px] p-4 flex flex-col"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(status)}
              >
                <h3 className="font-semibold text-slate-700 mb-4 flex justify-between items-center">
                  {status}
                  <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                    {columnApps.length}
                  </span>
                </h3>
                
                <div className="flex-1 space-y-3 min-h-[100px]">
                  {columnApps.map(app => (
                    <Card 
                      key={app.id} 
                      className={`shadow-sm border-l-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                        status === 'APPLIED' ? 'border-l-blue-500' : 
                        status === 'PREPARING' ? 'border-l-yellow-500' : 
                        status === 'OFFER' ? 'border-l-green-500' : 
                        status === 'REJECTED' ? 'border-l-red-500' : 'border-l-slate-400'
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(app.id)}
                    >
                      <Link href={`/dashboard/applications/${app.id}`} className="block focus:outline-none">
                        <CardContent className="p-4 hover:bg-slate-50/50 transition-colors">
                          <h4 className="font-semibold">{app.roleTitle}</h4>
                          <p className="text-sm text-slate-500">{app.company}</p>
                          <div className="mt-4 flex gap-2">
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              Updated {new Date(app.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                  {columnApps.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground mt-8 opacity-50">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {viewMode !== 'KANBAN' && (
        <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg border border-dashed">
          <p className="text-slate-500">View mode {viewMode} is structurally supported via unified DB queries.</p>
        </div>
      )}
    </div>
  );
}

