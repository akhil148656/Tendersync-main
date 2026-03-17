import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Calendar, 
  Database, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { MOCK_TENDERS } from '../data/mockData';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export const Explorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<'All' | 'eProcure' | 'GeM'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'New' | 'Processing' | 'Ready'>('All');

  const filteredTenders = MOCK_TENDERS.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tender.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = filterSource === 'All' || tender.source === filterSource;
    const matchesStatus = filterStatus === 'All' || tender.status === filterStatus;
    return matchesSearch && matchesSource && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">RFP Explorer</h2>
          <p className="text-slate-400 mt-1">Discover and analyze new tender opportunities in real-time.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold">
          <Database size={16} />
          <span>Live from 12 Sources</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, ID, or keywords..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-400">Source:</span>
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              {['All', 'eProcure', 'GeM'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterSource(s as any)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-bold transition-all",
                    filterSource === s ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400">Status:</span>
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              {['All', 'New', 'Processing', 'Ready'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s as any)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-bold transition-all",
                    filterStatus === s ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tender List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTenders.map((tender) => (
          <motion.div
            key={tender.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4 }}
            className="glass-card group cursor-pointer"
          >
            <Link to={`/tender/${tender.id}`} className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                    tender.source === 'eProcure' ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                  )}>
                    {tender.source}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{tender.id}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{tender.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">{tender.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">Deadline: {tender.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      tender.status === 'Ready' ? "bg-emerald-500" : tender.status === 'Processing' ? "bg-amber-500" : "bg-cyan-500"
                    )} />
                    <span className="text-xs font-medium text-slate-300">{tender.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Activity size={14} />
                    <span className="text-xs font-medium">Match Score: {tender.profitabilityScore}%</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end gap-4 min-w-[120px]">
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  tender.riskLevel === 'Low' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                  tender.riskLevel === 'Medium' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                  "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                )}>
                  {tender.riskLevel} Risk
                </div>
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm group-hover:gap-3 transition-all">
                  View Details <ArrowUpRight size={16} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {filteredTenders.length === 0 && (
          <div className="glass-card py-20 text-center">
            <Search size={48} className="text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">No tenders found</h3>
            <p className="text-slate-600 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
