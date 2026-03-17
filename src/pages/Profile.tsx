import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  User, 
  FileText, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Award
} from 'lucide-react';

export const Profile = () => {
  const companyInfo = {
    name: 'Vattem Infrastructure & Solutions',
    username: 'vattem_akhilesh_812',
    pan: 'ABCDE1234F',
    gstin: '27ABCDE1234F1Z5',
    license: 'LIC-INFRA-2024-99',
    status: 'Demo Mode',
    email: 'vattemakhilesh812@gmail.com',
    phone: '+91 98765 43210',
    address: '123 Tech Park, Hitech City, Hyderabad, Telangana - 500081'
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">My Profile</h2>
        <button className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold hover:bg-cyan-500/20 transition-all">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Status */}
        <div className="space-y-6">
          <div className="glass-card flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-purple-600">
                <div className="w-full h-full rounded-full bg-slate-900 border-4 border-slate-900 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Akhilesh" alt="Avatar" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-slate-900 flex items-center justify-center">
                <ShieldCheck size={16} className="text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">{companyInfo.name}</h3>
            <p className="text-sm text-slate-500 mt-1">@{companyInfo.username}</p>
            
            <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Verified Partner</span>
            </div>
          </div>

          <div className="glass-card">
            <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Account Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Trust Score</span>
                <span className="text-sm font-bold text-cyan-400">98%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[98%] h-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Win Rate</span>
                <span className="text-sm font-bold text-purple-400">74%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[74%] h-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card space-y-8">
            <section>
              <h4 className="text-sm font-bold text-cyan-400 uppercase mb-4 flex items-center gap-2">
                <Building2 size={16} /> Company Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Company Name</p>
                  <p className="text-slate-200 font-medium mt-1">{companyInfo.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Verification Status</p>
                  <p className="text-emerald-500 font-bold mt-1">{companyInfo.status}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-slate-500 uppercase font-bold">Registered Address</p>
                  <p className="text-slate-200 font-medium mt-1 flex items-start gap-2">
                    <MapPin size={16} className="text-slate-500 mt-0.5" />
                    {companyInfo.address}
                  </p>
                </div>
              </div>
            </section>

            <section className="pt-8 border-t border-white/5">
              <h4 className="text-sm font-bold text-cyan-400 uppercase mb-4 flex items-center gap-2">
                <FileText size={16} /> Legal & Tax Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">PAN Number</p>
                  <p className="text-slate-200 font-mono font-medium mt-1">{companyInfo.pan}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">GSTIN</p>
                  <p className="text-slate-200 font-mono font-medium mt-1">{companyInfo.gstin}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">License Number</p>
                  <p className="text-slate-200 font-mono font-medium mt-1">{companyInfo.license}</p>
                </div>
              </div>
            </section>

            <section className="pt-8 border-t border-white/5">
              <h4 className="text-sm font-bold text-cyan-400 uppercase mb-4 flex items-center gap-2">
                <Mail size={16} /> Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-slate-400">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Email</p>
                    <p className="text-slate-200 font-medium">{companyInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-slate-400">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Phone</p>
                    <p className="text-slate-200 font-medium">{companyInfo.phone}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="glass-card">
            <h4 className="text-sm font-bold text-cyan-400 uppercase mb-4 flex items-center gap-2">
              <Award size={16} /> Documents & Certifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['GST_Certificate.pdf', 'PAN_Card_Copy.pdf', 'Company_Reg.pdf', 'ISO_9001.pdf'].map((doc) => (
                <div key={doc} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-slate-500 group-hover:text-cyan-400" />
                    <span className="text-sm text-slate-300 group-hover:text-white">{doc}</span>
                  </div>
                  <ExternalLink size={14} className="text-slate-600 group-hover:text-cyan-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckCircle2 = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
