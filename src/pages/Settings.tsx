import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  RefreshCw, 
  Moon, 
  Globe,
  Lock,
  Smartphone
} from 'lucide-react';
import { cn } from '../lib/utils';

const SettingsSection = ({ title, icon: Icon, children }: any) => (
  <div className="glass-card">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2 rounded-lg bg-white/5 text-cyan-400">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={cn(
      "w-12 h-6 rounded-full transition-all relative",
      enabled ? "bg-cyan-500" : "bg-slate-700"
    )}
  >
    <div className={cn(
      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
      enabled ? "left-7" : "left-1"
    )} />
  </button>
);

export const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailDigests, setEmailDigests] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('15');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Settings</h2>
        <p className="text-slate-400 mt-1">Manage your account preferences and system configuration.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <SettingsSection title="System Configuration" icon={Database}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Data Refresh Interval</p>
              <p className="text-xs text-slate-500 mt-1">How often the system checks for new tenders.</p>
            </div>
            <select 
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="15">Every 15 mins</option>
              <option value="30">Every 30 mins</option>
              <option value="60">Every 60 mins</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Data Mode</p>
              <p className="text-xs text-slate-500 mt-1">Switch between static demo data and live API feeds.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-400">{demoMode ? 'Demo Mode' : 'Live Mode'}</span>
              <Toggle enabled={demoMode} onChange={() => setDemoMode(!demoMode)} />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Notifications" icon={Bell}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Push Notifications</p>
              <p className="text-xs text-slate-500 mt-1">Receive alerts for new tenders and bid status updates.</p>
            </div>
            <Toggle enabled={notifications} onChange={() => setNotifications(!notifications)} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Email Digests</p>
              <p className="text-xs text-slate-500 mt-1">Weekly summary of market trends and bid performance.</p>
            </div>
            <Toggle enabled={emailDigests} onChange={() => setEmailDigests(!emailDigests)} />
          </div>
        </SettingsSection>

        <SettingsSection title="Security & Privacy" icon={Shield}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500 mt-1">Add an extra layer of security to your account.</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all">
              Configure
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">API Access Keys</p>
              <p className="text-xs text-slate-500 mt-1">Manage keys for external integrations.</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all">
              Manage Keys
            </button>
          </div>
        </SettingsSection>

        <div className="flex flex-col gap-4">
          {showSaveSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium text-center"
            >
              Settings saved successfully!
            </motion.div>
          )}
          <div className="flex justify-end gap-4 pt-4">
            <button className="px-8 py-3 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-all">
              Discard Changes
            </button>
            <button 
              onClick={() => {
                setShowSaveSuccess(true);
                setTimeout(() => setShowSaveSuccess(false), 3000);
              }}
              className="px-8 py-3 rounded-xl bg-cyan-500 text-slate-900 font-bold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
