'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Briefcase, ChevronRight, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FileUploader } from '@/components/FileUploader';
import { VerificationCard } from '@/components/VerificationCard';

import { ExtractedData } from '@/lib/types';

const steps = ['Welcome', 'Career Goal', 'Upload', 'Extract', 'Verify'];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [extractedFacts, setExtractedFacts] = useState<ExtractedData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handleFinishSetup = async () => {
    setIsSaving(true);
    try {
      // Force all items to USER_CONFIRMED if they just click "Confirm All"
      // In a real app we'd map over everything, but here we'll just save what we have.
      const res = await fetch('/api/profile/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facts: extractedFacts })
      });
      if (res.ok) {
        router.push('/dashboard');
      } else {
        console.error('Failed to save profile');
        setIsSaving(false);
      }
    } catch (e) {
      console.error(e);
      setIsSaving(false);
    }
  };

  const handleConfirmFact = (category: keyof ExtractedData, updated: any, index?: number) => {
    setExtractedFacts((prev: ExtractedData | null) => {
      if (!prev) return prev;
      const next: any = { ...prev };
      if (index !== undefined) {
        if (!next[category]) next[category] = [];
        next[category][index] = updated;
      } else {
        next[category] = updated;
      }
      return next as ExtractedData;
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-center px-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              idx <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {idx + 1}
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">{step}</span>
          </div>
        ))}
      </div>

      <div className="bg-card text-card-foreground shadow-sm rounded-xl border p-8 overflow-hidden min-h-[400px] flex flex-col relative">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center justify-center flex-1 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <UserCircle className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Welcome to CareerOS AI</h1>
              <p className="text-muted-foreground mb-8 max-w-md">
                Let&apos;s build your Master Career Profile. This will serve as the brain for your auto-tailored resumes, applications, and mock interviews.
              </p>
              <Button size="lg" onClick={handleNext} className="w-full max-w-xs">
                Get Started <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col flex-1"
            >
              <h2 className="text-2xl font-semibold mb-2">What is your target industry?</h2>
              <p className="text-muted-foreground mb-6">Select your primary focus area to help us tailor your experience.</p>
              <div className="grid grid-cols-2 gap-4 mb-auto">
                {['Software Engineering', 'Cybersecurity', 'AI / ML', 'Data Science', 'Product Management', 'Other'].map(industry => (
                  <button
                    key={industry}
                    className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left font-medium"
                    onClick={handleNext}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col flex-1"
            >
              <h2 className="text-2xl font-semibold mb-2 text-center">Upload your existing resume</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-sm mx-auto">We&apos;ll extract your skills, experience, and projects to build your Master Career Profile automatically.</p>
              
              <FileUploader onExtractionComplete={(data) => {
                setExtractedFacts(data.parsedData);
                handleNext();
              }} />
              
              <Button variant="ghost" className="mt-4 mx-auto block" onClick={handleNext}>Skip for now</Button>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center justify-center flex-1"
            >
              <div className="relative w-20 h-20 mb-8">
                <motion.div 
                  className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <Briefcase className="absolute inset-0 m-auto w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">AI is reading your profile</h2>
              <p className="text-muted-foreground text-center">Extracting skills, parsing experience, and structuring your Master Career Profile...</p>
              
              <motion.div 
                className="mt-8 opacity-0"
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                onAnimationComplete={() => setTimeout(handleNext, 500)}
              >
                <p className="text-sm font-medium text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" /> Extraction Complete!
                </p>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col flex-1"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Verify Your Profile</h2>
                <Button size="sm" variant="outline" onClick={handleFinishSetup} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Confirm All Facts'}
                </Button>
              </div>
              
              <div className="space-y-4 mb-8 overflow-y-auto max-h-[400px] pr-2">
                {!extractedFacts ? (
                  <p className="text-sm text-muted-foreground">No facts found.</p>
                ) : (
                  <>
                    {/* Render Basics */}
                    {extractedFacts.basics && extractedFacts.basics.value && (
                      <VerificationCard 
                        title="Personal Information" 
                        item={extractedFacts.basics} 
                        onConfirm={(updated) => handleConfirmFact('basics', updated)} 
                      />
                    )}
                    
                    {/* Render Summary */}
                    {extractedFacts.summary && extractedFacts.summary.value && (
                      <VerificationCard 
                        title="Professional Summary" 
                        item={extractedFacts.summary} 
                        onConfirm={(updated) => handleConfirmFact('summary', updated)} 
                      />
                    )}

                    {/* Render Experience Array */}
                    {extractedFacts.experience?.map((exp: any, i: number) => (
                      <VerificationCard 
                        key={`exp-${i}`}
                        title={`Experience: ${exp.value?.role || 'Unknown'}`} 
                        item={exp} 
                        onConfirm={(updated) => handleConfirmFact('experience', updated, i)} 
                      />
                    ))}

                    {/* Render Education Array */}
                    {extractedFacts.education?.map((edu: any, i: number) => (
                      <VerificationCard 
                        key={`edu-${i}`}
                        title={`Education: ${edu.value?.degree || 'Unknown'}`} 
                        item={edu} 
                        onConfirm={(updated) => handleConfirmFact('education', updated, i)} 
                      />
                    ))}

                    {/* Render Skills Array */}
                    {extractedFacts.skills?.map((skill: any, i: number) => (
                      <VerificationCard 
                        key={`skill-${i}`}
                        title={`Skill`} 
                        item={skill} 
                        onConfirm={(updated) => handleConfirmFact('skills', updated, i)} 
                      />
                    ))}
                  </>
                )}
              </div>

              <div className="mt-auto pt-4 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={() => setCurrentStep(2)} disabled={isSaving}>Re-upload</Button>
                <Button onClick={handleFinishSetup} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Finish Setup'} <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
