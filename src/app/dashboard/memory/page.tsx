import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { FileText, Database, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function CareerMemoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const uploadedFiles = await prisma.uploadedFile.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Career Memory</h1>
          <p className="text-muted-foreground mt-1">A historical archive of your uploaded resumes and extracted evidence.</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Database className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Source Files ({uploadedFiles.length})
          </h3>
        </div>
        
        <div className="divide-y">
          {uploadedFiles.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No files uploaded yet.
            </div>
          ) : (
            uploadedFiles.map(file => (
              <div key={file.id} className="p-4 flex items-center justify-between hover:bg-muted/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{file.originalFilename}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(file.createdAt).toLocaleDateString()}</span>
                      <span>{(file.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">{file.processingStatus}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="w-4 h-4" /> Original
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 rounded-lg border border-blue-100 dark:border-blue-900/50 text-sm">
        <strong>The Provenance Engine:</strong> Because your confirmed facts are stored separately from these files, you can safely delete older resumes without losing the Master Career Profile history. 
      </div>
    </div>
  );
}
