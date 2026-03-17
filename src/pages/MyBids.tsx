import React from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  MoreVertical,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { MOCK_BIDS } from '../data/mockData';
import { cn } from '../lib/utils';

export const MyBids = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">My Bids</h2>
          <p className="text-slate-400 mt-1">Track and manage your submitted proposals.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search bids..." 
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tender Name</th>
                  <th className="px-6 py-4 font-semibold">Bid Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date Submitted</th>
                  <th className="px-6 py-4 font-semibold">AI Insights</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_BIDS.map((bid) => (
                  <tr key={bid.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                          <Briefcase size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{bid.tenderName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{bid.tenderId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">₹{bid.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {bid.status === 'Approved' ? (
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        ) : bid.status === 'Rejected' ? (
                          <XCircle size={14} className="text-rose-500" />
                        ) : (
                          <Clock size={14} className="text-amber-500" />
                        )}
                        <span className={cn(
                          "text-xs font-bold",
                          bid.status === 'Approved' ? "text-emerald-500" : 
                          bid.status === 'Rejected' ? "text-rose-500" : "text-amber-500"
                        )}>
                          {bid.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {bid.dateSubmitted}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <Zap size={14} className="text-cyan-400 shrink-0" />
                        <p className="text-xs text-slate-400 italic line-clamp-1">{bid.aiRecommendation}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bid Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10">
          <p className="text-xs font-bold text-emerald-500 uppercase mb-2">Win Rate</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-bold text-white">74%</h4>
            <span className="text-emerald-500 text-xs font-bold mb-1">+12% vs last month</span>
          </div>
        </div>
        <div className="glass-card bg-gradient-to-br from-cyan-500/5 to-transparent border-cyan-500/10">
          <p className="text-xs font-bold text-cyan-500 uppercase mb-2">Avg. Bid Value</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-bold text-white">₹4.8L</h4>
            <span className="text-slate-500 text-xs font-bold mb-1">Across 42 active bids</span>
          </div>
        </div>
        <div className="glass-card bg-gradient-to-br from-purple-500/5 to-transparent border-purple-500/10">
          <p className="text-xs font-bold text-purple-500 uppercase mb-2">AI Accuracy</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-bold text-white">98.4%</h4>
            <span className="text-purple-500 text-xs font-bold mb-1">Technical match precision</span>
          </div>
        </div>
      </div>
    </div>
  );
};
