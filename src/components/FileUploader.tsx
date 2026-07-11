'use client';

import { useState } from 'react';
import { Upload, File as FileIcon, X, Loader2, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Button } from './ui/button';

interface FileUploaderProps {
  onExtractionComplete: (data: { parsedData: any; fileId: string }) => void;
}

export function FileUploader({ onExtractionComplete }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string>('');

  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setStatus('Authenticating...');

      const { data: { user } } = await supabase.auth.getUser();
      
      // If no user exists, we'd normally prompt login.
      // For this MVP onboarding step, we assume the user is signed in or anonymous session.
      if (!user) {
        setStatus('Error: Please sign in first.');
        setIsUploading(false);
        return;
      }

      setStatus('Uploading securely...');
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      setStatus('Extracting text on server...');
      
      // Call our secure extraction API
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath,
          originalFilename: file.name,
          mimeType: file.type,
          sizeBytes: file.size
        }),
      });

      if (!res.ok) {
        throw new Error('Extraction failed');
      }

      const data = await res.json();
      
      setStatus('Extraction complete! AI parsing next...');
      // In a full implementation, we'd then call the AI parsing endpoint.
      
      setTimeout(() => {
        onExtractionComplete(data);
      }, 1000);

    } catch (error) {
      console.error(error);
      setStatus('Error occurred during upload or extraction.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!file ? (
        <label className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
          <Upload className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="font-medium text-sm">Click to upload PDF or DOCX</p>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="border rounded-xl p-6 flex flex-col items-center">
          <div className="flex items-center gap-4 w-full mb-6 p-3 bg-muted/30 rounded-lg">
            <FileIcon className="w-8 h-8 text-primary" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            {!isUploading && (
              <button onClick={() => setFile(null)} className="p-2 hover:bg-muted rounded-full">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleUpload} 
            disabled={isUploading}
          >
            {isUploading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {status}</>
            ) : (
              'Process Resume'
            )}
          </Button>

          {status && !isUploading && status.includes('complete') && (
            <p className="text-sm text-green-600 mt-4 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" /> {status}
            </p>
          )}
          {status && !isUploading && status.includes('Error') && (
            <p className="text-sm text-destructive mt-4">{status}</p>
          )}
        </div>
      )}
    </div>
  );
}
