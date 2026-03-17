import React from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Activity, Target, PieChart, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

const mockHistoricalData = [
  { name: 'Oct', tenders: 120, match: 82, margin: 18, success: 65 },
  { name: 'Nov', tenders: 180, match: 84, margin: 21, success: 68 },
  { name: 'Dec', tenders: 200, match: 87, margin: 19, success: 70 },
  { name: 'Jan', tenders: 280, match: 89, margin: 24, success: 72 },
  { name: 'Feb', tenders: 320, match: 90, margin: 27, success: 75 },
  { name: 'Mar', tenders: 400, match: 91, margin: 29, success: 78 },
];

const ChartCard = ({ title, icon: Icon, children }: any) => (
  <div className="glass-card flex flex-col h-[400px]">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-white/5 text-cyan-400">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    <div className="flex-1 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export const Analytics = () => {
  const [dbData, setDbData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data: bids } = await supabase.from('bids').select('status');
      if (bids) {
        const statusMap = bids.reduce((acc: any, curr: any) => {
          acc[curr.status] = (acc[curr.status] || 0) + 1;
          return acc;
        }, {});
        
        const chartData = Object.keys(statusMap).map(key => ({
          name: key,
          count: statusMap[key]
        }));
        setDbData(chartData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Analytics & Insights</h2>
          <p className="text-slate-400 mt-1">Performance metrics and market trends from live data.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchAnalytics}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-900 text-sm font-bold hover:bg-cyan-400 transition-all">
            Generate AI Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Bid Status Distribution (Live)" icon={PieChart}>
          <BarChart data={dbData.length > 0 ? dbData : [{name: 'No Bids', count: 0}]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#00ffff' }}
            />
            <Bar dataKey="count" fill="#00f2ff" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Avg Spec Match %" icon={Target}>
          <LineChart data={mockHistoricalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[80, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#bc13fe' }}
            />
            <Line type="monotone" dataKey="match" stroke="#bc13fe" strokeWidth={3} dot={{ fill: '#bc13fe', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Tenders Processed (Growth)" icon={Activity}>
          <AreaChart data={mockHistoricalData}>
            <defs>
              <linearGradient id="colorTenders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#00f2ff' }}
            />
            <Area type="monotone" dataKey="tenders" stroke="#00f2ff" fillOpacity={1} fill="url(#colorTenders)" strokeWidth={3} />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Projected Success Rate %" icon={TrendingUp}>
          <AreaChart data={mockHistoricalData}>
            <defs>
              <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#10b981' }}
            />
            <Area type="monotone" dataKey="success" stroke="#10b981" fillOpacity={1} fill="url(#colorSuccess)" strokeWidth={3} />
          </AreaChart>
        </ChartCard>
      </div>
    </div>
  );
};
