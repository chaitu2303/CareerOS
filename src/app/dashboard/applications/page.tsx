'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Kanban, List, Clock, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ApplicationTrackerHub() {
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE' | 'TIMELINE'>('KANBAN');

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
          {/* Mock Kanban Columns */}
          {['SAVED', 'PREPARING', 'APPLIED', 'INTERVIEW', 'OFFER'].map(status => (
            <div key={status} className="bg-slate-50 border rounded-lg min-w-[320px] p-4 flex flex-col">
              <h3 className="font-semibold text-slate-700 mb-4 flex justify-between items-center">
                {status}
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                  {status === 'APPLIED' ? 2 : 1}
                </span>
              </h3>
              
              <div className="flex-1 space-y-3">
                {status === 'APPLIED' && (
                  <Card className="shadow-sm border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-semibold">Software Engineer</h4>
                      <p className="text-sm text-slate-500">TechCorp Inc.</p>
                      <div className="mt-4 flex gap-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Applied 2d ago</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {status === 'PREPARING' && (
                  <Card className="shadow-sm border-l-4 border-l-yellow-500 cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-semibold">Frontend Developer</h4>
                      <p className="text-sm text-slate-500">DesignStudio</p>
                      <div className="mt-4 flex flex-col gap-2">
                        <p className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                          <strong>Next Action:</strong> Tailor your resume before applying.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ))}
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
