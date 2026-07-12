'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Save, Plus, FileText, Clock, Bell } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/applications/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setApp(data.application);
        setNotes(data.application?.notes || '');
        setLoading(false);
      })
      .catch(console.error);
  }, [params.id]);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await fetch(`/api/applications/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      // Optionally show toast
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!app) return <div>Application not found</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <Link href="/dashboard/applications" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tracker
      </Link>
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{app.roleTitle}</h1>
          <p className="text-lg text-muted-foreground">{app.company}</p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-lg border font-medium">
          Status: {app.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Notes & Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add preparation notes, interview questions, or strategic points here..."
                className="w-full h-48 p-4 rounded-xl border bg-slate-50 focus:bg-white resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveNotes} disabled={saving} size="sm">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline & History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-slate-900">Application Created</div>
                      <time className="font-mono text-xs text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</time>
                    </div>
                    <div className="text-slate-500 text-sm">Status set to {app.status}</div>
                  </div>
                </div>
                {/* Future implementation of dynamic history mapping */}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4" /> Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                No active reminders.
                <Button variant="link" className="block mx-auto mt-2 h-auto p-0">Add Reminder</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" /> Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {app.resumeId ? (
                  <div className="flex items-center gap-2 text-sm border p-3 rounded-lg">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="truncate flex-1">Tailored Resume</span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                    No documents attached.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
