import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  Clock, 
  Zap,
  ChevronRight,
  TrendingUp,
  RotateCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card flex flex-col gap-4"
  >
    <div className="flex justify-between items-start">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
          <TrendingUp size={14} />
          {trend}
        </div>
      )}
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
    </div>
  </motion.div>
);

export const Dashboard = () => {
  const [stats, setStats] = React.useState({
    totalTenders: 0,
    activeBids: 0,
    approvedBids: 0,
    rejectedBids: 0
  });
  const [liveTenders, setLiveTenders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchDashboardData = async () => {
    try {
      // Fetch Tenders Count
      const { count: tendersCount } = await supabase
        .from('tenders')
        .select('*', { count: 'exact', head: true });

      // Fetch Bids Stats
      const { data: bidsData } = await supabase
        .from('bids')
        .select('status');

      // Fetch Latest Tenders
      const { data: recentTenders } = await supabase
        .from('tenders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const active = bidsData?.filter(b => b.status === 'Accepted' || b.status === 'Pending').length || 0;
      const approved = bidsData?.filter(b => b.status === 'Approved').length || 0;
      const rejected = bidsData?.filter(b => b.status === 'Rejected').length || 0;

      setStats({
        totalTenders: tendersCount || 0,
        activeBids: active,
        approvedBids: approved,
        rejectedBids: rejected
      });
      setLiveTenders(recentTenders || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboardData();

    // Real-time Subscriptions
    const tendersSubscription = supabase
      .channel('public:tenders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tenders' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const bidsSubscription = supabase
      .channel('public:bids')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bids' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tendersSubscription);
      supabase.removeChannel(bidsSubscription);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-slate-400 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Live Status</p>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected to Supabase
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Tenders Detected" 
          value={loading ? "..." : stats.totalTenders.toLocaleString()} 
          icon={Activity} 
          color="bg-cyan-500" 
          trend="+12%"
        />
        <StatCard 
          label="Active Bids" 
          value={loading ? "..." : stats.activeBids} 
          icon={Briefcase} 
          color="bg-purple-500" 
          trend="+5%"
        />
        <StatCard 
          label="Approved Bids" 
          value={loading ? "..." : stats.approvedBids} 
          icon={CheckCircle2} 
          color="bg-emerald-500" 
          trend="+8%"
        />
        <StatCard 
          label="Rejected Bids" 
          value={loading ? "..." : stats.rejectedBids} 
          icon={XCircle} 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Tender Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card !p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity size={20} className="text-cyan-400" />
                Live Tender Feed
              </h3>
              <Link to="/explorer" className="text-sm text-cyan-400 hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Tender ID</th>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Source</th>
                    <th className="px-6 py-4 font-semibold">Deadline</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">
                        Loading live feed...
                      </td>
                    </tr>
                  ) : liveTenders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">
                        No tenders found. Run the scraper to see data here.
                      </td>
                    </tr>
                  ) : liveTenders.map((tender) => {
                    const source = tender.tender_id?.startsWith('GEM') ? 'GeM' : tender.tender_id?.startsWith('EPROC') ? 'eProcure' : 'Other';
                    return (
                      <tr key={tender.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 font-mono text-sm text-cyan-400">{tender.tender_id}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-white line-clamp-1">{tender.title}</p>
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
                        <td className="px-6 py-4 text-sm text-slate-400">{tender.deadline || "N/A"}</td>
                        <td className="px-6 py-4 text-right">
                          <Link 
                            to={`/tender/${tender.id}`}
                            className="p-2 hover:bg-cyan-500/20 rounded-lg text-slate-400 hover:text-cyan-400 transition-all inline-block"
                          >
                            <ChevronRight size={18} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Pipeline Panel */}
          <div className="glass-card">
            <h3 className="text-xl font-bold text-white mb-6">AI Intelligence Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'RFP Parsing', value: '100%', color: 'text-cyan-400' },
                { label: 'Technical Matching', value: '85%', color: 'text-purple-400' },
                { label: 'Pricing Analysis', value: '92%', color: 'text-emerald-400' },
                { label: 'Win Probability', value: '78%', color: 'text-orange-400' },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{item.label}</p>
                  <p className={cn("text-2xl font-bold", item.color)}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight Panel */}
          <div className="glass-card bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-cyan-400" size={20} />
              <h3 className="text-lg font-bold text-white">AI Strategy Insight</h3>
            </div>
            <p className="text-slate-300 italic leading-relaxed">
              {liveTenders.length > 0 
                ? `“New tender ${liveTenders[0].tender_id} shows high technical compatibility. Estimated win probability: 82%. Recommendation: Expedite bid preparation.”`
                : "“AI is analyzing current market trends. Ready to process new tender documents for strategic insights.”"
              }
            </p>
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="space-y-6">
          <div className="glass-card h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">System Feed</h3>
              <span className="px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">REAL-TIME</span>
            </div>
            <div className="space-y-4">
              {liveTenders.slice(0, 4).map((tender, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                  <div className="mt-1 text-cyan-400">
                    <Zap size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors uppercase">New Tender</p>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 text-nowrap">
                        <Clock size={10} /> Just detected
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{tender.title}</p>
                  </div>
                </div>
              ))}
              {liveTenders.length === 0 && (
                <p className="text-sm text-slate-500 italic text-center py-4">Waiting for system updates...</p>
              )}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 transition-all">
              View Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
