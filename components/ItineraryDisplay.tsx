
import React, { useState } from 'react';
import { Itinerary, Activity } from '../types';
import { exportToICS } from '../utils/calendar';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onProAction: (action: string) => void;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, onProAction }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  const handleAction = (activity: Activity) => {
    if (activity.verification_url) window.open(activity.verification_url, '_blank');
    else window.open(`https://www.google.com/search?q=${encodeURIComponent(activity.activity + ' ' + activity.location)}`, '_blank');
  };

  const currentDay = itinerary.days[selectedDay];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
      
      {/* Precision Metrics Pillar */}
      <div className="xl:col-span-3 space-y-10">
        <div className="glass-card p-10 rounded-[3rem] border-l-4 border-l-cyan-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-6">Optimization Ratio</div>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-8xl font-black text-white tracking-tighter">{itinerary.cellular_optimization_score}</span>
            <span className="text-2xl font-black text-cyan-500 uppercase tracking-widest">%</span>
          </div>
          
          <div className="space-y-6 pt-10 border-t border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment Tier</span>
              <span className="text-[11px] font-black text-white uppercase tracking-widest">Sovereign Elite</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Clinical Density</span>
              <span className="text-[11px] font-black text-white uppercase tracking-widest">94.2 Nodes/km</span>
            </div>
          </div>
        </div>

        {/* Phase Navigator */}
        <div className="space-y-4">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-4 ml-6">Deployment Phases</div>
          {itinerary.days.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDay(idx)}
              className={`w-full group relative p-8 rounded-[2rem] border transition-all duration-700 text-left overflow-hidden ${
                selectedDay === idx 
                ? 'bg-white border-white text-black shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)]' 
                : 'bg-white/5 border-white/5 text-slate-500 hover:border-cyan-500/30'
              }`}
            >
              <div className="relative z-10 flex flex-col gap-2">
                <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${selectedDay === idx ? 'text-black/50' : 'text-slate-700'}`}>
                  Phase {String(day.day_number).padStart(2, '0')}
                </span>
                <span className="text-xl font-black uppercase tracking-tight leading-none truncate">{day.focus}</span>
              </div>
              {selectedDay !== idx && (
                <div className="absolute bottom-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Timeline Dataset */}
      <div className="xl:col-span-9 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
               <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.4em]">Current Status: Sequence Deploying</span>
            </div>
            <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">
              <span className="text-cyan-500">{currentDay.focus}</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.5em]">{currentDay.date}</p>
          </div>
          <button 
            onClick={() => exportToICS(itinerary)} 
            className="px-12 py-6 bg-white text-black rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cyan-500 transition-all shadow-2xl active:scale-95"
          >
            Deploy Dataset to Personal Cloud
          </button>
        </div>

        {/* Biological Visualization */}
        <div className="glass-card p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10">
              <div className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em]">Cellular Load Distribution</div>
           </div>
           <div className="flex items-end gap-3 h-32 px-4">
              {currentDay.activities.map((a, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-2xl transition-all duration-1000 delay-${i * 100} group-hover:opacity-100 ${a.type === 'Protocol' ? 'bg-cyan-500' : 'bg-slate-800/40'}`}
                  style={{ height: `${Math.max(15, Math.abs(a.biological_load || 5) * 10)}%` }}
                ></div>
              ))}
           </div>
           <div className="mt-6 flex justify-between px-4 text-[8px] font-black text-slate-600 uppercase tracking-widest">
              <span>Calibration Start</span>
              <span>Homeostasis Target</span>
           </div>
        </div>

        {/* Intervention Cards */}
        <div className="space-y-8">
          {currentDay.activities.map((activity, i) => (
            <div key={i} className={`group p-12 rounded-[4rem] border transition-all duration-700 hover:border-cyan-500/50 ${
              activity.type === 'Protocol' ? 'bg-cyan-900/10 border-cyan-500/20' : 'glass-card'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Meta Data */}
                <div className="lg:col-span-3 space-y-8">
                  <div className="space-y-2">
                    <div className="text-5xl font-black text-white font-mono tracking-tighter leading-none">{activity.time}</div>
                    <div className={`text-[10px] font-black uppercase tracking-[0.4em] py-2 px-4 rounded-xl inline-block ${
                      activity.type === 'Protocol' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-400'
                    }`}>
                      {activity.type}
                    </div>
                  </div>
                  
                  <div className="space-y-6 pt-8 border-t border-white/5">
                    <div className="space-y-1">
                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Molecular Intent</span>
                       <div className="text-xs text-white font-black uppercase tracking-tight">{activity.biological_impact}</div>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Duration Profile</span>
                       <div className="text-xs text-white font-black uppercase tracking-tight">{activity.duration_mins} MIN SESSION</div>
                    </div>
                  </div>
                </div>

                {/* Content Data */}
                <div className="lg:col-span-9 space-y-10">
                   <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-5xl font-black text-white tracking-tighter uppercase group-hover:text-cyan-500 transition-colors duration-500">{activity.activity}</h4>
                        {activity.clinical_grade && (
                          <div className="bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest">Clinical Standard</div>
                        )}
                      </div>
                      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">{activity.location}</p>
                   </div>
                   
                   <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-3xl">{activity.description}</p>
                   
                   <div className="flex flex-col sm:flex-row justify-between items-center pt-10 border-t border-white/5 gap-6">
                      <div className="flex gap-4">
                         {activity.suitability_tags.map((t, idx) => (
                           <span key={idx} className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4 py-1 border border-white/5 rounded-full">{t}</span>
                         ))}
                      </div>
                      <button 
                        onClick={() => handleAction(activity)}
                        className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cyan-500 transition-all shadow-xl active:scale-95"
                      >
                        Secure Intervention
                      </button>
                   </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Trust Grounding */}
        {itinerary.grounding_sources && (
          <div className="pt-20 border-t border-white/10 space-y-10">
             <div className="flex items-center gap-6">
                <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] whitespace-nowrap">Intelligence Grounding Matrix</h3>
                <div className="w-full h-px bg-white/5"></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itinerary.grounding_sources.map((s, idx) => (
                  <a key={idx} href={s.uri} target="_blank" rel="noreferrer" className="group p-6 glass-card rounded-3xl border border-white/5 hover:border-cyan-500/40 transition-all">
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.103-1.103" /></svg>
                       </div>
                       <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Verified Ref #{idx + 1}</span>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 truncate uppercase tracking-widest group-hover:text-cyan-400 transition-colors">{s.title}</div>
                  </a>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
