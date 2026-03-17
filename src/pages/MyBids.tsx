import React from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  Filter,
  Search,
  ChevronRight,
  Zap
} from 'lucide-react';
import { MOCK_BIDS } from '../data/mockData';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export const MyBids = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">My Bids</h2>
          <p className="text-slate-400 mt-1">Track the status and performance of your submitted bids.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass-card !p-2 flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
              18 Approved
            </div>
            <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold">
              42 Pending
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by tender name or bid ID..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition-all">
            <Filter size={16} /> Filter Status
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition-all">
            Sort by Date
          </button>
        </div>
      </div>

      <div className="glass-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Tender Name</th>
                <th className="px-6 py-4 font-semibold">Bid Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date Submitted</th>
                <th className="px-6 py-4 font-semibold">AI Recommendation</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_BIDS.map((bid) => (
                <tr key={bid.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{bid.tenderName}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-1">{bid.tenderId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-white">${bid.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      bid.status === 'Approved' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                      bid.status === 'Pending' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                      "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    )}>
                      {bid.status === 'Approved' && <CheckCircle2 size={12} />}
                      {bid.status === 'Pending' && <Clock size={12} />}
                      {bid.status === 'Rejected' && <XCircle size={12} />}
                      {bid.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{bid.dateSubmitted}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2 max-w-xs">
                      <Zap size={14} className="text-cyan-400 mt-0.5" />
                      <p className="text-xs text-slate-400 leading-relaxed italic">"{bid.aiRecommendation}"</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bid Detail View (Simulated) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { title: 'Bid Approved', tender: 'High-Performance Server Racks', time: '2 days ago', status: 'Approved' },
              { title: 'Bid Submitted', tender: 'Smart City Surveillance System', time: '5 days ago', status: 'Pending' },
              { title: 'Bid Rejected', tender: 'Solar Panel Installation', time: '1 week ago', status: 'Rejected' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  item.status === 'Approved' ? "bg-emerald-500/10 text-emerald-500" :
                  item.status === 'Pending' ? "bg-amber-500/10 text-amber-500" :
                  "bg-rose-500/10 text-rose-500"
                )}>
                  {item.status === 'Approved' ? <CheckCircle2 size={20} /> : item.status === 'Pending' ? <Clock size={20} /> : <XCircle size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.tender}</p>
                  <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-wider">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card bg-gradient-to-br from-cyan-900/10 to-purple-900/10 border-cyan-500/20">
          <h3 className="text-xl font-bold text-white mb-4">AI Performance Insights</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Your bid success rate has increased by <span className="text-emerald-500 font-bold">12%</span> since implementing AI-powered technical matching.
          </p>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Top Performing Category</p>
              <p className="text-lg font-bold text-white">IT Infrastructure</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Avg. Profit Margin</p>
              <p className="text-lg font-bold text-white">24.5%</p>
            </div>
          </div>
          <button className="w-full mt-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2">
            View Analytics <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
