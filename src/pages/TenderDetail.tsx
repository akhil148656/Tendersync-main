import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Download,
  ExternalLink,
  Zap
} from 'lucide-react';
import { MOCK_TENDERS } from '../data/mockData';
import { cn } from '../lib/utils';

export const TenderDetail = () => {
  const tender = MOCK_TENDERS[0]; // Just for demo

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">{tender.source}</span>
            <span className="text-slate-500 font-mono text-sm">{tender.id}</span>
          </div>
          <h2 className="text-3xl font-bold text-white">{tender.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition-all">
            <Download size={16} /> Download RFP
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan-500 text-slate-900 text-sm font-bold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all">
            Prepare Bid
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="glass-card">
            <h3 className="text-xl font-bold text-white mb-4">Project Overview</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              {tender.description} This project requires a comprehensive end-to-end solution including hardware procurement, software integration, and 3-year maintenance support.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Budget Estimate</p>
                <p className="text-lg font-bold text-white">₹4.2 Crores</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">EMD Amount</p>
                <p className="text-lg font-bold text-white">₹8.4 Lakhs</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Pre-bid Date</p>
                <p className="text-lg font-bold text-white">2026-03-28</p>
              </div>
            </div>
          </div>

          {/* Technical Matching */}
          <div className="glass-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Technical Specification Match</h3>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">94% Match</span>
            </div>
            <div className="space-y-4">
              {[
                { spec: '4K Resolution Support', status: 'match', product: 'SR-42U-PRO-X' },
                { spec: 'Night Vision (up to 50m)', status: 'match', product: 'SR-42U-PRO-X' },
                { spec: 'IP67 Weatherproof Rating', status: 'match', product: 'SR-42U-PRO-X' },
                { spec: 'Edge AI Processing', status: 'partial', product: 'Requires Add-on Module' },
                { spec: 'Redundant Power Supply', status: 'match', product: 'SR-42U-PRO-X' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    {item.status === 'match' ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={18} className="text-amber-500" />
                    )}
                    <span className="text-sm font-medium text-slate-200">{item.spec}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{item.product}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* AI Recommendation */}
          <div className="glass-card bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border-cyan-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">AI Bid Strategy</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Win Probability</span>
                <span className="text-lg font-bold text-emerald-500">78%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[78%] h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "94% specification match detected. Estimated profit margin: +18%. Risk level: Low. Recommendation: Proceed with bid."
              </p>
            </div>
          </div>

          {/* Key Dates */}
          <div className="glass-card">
            <h3 className="text-lg font-bold text-white mb-4">Critical Timeline</h3>
            <div className="space-y-6">
              {[
                { label: 'RFP Published', date: '2026-03-15', status: 'past' },
                { label: 'Pre-bid Meeting', date: '2026-03-28', status: 'upcoming' },
                { label: 'Bid Submission', date: '2026-04-12', status: 'upcoming' },
                { label: 'Technical Opening', date: '2026-04-13', status: 'upcoming' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      item.status === 'past' ? "bg-slate-700" : "bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                    )} />
                    {i < 3 && <div className="w-0.5 h-full bg-white/5 my-1" />}
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-bold",
                      item.status === 'past' ? "text-slate-500" : "text-white"
                    )}>{item.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
