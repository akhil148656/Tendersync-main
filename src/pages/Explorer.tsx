import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowRight,
  Calendar,
  Building2,
  Tag
} from 'lucide-react';
import { MOCK_TENDERS } from '../data/mockData';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export const Explorer = () => {
  const [activeSource, setActiveSource] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');

  const sources = ['All', 'GeM', 'eProcure', 'State Portal'];
  const statuses = ['All', 'New', 'Processing', 'Ready'];

  const filteredTenders = MOCK_TENDERS.filter(t => {
    const sourceMatch = activeSource === 'All' || t.source === activeSource;
    const statusMatch = activeStatus === 'All' || t.status === activeStatus;
    return sourceMatch && statusMatch;
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">RFP Explorer</h2>
        <p className="text-slate-400 mt-1">Discover and analyze high-potential opportunities.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-64 shrink-0 space-y-6">
          <div className="glass-card">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 size={14} className="text-cyan-400" /> Source
            </h3>
            <div className="space-y-2">
              {sources.map(source => (
                <button
                  key={source}
                  onClick={() => setActiveSource(source)}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeSource === source ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  )}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Tag size={14} className="text-purple-400" /> Status
            </h3>
            <div className="space-y-2">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeStatus === status ? "bg-purple-500/20 text-purple-400 border border-purple-500/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="flex-1">
          <div className="glass-card !p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by ID or title..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Showing {filteredTenders.length} results</span>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
                  <Filter size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Tender Title</th>
                    <th className="px-6 py-4 font-semibold">Source</th>
                    <th className="px-6 py-4 font-semibold">Deadline</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTenders.map((tender) => (
                    <tr key={tender.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-cyan-400">{tender.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{tender.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                          tender.source === 'eProcure' ? "bg-blue-500/20 text-blue-400" : 
                          tender.source === 'GeM' ? "bg-orange-500/20 text-orange-400" : "bg-purple-500/20 text-purple-400"
                        )}>
                          {tender.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar size={14} />
                          {tender.deadline}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          tender.status === 'Ready' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
                          tender.status === 'Processing' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : 
                          "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20"
                        )}>
                          {tender.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={`/tender/${tender.id}`}
                          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-cyan-400 transition-all"
                        >
                          Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
