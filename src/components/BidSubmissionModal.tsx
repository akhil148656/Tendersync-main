import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  DollarSign,
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

interface BidSubmissionModalProps {
  tender: any;
  isOpen: boolean;
  onClose: () => void;
}

export const BidSubmissionModal = ({ tender, isOpen, onClose }: BidSubmissionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [bidAmount, setBidAmount] = useState('');
  const [timeline, setTimeline] = useState('');
  const [notes, setNotes] = useState('');
  
  // File States
  const [files, setFiles] = useState<{
    technical_proposal: File | null;
    financial_proposal: File | null;
    company_profile: File | null;
    compliance_documents: File[];
    past_experience_docs: File[];
  }>({
    technical_proposal: null,
    financial_proposal: null,
    company_profile: null,
    compliance_documents: [],
    past_experience_docs: []
  });

  const fileInputRefs = {
    technical: useRef<HTMLInputElement>(null),
    financial: useRef<HTMLInputElement>(null),
    profile: useRef<HTMLInputElement>(null),
    compliance: useRef<HTMLInputElement>(null),
    experience: useRef<HTMLInputElement>(null)
  };

  const handleFileChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    if (type === 'technical_proposal' || type === 'financial_proposal' || type === 'company_profile') {
      setFiles(prev => ({ ...prev, [type]: selectedFiles[0] }));
    } else {
      setFiles(prev => ({ 
        ...prev, 
        [type]: [...(prev[type as keyof typeof files] as File[]), ...Array.from(selectedFiles)] 
      }));
    }
  };

  const removeFile = (type: string, index?: number) => {
    if (index === undefined) {
      setFiles(prev => ({ ...prev, [type]: null }));
    } else {
      setFiles(prev => ({
        ...prev,
        [type]: (prev[type as keyof typeof files] as File[]).filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.technical_proposal || !files.financial_proposal || !files.company_profile || files.compliance_documents.length === 0) {
      setError("Please upload all required mandatory documents.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('tender_id', tender.tender_id || tender.id.toString());
      formData.append('bid_amount', bidAmount);
      formData.append('delivery_timeline', timeline);
      formData.append('notes', notes);
      
      if (files.technical_proposal) formData.append('technical_proposal', files.technical_proposal);
      if (files.financial_proposal) formData.append('financial_proposal', files.financial_proposal);
      if (files.company_profile) formData.append('company_profile', files.company_profile);
      
      files.compliance_documents.forEach(doc => {
        formData.append('compliance_documents', doc);
      });
      
      files.past_experience_docs.forEach(doc => {
        formData.append('past_experience_docs', doc);
      });

      const response = await fetch('http://localhost:8000/api/submit-bid', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Submission failed");

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.href = '/bids';
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20">
              <FileCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Prepare & Submit Bid</h2>
              <p className="text-sm text-slate-400">Formal submission for {tender.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Bid Submitted Successfully!</h3>
              <p className="text-slate-400">Your proposal has been securely logged and documents uploaded.</p>
              <p className="text-cyan-400 text-sm mt-4 animate-pulse">Redirecting to Dashboard...</p>
            </motion.div>
          ) : (
            <>
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Financials & Timeline */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <DollarSign size={16} /> Basic Proposal Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Bid Amount (INR)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                        <input 
                          type="number" 
                          required
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder="e.g. 500000"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Delivery Timeline</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                          type="text" 
                          required
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                          placeholder="e.g. 45 Days from PO"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Additional Notes</label>
                      <textarea 
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special terms or highlights of your proposal..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all resize-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Required Documents */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Layers size={16} /> Mandatory Documents
                  </h3>

                  <div className="space-y-4">
                    {/* Technical Proposal */}
                    <div 
                      onClick={() => fileInputRefs.technical.current?.click()}
                      className={cn(
                        "p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer group",
                        files.technical_proposal ? "bg-emerald-500/5 border-emerald-500/30" : "bg-white/5 border-white/10 hover:border-cyan-500/30"
                      )}
                    >
                      <input type="file" hidden ref={fileInputRefs.technical} onChange={(e) => handleFileChange('technical_proposal', e)} accept=".pdf" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", files.technical_proposal ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-400 group-hover:text-cyan-400")}>
                            {files.technical_proposal ? <CheckCircle2 size={16} /> : <Upload size={16} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Technical Proposal</p>
                            <p className="text-xs text-slate-500 font-mono">
                              {files.technical_proposal ? files.technical_proposal.name : "PDF format only"}
                            </p>
                          </div>
                        </div>
                        {files.technical_proposal && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeFile('technical_proposal'); }} className="text-slate-500 hover:text-rose-500 p-1">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Financial Proposal */}
                    <div 
                      onClick={() => fileInputRefs.financial.current?.click()}
                      className={cn(
                        "p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer group",
                        files.financial_proposal ? "bg-emerald-500/5 border-emerald-500/30" : "bg-white/5 border-white/10 hover:border-cyan-500/30"
                      )}
                    >
                      <input type="file" hidden ref={fileInputRefs.financial} onChange={(e) => handleFileChange('financial_proposal', e)} accept=".pdf" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", files.financial_proposal ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-400 group-hover:text-cyan-400")}>
                            {files.financial_proposal ? <CheckCircle2 size={16} /> : <Upload size={16} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Financial Proposal</p>
                            <p className="text-xs text-slate-500 font-mono">
                               {files.financial_proposal ? files.financial_proposal.name : "Itemized cost breakdown"}
                            </p>
                          </div>
                        </div>
                        {files.financial_proposal && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeFile('financial_proposal'); }} className="text-slate-500 hover:text-rose-500 p-1">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Company Profile */}
                    <div 
                      onClick={() => fileInputRefs.profile.current?.click()}
                      className={cn(
                        "p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer group",
                        files.company_profile ? "bg-emerald-500/5 border-emerald-500/30" : "bg-white/5 border-white/10 hover:border-cyan-500/30"
                      )}
                    >
                      <input type="file" hidden ref={fileInputRefs.profile} onChange={(e) => handleFileChange('company_profile', e)} accept=".pdf" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", files.company_profile ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-400 group-hover:text-cyan-400")}>
                            {files.company_profile ? <CheckCircle2 size={16} /> : <Upload size={16} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Company Profile</p>
                            <p className="text-xs text-slate-500 font-mono">
                               {files.company_profile ? files.company_profile.name : "Latest corporate overview"}
                            </p>
                          </div>
                        </div>
                        {files.company_profile && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeFile('company_profile'); }} className="text-slate-500 hover:text-rose-500 p-1">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance & Experience (Multi-select) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase">Compliance Documents (PAN, GST, etc.) *</label>
                    <div 
                      onClick={() => fileInputRefs.compliance.current?.click()}
                      className="p-4 rounded-xl border-2 border-dashed bg-white/5 border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer text-center"
                    >
                      <input type="file" hidden multiple ref={fileInputRefs.compliance} onChange={(e) => handleFileChange('compliance_documents', e)} accept=".pdf,.jpg,.png" />
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={20} className="text-slate-500" />
                        <span className="text-sm text-slate-400">Click to upload multiple legal documents</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {files.compliance_documents.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-medium">
                          <FileText size={10} />
                          <span className="truncate max-w-[80px]">{file.name}</span>
                          <button type="button" onClick={() => removeFile('compliance_documents', i)} className="hover:text-rose-500"><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase">Past Experience Docs (Optional)</label>
                    <div 
                      onClick={() => fileInputRefs.experience.current?.click()}
                      className="p-4 rounded-xl border-2 border-dashed bg-white/5 border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer text-center"
                    >
                      <input type="file" hidden multiple ref={fileInputRefs.experience} onChange={(e) => handleFileChange('past_experience_docs', e)} accept=".pdf" />
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={20} className="text-slate-500" />
                        <span className="text-sm text-slate-400">Completion certificates, WO, etc.</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {files.past_experience_docs.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-400 font-medium font-sans">
                          <FileText size={10} />
                          <span className="truncate max-w-[80px]">{file.name}</span>
                          <button type="button" onClick={() => removeFile('past_experience_docs', i)} className="hover:text-rose-500"><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                </div>
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        {!success && (
          <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/5 text-slate-300 text-sm font-bold hover:bg-white/10 transition-all font-sans"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-10 py-2.5 rounded-xl bg-cyan-500 text-slate-900 text-sm font-bold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>Submit Final Proposal</>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
