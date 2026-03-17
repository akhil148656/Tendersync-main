import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Activity, ArrowRight } from 'lucide-react';

export const AuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 glass rounded-[32px] overflow-hidden shadow-2xl border border-white/5"
      >
        {/* Left Side - Visuals */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-r border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Activity className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-white">TenderSync</h1>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
              The Future of <br />
              <span className="text-cyan-400">Tender Intelligence</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Harness the power of AI to discover, analyze, and win high-value government and private contracts.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400 border border-white/10">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-white font-bold">Real-time Analysis</p>
                <p className="text-slate-500 text-sm">Instant RFP parsing and technical matching.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400 border border-white/10">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-white font-bold">Risk Assessment</p>
                <p className="text-slate-500 text-sm">AI-driven profitability and risk scoring.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12 flex flex-col justify-center">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                <Activity className="text-white" size={18} />
              </div>
              <h1 className="text-xl font-bold text-white">TenderSync</h1>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
            <p className="text-slate-500">Enter your credentials to access the command center.</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Email Address</label>
              <input 
                type="email" 
                defaultValue="admin@acmecorp.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-400">Password</label>
                <button className="text-xs text-cyan-400 hover:underline">Forgot Password?</button>
              </div>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>

            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 group"
            >
              Access Dashboard
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#020617] px-2 text-slate-500">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                <img src="https://github.com/favicon.ico" className="w-4 h-4 invert" alt="GitHub" />
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-slate-500 text-sm">
            Don't have an account? <button className="text-cyan-400 font-bold hover:underline">Request Access</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
