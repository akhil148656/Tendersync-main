import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Building2, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone,
  Edit3,
  ExternalLink,
  Save,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useProfile } from '../contexts/ProfileContext';

const ProfileCard = ({ title, icon: Icon, children }: any) => (
  <div className="glass-card">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-white/5 text-cyan-400">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const DetailItem = ({ label, value, icon: Icon, isEditing, onChange, name }: any) => (
  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
    {Icon && <Icon size={18} className="text-slate-500 mt-0.5" />}
    <div className="flex-1">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white mt-2 focus:outline-none focus:border-cyan-500/50 transition-all"
        />
      ) : (
        <p className="text-sm font-medium text-white mt-1">{value}</p>
      )}
    </div>
  </div>
);

export const Profile = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<any>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name,
        contractor_type: profile.contractor_type,
        pan: profile.pan,
        gstin: profile.gstin,
        license: profile.license,
        email: profile.email,
        phone: profile.phone,
        address: profile.address
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const cancelChanges = () => {
    if (profile) {
      setFormData({ ...profile });
    }
    setIsEditing(false);
  };

  if (loading || !formData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Syncing profile data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-cyan-500/20 border-4 border-white/10 uppercase">
            {profile?.avatar_initials || 'KS'}
          </div>
          <div>
            {isEditing ? (
               <input
                 type="text"
                 name="company_name"
                 value={formData.company_name}
                 onChange={handleInputChange}
                 className="text-3xl font-bold bg-white/5 border border-white/10 rounded-xl px-4 py-1 text-white focus:outline-none focus:border-cyan-500/50"
               />
            ) : (
              <h2 className="text-3xl font-bold text-white">{profile?.company_name}</h2>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={12} /> Verified Entity
              </span>
              <span className="text-slate-500 text-sm">Last Synced: {profile?.profile_last_updated ? new Date(profile.profile_last_updated).toLocaleTimeString() : 'Just now'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button 
                onClick={cancelChanges}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold hover:bg-rose-500/20 transition-all"
              >
                <X size={18} /> Cancel
              </button>
              <button 
                onClick={saveChanges}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
            >
              <Edit3 size={18} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileCard title="Contractor Profile" icon={Building2}>
              <DetailItem label="Contractor Type" value={formData.contractor_type} name="contractor_type" isEditing={isEditing} onChange={handleInputChange} />
              <DetailItem label="Industry" value="Infrastructure & Technology" name="industry" isEditing={false} onChange={() => {}} />
              <DetailItem label="Company Size" value="250 - 500 Employees" name="size" isEditing={false} onChange={() => {}} />
            </ProfileCard>

            <ProfileCard title="Identification" icon={CreditCard}>
              <DetailItem label="PAN Number" value={formData.pan} name="pan" isEditing={isEditing} onChange={handleInputChange} />
              <DetailItem label="GSTIN" value={formData.gstin} name="gstin" isEditing={isEditing} onChange={handleInputChange} />
              <DetailItem label="License Number" value={formData.license} name="license" isEditing={isEditing} onChange={handleInputChange} />
            </ProfileCard>
          </div>

          <ProfileCard title="Contact Information" icon={Mail}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem label="Primary Email" value={formData.email} name="email" isEditing={isEditing} onChange={handleInputChange} icon={Mail} />
              <DetailItem label="Phone Number" value={formData.phone} name="phone" isEditing={isEditing} onChange={handleInputChange} icon={Phone} />
              <DetailItem label="Headquarters" value={formData.address} name="address" isEditing={isEditing} onChange={handleInputChange} icon={MapPin} />
            </div>
          </ProfileCard>
        </div>

        <div className="space-y-8">
          <div className="glass-card">
            <h3 className="text-lg font-bold text-white mb-6">Verification Status</h3>
            <div className="space-y-6">
              {[
                { label: 'Identity Verification', status: 'Completed' },
                { label: 'Tax Compliance', status: 'Completed' },
                { label: 'Technical Audits', status: 'In Progress' },
                { label: 'Financial Stability', status: 'Completed' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-2 py-1 rounded-md",
                    item.status === 'Completed' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                  )}>{item.status}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
              <p className="text-xs text-cyan-400 font-bold uppercase mb-1">Current Mode</p>
              <p className="text-lg font-bold text-white">Demo Mode</p>
              <p className="text-xs text-slate-500 mt-1">Switch to Live Mode for real tender submissions.</p>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-lg font-bold text-white mb-4">Legal Documents</h3>
            <div className="space-y-3">
              {['Certificate of Incorporation', 'GST Registration', 'PAN Card Copy', 'MSME Certificate'].map((doc, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-slate-500 group-hover:text-cyan-400" />
                    <span className="text-sm text-slate-300 group-hover:text-white">{doc}</span>
                  </div>
                  <ExternalLink size={14} className="text-slate-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
