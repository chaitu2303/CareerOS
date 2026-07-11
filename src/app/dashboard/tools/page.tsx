'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileImage, FileText, Download, Scissors, RefreshCw, Upload, ShieldCheck } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function UtilityStudio() {
  const [activeTab, setActiveTab] = useState<'PDF' | 'IMAGE' | 'PHOTO'>('PDF');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setResultUrl(null);
      setLogs([]);
    }
  };

  const log = (msg: string) => setLogs(prev => [...prev, msg]);

  const mergePdfs = async () => {
    if (selectedFiles.length < 2) return alert('Select at least 2 PDF files to merge.');
    setProcessing(true);
    try {
      log('Starting local browser-side PDF merge...');
      const mergedPdf = await PDFDocument.create();
      
      for (const file of selectedFiles) {
        log(`Loading ${file.name}...`);
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      log('Serializing merged PDF...');
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      log('Merge complete. Ready for download.');
    } catch (err) {
      log('Error during merge.');
      console.error(err);
    }
    setProcessing(false);
  };

  const convertImageToWebp = async () => {
    if (selectedFiles.length === 0) return alert('Select an image.');
    setProcessing(true);
    try {
      const file = selectedFiles[0];
      log(`Loading image ${file.name} into local canvas...`);
      const imgUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = imgUrl;
      await new Promise(resolve => img.onload = resolve);
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(img, 0, 0);

      log('Compressing to WebP format (0.8 quality)...');
      canvas.toBlob(blob => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setResultUrl(url);
          log(`Converted successfully. Output size: ${(blob.size / 1024).toFixed(1)} KB`);
        }
        setProcessing(false);
      }, 'image/webp', 0.8);
    } catch (err) {
      log('Error during conversion.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">CareerOS Utility Studio</h1>
        <p className="text-slate-500 mt-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          Privacy-First Processing: Most tools run entirely in your local browser without uploading files to our servers.
        </p>
      </div>

      <div className="flex gap-4 border-b mb-8">
        <button 
          className={`pb-4 px-4 font-medium text-sm transition-colors ${activeTab === 'PDF' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}
          onClick={() => setActiveTab('PDF')}
        >
          <div className="flex items-center gap-2"><FileText className="w-4 h-4"/> PDF Tools</div>
        </button>
        <button 
          className={`pb-4 px-4 font-medium text-sm transition-colors ${activeTab === 'IMAGE' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}
          onClick={() => setActiveTab('IMAGE')}
        >
          <div className="flex items-center gap-2"><FileImage className="w-4 h-4"/> Image & Photo Tools</div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg">Workspace</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border-2 border-dashed rounded-lg p-12 text-center flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
              <Upload className="w-12 h-12 text-slate-400 mb-4" />
              <p className="text-slate-600 font-medium mb-4">Drag and drop files, or click to browse</p>
              <Input type="file" multiple onChange={handleFileChange} className="max-w-xs cursor-pointer" />
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-slate-800">Selected Files ({selectedFiles.length})</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  {selectedFiles.map(f => (
                    <li key={f.name}>{f.name} ({(f.size / 1024).toFixed(1)} KB)</li>
                  ))}
                </ul>
                
                <div className="flex gap-4 pt-4">
                  {activeTab === 'PDF' && (
                    <Button onClick={mergePdfs} disabled={processing} className="flex items-center gap-2">
                      <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
                      Merge PDFs Locally
                    </Button>
                  )}
                  {activeTab === 'IMAGE' && (
                    <Button onClick={convertImageToWebp} disabled={processing} className="flex items-center gap-2">
                      <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
                      Convert to WebP & Compress
                    </Button>
                  )}
                </div>
              </div>
            )}

            {resultUrl && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-900">Processing Complete</h3>
                  <p className="text-sm text-green-700 mt-1">Your file is ready securely.</p>
                </div>
                <a href={resultUrl} download={`processed_output.${activeTab === 'PDF' ? 'pdf' : 'webp'}`}>
                  <Button variant="outline" className="flex items-center gap-2 border-green-600 text-green-700 hover:bg-green-100">
                    <Download className="w-4 h-4" /> Download File
                  </Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg">Processing Log</CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-slate-900 text-green-400 font-mono text-xs min-h-[300px] overflow-y-auto">
            {logs.length === 0 && <span className="text-slate-500">Waiting for local operations...</span>}
            {logs.map((log, i) => (
              <div key={i}>{'>'} {log}</div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
