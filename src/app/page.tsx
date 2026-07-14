'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Target, Brain, Briefcase } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-[#ffb0b0]">
      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between border-b-4 border-black">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ffe500] border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <span className="text-3xl font-black tracking-tighter uppercase">CareerOS</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="font-bold text-lg hover:underline decoration-4 underline-offset-4 decoration-[#ffb0b0]">
            Sign In
          </Link>
          <Link href="/register">
            <Button className="bg-[#ff90e8] hover:bg-[#ff70dd] text-black font-bold text-lg py-6 px-8 rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div className="flex flex-col items-start relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -5 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="px-4 py-2 bg-[#23a094] text-white border-4 border-black font-bold text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8"
          >
            Built by Humans.
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8"
          >
            Hate <br />
            Applying <br />
            <span className="inline-block bg-[#ff90e8] px-4 pt-4 pb-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2 mt-2">
              To Jobs?
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl font-medium mb-12 max-w-xl leading-relaxed border-l-8 border-[#ffb0b0] pl-6"
          >
            We do too. CareerOS automatically tailors your resume and fills out job applications while you practice with our brutally honest AI interviewer.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-[#90c0ff] hover:bg-[#70aaff] text-black h-16 px-10 rounded-none border-4 border-black text-xl font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex gap-3">
                Launch App <ArrowRight className="w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero Visual (Asymmetric Abstract) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative h-[500px] hidden lg:block"
        >
          <div className="absolute top-10 right-10 w-64 h-64 bg-[#ffe500] border-4 border-black rounded-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-0" />
          <div className="absolute top-32 left-10 w-80 h-80 bg-[#ffb0b0] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -rotate-6 z-10 p-8 flex flex-col justify-between">
            <div className="w-full h-8 bg-black mb-4" />
            <div className="w-3/4 h-8 bg-black mb-4" />
            <div className="w-1/2 h-8 bg-black mb-4" />
            <div className="mt-auto flex gap-4">
               <div className="w-16 h-16 rounded-full bg-white border-4 border-black" />
               <div className="flex-1 bg-white border-4 border-black" />
            </div>
          </div>
          <div className="absolute bottom-10 right-20 bg-white border-4 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-3 z-20 flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-[#23a094]" />
            <span className="font-bold text-xl uppercase">Application Sent</span>
          </div>
        </motion.div>
      </section>

      {/* Features - Brutalist Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-5xl font-black uppercase mb-16 border-b-8 border-black pb-4 inline-block">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Target, color: 'bg-[#ff90e8]', title: 'Cloud Auto-Apply', desc: 'Just paste a job URL. Our headless cloud browsers navigate the site and apply for you.' },
            { icon: Brain, color: 'bg-[#90c0ff]', title: 'Mock Interviews', desc: 'Sweat in practice, not in reality. Talk to an AI that grills you like a real hiring manager.' },
            { icon: Briefcase, color: 'bg-[#ffe500]', title: 'Skill Builder', desc: 'Earn XP. Level up. Go from a complete beginner to a senior engineer through simulated rounds.' }
          ].map((feat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              key={i} 
              className={`p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${feat.color} hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all`}
            >
              <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                <feat.icon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4">{feat.title}</h3>
              <p className="text-lg font-medium">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Fix missing CheckCircle icon by importing it at the top or locally */}
    </main>
  );
}

// Temporary icon component since we used CheckCircle but didn't import it in the replacement above
function CheckCircle(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
