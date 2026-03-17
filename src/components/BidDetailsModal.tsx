import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  FileText, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  DollarSign,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';

interface BidDetailsModalProps {
  bidId: string | number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BidDetailsModal = ({ bidId, isOpen, onClose }: BidDetailsModalProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.com';

  useEffect(() => {
    if (isOpen && bidId) {
      const fetchBidDetails = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/bid/${bidId}`);
          if (!response.ok) throw new Error("Failed to fetch bid details");
          const result = await response.json();
          setData(result);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBidDetails();
    }
  }, [isOpen, bidId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Hash size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Bid Submission Details</h2>
              <p className="text-sm text-slate-400">Reference: BID-{String(bidId).substring(0,8).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm">Loading submission data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <AlertCircle size={40} className="text-rose-500" />
              <p className="text-white font-medium">{error}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Bid Amount</p>
                  <p className="text-lg font-bold text-white flex items-center gap-1">
                    <DollarSign size={16} className="text-emerald-500" />
                    ₹{data.bid_details.amount.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-amber-500" />
                    <span className="text-lg font-bold text-white uppercase">{data.status}</span>
                  </div>
                </div>
              </div>

              {/* Delivery & Notes */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <Calendar size={20} className="text-cyan-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Proposed Timeline</h4>
                    <p className="text-sm text-white mt-1">{data.bid_details.delivery_timeline || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <MessageSquare size={20} className="text-purple-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Internal Notes</h4>
                    <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                      {data.bid_details.notes || "No additional notes provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText size={18} className="text-cyan-400" /> Attached Documents
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {data.documents.map((doc: any, i: number) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/10 text-slate-400 group-hover:text-cyan-400 transition-colors">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200 capitalize">
                            {doc.document_type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <a 
                        href={`${API_URL}${doc.file_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                  {data.documents.length === 0 && (
                    <p className="text-center py-6 text-slate-500 text-sm italic">No documents found for this submission.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/5 text-slate-300 text-sm font-bold hover:bg-white/10 transition-all"
          >
            Close Viewer
          </button>
        </div>
      </motion.div>
    </div>
  );
};
