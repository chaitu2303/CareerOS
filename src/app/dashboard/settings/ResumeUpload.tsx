'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploaded(false);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    
    // Simulate upload delay for the demo
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
      toast.success('Master Resume uploaded and parsed successfully!');
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Master Resume</CardTitle>
        <CardDescription>Upload your master resume. We will parse it and use it as a baseline for ATS and Applications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
          {!uploaded ? (
            <>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium mb-1">Click or drag file to this area to upload</p>
              <p className="text-xs text-muted-foreground mb-4">Support for a single PDF or DOCX file.</p>
              
              <div className="relative">
                <input 
                  type="file" 
                  accept=".pdf,.docx,.doc" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline">Select File</Button>
              </div>

              {file && (
                <div className="mt-4 p-3 bg-white border rounded-md flex items-center gap-3 w-full max-w-xs">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div className="flex-1 truncate text-sm font-medium">{file.name}</div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-2" />
              <p className="font-semibold text-lg text-slate-800">Upload Complete</p>
              <p className="text-sm text-slate-500 mt-1">{file?.name} has been processed.</p>
              <Button variant="link" onClick={() => { setFile(null); setUploaded(false); }} className="mt-2">
                Upload a different file
              </Button>
            </div>
          )}
        </div>
        
        {!uploaded && (
          <Button 
            className="w-full" 
            disabled={!file || uploading} 
            onClick={handleUpload}
          >
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {uploading ? 'Parsing Resume...' : 'Upload & Parse Resume'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
