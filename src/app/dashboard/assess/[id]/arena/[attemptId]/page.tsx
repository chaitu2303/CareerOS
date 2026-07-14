'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, CheckCircle2, Circle, AlertCircle, Flag, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AssessmentArenaWorkspace() {
  const params = useParams();
  const router = useRouter();
  
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State for attempt and answers
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  
  // Navigation state
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const modeRef = useRef('PRACTICE');

  useEffect(() => {
    fetch(`/api/assessments/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setAssessment(data.assessment);
        modeRef.current = data.assessment.mode || 'PRACTICE';
        if (data.assessment.durationMinutes && modeRef.current !== 'PRACTICE') {
          setTimeLeft(data.assessment.durationMinutes * 60);
        }
        setLoading(false);
      })
      .catch(console.error);
  }, [params.id]);

  const [securityEvents, setSecurityEvents] = useState<any[]>([]);

  const logSecurityEvent = (type: string) => {
    setSecurityEvents(prev => [...prev, { type, timestamp: new Date().toISOString() }]);
    toast.warning(`Security Alert: ${type.replace('_', ' ')} detected.`);
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      const payloadAnswers = Object.keys(answers).map(qId => ({
        questionId: qId,
        answer: answers[qId],
        isMarkedForReview: !!markedForReview[qId],
        timeTakenSeconds: 0 // advanced tracking can be added
      }));

      await fetch(`/api/assessments/${params.id}/attempt/${params.attemptId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payloadAnswers })
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await saveProgress();
    
    try {
      const payloadAnswers = Object.keys(answers).map(qId => ({
        questionId: qId,
        answer: answers[qId],
        isMarkedForReview: !!markedForReview[qId],
        timeTakenSeconds: 0
      }));

      const res = await fetch(`/api/assessments/${params.id}/attempt/${params.attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payloadAnswers, securityEvents })
      });
      const data = await res.json();
      
      if (data.success) {
        router.push(`/dashboard/assess/${params.id}/results/${params.attemptId}`);
      } else {
        toast.error('Failed to submit. Please try again.');
        setSubmitting(false);
      }
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev !== null && prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Security logging for STRICT mode
  useEffect(() => {
    if (modeRef.current !== 'STRICT') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSecurityEvent('TAB_SWITCH');
      }
    };
    const handleBlur = () => logSecurityEvent('FOCUS_LOSS');
    const handlePaste = (e: ClipboardEvent) => logSecurityEvent('PASTE');

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('paste', handlePaste);
    };
  }, []);


  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const toggleMarkForReview = (questionId: string) => {
    setMarkedForReview(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };


  if (loading || !assessment) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentSection = assessment.sections[currentSectionIdx];
  const currentQuestion = currentSection.questions[currentQuestionIdx];
  const isAnswered = !!answers[currentQuestion.id];
  const isMarked = !!markedForReview[currentQuestion.id];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="font-semibold">{assessment.title}</h1>
          <p className="text-xs text-muted-foreground">{currentSection.title}</p>
        </div>
        
        <div className="flex items-center space-x-6">
          {saving && <span className="text-xs text-muted-foreground flex items-center"><Save className="w-3 h-3 mr-1 animate-pulse" /> Saving...</span>}
          
          {timeLeft !== null && (
            <div className={`flex items-center space-x-2 font-mono text-lg ${timeLeft < 300 ? 'text-red-600 font-bold' : ''}`}>
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
          
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Submit Assessment'}
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Question Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Question {currentQuestionIdx + 1}</h2>
              <Button 
                variant="outline" 
                size="sm" 
                className={isMarked ? "bg-amber-50 text-amber-600 border-amber-200" : ""}
                onClick={() => toggleMarkForReview(currentQuestion.id)}
              >
                <Flag className="w-4 h-4 mr-2" />
                {isMarked ? 'Marked for Review' : 'Mark for Review'}
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-xl border shadow-sm mb-6">
              <div className="text-lg mb-6 whitespace-pre-wrap">{currentQuestion.questionText}</div>
              
              {currentQuestion.type === 'MCQ' && (
                <div className="space-y-3">
                  {currentQuestion.options.map((opt: any) => (
                    <div 
                      key={opt.id}
                      onClick={() => handleAnswerSelect(currentQuestion.id, opt.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center space-x-3
                        ${answers[currentQuestion.id] === opt.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                    >
                      {answers[currentQuestion.id] === opt.id ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                      <span>{opt.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Footer Controls */}
          <div className="bg-white border-t p-4 flex justify-between items-center mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            
            <Button 
              onClick={() => setCurrentQuestionIdx(prev => Math.min(currentSection.questions.length - 1, prev + 1))}
              disabled={currentQuestionIdx === currentSection.questions.length - 1}
            >
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Right: Navigator */}
        <div className="w-64 bg-white border-l flex flex-col overflow-y-auto">
          <div className="p-4 border-b bg-slate-50 font-medium">Question Navigator</div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              {currentSection.questions.map((q: any, i: number) => {
                const isCurrent = i === currentQuestionIdx;
                const answered = !!answers[q.id];
                const marked = !!markedForReview[q.id];
                
                let bgClass = "bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200";
                if (answered) bgClass = "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
                if (marked) bgClass = "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200";
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(i)}
                    className={`h-10 w-10 rounded-md border flex items-center justify-center text-sm font-medium transition-all
                      ${bgClass}
                      ${isCurrent ? 'ring-2 ring-black ring-offset-1' : ''}
                    `}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
