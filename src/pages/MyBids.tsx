import React from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  MoreVertical,
  ArrowUpRight,
  Zap,
  AlertCircle,
  Eye,
  Trash2,
  ExternalLink,
  FileSearch
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { MOCK_BIDS } from '../data/mockData';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { BidDetailsModal } from '../components/BidDetailsModal';

export const MyBids = () => {
  const [bids, setBids] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [errorHeader, setErrorHeader] = React.useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [selectedBidId, setSelectedBidId] = React.useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const navigate = useNavigate();

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
      setConfirmDeleteId(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDeleteBid = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('bids')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setBids(prev => prev.filter(b => b.id !== id));
      setOpenMenuId(null);
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error deleting bid:', error);
      alert("Failed to delete bid. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  React.useEffect(() => {
    const fetchBids = async () => {
      try {
        const { data, error } = await supabase
          .from('bids')
          .select('*')
          .order('date_submitted', { ascending: false });
        
        if (error) {
           if (error.code === 'PGRST205') {
              setErrorHeader("Database Table Missing: Please run the provided SQL in your Supabase dashboard to create the 'bids' table.");
           }
           throw error;
        }
        
        // Remove duplicates in frontend just in case, though DB has unique constraint
        const uniqueBids = data ? data.filter((v, i, a) => a.findIndex(t => (t.tender_id === v.tender_id)) === i) : [];
        setBids(uniqueBids);
      } catch (error) {
        console.error('Error fetching bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();

    const channel = supabase
      .channel('public:bids:dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bids' }, () => {
        fetchBids();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {errorHeader && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle size={18} />
          {errorHeader}
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">My Bids</h2>
          <p className="text-slate-400 mt-1">Track and manage your submitted proposals.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search bids..." 
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tender Name</th>
                  <th className="px-6 py-4 font-semibold">Bid Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date Submitted</th>
                  <th className="px-6 py-4 font-semibold">AI Insights</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bids.length > 0 ? bids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                          <Briefcase size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{bid.tender_name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{bid.tender_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">₹{bid.amount?.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {bid.status === 'Approved' || bid.status === 'Accepted' ? (
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        ) : bid.status === 'Rejected' ? (
                          <XCircle size={14} className="text-rose-500" />
                        ) : (
                          <Clock size={14} className="text-amber-500" />
                        )}
                        <span className={cn(
                          "text-xs font-bold",
                          (bid.status === 'Approved' || bid.status === 'Accepted') ? "text-emerald-500" : 
                          bid.status === 'Rejected' ? "text-rose-500" : "text-amber-500"
                        )}>
                          {bid.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(bid.date_submitted).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <Zap size={14} className="text-cyan-400 shrink-0" />
                        <p className="text-xs text-slate-400 italic line-clamp-1">{bid.ai_recommendation}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === bid.id ? null : bid.id);
                            setConfirmDeleteId(null);
                          }}
                          className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenuId === bid.id && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-white/10 shadow-2xl z-50 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button 
                                onClick={() => {
                                  setSelectedBidId(bid.id);
                                  setIsDetailsOpen(true);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-cyan-400 transition-all font-medium"
                              >
                                <Eye size={14} />
                                View Details
                              </button>
                              {confirmDeleteId === bid.id ? (
                                <div className="p-2 bg-rose-500/10 border-t border-white/5 space-y-2">
                                  <p className="text-[10px] text-rose-400 font-bold uppercase text-center px-2">Confirm Removal?</p>
                                  <div className="flex gap-1">
                                    <button 
                                      onClick={(e) => handleDeleteBid(bid.id, e)}
                                      disabled={isDeleting}
                                      className="flex-1 py-1.5 rounded-lg bg-rose-500 text-white text-[10px] font-bold hover:bg-rose-600 transition-all disabled:opacity-50"
                                    >
                                      {isDeleting ? "..." : "Yes, Remove"}
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                                      className="flex-1 py-1.5 rounded-lg bg-white/10 text-slate-300 text-[10px] font-bold hover:bg-white/20 transition-all"
                                    >
                                      No
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(bid.id); }}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-all font-medium border-t border-white/5"
                                >
                                  <Trash2 size={14} />
                                  Remove Bid
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">
                      No bids accepted yet. Go to Explorer to find and accept tenders.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bid Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10">
          <p className="text-xs font-bold text-emerald-500 uppercase mb-2">Win Rate</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-bold text-white">74%</h4>
            <span className="text-emerald-500 text-xs font-bold mb-1">+12% vs last month</span>
          </div>
        </div>
        <div className="glass-card bg-gradient-to-br from-cyan-500/5 to-transparent border-cyan-500/10">
          <p className="text-xs font-bold text-cyan-500 uppercase mb-2">Active Bids</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-bold text-white">{bids.length}</h4>
            <span className="text-slate-500 text-xs font-bold mb-1">Live accepted proposals</span>
          </div>
        </div>
        <div className="glass-card bg-gradient-to-br from-purple-500/5 to-transparent border-purple-500/10">
          <p className="text-xs font-bold text-purple-500 uppercase mb-2">AI Accuracy</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-bold text-white">98.4%</h4>
            <span className="text-purple-500 text-xs font-bold mb-1">Technical match precision</span>
          </div>
        </div>
      </div>

      <BidDetailsModal 
        bidId={selectedBidId}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};
