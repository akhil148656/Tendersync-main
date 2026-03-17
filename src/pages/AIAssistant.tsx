import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  AlertTriangle,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm TenderSync AI. I can help you analyze tenders, estimate profits, and optimize your bidding strategy. What would you like to know today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, text?: string) => {
    if (e) e.preventDefault();
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            role: 'user',
            parts: [{ text: `You are TenderSync AI, a specialized assistant for a tender intelligence platform. 
            The user is asking: "${messageText}". 
            Provide a professional, data-driven response focused on tender analysis, bidding strategy, or profit estimation. 
            Keep it concise and helpful.` }]
          }
        ],
        config: {
          systemInstruction: "You are a professional tender intelligence assistant. You help contractors analyze RFPs, match products, and estimate profitability."
        }
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I'm sorry, I couldn't process that request. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to my intelligence core. Please check your connection and try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    { text: "Should I bid the Server Rack tender?", icon: Zap },
    { text: "What is the expected profit for TND-2024-001?", icon: TrendingUp },
    { text: "Why was SR-42U-PRO-X selected?", icon: Sparkles },
    { text: "Analyze risks for the Smart City project", icon: AlertTriangle },
  ];

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bot className="text-cyan-400" size={32} /> AI Assistant
          </h2>
          <p className="text-slate-400 mt-1">Intelligent insights for your bidding strategy.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AI Core Online</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Chat Interface */}
        <div className="flex-1 glass-card !p-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                    msg.role === 'assistant' ? "bg-gradient-to-br from-cyan-500 to-cyan-700 text-white" : "bg-slate-800 text-slate-400"
                  )}>
                    {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'assistant' ? "bg-white/5 border border-white/10 text-slate-200" : "bg-cyan-500 text-white font-medium"
                  )}>
                    {msg.content}
                    <p className={cn(
                      "text-[10px] mt-2 opacity-50",
                      msg.role === 'user' ? "text-right" : ""
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 text-white flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-white/5 bg-white/5">
            <form onSubmit={handleSend} className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about tenders, profits, or strategy..."
                className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Suggestions */}
        <div className="lg:w-80 space-y-6">
          <div className="glass-card">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-cyan-400" /> Suggested Prompts
            </h3>
            <div className="space-y-3">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(undefined, prompt.text)}
                  className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <prompt.icon size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200">AI Suggestion</span>
                  </div>
                  <p className="text-sm text-slate-300 group-hover:text-white leading-relaxed">{prompt.text}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border-cyan-500/20">
            <h3 className="text-sm font-bold text-white mb-2">Pro Tip</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You can upload tender documents directly to the chat for instant analysis and SKU matching.
            </p>
            <button className="mt-4 flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline">
              Learn more about AI Analysis <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
