import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Building2, MapPin, User, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-background to-purple-900/20" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px]" />
        </div>

        <div className="relative z-10 max-w-xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-2xl shadow-cyan-500/40">
              <Activity className="text-white" size={40} />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white">TenderSync</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl font-semibold text-cyan-400 mb-4 neon-text-blue">
              Synchronizing Opportunities with Intelligent Bidding
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              AI-powered system to discover, analyze, and respond to tenders faster than ever before. 
              Stay ahead of the competition with real-time intelligence.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-2 gap-6"
          >
            {[
              { label: 'AI Analysis', desc: 'Automated spec matching' },
              { label: 'Real-time Feed', desc: 'Instant tender detection' },
              { label: 'Smart Pricing', desc: 'Profitability optimization' },
              { label: 'Auto-Bidding', desc: 'Ready-to-bid documents' },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-4">
                <p className="text-cyan-400 font-bold mb-1">{feature.label}</p>
                <p className="text-sm text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-card !p-0 overflow-hidden"
        >
          <div className="flex border-b border-white/10">
            <button 
              onClick={() => setActiveTab('login')}
              className={cn(
                "flex-1 py-4 font-semibold transition-all",
                activeTab === 'login' ? "text-cyan-400 bg-white/5 border-b-2 border-cyan-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Login
            </button>
            <button 
              onClick={() => setActiveTab('signup')}
              className={cn(
                "flex-1 py-4 font-semibold transition-all",
                activeTab === 'signup' ? "text-cyan-400 bg-white/5 border-b-2 border-cyan-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Register Company
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'login' ? (
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Username / Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Enter your email"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-400">Password</label>
                    <button type="button" className="text-xs text-cyan-400 hover:underline">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-[0.98]"
                >
                  Login
                </button>
              </form>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <form onSubmit={handleAuth} className="space-y-8">
                  {/* Section 1: Company Details */}
                  <div className="space-y-4">
                    <h3 className="text-cyan-400 font-bold flex items-center gap-2">
                      <Building2 size={18} /> Company Details
                    </h3>
                    <div className="grid gap-4">
                      <input type="text" placeholder="Company Name" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500/50" />
                      <textarea placeholder="Registered Address" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500/50 h-20" />
                      <input type="text" placeholder="Contact Person Name" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500/50" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500/50" />
                        <input type="tel" placeholder="Phone Number" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500/50" />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Legal Details */}
                  <div className="space-y-4">
                    <h3 className="text-cyan-400 font-bold flex items-center gap-2">
                      <FileText size={18} /> Legal Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="PAN Number" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500/50" />
                      <input type="text" placeholder="GSTIN" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500/50" />
                      <input type="text" placeholder="CIN (Optional)" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500/50" />
                      <input type="text" placeholder="MSME Number (Optional)" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500/50" />
                    </div>
                  </div>

                  {/* Section 3: Document Upload */}
                  <div className="space-y-4">
                    <h3 className="text-cyan-400 font-bold flex items-center gap-2">
                      <Activity size={18} /> Document Upload
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {['PAN Card', 'GST Certificate', 'Registration Certificate', 'Business License'].map((doc) => (
                        <div key={doc} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-cyan-500/50 transition-all cursor-pointer group">
                          <span className="text-sm text-slate-400 group-hover:text-slate-200">Upload {doc}</span>
                          <Activity size={16} className="text-slate-500 group-hover:text-cyan-400" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: Account Setup */}
                  <div className="space-y-4">
                    <h3 className="text-cyan-400 font-bold flex items-center gap-2">
                      <User size={18} /> Account Setup
                    </h3>
                    <div className="grid gap-4">
                      <input type="text" placeholder="Username" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500/50" />
                      <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500/50" />
                      <input type="password" placeholder="Confirm Password" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:border-cyan-500/50" />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-[0.98]"
                  >
                    Register Company
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
