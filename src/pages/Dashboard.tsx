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
  TrendingUp
} from 'lucide-react';
import { MOCK_TENDERS } from '../data/mockData';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

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
  const pipelineStages = [
    { label: 'Tender Detected', progress: 100, status: 'completed' },
    { label: 'Summarized', progress: 100, status: 'completed' },
    { label: 'Technical Matching', progress: 75, status: 'active' },
    { label: 'Pricing Completed', progress: 0, status: 'pending' },
    { label: 'Ready to Bid', progress: 0, status: 'pending' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-slate-400 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Last updated</p>
          <p className="text-sm font-medium text-cyan-400">2 mins ago</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Tenders Detected" 
          value="1,284" 
          icon={Activity} 
          color="bg-cyan-500" 
          trend="+12%"
        />
        <StatCard 
          label="Active Bids" 
          value="42" 
          icon={Briefcase} 
          color="bg-purple-500" 
          trend="+5%"
        />
        <StatCard 
          label="Approved Bids" 
          value="18" 
          icon={CheckCircle2} 
          color="bg-emerald-500" 
          trend="+8%"
        />
        <StatCard 
          label="Rejected Bids" 
          value="5" 
          icon={XCircle} 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Tender Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card !p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Live Tender Feed</h3>
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
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_TENDERS.map((tender) => (
                    <tr key={tender.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-cyan-400">{tender.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white line-clamp-1">{tender.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                          tender.source === 'eProcure' ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                        )}>
                          {tender.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{tender.deadline}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            tender.status === 'Ready' ? "bg-emerald-500" : tender.status === 'Processing' ? "bg-amber-500" : "bg-cyan-500"
                          )} />
                          <span className="text-sm text-slate-300">{tender.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          to={`/tender/${tender.id}`}
                          className="p-2 hover:bg-cyan-500/20 rounded-lg text-slate-400 hover:text-cyan-400 transition-all inline-block"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Pipeline Panel */}
          <div className="glass-card">
            <h3 className="text-xl font-bold text-white mb-6">AI Pipeline Panel</h3>
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
              <h3 className="text-lg font-bold text-white">AI Insight Panel</h3>
            </div>
            <p className="text-slate-300 italic leading-relaxed">
              “94% specification match detected. Estimated profit margin: +18%. Risk level: Low. Recommendation: Proceed with bid.”
            </p>
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="space-y-6">
          <div className="glass-card h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Notifications</h3>
              <span className="px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">3 NEW</span>
            </div>
            <div className="space-y-4">
              {[
                { title: 'New tender detected', desc: 'Smart Grid Infrastructure project in Mumbai.', time: '12m ago', icon: Zap, color: 'text-cyan-400' },
                { title: 'Analysis completed', desc: 'Technical matching for TND-2024-001 is ready.', time: '45m ago', icon: CheckCircle2, color: 'text-emerald-400' },
                { title: 'High profit opportunity', desc: 'New tender matches 95% of your inventory.', time: '2h ago', icon: TrendingUp, color: 'text-purple-400' },
                { title: 'System Alert', desc: 'GeM data scraper updated successfully.', time: '5h ago', icon: Activity, color: 'text-slate-400' },
              ].map((notif, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                  <div className={cn("mt-1", notif.color)}>
                    <notif.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{notif.title}</p>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock size={10} /> {notif.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 transition-all">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
