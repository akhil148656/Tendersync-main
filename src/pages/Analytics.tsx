import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const performanceData = [
  { month: 'Jan', processed: 45, won: 12, margin: 22 },
  { month: 'Feb', processed: 52, won: 15, margin: 24 },
  { month: 'Mar', processed: 68, won: 22, margin: 21 },
  { month: 'Apr', processed: 85, won: 28, margin: 25 },
  { month: 'May', processed: 92, won: 31, margin: 26 },
  { month: 'Jun', processed: 110, won: 38, margin: 28 },
];

const categoryData = [
  { name: 'IT Infra', value: 45 },
  { name: 'Surveillance', value: 25 },
  { name: 'Networking', value: 15 },
  { name: 'Energy', value: 10 },
  { name: 'Other', value: 5 },
];

const marginTrendData = [
  { day: 'Mon', margin: 18 },
  { day: 'Tue', margin: 22 },
  { day: 'Wed', margin: 25 },
  { day: 'Thu', margin: 21 },
  { day: 'Fri', margin: 28 },
  { day: 'Sat', margin: 24 },
  { day: 'Sun', margin: 26 },
];

const StatCard = ({ label, value, trend, trendType, icon: Icon }: any) => (
  <div className="glass-card">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-white/5 text-slate-400">
        <Icon size={20} />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
        trendType === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
      )}>
        {trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trend}
      </div>
    </div>
    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{label}</p>
    <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
  </div>
);

export const Analytics = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Analytics & Insights</h2>
          <p className="text-slate-400 mt-1">Deep dive into your bidding performance and market trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition-all">
            <Filter size={16} /> Last 6 Months
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Avg. Spec Match" value="94.2%" trend="+2.4%" trendType="up" icon={Target} />
        <StatCard label="Bid Success Rate" value="38.5%" trend="+5.1%" trendType="up" icon={Award} />
        <StatCard label="Total Revenue" value="$4.2M" trend="+18.2%" trendType="up" icon={DollarSign} />
        <StatCard label="Avg. Margin" value="26.4%" trend="-1.2%" trendType="down" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tenders Processed vs Won */}
        <div className="glass-card">
          <h3 className="text-xl font-bold text-white mb-8">Tender Processing Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="processed" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorProcessed)" />
                <Area type="monotone" dataKey="won" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorWon)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <span className="text-xs text-slate-400 font-bold uppercase">Processed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-xs text-slate-400 font-bold uppercase">Won</span>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card">
          <h3 className="text-xl font-bold text-white mb-8">Bid Distribution by Category</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm text-slate-300 font-medium">{item.name}</span>
                  <span className="text-sm text-slate-500 font-bold ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Margin Trends */}
        <div className="glass-card">
          <h3 className="text-xl font-bold text-white mb-8">Weekly Margin Performance</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marginTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="margin" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Insights */}
        <div className="glass-card bg-gradient-to-br from-slate-900 to-slate-950">
          <h3 className="text-xl font-bold text-white mb-6">AI Market Insights</h3>
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <h4 className="text-sm font-bold text-cyan-400 mb-2">Emerging Trend</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                There is a <span className="text-white font-bold">25% increase</span> in Smart City tenders across Western regions. Recommended to update surveillance SKU inventory.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <h4 className="text-sm font-bold text-purple-400 mb-2">Pricing Optimization</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Historical data suggests a <span className="text-white font-bold">2% lower bid</span> on eProcure tenders increases win probability by <span className="text-white font-bold">15%</span>.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-sm font-bold text-emerald-400 mb-2">Inventory Alert</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                High demand detected for <span className="text-white font-bold">Lithium Storage</span> units. Current supply chain lead times are increasing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
