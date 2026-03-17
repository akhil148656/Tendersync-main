import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  MessageSquare, 
  ArrowUpRight,
  Zap,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

export const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I’m your TenderSync AI Assistant. I can help you analyze tenders and make smarter bidding decisions.' }
  ]);
  const [input, setInput] = useState('');

  const suggestedPrompts = [
    'Should I bid on TND-2847?',
    'What is expected profit margin?',
    'Why was this product selected?',
    'Compare top 3 matching products'
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Based on my analysis of ${input.includes('TND') ? input : 'the current tender'}, I recommend proceeding with a 15% margin optimization. Your technical match score is 92%.` 
      }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            AI Assistant <Sparkles className="text-cyan-400" size={24} />
          </h2>
          <p className="text-slate-400 mt-1">Intelligent insights at your fingertips.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          <Zap size={14} /> Powered by Gemini 3.1 Pro
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col glass rounded-[32px] overflow-hidden border border-white/5">
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex gap-4 max-w-[80%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border border-white/10",
                  msg.role === 'assistant' ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "bg-slate-800 text-slate-400"
                )}>
                  {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={cn(
                  "p-5 rounded-[24px]",
                  msg.role === 'assistant' ? "bg-white/5 text-slate-200 rounded-tl-none" : "bg-cyan-500 text-slate-900 font-medium rounded-tr-none"
                )}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 bg-white/5 border-t border-white/5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="px-4 py-2 rounded-full bg-slate-900 border border-white/10 text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about your tenders..." 
                className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              />
              <button 
                onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-cyan-500 text-slate-900 flex items-center justify-center hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Side Panel - Context */}
        <div className="hidden lg:block w-80 space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Info size={18} className="text-cyan-400" /> AI Capabilities
            </h3>
            <ul className="space-y-4">
              {[
                { title: 'RFP Summarization', desc: 'Extract key terms from 100+ page docs.' },
                { title: 'Technical Matching', desc: 'Compare specs with your inventory.' },
                { title: 'Profitability Analysis', desc: 'Predict margins based on historical data.' },
                { title: 'Competitor Intel', desc: 'Analyze past bidding patterns.' },
              ].map((cap, i) => (
                <li key={i} className="space-y-1">
                  <p className="text-sm font-bold text-white">{cap.title}</p>
                  <p className="text-xs text-slate-500">{cap.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <h3 className="text-lg font-bold text-white mb-2">Recent Analysis</h3>
            <p className="text-xs text-slate-400 mb-4">TND-2847: Lab Testing Equipment</p>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Match Score</span>
                <span className="text-emerald-500 font-bold">92%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[92%] h-full bg-emerald-500" />
              </div>
              <button className="w-full mt-2 py-2 rounded-lg bg-white/5 text-xs text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                View Report <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
