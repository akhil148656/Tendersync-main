import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  DollarSign,
  BarChart3,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { MOCK_TENDERS } from '../data/mockData';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export const TenderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tender = MOCK_TENDERS.find(t => t.id === id) || MOCK_TENDERS[0];

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const productMatches = [
    { 
      requirement: '42U Server Rack', 
      matches: [
        { sku: 'SR-42U-PRO-X', matchPercentage: 98, price: 2500 },
        { sku: 'SR-42U-STD', matchPercentage: 85, price: 1800 },
        { sku: 'SR-40U-ADAPT', matchPercentage: 65, price: 1500 },
      ]
    },
    { 
      requirement: 'Intelligent PDU', 
      matches: [
        { sku: 'PDU-IP-32A', matchPercentage: 95, price: 850 },
        { sku: 'PDU-BASIC-32A', matchPercentage: 70, price: 400 },
      ]
    }
  ];

  const specComparison = [
    { parameter: 'Height', requirement: '42U', products: [{ name: 'SR-42U-PRO-X', value: '42U', isMatch: true }, { name: 'SR-42U-STD', value: '42U', isMatch: true }] },
    { parameter: 'Load Capacity', requirement: '1500kg', products: [{ name: 'SR-42U-PRO-X', value: '1600kg', isMatch: true }, { name: 'SR-42U-STD', value: '1200kg', isMatch: false }] },
    { parameter: 'Cooling', requirement: 'Perforated 80%', products: [{ name: 'SR-42U-PRO-X', value: '85%', isMatch: true }, { name: 'SR-42U-STD', value: '75%', isMatch: false }] },
  ];

  const pricingData = [
    { name: 'SR-42U-PRO-X', cost: 2500, margin: 450 },
    { name: 'PDU-IP-32A', cost: 850, margin: 150 },
    { name: 'Cooling Unit', cost: 1200, margin: 300 },
  ];

  const handleReRun = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-white">{tender.title}</h2>
            <span className="px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              {tender.id}
            </span>
          </div>
          <p className="text-slate-400 mt-1">Source: {tender.source} • Deadline: {tender.deadline}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Tender Summary */}
          <section className="glass-card">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap size={20} className="text-cyan-400" /> Tender Summary
            </h3>
            <p className="text-slate-300 leading-relaxed mb-6">{tender.description}</p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-3">Products Required</h4>
                <ul className="space-y-2">
                  {tender.productsRequired.map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-3">Test Requirements</h4>
                <ul className="space-y-2">
                  {tender.testRequirements.map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Technical Matching */}
          <section className="glass-card">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity size={20} className="text-purple-400" /> Technical Matching (AI Agent)
            </h3>
            <div className="space-y-6">
              {productMatches.map((match, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="text-sm font-bold text-slate-400 mb-4">{match.requirement}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {match.matches.map((m, j) => (
                      <div key={j} className={cn(
                        "p-4 rounded-xl border transition-all",
                        j === 0 ? "bg-cyan-500/10 border-cyan-500/50" : "bg-white/5 border-white/10"
                      )}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-white">{m.sku}</p>
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded",
                            m.matchPercentage > 90 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                          )}>
                            {m.matchPercentage}% Match
                          </span>
                        </div>
                        <p className="text-lg font-bold text-white">${m.price}</p>
                        {j === 0 && <p className="text-[10px] text-cyan-400 font-bold mt-2 uppercase">Best Match</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Spec Comparison */}
          <section className="glass-card !p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white">Spec Comparison Table</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Parameter</th>
                    <th className="px-6 py-4">Tender Requirement</th>
                    <th className="px-6 py-4">SR-42U-PRO-X</th>
                    <th className="px-6 py-4">SR-42U-STD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {specComparison.map((spec, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-300">{spec.parameter}</td>
                      <td className="px-6 py-4 text-sm text-white font-bold">{spec.requirement}</td>
                      {spec.products.map((p, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {p.isMatch ? (
                              <CheckCircle2 size={14} className="text-emerald-500" />
                            ) : (
                              <XCircle size={14} className="text-rose-500" />
                            )}
                            <span className={cn("text-sm", p.isMatch ? "text-emerald-400" : "text-rose-400")}>
                              {p.value}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column - Insights & Pricing */}
        <div className="space-y-8">
          {/* Section 5: AI Insights */}
          <section className="glass-card bg-gradient-to-br from-slate-900 to-slate-950">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 size={20} className="text-cyan-400" /> AI Insights Panel
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Profitability Score</p>
                  <p className="text-2xl font-bold text-emerald-500">{tender.profitabilityScore}/100</p>
                </div>
                <TrendingUp size={32} className="text-emerald-500/50" />
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Risk Level</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    tender.riskLevel === 'Low' ? "text-emerald-500" : tender.riskLevel === 'Medium' ? "text-amber-500" : "text-rose-500"
                  )}>
                    {tender.riskLevel}
                  </p>
                </div>
                <AlertTriangle size={32} className={cn(
                  "opacity-50",
                  tender.riskLevel === 'Low' ? "text-emerald-500" : tender.riskLevel === 'Medium' ? "text-amber-500" : "text-rose-500"
                )} />
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <p className="text-xs text-cyan-400 uppercase font-bold mb-2">Recommendation</p>
                <p className="text-xl font-bold text-white">BID NOW</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  High technical match (98%) and healthy margins detected. Competition analysis suggests low entry barrier.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Pricing Panel */}
          <section className="glass-card">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-400" /> Pricing Panel
            </h3>
            <div className="h-48 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pricingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="cost" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                    {pricingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#06b6d4' : '#8b5cf6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Unit Cost</span>
                <span className="text-white font-bold">$4,550.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Testing & Logistics</span>
                <span className="text-white font-bold">$1,200.00</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between">
                <span className="text-slate-200 font-bold">Total Project Cost</span>
                <span className="text-xl font-bold text-cyan-400">$5,750.00</span>
              </div>
            </div>
          </section>

          {/* Section 6: Action Panel */}
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-[0.98]">
              Place Bid
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleReRun}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-slate-300 font-medium hover:bg-white/5 transition-all"
              >
                <RefreshCw size={16} className={isAnalyzing ? "animate-spin" : ""} />
                {isAnalyzing ? "Analyzing..." : "Re-run AI"}
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-500/20 text-rose-400 font-medium hover:bg-rose-500/10 transition-all">
                <XCircle size={16} />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
