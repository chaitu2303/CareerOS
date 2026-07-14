'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle2, ChevronRight, Calculator, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    question: "If A completes a project in 20 days and B completes the same project in 30 days, how long will it take them to complete it together?",
    options: ["10 days", "12 days", "15 days", "25 days"],
    correct: 1,
    explanation: "A's 1 day work = 1/20. B's 1 day work = 1/30. Together 1 day work = 1/20 + 1/30 = 5/60 = 1/12. So they will finish in 12 days."
  },
  {
    question: "What comes next in the sequence: 2, 6, 12, 20, 30, ...?",
    options: ["40", "42", "48", "50"],
    correct: 1,
    explanation: "The differences are 4, 6, 8, 10. The next difference is 12. So 30 + 12 = 42."
  },
  {
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 meters", "180 meters", "150 meters", "200 meters"],
    correct: 2,
    explanation: "Speed = 60 * (5/18) = 50/3 m/s. Length = Speed * Time = (50/3) * 9 = 150 meters."
  }
];

export default function AptitudeTest() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleNext = () => {
    if (selected === questions[currentQ].correct) setScore(s => s + 1);
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-24 h-24 bg-[#ff90e8] border-4 border-black mx-auto mb-6 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-3">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black uppercase mb-4">Test Complete!</h1>
        <p className="text-2xl font-bold mb-8">You scored {score} out of {questions.length}</p>
        <Button onClick={() => window.location.href='/dashboard/assess'} className="h-14 px-8 rounded-none border-4 border-black bg-[#ffe500] hover:bg-[#ffe500]/80 text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Back to Arena
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-[#faf8f5] min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-8 border-black">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#90c0ff] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-3">
            <Calculator className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Aptitude Test</h1>
        </div>
        <div className="font-bold text-lg bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Question {currentQ + 1} / {questions.length}
        </div>
      </div>

      <Card className="rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
        <CardHeader className="bg-[#ffe500] border-b-4 border-black p-6">
          <CardTitle className="text-xl md:text-2xl font-black leading-tight">
            {questions[currentQ].question}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {questions[currentQ].options.map((opt, i) => (
              <button
                key={i}
                disabled={showExplanation}
                onClick={() => setSelected(i)}
                className={`w-full text-left p-4 border-4 border-black font-bold text-lg transition-all ${
                  selected === i 
                    ? showExplanation
                      ? i === questions[currentQ].correct 
                        ? 'bg-[#abf5d1]' 
                        : 'bg-[#ff4040] text-white'
                      : 'bg-black text-white translate-x-1 translate-y-1' 
                    : showExplanation && i === questions[currentQ].correct
                      ? 'bg-[#abf5d1]'
                      : 'bg-white hover:bg-slate-100'
                }`}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-4 bg-[#e8f0fe] border-4 border-black font-bold flex gap-3"
              >
                <Brain className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <p className="text-sm uppercase tracking-wider text-blue-600 mb-1">Explanation</p>
                  <p>{questions[currentQ].explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t-4 border-black p-6 flex justify-end">
          {!showExplanation ? (
            <Button 
              disabled={selected === null} 
              onClick={() => setShowExplanation(true)}
              className="h-14 px-8 rounded-none border-4 border-black bg-black text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Check Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              className="h-14 px-8 rounded-none border-4 border-black bg-[#90c0ff] hover:bg-[#70aaff] text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {currentQ < questions.length - 1 ? 'Next Question' : 'Finish Test'} <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
