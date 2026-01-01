
import React, { useState } from 'react';
import { ProtocolInputs } from '../types';

interface TripFormProps {
  onSubmit: (inputs: ProtocolInputs) => void;
  isLoading: boolean;
  onDemo?: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading, onDemo }) => {
  const [inputs, setInputs] = useState<ProtocolInputs>({
    destination: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 864000000).toISOString().split('T')[0],
    biologicalGoal: 'Cellular Regeneration',
    medicalProtocol: 'None',
    luxuryTier: 'Sovereign',
    specificNeeds: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.destination) return;
    onSubmit(inputs);
  };

  return (
    <div className="relative group">
      {/* Decorative Outer Glow */}
      <div className="absolute inset-0 bg-cyan-500/5 blur-[100px] rounded-[3rem] transition-all duration-1000 group-hover:bg-cyan-500/10"></div>
      
      <form 
        onSubmit={handleSubmit} 
        className="relative z-10 glass-card p-12 rounded-[3.5rem] border border-white/10 space-y-10"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Biological Intake</h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
              <p className="text-cyan-500 text-[9px] font-black uppercase tracking-[0.4em]">Protocol Scanning v5.0 Active</p>
            </div>
          </div>
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center group-hover:border-cyan-500/30 transition-all duration-500">
             <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Primary Clinical Node</label>
            <input
              type="text"
              placeholder="GLOBAL GEOGRAPHY OR CLINIC NAME"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white font-bold tracking-tight focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
              value={inputs.destination}
              onChange={(e) => setInputs({ ...inputs, destination: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Intention</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold text-sm focus:outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
                value={inputs.biologicalGoal}
                onChange={(e) => setInputs({ ...inputs, biologicalGoal: e.target.value as any })}
              >
                <option className="bg-slate-900">Cellular Regeneration</option>
                <option className="bg-slate-900">Cognitive Peak</option>
                <option className="bg-slate-900">Stress Deceleration</option>
                <option className="bg-slate-900">Athletic Recovery</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Service Tier</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold text-sm focus:outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
                value={inputs.luxuryTier}
                onChange={(e) => setInputs({ ...inputs, luxuryTier: e.target.value as any })}
              >
                <option className="bg-slate-900">Sovereign</option>
                <option className="bg-slate-900">Ultra-Luxe</option>
                <option className="bg-slate-900">Clinical Focus</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Target Protocol</label>
            <input
              type="text"
              placeholder="STEM CELLS / NAD+ / HYPERBARIC / ETC"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white font-bold tracking-tight focus:outline-none focus:border-cyan-500/50 transition-all"
              value={inputs.medicalProtocol}
              onChange={(e) => setInputs({ ...inputs, medicalProtocol: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full py-7 bg-white text-black rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] overflow-hidden group/btn shadow-[0_20px_40px_rgba(255,255,255,0.05)] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center justify-center gap-4">
            {isLoading ? "Synchronizing Clinical Data..." : "Deploy Sequence"}
            {!isLoading && (
              <svg className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </span>
          <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
        </button>

        {onDemo && (
          <button 
            type="button" 
            onClick={onDemo} 
            className="w-full text-slate-600 hover:text-cyan-500 text-[10px] font-black uppercase tracking-[0.4em] transition-colors"
          >
            Run Demo Analysis (SHA Protocol)
          </button>
        )}
      </form>
    </div>
  );
};

export default TripForm;
