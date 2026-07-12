'use client';

import { useState } from 'react';
import { Upload, File as FileIcon, X, Loader2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface FileUploaderProps {
  onExtractionComplete: (data: { parsedData: any; fileId: string }) => void;
}

export function FileUploader({ onExtractionComplete }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setStatus('Uploading and Extracting...');
      
      const formData = new FormData();
      formData.append('file', file);
      
      // Call our secure extraction API which handles upload and AI parsing
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Extraction failed (${res.status})`);
      }

      const data = await res.json();
      
      setStatus('Extraction complete! Loading verification...');
      
      setTimeout(() => {
        onExtractionComplete(data);
      }, 1000);

    } catch (error: any) {
      console.error(error);
      setStatus(error.message || 'Error occurred during upload or extraction.');
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
