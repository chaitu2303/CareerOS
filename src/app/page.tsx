'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Target, Brain, Briefcase } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center overflow-hidden bg-slate-950 text-slate-50 relative selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
      <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[120px]" />
      <div className="absolute top-[20%] -right-[20%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />

      {/* Navigation (Mockup) */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">CareerOS<span className="text-indigo-400">.ai</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/50">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10 mt-12 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Next-Gen AI Career Assistant
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
        >
          Automate Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
            Job Search Journey
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed"
        >
          From intelligent resume tailoring to cloud-based auto-applications and AI mock interviews, CareerOS builds your skills and lands you the job—seamlessly.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/login">
            <Button size="lg" className="h-14 px-8 rounded-full bg-white text-slate-950 hover:bg-slate-200 text-lg font-semibold gap-2 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105 transition-all">
              Launch Dashboard <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-lg font-medium backdrop-blur-md">
            View Live Demo
          </Button>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-4xl text-left"
        >
          {[
            { icon: Target, title: 'Cloud Auto-Apply', desc: 'Paste a link. We tailor your resume and fill the application automatically.' },
            { icon: Brain, title: 'Mock Interviews', desc: 'Practice with our AI interviewer that dynamically adapts to your target job.' },
            { icon: Briefcase, title: 'Skill Scaling', desc: 'Track your XP and grow your technical skills from scratch to top-tier.' }
          ].map((feat, i) => (
            <div key={i} className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:bg-slate-800/50 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-4 group-hover:scale-110 transition-transform">
                <feat.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
