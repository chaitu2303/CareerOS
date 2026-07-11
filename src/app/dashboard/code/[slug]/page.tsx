'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Play, Send, Layout, Info, AlertTriangle } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function CodingWorkspace() {
  const { slug } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/code/problems/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProblem(data.problem);
        // Load default template if available
        const defaultLang = data.problem.languages?.[0]?.language || 'javascript';
        setLanguage(defaultLang);
        const template = data.problem.templates?.find((t: any) => t.language === defaultLang);
        if (template) setCode(template.code);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleLanguageChange = (val: string) => {
    setLanguage(val);
    const template = problem?.templates?.find((t: any) => t.language === val);
    if (template) setCode(template.code);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/code/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          language,
          code
        })
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error(err);
      setResult({ status: 'INTERNAL_ERROR', message: 'Failed to connect to execution service.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!problem) {
    return <div className="p-8 text-center text-red-500">Problem not found.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      {/* Left Panel: Description */}
      <div className="w-full md:w-1/2 p-4 flex flex-col h-full overflow-y-auto border-r border-slate-200 bg-white shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
            problem.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
            problem.difficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            {problem.difficulty}
          </span>
        </div>

        <Tabs defaultValue="description" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start border-b rounded-none px-0 h-10 bg-transparent">
            <TabsTrigger value="description" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none px-4">Description</TabsTrigger>
            <TabsTrigger value="submissions" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none px-4">Submissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="flex-1 overflow-y-auto py-4 pr-2">
            <div className="prose prose-slate max-w-none prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: problem.description }} />
            
            {problem.examples?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Examples</h3>
                {problem.examples.map((ex: any, i: number) => (
                  <div key={ex.id} className="mb-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="font-semibold text-sm mb-2 text-slate-500">Example {i + 1}</p>
                    <div className="mb-2"><strong>Input:</strong> <code className="bg-slate-200 px-1 py-0.5 rounded">{ex.input}</code></div>
                    <div className="mb-2"><strong>Output:</strong> <code className="bg-slate-200 px-1 py-0.5 rounded">{ex.output}</code></div>
                    {ex.explanation && <div><strong>Explanation:</strong> {ex.explanation}</div>}
                  </div>
                ))}
              </div>
            )}

            {problem.constraints?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Constraints</h3>
                <ul className="list-disc pl-5 space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {problem.constraints.map((c: any) => (
                    <li key={c.id}><code>{c.content}</code></li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="submissions" className="p-4">
            <div className="text-center text-muted-foreground py-8">
              Submission history will appear here.
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel: Code Editor */}
      <div className="w-full md:w-1/2 flex flex-col h-full bg-slate-900">
        <div className="flex items-center justify-between p-2 bg-slate-800 border-b border-slate-700">
          <Select value={language} onValueChange={(val: string | null) => { if (val) setLanguage(val); }}>
            <SelectTrigger className="w-[180px] h-8 bg-slate-700 text-slate-100 border-slate-600">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {problem.languages?.map((lang: any) => (
                <SelectItem key={lang.id} value={lang.language}>
                  {lang.language.charAt(0).toUpperCase() + lang.language.slice(1)}
                </SelectItem>
              ))}
              {(!problem.languages || problem.languages.length === 0) && (
                <>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" className="h-8 bg-slate-700 text-slate-200 hover:bg-slate-600 border-0" disabled={submitting}>
              <Play className="w-4 h-4 mr-2" /> Run
            </Button>
            <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white border-0" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />} Submit
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Execution Result Panel */}
        <div className={`h-1/3 bg-slate-800 border-t border-slate-700 transition-all duration-300 flex flex-col ${result ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-between p-2 border-b border-slate-700 bg-slate-900">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Test Results</span>
            <Button variant="ghost" size="sm" className="h-6 text-slate-400 hover:text-white" onClick={() => setResult(null)}>Close</Button>
          </div>
          <div className="p-4 overflow-y-auto flex-1 text-slate-300 font-mono text-sm">
            {result?.status === 'INTERNAL_ERROR' ? (
              <div className="flex flex-col items-center justify-center h-full text-amber-500">
                <AlertTriangle className="w-8 h-8 mb-2" />
                <p className="text-center max-w-md">{result.errorOutput || result.message}</p>
              </div>
            ) : result?.status === 'ACCEPTED' ? (
              <div className="text-green-500 font-bold text-lg mb-2">Accepted</div>
            ) : (
              <div className="text-red-500 font-bold text-lg mb-2">{result?.status}</div>
            )}
            
            {result?.result && (
              <div className="space-y-1 mt-4 text-slate-400">
                <div>Tests Passed: {result.result.testsPassed} / {result.result.testsTotal}</div>
                <div>Runtime: {result.result.executionMs} ms</div>
                <div>Memory: {result.result.memoryUsedKb} KB</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
