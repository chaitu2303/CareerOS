'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Send, Video, Mic, CheckCircle, Loader2, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MockInterviewPage() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hi there. I am your AI Interviewer. Please tell me a bit about yourself to get started.' }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'system', content: `That's great! Can you tell me about a time you had to overcome a difficult technical challenge involving ${input.length > 20 ? 'that experience' : 'your past projects'}?` }
      ]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-[#faf8f5] text-black font-sans min-h-[calc(100vh-4rem)] flex flex-col">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b-8 border-black pb-8 shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#ff90e8] border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-2">
            <Brain className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Mock Chat</h1>
            <p className="font-bold text-lg mt-1 bg-[#23a094] text-white inline-block px-2 border-2 border-black rotate-1">Real-time interview simulator.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4040] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff4040]"></span>
            </span>
            <span className="font-black uppercase text-sm">Session Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 flex-1 min-h-0 pb-10">
        
        {/* Chat Area */}
        <div className="xl:col-span-8 flex flex-col bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden h-[600px]">
          <div className="absolute top-0 left-0 right-0 bg-[#ffe500] border-b-4 border-black px-6 py-3 flex items-center justify-between z-10">
            <h3 className="font-black uppercase flex items-center gap-2">
              <Video className="w-5 h-5" /> Live AI Interviewer
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider bg-white border-2 border-black px-2 py-1">Voice & Text</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-20 space-y-6 bg-[#faf8f5]">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 border-4 border-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    msg.role === 'user' ? 'bg-[#90c0ff] rounded-tl-xl rounded-bl-xl rounded-tr-xl' : 'bg-white rounded-tr-xl rounded-br-xl rounded-tl-xl'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-tr-xl rounded-br-xl rounded-tl-xl flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> <span className="font-bold">Interviewer is typing...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 bg-white border-t-4 border-black flex gap-4 items-end shrink-0">
            <Button 
              onClick={() => setIsRecording(!isRecording)}
              className={`h-14 w-14 shrink-0 rounded-none border-4 border-black ${isRecording ? 'bg-[#ff4040] hover:bg-[#ff4040]/80' : 'bg-[#ffe500] hover:bg-[#ffe500]/80'} text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center`}
            >
              {isRecording ? <StopCircle className="w-6 h-6 animate-pulse text-white" /> : <Mic className="w-6 h-6" />}
            </Button>
            <div className="flex-1 relative">
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your answer here..."
                className="w-full rounded-none border-4 border-black bg-[#faf8f5] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] focus-visible:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all resize-none min-h-[56px] py-4 px-4 font-bold"
              />
            </div>
            <Button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="h-14 px-8 rounded-none border-4 border-black bg-[#ff90e8] hover:bg-[#ff70dd] text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all shrink-0"
            >
              <Send className="w-5 h-5 md:mr-2" /> <span className="hidden md:inline">Send</span>
            </Button>
          </div>
        </div>

        {/* Sidebar Feedback */}
        <div className="xl:col-span-4 flex flex-col space-y-6">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1 hover:rotate-0 transition-transform">
            <h3 className="font-black uppercase text-xl mb-4 border-b-4 border-black pb-2">Live Feedback</h3>
            <div className="space-y-4">
              <div className="p-3 bg-[#faf8f5] border-2 border-black flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#23a094] shrink-0 mt-0.5" />
                <p className="font-bold text-sm">Great use of the STAR method in your previous answer!</p>
              </div>
              <div className="p-3 bg-[#faf8f5] border-2 border-black flex gap-3">
                <Loader2 className="w-5 h-5 text-[#ff4040] shrink-0 mt-0.5" />
                <p className="font-bold text-sm">Try to slow down your speaking pace slightly.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#23a094] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white mt-auto">
            <h3 className="font-black uppercase text-xl mb-2">Confidence Score</h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-5xl font-black">92</span>
              <span className="text-lg font-bold pb-1 text-white/80">/ 100</span>
            </div>
            <div className="h-4 w-full bg-black border-2 border-white relative overflow-hidden">
              <div className="h-full bg-white w-[92%]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
