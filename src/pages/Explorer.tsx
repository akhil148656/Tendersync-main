import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowRight,
  Calendar,
  Building2,
  Tag,
  RotateCw
} from 'lucide-react';
import { MOCK_TENDERS } from '../data/mockData';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Tender {
  id: number;
  tender_id: string;
  title: string;
  description: string;
  deadline: string;
  url: string;
  ai_summary: string;
  created_at: string;
}

export const Explorer = () => {
  const [activeSource, setActiveSource] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  const sources = ['All', 'GeM', 'eProcure', 'Other'];
  const statuses = ['All', 'New', 'Processing', 'Ready'];

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setTenders(data as Tender[]);
    } catch (error) {
      console.error('Error fetching tenders:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTenders();

    const channel = supabase
      .channel('public:tenders:explorer')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tenders' }, () => {
        fetchTenders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRefresh = () => {
    fetchTenders();
  };

  const filteredTenders = tenders.filter(t => {
    const source = t.tender_id?.startsWith('GEM') ? 'GeM' : t.tender_id?.startsWith('EPROC') ? 'eProcure' : 'Other';
    const sourceMatch = activeSource === 'All' || source === activeSource;
    // Since real db doesn't naturally have a 'status' right now, we can hardcode for demo or compute it.
    // Let's assume all fetched items have AI Summary processing done, so they are 'Ready'
    const statusMatch = activeStatus === 'All' || activeStatus === 'Ready'; 
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
                <button 
                  onClick={handleRefresh}
                  disabled={loading}
                  className={cn(
                    "p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all",
                    loading && "opacity-50 cursor-not-allowed"
                  )}
                  title="Refresh Tenders"
                >
                  <RotateCw size={16} className={cn(loading && "animate-spin")} />
                </button>
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
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        <div className="flex items-center justify-center gap-3">
                           <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                           Fetching live tenders...
                        </div>
                      </td>
                    </tr>
                  ) : filteredTenders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        No tenders found. Run the Python scraper to populate data!
                      </td>
                    </tr>
                  ) : filteredTenders.map((tender) => {
                    const source = tender.tender_id?.startsWith('GEM') ? 'GeM' : tender.tender_id?.startsWith('EPROC') ? 'eProcure' : 'Other';
                    
                    return (
                    <tr key={tender.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-cyan-400">{tender.tender_id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2">{tender.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                          source === 'eProcure' ? "bg-blue-500/20 text-blue-400" : 
                          source === 'GeM' ? "bg-orange-500/20 text-orange-400" : "bg-purple-500/20 text-purple-400"
                        )}>
                          {source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar size={14} />
                          {tender.deadline || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Ready
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
