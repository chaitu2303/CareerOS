'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Copy, ArrowRight, Clock, Briefcase, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // In a real Server Component we'd fetch directly via prisma.
    // For this client component we can just use an API or just mock it, but actually the original was a server component.
    // Let me rewrite this back as a Server component but with a client wrapper for the upload?
    // Let me just stick to Client Component and fetch data to make upload handling easier.
    fetch('/api/resumes')
      .then(r => r.json())
      .then(data => {
        setResumes(data.resumes || []);
        setHasProfile(data.hasProfile || false);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/resumes/${data.resumeId}`);
      } else {
        alert(data.error || 'Upload failed');
        setUploading(false);
      }
    } catch (err) {
      alert('Network error');
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 h-full flex flex-col min-h-[calc(100vh-4rem)] bg-[#faf8f5] text-black">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b-8 border-black pb-8 shrink-0">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Resume Studio</h1>
          <p className="font-bold text-lg mt-1 bg-[#ff90e8] text-black inline-block px-2 border-2 border-black -rotate-1">Build, tailor, and export professional resumes.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {hasProfile && (
            <Link href="/dashboard/resumes/new?mode=FROM_PROFILE" className="h-12 px-6 flex items-center justify-center border-4 border-black bg-[#90c0ff] hover:bg-[#70aaff] text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all">
              <Copy className="w-5 h-5 mr-2" /> From Profile
            </Link>
          )}
          <Link href="/dashboard/resumes/new?mode=BLANK" className="h-12 px-6 flex items-center justify-center border-4 border-black bg-white hover:bg-slate-100 text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all">
            <Plus className="w-5 h-5 mr-2" /> Blank Resume
          </Link>
        </div>
      </div>

      <div className="mb-12 relative overflow-hidden bg-[#abf5d1] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6 group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-transform">
        <div className="absolute top-0 right-0 bg-black text-white font-black uppercase px-4 py-2 text-xs border-b-4 border-l-4 border-black">Import</div>
        <div className="flex items-center gap-6 z-10">
          <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Upload Existing Resume</h2>
            <p className="font-bold opacity-80 uppercase tracking-widest mt-1">PDF format. We'll parse it instantly.</p>
          </div>
        </div>
        
        <div className="relative z-10 w-full md:w-auto">
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <button disabled={uploading} className="w-full md:w-auto h-14 px-8 border-4 border-black bg-[#ffe500] text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-black group-hover:text-[#ffe500] transition-colors flex items-center justify-center pointer-events-none">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <ArrowRight className="w-6 h-6 mr-2" />}
            {uploading ? 'Extracting...' : 'Select File'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resumes.map((resume: any, idx: number) => {
          const latestVersion = resume.versions?.[0];
          const colors = ['bg-[#ff90e8]', 'bg-[#90c0ff]', 'bg-[#ffe500]', 'bg-[#ff4040]', 'bg-[#abf5d1]'];
          const color = colors[idx % colors.length];
          return (
            <Link
              key={resume.id}
              href={`/dashboard/resumes/${resume.id}`}
              className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-transform min-h-[260px] relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-3 mb-6 relative z-10">
                <div className={`w-14 h-14 border-4 border-black flex items-center justify-center rotate-3 group-hover:-rotate-3 transition-transform ${color}`}>
                  <FileText className="w-7 h-7 text-black" />
                </div>
                {resume.atsScore != null && (
                  <div className="bg-black text-white px-3 py-1 font-black uppercase tracking-widest text-xs border-2 border-black">
                    ATS {resume.atsScore}
                  </div>
                )}
              </div>
              
              <h3 className="font-black text-2xl uppercase leading-tight mb-4 relative z-10 line-clamp-2">
                {resume.title}
              </h3>
              
              <div className="flex flex-col gap-2 mt-auto relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black text-white px-2 py-1 self-start">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </div>
                {latestVersion?.tailoredForJob && (
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-[#ff4040] text-white px-2 py-1 self-start border-2 border-black">
                    <Briefcase className="w-3.5 h-3.5" />
                    AI Tailored
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
