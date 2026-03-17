import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  DollarSign,
  Package,
  Activity,
  ArrowRight,
  Upload,
  FileText
} from 'lucide-react';

import { cn } from '../lib/utils';

interface AnalysisResult {
  profit_analysis: {
    estimated_revenue: string;
    estimated_costs: string;
    net_profit_margin: string;
    summary: string;
  };
  risk_assessment: {
    detailed_score: number;
    risk_factors: string[];
    feasibility: string;
    gap_analysis: string;
  };
  comparison: Array<{
    requirement: string;
    user_data: string;
    status: string;
    impact: string;
  }>;
}

export const FinancialAnalysisModal = ({ tender, isOpen, onClose, onAnalysisComplete }: any) => {
  const [inventoryData, setInventoryData] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const resp = await fetch('http://localhost:8000/api/extract-text', {
        method: 'POST',
        body: formData,
      });
      const data = await resp.json();
      if (data.text) {
        setInventoryData(prev => prev + (prev ? '\n\n' : '') + data.text);
      }
    } catch (err) {
      console.error('File upload failed:', err);
      alert("Failed to extract text from file.");
    } finally {
      setUploadLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const runAnalysis = async () => {
    if (!inventoryData.trim()) {
      alert("Please enter some inventory or raw material data or upload a file.");
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch('http://localhost:8000/api/analyze-financials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tender_data: tender,
          user_inventory_data: inventoryData
        })
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      if (onAnalysisComplete) onAnalysisComplete(data);
    } catch (err: any) {
      console.error(err);
      alert("Analysis failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!result) return;
    try {
      const resp = await fetch('http://localhost:8000/api/export-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tender_data: tender,
          analysis_result: result
        })
      });
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Tender_Analysis_${tender.tender_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Export failed:', err);
      alert("Failed to export PDF report.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Analyse with AI</h2>
                  <p className="text-sm text-slate-400 mt-1">Cross-referencing {tender.tender_id} with your inventory data.</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="glass-card !bg-slate-950/40">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                       <Package size={16} /> Data Input
                    </h3>
                    
                    {/* Drag and Drop Zone */}
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={onDrop}
                      className={cn(
                        "relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 mb-6 transition-all",
                        isDragging ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]" : "border-white/10 hover:border-white/20 bg-white/5"
                      )}
                    >
                      <input 
                        type="file" 
                        onChange={onFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept=".pdf,.txt,.doc,.docx"
                      />
                      <div className="flex flex-col items-center justify-center text-center gap-3">
                        {uploadLoading ? (
                          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <div className={cn(
                            "p-3 rounded-xl bg-white/5 text-slate-400 group-hover:text-cyan-400 transition-colors",
                            isDragging && "text-cyan-400"
                          )}>
                            <Upload size={24} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-white">Attach Inventory File</p>
                          <p className="text-[10px] text-slate-500 mt-1">PDF or Text files supported</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        value={inventoryData}
                        onChange={(e) => setInventoryData(e.target.value)}
                        placeholder="Or manually enter inventory details..."
                        className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all resize-none font-sans leading-relaxed"
                      />
                      {uploadLoading && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                          <div className="flex items-center gap-3 text-cyan-400">
                             <Zap size={18} className="animate-pulse" />
                             <span className="text-xs font-bold uppercase tracking-widest">Extracting Data...</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={runAnalysis}
                      disabled={loading}
                      className="w-full mt-6 py-4 rounded-2xl bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>Run AI Analysis <Zap size={18} /></>
                      )}
                    </button>
                  </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-8 space-y-8">
                  {!result && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20 border-2 border-dashed border-white/5 rounded-[32px]">
                      <Activity size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-medium">Waiting for analysis...</p>
                      <p className="text-sm mt-1">Input your data and click "Run AI Analysis"</p>
                    </div>
                  )}

                  {loading && !result && (
                    <div className="h-full flex flex-col items-center justify-center text-cyan-400 py-20">
                      <Zap size={48} className="mb-4 animate-pulse" />
                      <p className="text-lg font-bold">Gemini is calculating...</p>
                      <p className="text-sm text-slate-500 mt-1 italic font-sans max-w-sm text-center">
                        Synthesizing tender requirements with your raw material data for a detailed P&L forecast.
                      </p>
                    </div>
                  )}

                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* Financial Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card border-emerald-500/20 bg-emerald-500/5">
                          <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Est. Revenue</p>
                          <p className="text-xl font-bold text-white">{result.profit_analysis.estimated_revenue}</p>
                        </div>
                        <div className="glass-card border-rose-500/20 bg-rose-500/5">
                          <p className="text-[10px] font-bold text-rose-500 uppercase mb-1">Est. Total Costs</p>
                          <p className="text-xl font-bold text-white">{result.profit_analysis.estimated_costs}</p>
                        </div>
                        <div className="glass-card border-cyan-500/20 bg-cyan-500/5">
                          <p className="text-[10px] font-bold text-cyan-400 uppercase mb-1">Net Margin</p>
                          <p className="text-xl font-bold text-white">{result.profit_analysis.net_profit_margin}</p>
                        </div>
                      </div>

                      {/* Risk and Feasibility */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card">
                          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                             <ShieldCheck size={16} className="text-emerald-400" /> Feasibility: {result.risk_assessment.feasibility}
                          </h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                               <span className="text-sm text-slate-400">Risk Score</span>
                               <span className={cn(
                                 "text-lg font-bold",
                                 result.risk_assessment.detailed_score > 60 ? "text-rose-500" : "text-emerald-500"
                               )}>{result.risk_assessment.detailed_score}%</span>
                            </div>
                            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                              <p className="text-[10px] font-bold text-orange-400 uppercase mb-1">Gap Analysis</p>
                              <p className="text-sm text-slate-300 leading-relaxed">{result.risk_assessment.gap_analysis}</p>
                            </div>
                          </div>
                        </div>

                        <div className="glass-card">
                          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                             <AlertTriangle size={16} className="text-rose-400" /> Primary Risk Factors
                          </h4>
                          <ul className="space-y-3">
                            {result.risk_assessment?.risk_factors?.map((risk: string, i: number) => (
                              <li key={i} className="flex gap-3 text-sm text-slate-300 items-start">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                {risk}
                              </li>
                            )) || <li className="text-xs text-slate-500 italic">No specific risk factors flagged.</li>}
                          </ul>
                        </div>
                      </div>

                      {/* Comparison Table */}
                      <div className="glass-card !p-0 overflow-hidden">
                        <div className="p-4 border-b border-white/5">
                          <h4 className="text-sm font-bold text-white">Government Requirements vs Your Inventory</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-slate-500 uppercase text-[10px] font-bold">
                              <tr>
                                <th className="px-6 py-4">Requirement</th>
                                <th className="px-6 py-4">Your Capability</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Impact</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {result.comparison?.map((item: any, i: number) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                  <td className="px-6 py-4 font-medium text-white">{item.requirement}</td>
                                  <td className="px-6 py-4 text-slate-400">{item.user_data}</td>
                                  <td className="px-6 py-4">
                                    <span className={cn(
                                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                                      item.status?.toLowerCase().includes('match') ? "bg-emerald-500/10 text-emerald-500" :
                                      item.status?.toLowerCase().includes('gap') ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                                    )}>
                                      {item.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right font-mono text-cyan-400 text-xs">{item.impact}</td>
                                </tr>
                              )) || (
                                <tr>
                                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">No direct comparisons found. Check your inventory details.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Summary Note */}
                      <div className="p-6 rounded-[24px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 mb-8">
                         <div className="flex gap-4">
                            <Info size={20} className="text-cyan-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-300 italic leading-relaxed">
                              {result.profit_analysis.summary}
                            </p>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-white/5 bg-white/5 flex justify-end gap-4">
              <button 
                onClick={onClose}
                className="px-8 py-3 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-all outline-none"
              >
                Close Analysis
              </button>
              {result && (
                <button 
                  onClick={handleExportPDF}
                  className="px-8 py-3 rounded-xl bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 outline-none"
                >
                  <FileText size={18} /> Export Full PDF Report
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
