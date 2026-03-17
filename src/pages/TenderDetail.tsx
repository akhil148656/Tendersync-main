import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  AlertTriangle,
  Download,
  ExternalLink,
  Zap,
  Check,
  X
} from 'lucide-react';
import { MOCK_TENDERS } from '../data/mockData';
import { cn } from '../lib/utils';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import { FinancialAnalysisModal } from '../components/FinancialAnalysisModal';
import { BidSubmissionModal } from '../components/BidSubmissionModal';
import { Calculator, MessageCircle } from 'lucide-react';

interface Tender {
  id: number;
  tender_id: string;
  title: string;
  description: string;
  deadline: string;
  url: string;
  ai_summary: string;
  risk_score: number;
  created_at: string;
}

export const TenderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = React.useState<Tender | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isAnalysisOpen, setIsAnalysisOpen] = React.useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = React.useState(false);
  const [dynamicAnalysis, setDynamicAnalysis] = React.useState<any>(null);

  const handleAccept = () => {
    setIsBidModalOpen(true);
  };

  const handleReject = () => {
    window.location.href = '/explorer';
  };

  React.useEffect(() => {
    const fetchTender = async () => {
      try {
        // Try fetching by numeric ID first
        let query = supabase.from('tenders').select('*');
        
        if (!isNaN(Number(id))) {
          const { data, error } = await query.eq('id', id).single();
          if (!error && data) {
            setTender(data as Tender);
            return;
          }
        }

        // If numeric fetch fails or id is string, try tender_id
        const { data, error } = await supabase
          .from('tenders')
          .select('*')
          .eq('tender_id', id)
          .single();
        
        if (error) throw error;
        if (data) setTender(data as Tender);
      } catch (error) {
        console.error('Error fetching tender:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
       fetchTender();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="text-center p-12 text-slate-400">
        Tender not found.
      </div>
    );
  }

  const source = tender.tender_id?.startsWith('GEM') ? 'GeM' : tender.tender_id?.startsWith('EPROC') ? 'eProcure' : 'Other';

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/5">
        <div className="flex-1 max-w-4xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">{source}</span>
            <span className="text-slate-500 font-mono text-sm">{tender.tender_id}</span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight">{tender.title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a href={tender.url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition-all">
            <ExternalLink size={16} /> Original Setup
          </a>
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
            <button 
              onClick={() => setIsAnalysisOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-all font-sans"
            >
              <Calculator size={16} /> Analyse with AI
            </button>
            <button 
              onClick={() => navigate('/ai-assistant', { state: { tenderContext: tender } })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 text-orange-400 text-sm font-medium hover:bg-orange-500/20 transition-all font-sans"
            >
              <MessageCircle size={16} /> Ask Assistant
            </button>
          </div>
          <button 
            onClick={handleAccept}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-900 text-sm font-bold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all font-sans"
          >
            Prepare Bid
          </button>
        </div>
      </div>

      <FinancialAnalysisModal 
        tender={tender} 
        isOpen={isAnalysisOpen} 
        onClose={() => setIsAnalysisOpen(false)} 
        onAnalysisComplete={(data: any) => setDynamicAnalysis(data)}
      />

      <BidSubmissionModal 
        tender={tender} 
        isOpen={isBidModalOpen} 
        onClose={() => setIsBidModalOpen(false)} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="glass-card">
            <h3 className="text-xl font-bold text-white mb-4">Project Overview</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              {tender.description || "No description provided."}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Status</p>
                <p className="text-lg font-bold text-white mb-2">Ready for Bid</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Deadline Date</p>
                <p className="text-lg font-bold text-white mb-2">{tender.deadline || "TBA"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Record ID</p>
                <p className="text-lg font-bold text-white mb-2">{tender.id}</p>
              </div>
            </div>
            
            {/* Display the AI Summary */}
            <div className="mt-8 border-t border-white/10 pt-6">
               <h4 className="text-md font-bold text-cyan-400 mb-4 flex items-center gap-2">
                 <Zap size={16} /> AI Extracted Summary
               </h4>
               <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed gemini-output">
                 {tender.ai_summary ? (
                    <ReactMarkdown>{tender.ai_summary}</ReactMarkdown>
                 ) : (
                    <p className="italic text-slate-500">No AI processing data available for this tender.</p>
                 )}
               </div>
            </div>
          </div>

          {/* Technical Matching */}
          <div className="glass-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Technical Specification Match</h3>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                {dynamicAnalysis ? "Dynamic Match" : "94% Match"}
              </span>
            </div>
            <div className="space-y-4">
              {dynamicAnalysis?.comparison ? (
                dynamicAnalysis.comparison.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      {item.status.toLowerCase().includes('match') ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={18} className="text-amber-500" />
                      )}
                      <span className="text-sm font-medium text-slate-200">{item.requirement}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono truncate max-w-[150px]">{item.user_data}</span>
                  </div>
                ))
              ) : [
                { spec: '4K Resolution Support', status: 'match', product: 'SR-42U-PRO-X' },
                { spec: 'Night Vision (up to 50m)', status: 'match', product: 'SR-42U-PRO-X' },
                { spec: 'IP67 Weatherproof Rating', status: 'match', product: 'SR-42U-PRO-X' },
                { spec: 'Edge AI Processing', status: 'partial', product: 'Requires Add-on Module' },
                { spec: 'Redundant Power Supply', status: 'match', product: 'SR-42U-PRO-X' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    {item.status === 'match' ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={18} className="text-amber-500" />
                    )}
                    <span className="text-sm font-medium text-slate-200">{item.spec}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{item.product}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* AI Recommendation & Risk */}
          <div className="space-y-6">
            <div className="glass-card bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border-cyan-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                  <Zap size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">AI Bid Strategy</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Win Probability</span>
                  <span className="text-lg font-bold text-emerald-500">
                    {dynamicAnalysis ? `${100 - dynamicAnalysis.risk_assessment.detailed_score}%` : `${100 - (tender.risk_score ?? 22)}%`}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" 
                    style={{ width: dynamicAnalysis ? `${100 - dynamicAnalysis.risk_assessment.detailed_score}%` : `${100 - (tender.risk_score ?? 22)}%` }}
                  />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  {dynamicAnalysis ? (
                    dynamicAnalysis.profit_analysis.summary.substring(0, 150) + "..."
                  ) : (
                    <ReactMarkdown>{tender.ai_summary ? `Based on AI Summary: ${tender.ai_summary.substring(0, 150)}...` : `"AI Analysis pending processing. Please check back later for matched probabilities."`}</ReactMarkdown>
                  )}
                </p>
              </div>
            </div>

            <div className="glass-card border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-500 text-white">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Risk Assessment</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Risk Score</span>
                  <span className={cn(
                    "text-lg font-bold",
                    (dynamicAnalysis?.risk_assessment.detailed_score || tender.risk_score || 0) > 60 ? "text-rose-500" : 
                    (dynamicAnalysis?.risk_assessment.detailed_score || tender.risk_score || 0) > 30 ? "text-amber-500" : "text-emerald-500"
                  )}>{dynamicAnalysis?.risk_assessment.detailed_score || tender.risk_score || 0}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000",
                      (dynamicAnalysis?.risk_assessment.detailed_score || tender.risk_score || 0) > 60 ? "bg-rose-500" : 
                      (dynamicAnalysis?.risk_assessment.detailed_score || tender.risk_score || 0) > 30 ? "bg-amber-500" : "bg-emerald-500"
                    )} 
                    style={{ width: `${dynamicAnalysis?.risk_assessment.detailed_score || tender.risk_score || 0}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  { dynamicAnalysis?.risk_assessment.gap_analysis.substring(0, 150) || ( 
                    (tender.risk_score || 0) > 60 
                      ? "Warning: High risk detected due to stringent technical requirements and tight timelines."
                      : (tender.risk_score || 0) > 30 
                        ? "Moderate risk. Compliance requirements are standard for this category."
                        : "Low risk. Requirements are well-defined and match standard profiles."
                  )}
                </p>
              </div>
            </div>
            
            {/* Accept / Reject Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button 
                onClick={handleReject}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-rose-500 font-bold hover:bg-rose-500/10 transition-all"
              >
                <X size={18} /> Reject Bid
              </button>
              <button 
                onClick={handleAccept}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-900 font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Check size={18} /> Accept Bid
              </button>
            </div>
          </div>

          {/* Key Dates */}
          <div className="glass-card">
            <h3 className="text-lg font-bold text-white mb-4">Critical Timeline</h3>
            <div className="space-y-6">
              {[
                { label: 'RFP Published', date: '2026-03-15', status: 'past' },
                { label: 'Pre-bid Meeting', date: '2026-03-28', status: 'upcoming' },
                { label: 'Bid Submission', date: '2026-04-12', status: 'upcoming' },
                { label: 'Technical Opening', date: '2026-04-13', status: 'upcoming' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      item.status === 'past' ? "bg-slate-700" : "bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                    )} />
                    {i < 3 && <div className="w-0.5 h-full bg-white/5 my-1" />}
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-bold",
                      item.status === 'past' ? "text-slate-500" : "text-white"
                    )}>{item.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
