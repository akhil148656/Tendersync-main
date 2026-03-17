import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Monitor, 
  Globe, 
  Zap,
  Save,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Settings = () => {
  const [refreshInterval, setRefreshInterval] = useState('30');
  const [dataSource, setDataSource] = useState('Demo');
  const [notifications, setNotifications] = useState({
    newTender: true,
    analysisComplete: true,
    bidStatus: true,
    marketTrends: false
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">System Settings</h2>
          <p className="text-slate-400 mt-1">Configure your platform preferences and data sources.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* General Settings */}
        <section className="glass-card space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Monitor className="text-cyan-400" size={24} />
            <h3 className="text-xl font-bold text-white">General Preferences</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Refresh Interval</label>
              <p className="text-xs text-slate-500 mb-2">How often the system scans for new tenders.</p>
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                {['15', '30', '60'].map((time) => (
                  <button
                    key={time}
                    onClick={() => setRefreshInterval(time)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                      refreshInterval === time ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {time} Mins
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Data Source Mode</label>
              <p className="text-xs text-slate-500 mb-2">Switch between simulated and live data scraping.</p>
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                {['Demo', 'Scraper'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDataSource(mode)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                      dataSource === mode ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {mode} Mode
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="glass-card space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Bell className="text-purple-400" size={24} />
            <h3 className="text-xl font-bold text-white">Notification Controls</h3>
          </div>

          <div className="space-y-4">
            {[
              { id: 'newTender', label: 'New Tender Alerts', desc: 'Get notified as soon as a matching tender is detected.' },
              { id: 'analysisComplete', label: 'Analysis Completion', desc: 'Receive updates when AI technical matching is finished.' },
              { id: 'bidStatus', label: 'Bid Status Updates', desc: 'Real-time notifications for approval or rejection of bids.' },
              { id: 'marketTrends', label: 'Market Trend Insights', desc: 'Weekly summaries of emerging opportunities in your sector.' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
                <button 
                  onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    notifications[item.id as keyof typeof notifications] ? "bg-cyan-500" : "bg-slate-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                    notifications[item.id as keyof typeof notifications] ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Security & API */}
        <section className="glass-card space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Shield className="text-emerald-400" size={24} />
            <h3 className="text-xl font-bold text-white">Security & API Access</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">AI Core API Key</p>
                  <p className="text-xs text-slate-500 mt-1">Connected to Gemini-3-Flash-Preview</p>
                </div>
              </div>
              <button className="text-xs font-bold text-cyan-400 hover:underline">Manage Key</button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Database size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Database Sync</p>
                  <p className="text-xs text-slate-500 mt-1">Last synced: Today, 09:12 AM</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold text-purple-400 hover:underline">
                <RefreshCw size={14} /> Sync Now
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="glass-card border-rose-500/20">
          <h3 className="text-sm font-bold text-rose-500 uppercase mb-4">Danger Zone</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
            <div>
              <p className="text-sm font-bold text-white">Reset Platform Data</p>
              <p className="text-xs text-slate-500 mt-1">This will clear all your bid history and cached tenders.</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold hover:bg-rose-500/20 transition-all">
              Reset Data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
